var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')
var middleware = require('../middleware/index')

router.get('/', function (req, res) {
    Campground.find(function (err, campgrounds) {
        if (!err) {
            res.render("./campgrounds/index", {
                campgrounds
            })
        } else {
            console.error("Error: ", err)
        }
    })
})

router.post('/', middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    console.log(req.body)
    var newCampground = {
        name,
        image,
        description,
        price,
        author:{
            username: req.user.username,
            id: req.user._id
        }
    }

    Campground.create(newCampground, function (err, campground) {
        if (err) {
            req.flash('error', 'Campground could not be created');
            res.redirect("/campgrounds")
        } else {
            req.flash('success', "Se ha creado correctamente!")
            res.redirect("/campgrounds")
        }
    })
})

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render("./campgrounds/new")
})

router.get('/:id', middleware.isLoggedIn, function (req, res) {
    var id = req.params.id
    Campground.findById(id).populate("comments").exec(function (err, campgroundFinded) {
        if (!err) {
            res.render('./campgrounds/show', {
                campgroundFinded
            })
        } else {
            console.error("error: ", err)
        }
    })
})

//EDIT
router.get('/:id/edit', middleware.isCampOwner, function(req, res){
    var id = req.params.id
    Campground.findById(id, function(err, campFounded){
        if(!err){
            
            res.render('./campgrounds/edit', {campFounded})
        }
    })
})

router.put('/:id', middleware.isCampOwner, function(req, res){
    var id = req.params.id
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var newCampground = {
        name,
        image,
        description,
        price
    }

    Campground.findByIdAndUpdate(id, newCampground, function(err, campFounded){
        if(!err){
            req.flash('success', "Se ha editado correctamente!")
            res.redirect('/campgrounds/'+req.params.id)
        }else{
            req.flash('error', "Surgió un problema al crear")
            console.error(err)
        }
    })
})

router.delete('/:id', middleware.isCampOwner, function(req, res){
    var id = req.params.id;

    Campground.findByIdAndDelete(id, function(err, camp){
        if(!err){
            req.flash("success", "Se ha eliminado correctamente.")
            res.redirect("/campgrounds")
        }else{
            req.flash('error', "Surgió un problema al editar")
            console.error(err)
        }
    })
})

module.exports = router
