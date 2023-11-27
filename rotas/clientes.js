const express = require("express")
const connection = require("../config/database")
const moment = require("moment")
const fs = require("node:fs")

module.exports = (app) => {
	const rotas = express.Router()

	rotas.get('/clientes_all', (requisition, answer) => {
		connection.query(
			'select * from cliente order by id_cliente desc limit 10',
			(mensagemDeErro, resultados, metaDataDosClientes) => {
				if (mensagemDeErro) console.log(mensagemDeErro)
				answer.send(resultados)
			}
		);
	})

	rotas.get('/clientes', (requisicao, resposta) => {
		connection.query(
			'select * from cliente',
			(mensagemDeErro, resultados, metaDataDosClientes) => {
				if (mensagemDeErro) console.log(mensagemDeErro)
				resposta.send(resultados)
			}
		);
	})

	rotas.get('/clientes_byid/:idDoCliente', (req, res) => {
		var id_cliente = req.params.idDoCliente
		connection.query(
			`select * from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				var resultado = {}
				if (results.length > 0) {
					resultado.id_cliente = results[0].id_cliente
					resultado.nome = results[0].nome
					resultado.sobrenome = results[0].sobrenome
					resultado.email = results[0].email
					resultado.salario = results[0].salario
					resultado.data_cadastro = results[0].data_cadastro
				}
				res.send(resultado)
			}
		);
	})

	rotas.get('/clientes_email/:email', (req, res) => {
		var email = req.params.email
		var sql = `select * from cliente where email = "${email}"`//string inteligente(crase `)
		connection.query(
			sql,
			(err, results, fields) => {
				if (err) console.log(err)
				if (results.length > 0) res.send({ existe: true })
				else res.send({ existe: false })

			}
		);
	})

	rotas.get('/clientes_email_all/:nome/:email', (req, res) => {
		var email = req.params.email
		var nome = req.params.nome
		var sql = `select * from cliente where email = "${email}" AND nome = "${nome}"`//string inteligente(crase `)
		connection.query(
			sql,
			(err, results, fields) => {
				if (err) {
					console.log(err)
					res.status(500).send('Erro no servidor');
				} else if (results.length > 0) {
					res.json(results);
				} else {
					res.send({ existe: false })
				}
			}
		);
	})


	rotas.delete('/clientes_del/:id_cliente', (req, res) => {
		var id_cliente = req.params.id_cliente
		connection.query(
			`delete from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})



	/*
		rotas.post('/clientes', (req, res) => {
			var nome = req.body.nome
			var sobrenome = req.body.sobrenome
			var email = req.body.email
			var data_cadastro = moment().format("YYYY-MM-DD")
			var salario = req.body.salario
			console.log(req.files)
			var sql = `insert into cliente(nome, sobrenome, email,`
				+ ` data_cadastro, salario) values("${nome}","${sobrenome}",` + `
			 "${email}", "${data_cadastro}", ${salario})`;

			connection.query(sql, (erro, resultado) => {
				if (erro) res.send(erro)
				var caminhoTemp = req.files.avatar.path
				var caminhoNovo = `./uploads/clientes/${resultado.insertId}.png`
				fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
					console.log(err)
					res.send(resultado)
				})



			})
		})*/

	rotas.post('/clientes', (req, res) => {
		console.log(req.body)
		var nome = req.body.nome
		var sobrenome = req.body.sobrenome
		var email = req.body.email
		var data_cadastro = moment().format("YYYY-MM-DD")
		var salario = req.body.salario
		console.log(req.body)
		var sql = `insert into cliente(nome, sobrenome, email, ` +
			`data_cadastro,salario) values("${nome}", "${sobrenome}", ` +
			`"${email}", "${data_cadastro}", ${salario})`
		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			/*
			var caminhoTemp = req.files.avatar.path
			var caminhoNovo = `./uploads/clientes/${resultado.insertId}.png`
			fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
				console.log(err)

			})
			res.send(resultado)*/
		})
	})



	rotas.patch('/clientes/:id_cliente', (req, res) => {
		var nome = req.body.nome
		var sobrenome = req.body.sobrenome
		var email = req.body.email
		var salario = req.body.salario
		var id_cliente = req.params.id_cliente

		var sql = `update cliente set nome ="${nome}", sobrenome = "${sobrenome}", `
			+ `email = "${email}", salario = ${salario} where id_cliente = ${id_cliente}`

		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			res.send(resultado)
		})
	})


	app.use("/", rotas)
}