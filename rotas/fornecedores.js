const express = require("express")
const connection = require("../config/database")
const moment = require("moment")
const fs = require("node:fs")

module.exports = (app) => {

	const rotas = express.Router()

	rotas.get('/fornecedores_all', (req, res) => {
		connection.query(
			'select * from fornecedor order by id_fornecedor desc limit 10',
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})

	rotas.get('/fornecedores', (req, res) => {
		connection.query(
			'select * from fornecedor',
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})

	rotas.get('/fornecedores_byid/:id_fornecedor', (req, res) => {
		var id_fornecedor = req.params.id_fornecedor
		connection.query(
			`select * from fornecedor where id_fornecedor = ${id_fornecedor}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				var resultado = {}
				if (results.length > 0) {
					resultado.id_fornecedor = results[0].id_fornecedor
					resultado.razao = results[0].razao
					resultado.cpf_cnpj = results[0].cpf_cnpj
					resultado.contato = results[0].contato
					resultado.logradouro = results[0].logradouro
					resultado.cidade = results[0].cidade
					resultado.uf = results[0].uf
				}
				res.send(resultado)
			}
		);
	})

	rotas.get('/fornecedores_cpf_cnpj/:cpf_cnpj', (req, res) => {
		var cpf_cnpj = req.params.cpf_cnpj
		var sql = `select * from fornecedor where cpf_cnpj = "${cpf_cnpj}"`//string inteligente(crase `)
		connection.query(
			sql,
			(err, results, fields) => {
				if (err) console.log(err)
				if (results.length > 0) res.send({ existe: true })
				else res.send({ existe: false })

			}
		);
	})

	rotas.delete('/fornecedores_del/:id_fornecedor', (req, res) => {
		var id_fornecedor = req.params.id_fornecedor
		connection.query(
			`delete from fornecedor where id_fornecedor = ${id_fornecedor}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})



	rotas.post('/fornecedores', (req, res) => {
		var razao = req.body.razao
		var cpf_cnpj = req.body.cpf_cnpj
		var contato = req.body.contato
		var logradouro = req.body.logradouro
		var cidade = req.body.cidade
		var uf = req.body.uf
		console.log(req.files)

		var sql = `insert into fornecedor(razao, cpf_cnpj, contato,`
			+ ` logradouro, cidade, uf) values("${razao}","${cpf_cnpj}",` + `
		 "${contato}", "${logradouro}", "${cidade}", "${uf}")`;

		//////////////////////AQUI Tá TUDO ERRADO/////////////////////////////////////////////////
		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			/*
						var caminhoTemp = req.files.avatar.path
						var caminhoNovo = `./uploads/fornecedores/${resultado.insertId}.png`
						fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
							console.log(err)
							res.send(resultado)
						})*/
			////////////////////////////////////////////////////////////////////////
			//fs.copyFile(req.files.avatar.path, `./uploads/clientes/${resultado.insetId}.png`,


		})
	})


	rotas.patch('/fornecedores/:id_fornecedor', (req, res) => {
		var razao = req.body.razao
		var cpf_cnpj = req.body.cpf_cnpj
		var contato = req.body.contato
		var logradouro = req.body.logradouro
		var cidade = req.body.cidade
		var uf = req.body.uf
		var id_fornecedor = req.params.id_fornecedor

		var sql = `update fornecedor set razao = "${razao}", cpf_cnpj = "${cpf_cnpj}", `
			+ `contato = "${contato}", logradouro = "${logradouro}", cidade = "${cidade}", `
			+ `uf = "${uf}" where id_fornecedor = ${id_fornecedor}`

		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			res.send(resultado)
		})
	})

	app.use("/", rotas)
}