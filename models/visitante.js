module.exports = {
	name: "visitante",
	label: "Visitantes",
	menu: "Visitantes",
	cache: "elasticache",
	
	fields: [
		{ name: "nome", label: "Nome" },
		{ name: "pwdHash", label: "Senha", type: "password" },
		{ name: "cpfCnpj", label: "CPF / CNPJ" },
		{ name: "endereco", label: "Endereço" },
		{ name: "cidade", label: "Cidade" },
		{ name: "uf", label: "Estado" },
		{ name: "fone1", label: "Telefone Principal", type: "tel" },
		{ name: "email", label: "e-mail", type: "email" },
		{ name: "indAtivo", label: "Ativo", type: "boolean" },
		{ name: "atividade", label: "Ramo de Atividade", type: "combo", of: "atividade" },
		{ name: "dataDeFim", label: "Data de Fim", type: "date" }
	],
	format: "{{nome}} - {{email}}",

	auth: function( _id, pwd, callback ){

		var query = { email: _id }

		function afterFind( err, visitante ){
			if ( visitante ){
				var auth = bcrypt.compareSync( pwd, visitante.pwdHash )
				
				if ( new Date() > visitante.dataDeFim ) callback( 409 )
				else if ( !auth ) callback( 401 )
				else callback( 200, visitante )
			} else {

				callback( 404 )
			}
		}

		this.collection().findOne( query, afterFind )

	}
}