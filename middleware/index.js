var Campground = require('../models/campground'),
    Comment = require('../models/comment')

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Inicia sesión primero!")
    res.redirect('/login');
  }
};

middlewareObj.isCampOwner = function(req, res, next){
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, campground){
      if (err){
        req.flash('error', 'Campground was not found');
        res.redirect('/campgrounds/'+req.params.id)
      }else if (campground.author.id.equals(req.user.id)){
        next()
      }else {
        console.log("Dont have permissions")
        req.flash('error', 'Not have permissions');
        res.redirect('/campgrounds/'+req.params.id)
      }
    })
  }else {
    req.flash("error", "Inicia sesión primero!")
    res.redirect('/login')
  }
}

middlewareObj.isCommentOwner = function (req, res, next){
  if (req.isAuthenticated()){
    Comment.findById(req.params.id_comment, function(err, comment){
      if (err){
        req.flash('error', 'Comment was not found');
        res.redirect('/campgrounds/'+req.id)
      }else if (comment.author.id.equals(req.user._id)){
        next()
      }else {
        console.log("Dont have permissions")
        req.flash('error', 'Not have permissions');
        res.redirect('/campgrounds/'+req.params.id)
      }
    })
  }else {
    req.flash("error", "Inicia sesión primero!")
  }
}

module.exports = middlewareObj