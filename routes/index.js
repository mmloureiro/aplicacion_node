var express = require('express');
const parser = require('body-parser')
const payloadChecker = require ('payload-validator')
var router = express.Router()
var Promise = require('bluebird')

//validamos archivo json, tienen que ser tipo string ""
const expectedPayload = {
	"host1": "", "usuario1": "", "passw1": "", "bd1": "","puerto11": "", "host2": "", "usuario2": "", "passw2": "", "bd2": "","puerto2": ""}

const volcado = require ('../controllers/volcado.js')
//usamos "body-parser" para la validación del archivo como json
router.use(parser.json())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mi API' });
});

// POST
router.post('/users', function(req,res,next){
	if(req.body){
		// validamos que los datos sean correctos y que no estén los campos vacíos
		const result = payloadChecker.validator(req.body,expectedPayload,["host1","user1", "password1","database1","port1","host2","user2", "password2","database2","port2"], false)
		if(result.success) {
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
			
			// volcado.importar(host1, user1, pass1, bd1, port1, archivo_sql).then(volcado.mod_archivo(archivo_sql)).then(volcado.crearBD(host2, user2, pass2, port2, bd2, archivo_sql)).then(volcado.leer_archivo(archivo_sql)).then(volcado.cortar_array).then(volcado.mandar_datos)
			// 	.then(function(resolve){
			// 		res.render('users', {error: 0, host: host1, user: user1, pass: pass1, bd: bd1, port: port1, archivo_sql: archivo_sql})
			// 		console.log("TODO ES CORRECTO", resolve)
			// 	})
			// 	.catch(function(err){
			// 		// Enviamos el código de error y el tipo de error correspondiente
			// 		res.render('users', {error: 2, mensaje: err})
			// 		console.log("NO SE PUDO COMPLETAR LA ACCIÓN")
			// 	})

// Importa los datos correctamente, pero no maneja adecuadamente los errores
			Promise.all([volcado.importar(host1, user1, pass1, bd1, port1, archivo_sql), volcado.mod_archivo(archivo_sql), volcado.crearBD(host2, user2, pass2, port2, bd2, archivo_sql)])
			.then(function(){
				volcado.enviar(host2, user2, pass2, port2, bd2, archivo_sql)
			})
			.then(function(){
				volcado.borrar_archivo(archivo_sql)
			}) 
			.then(function(response){
				console.log("TODO ES CORRECTO",response)
				res.render('users', {error: 0, host1: host1, user1: user1, bd1: bd1, port1: port1, archivo_sql: archivo_sql, host2: host2, user2: host2, bd2: bd2, port2: port2})
			})
			.catch(function(err){
				console.log("NO SE PUDO COMPLETAR LA ACCIÓN", err)
				res.render('users', {error: 2, mensaje: err})

			})
			}else{
				res.render('users', {error: 1})
			}
		}else{
			res.json({"message" : "no es correcto"})
		}
})
module.exports = router;
