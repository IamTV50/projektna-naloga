const express = require('express');

// Save video to 'public/python/temp_videos/'
// Save image to 'public/python/temp_images/'
var multer = require('multer');
var uploadVideo = multer({dest: 'public/python/tmp_videos/'});
var uploadImage = multer({dest: 'public/python/tmp_images/'});

const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/myPackagers', userController.myPackagers);
router.get('/', userController.list);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/registerFace', uploadVideo.single('video'), userController.registerFace);
router.post('/faceId', uploadImage.single('image'), userController.faceId);

router.put('/addPackager', userController.addPackager);
router.put('/removePackager', userController.removePackager);
router.put('/:id', userController.update);

router.delete('/', userController.remove);
router.delete('/:id', userController.adminRemove);

module.exports = router;
