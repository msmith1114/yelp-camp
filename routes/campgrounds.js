const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const middleware = require('../middleware')
//=========================
// Campgrounds Index
//=========================
router.get('/campgrounds', function(req, res) {
  //Get all Campgrounds from DB
  Campground.find({}, function(err, Campgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render("campgrounds/index",{campgrounds: Campgrounds, page: 'campgrounds'});
    }
  })
})
//=========================
// NEW Campground
//=========================
router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new')
})

router.post('/campgrounds', middleware.isLoggedIn, function(req, res) {
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let name = req.body.name
  let image = req.body.image
  let description = req.body.description
  let price = req.body.price
  let newCampground = {
    'name': name,
    'price': price,
    'image': image,
    'description': description,
    'author': author
  }
  Campground.create(newCampground, function(err, Campground) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/campgrounds')
    }
  })

})
//=========================
// SHOW Campgrounds
//=========================
router.get('/campgrounds/:id', function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found')
      res.redirect('/campgrounds')
    } else {
      res.render('campgrounds/show', {
        campground: foundCampground
      })
    }
  })
})
//=========================
// EDIT Campgrounds
//=========================
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      res.render('campgrounds/edit', {campground: foundCampground})
    })
}
})
//=========================
// UPDATE Campgrounds
//=========================
router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})
//=========================
// DESTROY Campgrounds
//=========================
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})
//=========================
//
//=========================
module.exports = router
