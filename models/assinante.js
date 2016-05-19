module.exports = {
	name: "assinante",
	label: "Assinantes",
	menu: "Assinantes",
	cache: "elasticache",
	
	fields: [
		{ name: "numAssinante", label: "Sequência" },
		{ name: "pwdHash", label: "Senha", type: "password" },
		{ name: "codAssinante", label: "Código" },
		{ name: "nome", label: "Nome" },
		{ name: "cpfCnpj", label: "CPF / CNPJ" },
		{ name: "atividade", label: "Atividade" },
		{ name: "endereco", label: "Endereço" },
		{ name: "bairro", label: "Bairro" },
		{ name: "cidade", label: "Cidade" },
		{ name: "uf", label: "UF" },
		{ name: "cep", label: "CEP" },
		{ name: "caixaPostal", label: "Caixa Postal" },
		{ name: "fone1", label: "Telefone Principal", type: "tel" },
		{ name: "fone2", label: "Outro Telefone", type: "tel" },
		{ name: "fax", label: "FAX", type: "tel" },
		{ name: "email", label: "e-mail", type: "email" },
		{ name: "email2", label: "Segundo e-mail", type: "email" },
		{ name: "email3", label: "Terceiro e-mail", type: "email" },
		{ name: "nomeAc", label: "Nome AC" },
		{ name: "nomeCob", label: "Nome da Cobrança" },
		{ name: "enderecoCob", label: "Endereço da Cobrança" },
		{ name: "cidadeCob", label: "Cidade da Cobrança" },
		{ name: "ufCob", label: "UF da Cobrança" },
		{ name: "cepCob", label: "CEP da Cobrança" },
		{ name: "indAtivo", label: "Ativo", type: "boolean" },
		{ name: "ultAtualizacao", label: "Ultima Atualização", type: "date" },
		{ name: "opcaoDeAssinatura", label: "Opção de Assinatura" },
		{ name: "condicaoPagamento", label: "Condição de Pagamento" },
		{ name: "comentarioPagamento", label: "Comentário de Pagamento" },
		{ name: "canal", label: "Como ficou sabendo?" }
	],
	format: "{{nome}} - {{email}}",

	auth: function( _id, pwd, callback ){

		var query = { $or: [ { codAssinante: _id }, { email: _id } ] }

		function afterFind( err, assinante ){
			if ( assinante ){
				var auth = bcrypt.compareSync( pwd, assinante.pwdHash )
				
				if ( auth ) callback( 200, assinante )
				else callback( 401 )
			} else {
				callback( 404 )
			}
		}

		this.collection().findOne( query, afterFind )

	}
}