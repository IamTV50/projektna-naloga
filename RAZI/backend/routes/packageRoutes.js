var express = require('express');
var router = express.Router();
var packageController = require('../controllers/packageController.js');


router.get('/', packageController.list);
router.get('/:id', packageController.show);

router.post('/', packageController.create);

router.put('/:id', packageController.update);

router.delete('/:id', packageController.remove);

module.exports = router;
