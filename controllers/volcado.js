// const server = require ('./server.js')
const mysqlDump = require('mysqldump')
const mysql = require('mysql')
const importer = require('node-mysql-importer')
const fs = require('fs')
var con

// funcion para conectar e importar toda la base de datos a un archivo .sql
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
				reject("No se puede conectar con la base de datos de origen " + err)
			}else{
				resolve("Conexión realizada a la base de datos de origen")
			}
		})
	})
}

// función que conecta con la BD, crea la base de datos vacía y añade las globales a sus estado original
function crearBD(host, user, pass, port, bd, archivo_sql){
		var config = {
			host: host,
			user: user,
			password: pass,
			port: port,
			multipleStatements: true
		}
		var con = mysql.createConnection(config)
			return new Promise(function(resolve, reject){
				con.connect(function(err, data) {
					if(err){
				// console.error('error de conexion:' + err.stack)
				// evitamos que salga el error de "Unhandled promise rejection"
				// con.on('error',function(){
						reject("No se pudo conectar con la base de datos de destino " + err)		
				// })
			}else{
				// console.log('conectado con la id ' + con.threadId)
				// creamos la tabla y desactivamos la comprobación de claves foraneas
				con.query("CREATE DATABASE " + bd + "; SET GLOBAL FOREIGN_KEY_CHECKS=0;", function(err, result){
					if(err){
						return reject(err)
					}else{
						con.end()
						resolve("Conectado con la base de datos de destino")
					}

				})
				} 
			}
		})
	}) 
}

var conexion = function conectar_bd2(host, user, pass, port, bd){
		var config = {
			host: host,
			user: user,
			password: pass,
			port: port,
			multipleStatements: true
		}
		var con = mysql.createConnection(config)
			return new Promise(function(resolve, reject){
				con.connect(function(err, data) {
					if(err){
						reject("No se pudo conectar con la base de datos de destino " + err)
			}else{
						resolve(con)
				}
			})
		})
	}		

// function enviar (host, user, pass, port, bd, archivo_sql){
// 	return new Promise(function(resolve,reject){	
// 	config = {
// 		host: host,
// 		user: user,
// 		password: pass,
// 		port: port,
// 		database: bd
// 	}
// 	importer.config(config)
// 	importer.importSQL(archivo_sql).then(function(err,data){
// 		// console.log(importer.response)
// 		resolve(data)
// 	}).catch(function(err){
// 		console.log(`error: ${err}`)
// 		reject(err)
// 	})
// 	})
// }

function leer_archivo(archivo){
	return new Promise(function(resolve, reject){
		fs.readFile(archivo, 'utf8', function(err,res){
			if(err){
				reject(err)
			}else{
				resolve(res)
			}
		})
	})
}

function cortar_array(str) {
	return new Promise (function(resolve, reject){
		if (str.indexOf(';') === -1){
			reject("cada sentencia SQL debe concluir con un punto y coma")
		}else{
			str = str.trim()
			str = str.replace(/\s\s+/g, ' ').trim()
			str = str.substring(0, str.length-1)
			let arr = str.split(';')
			resolve(arr)
		}
	})
}

function mandar_datos(arr) {
	return new Promise(function(resolve,reject){
		var config = {
			// llamamos a las variables de entorno
				host: process.env.host2,
				user: process.env.user2,
				password: process.env.pass2,
				port: process.env.port2,
				database: process.env.bd2,
				multipleStatements: true
			}
		var con = mysql.createConnection(config)
			arr.map(function(item){
				con.query(item,function(err, data){
					if (err){
						reject (err)
					}else{
						resolve('Datos volcados en la Base de Datos')	
					}
				})
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
	return new Promise(function(resolve, reject){
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
// exports.enviar = enviar
exports.crearBD = crearBD
exports.nombre_archivo = nombre_archivo
exports.mod_archivo = mod_archivo
exports.borrar_archivo = borrar_archivo
exports.leer_archivo = leer_archivo
exports.cortar_array = cortar_array
exports.mandar_datos = mandar_datos
