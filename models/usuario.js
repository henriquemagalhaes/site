module.exports = {
	name: "usuario",
	label: "Usuarios",
	menu: "Administração",
	onlyFor: ["admin"],
	cache: "elasticache",
	
	fields: [
		{ name: "user", label: "User" },
		{ name: "pwdHash", label: "Senha", type: "password" },
		{ name: "nome", label: "Nome" },
		{ name: "email", label: "e-mail", type: "email" },
		{ name: "endereco", label: "Endereço" },
		{ name: "cidade", label: "Cidade" },
		{ name: "uf", label: "UF" },
		{ name: "cep", label: "CEP" },
		{ name: "fone1", label: "Telefone Principal", type: "tel" },
		{ name: "fone2", label: "Outro Telefone", type: "tel" },
		{ name: "indInativo", label: "Inativo", type: "boolean" }
	],
	format: "{{nome}}",

	auth: function( _id, pwd, callback ){

		var query = { $or: [ { user: _id }, { email: _id } ] }

		function afterFind( err, usr ){
			if ( usr ){
				var auth = bcrypt.compareSync( pwd, usr.pwdHash )
				
				if ( auth ) callback( 200, usr )
				else callback( 401 )
			} else {
				callback( 404 )
			}
		}

		this.collection().findOne( query, afterFind )

	}
}