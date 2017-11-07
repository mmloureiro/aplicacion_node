var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('usuario', {usuario:'Marcos', title: 'Mi Api'});
})

router.get('/cool', function(req, res, next) {
	res.send('Una nueva ruta cool')
})
module.exports = router
