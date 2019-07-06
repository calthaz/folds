const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileHelper = require('../_helpers/file-helper');

const UPLOAD_PATH = 'uploads';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })
   
const upload = multer({ storage: storage })//configuration

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.post('/uploadAvatar', upload.single('avatar'), updateAvatar);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function updateAvatar(req, res, next) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var mimeType = path.extname(req.file.path).substr(1);
     // Define a JSONobject for the image attributes for saving to database
    
    var finalImg = 'data:' + mimeType + ';base64,' + encode_image;
    userService.updateAvatar(req.body.id, finalImg)
        .then(() => {
            fileHelper.unlinkFile(req.file.path);
            res.json({url: req.file.path, base64: finalImg})
        })
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

