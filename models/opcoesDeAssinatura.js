module.exports = {
	
	name: "opcoesDeAssinatura",
	label: "Opções de Assinatura",
	menu: "Assinantes",
	fields: [
		{ name: "nome", label: "Nome" },
		{ name: "descricao", label: "Descrição" },
		{ name: "ordem", label: "Ordem", type: "number" }
	],

	format: "{{descricao}}",

	sortBy: "ordem"

}