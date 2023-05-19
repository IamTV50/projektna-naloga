var express = require('express');
var router = express.Router();
var requestController = require('../controllers/requestController.js');

router.get('/', requestController.list);
router.get('/:id', requestController.show);

router.post('/', requestController.create);
router.post('/userRequestPackage', requestController.userRequestPackager);

router.put('/:id', requestController.update);

router.delete('/:id', requestController.remove);

module.exports = router;
