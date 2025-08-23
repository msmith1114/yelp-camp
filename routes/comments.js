const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const Comment = require('../models/comment')
const middleware = require('../middleware/index')
//=========================
// NEW Comment
//=========================
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, async function(req, res){
  try {
    const campground = await Campground.findById(req.params.id);
    res.render('comments/new', {campground: campground});
  } catch (err) {
    console.log(err);
    res.redirect('/campgrounds');
  }
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn, async function(req, res){
  try {
    const campground = await Campground.findById(req.params.id);
    const comment = await Comment.create(req.body.comment);
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    await comment.save();
    campground.comments.push(comment);
    await campground.save();
    req.flash('success', 'Comment added!');
    res.redirect('/campgrounds/' + campground._id);
  } catch (err) {
    req.flash('error', 'Something went wrong...');
    console.log(err);
    res.redirect('/campgrounds');
  }
});
//=========================
// EDIT Comment
//=========================
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, async function(req, res){
  try {
    const foundCampground = await Campground.findById(req.params.id);
    if (!foundCampground) {
      req.flash('error', 'Campground not found..');
          return res.redirect(req.get('Referrer') || '/');
    }
    const foundComment = await Comment.findById(req.params.comment_id);
    res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
  } catch (err) {
        res.redirect(req.get('Referrer') || '/');
  }
});

router.put('/campgrounds/:id/comments/:comment_id/', middleware.checkCommentOwnership, async function(req, res){
  try {
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    res.redirect('/campgrounds/' + req.params.id);
  } catch (err) {
  res.redirect(req.get('Referrer') || '/');
  }
});
//=========================
// DELETE Comment
//=========================
router.delete('/campgrounds/:id/comments/:comment_id/', middleware.checkCommentOwnership, async function(req, res){
  try {
  await Comment.findByIdAndDelete(req.params.comment_id);
    // Remove reference from campground
    await Campground.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: req.params.comment_id } }
    );
    req.flash('success', 'Comment deleted');
    res.redirect('/campgrounds/' + req.params.id);
  } catch (err) {
    console.error('Delete comment error:', err);
    req.flash('error', 'Database error deleting comment...');
    res.redirect(req.get('Referrer') || '/');
  }
});
//=========================
//
//=========================
module.exports = router
