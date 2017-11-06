var express = require('express');
var router = express.Router();

const volcado = require ('../controllers/volcado.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mi API' , subtitle: 'formulario'});
});

// POST
router.post('/users', function(req,res,next){
	var host1 = req.body.host1
	var user1 = req.body.usuario1
	var pass1 = req.body.passw1
	var bd1 = req.body.bd1
	var port1 = req.body.puerto1

	var host2 = req.body.host2
	var user2 = req.body.usuario2
	var pass2 = req.body.passw2
	var bd2 = req.body.bd2
	var port2 = req.body.puerto2
// creamos el nombre del archivo que vamos a usar para guardar los datos de la BD
	var archivo_sql = './public/sql/' + host1 + '_' + bd1 + '_' + volcado.nombre_archivo()
	console.log(archivo_sql)
	res.render('users', {host: host1, user: user1, pass: pass1, bd: bd1, port: port1, archivo_sql: archivo_sql})

	volcado.importar(host1, user1, pass1, bd1, port1, archivo_sql)
		.then(function(){
		volcado.mod_archivo(archivo_sql)})
		.then(function(){
			volcado.crearBD(host2, user2, pass2, port2, bd2, archivo_sql)})
		.then(function(){		
			volcado.enviar(host2, user2, pass2, port2, bd2, archivo_sql)})
		// .then(function(){
			// volcado.borrar_archivo(archivo_sql)})
		.then(function(response){
			console.log("TODO ES CORRECTO",response)
		})
		.catch(function(err){
			console.log(err,"No se pudo completar la acción")
		})
})

module.exports = router;
