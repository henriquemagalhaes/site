module.exports = {
	name: "proposta",
	label: "Propostas",
	menu: "Assinantes",
	onlyFor: ["admin"],
	
	fields: [
		{ name: "nomeProposto", label: "Nome do Proposto", check: "hasValue" },
		{ name: "validade", label: "Validade", type: "date" },
		{ name: "descricao", label: "Descrição", type: 'html' },
		{ name: "estado", label: "Estado", type: "category", options: ["Pendente", "Aceita", "Processada", "Cancelada"] },

		{ name: "nome",        label: "Nome"                              },
		{ name: "cpfCnpj",     label: "CPF / CNPJ"                        },
		{ name: "endereco",    label: "Endereço"                          },
		{ name: "cidade",      label: "Cidade"                            },
		{ name: "uf",          label: "UF"                                },
		{ name: "cep",         label: "CEP"                               },
		{ name: "caixaPostal", label: "Caixa Postal"                      },
		{ name: "fone1",       label: "Telefone Principal", type: "tel"   },
		{ name: "fone2",       label: "Outro Telefone",     type: "tel"   },
		{ name: "fax",         label: "FAX",                type: "tel"   },
		{ name: "email",       label: "e-mail",             type: "email" },
		{ name: "email2",      label: "Segundo e-mail",     type: "email" },
		{ name: "email3",      label: "Terceiro e-mail",    type: "email" },
		{ name: "nomeAc",      label: "Nome AC"                           },
		{ name: "nomeCob",     label: "Nome da Cobrança"                  },
		{ name: "enderecoCob", label: "Endereço da Cobrança"              },
		{ name: "cidadeCob",   label: "Cidade da Cobrança"                },
		{ name: "ufCob",       label: "UF da Cobrança"                    },
		{ name: "cepCob",      label: "CEP da Cobrança"                   },
		{ name: "novo",      label: "O novo Campo"                   }

	],
	format: "{{nomeProposto}}, até {{validade}}, {{estado}}"
}