const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        (req,res,next) => {
        Favorites.findOne({user: req.user._id}, (err, favorite))
        .then((favorite) =>{
            if (err) return next(err);

            if (!favorite) {
                Favorites.create({user: req.user._id})
                .then((favorite) => {
                    for (var i = 0; i < req.body.length; i++) {
                        if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                            favorite.dishes = favorite.dishes.concat(req.body[i]._id);
                        }
                    }
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorites) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => {
                        return next(err);
                    });
                })
                .catch((err) => {
                    return next(err);
                });
            } else {
                for (var i = 0; i < req.body.length; i++) {
                    if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                        favorite.dishes = favorite.dishes.concat(req.body[i]._id);
                    }
                }
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => {
                    return next(err);
                });
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser,
        (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT op not supperted on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,
        (req,res,next) => {
        Favorites.findOneAndRemove({"user": req.user._id})
        .then((resp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, 
    (req,res,next) => {
        Favorites.findOne({ user: req.user._id })
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'applicationl/json');
                return res.json({ "exits": false, "favorites": favorites });
            } else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'applicationl/json');
                    return res.json({ "exits": false, "favorites": favorites });
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'applicationl/json');
                    return res.json({ "exits": true, "favorites": favorites });
                }
            }
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
    (req,res,next) => {
        Favorites.findOne({user: req.user._id}, (err, favorite))
        .then((favorite) => {
            if (err) return next(err);

            if (!favorite) {
                Favorites.create({ user: req.user._id })
                .then((favorite) => {
                    favorites.dishes.push({ "_id": req.params.dishId });
                    favorites.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorites) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => {
                        return next(err);
                    });
                })
                .catch((err) => {
                    return next(err);
                });
            } else {
                if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                    favorite.dishes = favorite.dishes.concat(req.params.dishId);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorites) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => {
                        return next(err);
                    });
                } else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.end('Dish ' + req.params.dishId + ' already exists!');
                }
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser,
    (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT op not supperted on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,
    (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorite) => {
            if (favorite) {
                index = favorite.dishes.indexOf(req.params.dishId);
                if (index === -1) {
                    err = new Error('Dish: ' + req.params.dishId + ' not found!');
                    err.status = 404;
                    return next(err);
                } else {
                    favorite.dishes.splice(index, 1);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorites) => {
                            console.log('Favorite Deleted: ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    }, (err) => next(err));
                }
            } else {
                err = new Error('Favorite not found!');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = favoriteRouter;