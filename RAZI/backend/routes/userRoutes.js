const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/profile', userController.profile);
router.get('/logout', userController.logout);
router.get('/myPackagers', userController.myPackagers);
router.get('/', userController.list);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);

router.put('/addPackager', userController.addPackager);
router.put('/removePackager', userController.removePackager);
router.put('/:id', userController.update);

router.delete('/', userController.remove);
router.delete('/:id', userController.adminRemove);

module.exports = router;
