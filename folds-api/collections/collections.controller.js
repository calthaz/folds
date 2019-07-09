const express = require('express');
const router = express.Router();
const collectionService = require('./collection.service');
const path = require('path');
const fs = require('fs');
const fileHelper = require('../_helpers/file-helper');
const jwt = require('../_helpers/jwt');
const sharp = require('sharp');


// routes
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:username/:name', getByUserAndName);
//router.put('/:id', jwt(), update);
//router.put('/:username/:name', jwt(), getByUserAndName);
//router.delete('/:id', _delete);

module.exports = router;


function getAll(req, res, next) {
    collectionService.getAll()
        .then(collections => res.json(collections))
        .catch(err => next(err));
}

function getById(req, res, next) {
    //console.log(req.params);
        collectionService.getById(req.params.idOrName)
        .then(collection => {
            if(collection){
                res.json(collection) 
            } else{ 
                res.sendStatus(404) 
            } 
        })
        .catch(err => next(err));
}

function getByUserAndName(req, res, next){
    collectionService.getByUserAndName(req.params.username, req.params.name)
        .then(collection => {
            if(collection){
                res.json(collection) 
            } else{ 
                res.sendStatus(404) 
            } 
        })
        .catch(err => next(err));
}

function update(req, res, next) {
    collectionService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function _delete(req, res, next) {
    collectionService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

