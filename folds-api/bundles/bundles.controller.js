const express = require('express');
const router = express.Router();
const bundleService = require('./bundle.service');
const path = require('path');
const fs = require('fs');
const fileHelper = require('../_helpers/file-helper');
const jwt = require('../_helpers/jwt');
const sharp = require('sharp');


// routes
//router.get('/', getAll);
router.get('/:type/:id', getByTypeAndId);

//router.put('/:id', jwt(), update);
//router.put('/:username/:name', jwt(), getByUserAndName);
//router.delete('/:id', _delete);

module.exports = router;


/*function getAll(req, res, next) {
    collectionService.getAll()
        .then(collections => res.json(collections))
        .catch(err => next(err));
}*/

function getByTypeAndId(req, res, next) {
    //console.log(req.params);
        bundleService.getByTypeAndId(req.params.type, req.params.id)
        .then(bundle => {
            if(bundle){
                res.json(bundle) 
            } else{ 
                res.sendStatus(404) 
            } 
        })
        .catch(err => next(err));
}


function update(req, res, next) {
    bundleService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function _delete(req, res, next) {
    bundleService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

