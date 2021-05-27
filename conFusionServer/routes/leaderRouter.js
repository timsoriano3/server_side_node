const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
    .get((req,res,next) => {
        Leaders.find({}).then((leaders) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req,res,next) => {
        Leaders.create(req.body).then((leader) =>{
            console.log('Leader Created ', leader);
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT op not supperted on /leaders');
    })
    .delete(authenticate.verifyUser, (req,res,next) => {
        Leaders.remove({}).then((resp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });

leaderRouter.route('/:leaderId')
    .get((req,res,next) => {
        Leaders.findById(req.params.leaderId)
        .then((leader) =>{
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('POST op not supperted on /leaders'
            + req.params.leaderId);
    })
    .put(authenticate.verifyUser, (req,res,next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
        .then((leader) =>{
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req,res,next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            res.StatusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = leaderRouter;