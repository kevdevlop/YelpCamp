var express = require('express')
var router = express.Router()
var Comment = require('../models/comment')
var Campground = require('../models/campground')
var middleware = require('../middleware/index')

//render view to create a new comment
router.get('/new', middleware.isLoggedIn, function (req, res) {
    var id = req.id
    res.render('./comments/new', {
        id
    })
})

//create a new comment
router.post('/', middleware.isLoggedIn, function (req, res) {
    var id = req.id
    var text = req.body.text
    var newComment = {
        author:{
            username: req.user.username,
            id: req.user._id
        },
        text
    }

    Campground.findById(id, function (err, campground) {
        if (!err) {
            Comment.create(newComment, function (err, comment) {
                if (err) {
                    console.error("Error while create comment: ", err)
                    res.redirect(`/campgrounds/${campground.id}`)
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', "Comentario creado correctamente")
                    res.redirect(`/campgrounds/${campground.id}`)
                }
            });
        }
    })
})

router.get('/:id_comment/edit', middleware.isCommentOwner, function(req, res){
    Comment.findById(req.params.id_comment, function(err, commentFinded){
        if(!err){
            res.render('comments/edit', {commentFinded: commentFinded, campground_id: req.id})
        }else{
            console.log("NOt finded")
        }
    })
})

router.put('/:id_comment', middleware.isCommentOwner, function(req, res){
    var new_comment = {
        text: req.body.text
    }
    Comment.findByIdAndUpdate(req.params.id_comment, new_comment, function(err, comment){
        if (!err){
            req.flash('success', "Comentario editado correctamente")
            res.redirect('/campgrounds/'+req.id)
        }else{
            req.flash('error', 'Ocurrió un error al crear el comentario.')
            console.log("Error")
        }
    })
})

router.delete('/:id_comment', middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndDelete(req.params.id_comment, function(err, comment_deleted){
        if(!err){
            req.flash('success', 'Comentario eliminado.')
            res.redirect('/campgrounds/'+req.id)
        }else {
            req.flash('error', 'Ocurrió un error al editar el comentario.')
            console.error(err)
        }
    })
})


module.exports = router