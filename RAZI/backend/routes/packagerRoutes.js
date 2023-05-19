var express = require('express');
var router = express.Router();
var packagerController = require('../controllers/packagerController.js');


router.get('/', packagerController.list);
router.get('/:id', packagerController.show);

router.post('/', packagerController.create);

router.put('/:id', packagerController.update);

router.delete('/:id', packagerController.remove);

module.exports = router;
