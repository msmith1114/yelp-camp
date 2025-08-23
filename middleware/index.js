//All Middle Goes methodOverride
const Campground = require('../models/campground')
const Comment = require('../models/comment')

const middlewareObj = {}

  middlewareObj.checkCommentOwnership = async function(req, res, next) {
    if (req.isAuthenticated()) {
      try {
        const foundComment = await Comment.findById(req.params.comment_id);
        if (!foundComment) {
          req.flash('error', 'Comment not found..');
          return res.redirect('back');
        }
        if (req.user && foundComment.author && String(foundComment.author.id) === String(req.user._id)) {
          return next();
        } else {
          req.flash('error', "You don't have permission..");
          return res.redirect('back');
        }
      } catch (err) {
        req.flash('error', 'Comment not found..');
        return res.redirect('back');
      }
    } else {
      req.flash('error', 'You need to be logged in...');
      res.redirect('back');
    }
  }


  middlewareObj.checkCampgroundOwnership = async function(req, res, next) {
    if (req.isAuthenticated()) {
      try {
        const foundCampground = await Campground.findById(req.params.id);
        if (!foundCampground) {
          req.flash('error', 'Campground not found...');
          return res.redirect('back');
        }
        if (req.user && foundCampground.author && String(foundCampground.author.id) === String(req.user._id)) {
          return next();
        } else {
          req.flash('error', "You don't have permissions..");
          return res.redirect('back');
        }
      } catch (err) {
        req.flash('error', 'Campground not found...');
        return res.redirect('back');
      }
    } else {
      req.flash('error', 'You need to be logged in...');
      res.redirect('back');
    }
  }

    middlewareObj.isLoggedIn = function(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      req.flash('error', 'You need to be logged in...')
      res.redirect('/login')
    }




module.exports = middlewareObj;
