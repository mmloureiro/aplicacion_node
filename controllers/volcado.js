// const server = require ('./server.js')
const mysqlDump = require('mysqldump')
const mysql = require('mysql')
const importer = require('node-mysql-importer')
const fs = require('fs')

// funcion para importar toda la base de datos a un archivo .sql
function importar(host, user, pass, bd, port, archivo_sql){
	return new Promise(function(resolve, reject){
		mysqlDump({
	    host: host,
	    user: user,
	    password: pass,
	    database: bd,
	    port: port,
	    ifNotExist:true,
	    dest: archivo_sql
		},function(err, result){
			if(err){
				reject("Algo falla en el origen")
			}else{
				resolve("Todo bien en origen")
			}
		})
	})
}

// función que conecta con la BD, crea la base de datos vacía y añade las globales a sus estado original
function crearBD(host, user, pass, port, bd, archivo_sql){
	return new Promise(function(resolve, reject){
		var config = {
			host: host,
			user: user,
			password: pass,
			port: port,
			multipleStatements: true
		}
		var con = mysql.createConnection(config)
		con.connect(function(err, data) {
			if(err){
				// console.error('error de conexion:' + err.stack)
				// evitamos que salga el error de "Unhandled promise rejection"
				con.on('error',function(){
				return reject(err)		
				})
			}else{
				// console.log('conectado con la id ' + con.threadId)
				// creamos la tabla y desactivamos la comprobación de claves foraneas
				con.query("CREATE DATABASE " + bd + "; SET GLOBAL FOREIGN_KEY_CHECKS=0;", function(err, result){
					if(err){
						return reject(err)
					}else{
						con.end()
						resolve("siiiiiiiiiiiiiii")
					}
				}) 
			}
		})
	}) 
}

function enviar (host, user, pass, port, bd, archivo_sql){
	return new Promise(function(resolve,reject){	
	config = {
		host: host,
		user: user,
		password: pass,
		port: port,
		database: bd
	}
	importer.config(config)
	importer.importSQL(archivo_sql).then(function(){
		resolve(importer.response)
	}).catch(function(err){
		// console.log(`error: ${err}`)
		reject(err)
	})
	})
}
// añadimos la función global mysql de comprobar claves foraneas
function mod_archivo(archivo){
	return new Promise(function(resolve,reject){
		fs.appendFile(archivo, 'SET GLOBAL FOREIGN_KEY_CHECKS=1;', function(err, res){
			if(err){
				reject(err)
			}else{
				resolve("Fichero modificado")
			}
		})
	})
}
// añadimos letras aleatorias para el nombre del archivo .sql
function nombre_archivo(){
  var text = ""
  var letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 3; i++)
    text += letras.charAt(Math.floor(Math.random() * letras.length))
  return (text + '.sql')
}
// borrado del archivo .sql
function borrar_archivo(archivo){
	new Promise(function(resolve, reject){
		fs.unlink (archivo, function(err){
			if (err){
				reject(err)
			}else{
				resolve('Fichero borrado')
			}
		})
	})
}
exports.importar = importar
exports.enviar = enviar
exports.crearBD = crearBD
exports.nombre_archivo = nombre_archivo
exports.mod_archivo = mod_archivo
exports.borrar_archivo = borrar_archivo
