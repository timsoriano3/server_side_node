const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json())

promoRouter.route('/')
    .get((req,res,next) => {
        Promotions.find({}).then((promotions) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .post((req,res,next) => {
        Promotions.create(req.body).then((promotion) =>{
            console.log('Promotion Created ', promotion);
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .put((req,res,next) => {
        res.statusCode = 403;
        res.end('PUT op not supperted on /promoes');
    })
    .delete((req,res,next) => {
        Promotions.remove({}).then((resp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req,res,next) => {
        Promotions.findById(req.params.promoId)
        .then((promotion) =>{
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .post((req,res,next) => {
        res.statusCode = 403;
        res.end('POST op not supperted on /promos'
            + req.params.promoId);
    })
    .put((req,res,next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
        .then((promotion) =>{
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .delete((req,res,next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });
    
module.exports = promoRouter;