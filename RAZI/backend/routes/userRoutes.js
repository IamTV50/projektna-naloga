const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/', userController.list);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);

router.put('/addPackage', userController.addPackage);
router.put('/removePackage', userController.removePackage);
router.put('/:id', userController.update);

router.delete('/', userController.remove);

module.exports = router;
