var express = require('express');
var router = express.Router();

const volcado = require ('../controllers/volcado.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mi API' , subtitle: 'formulario'});
});

// POST
router.post('/users', function(req,res,next){
	var host = req.body.host
	var user = req.body.usuario
	var pass = req.body.passw
	var bd = req.body.bd
	var port = req.body.puerto
// creamos el nombre del archivo que vamos a usar para guardar los datos de la BD
	var archivo_sql = '../sql/' + host + '_' + bd + '_' + volcado.nombre_archivo()
	console.log(archivo_sql)
	res.render('users', {host: host, user: user, pass: pass, bd: bd, port: port, archivo_sql: archivo_sql})

	volcado.importar(host, user, pass, bd, port, archivo_sql)
		.then(function(){
		volcado.mod_archivo(archivo_sql)})
		// .then(function(){
			// volcado.crearBD(host2, user2, pass2, port2, bd2, archivo_sql)})
		// .then(function(){		
			// volcado.enviar(host2, user2, pass2, port2, bd2, archivo_sql)})
		// .then(function(){
			// volcado.borrar_archivo(archivo_sql)})
		.then(function(response){
			console.log("TODO ES CORRECTO",response)
		})
		.catch(function(err){
			console.log(err,"No se pudo completar la importación")
		})
})

module.exports = router;
