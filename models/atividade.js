module.exports = {
	name: "atividade",
	label: "Atividades",
	menu: "Conteúdo",
	onlyFor: ["admin"],
	cache: "elasticache",
	
	fields: [
		{ name: "nome", label: "Nome", check: "hasValue" },
		{ name: "descricao", label: "Descrição" }
	],
	format: "{{nome}}"
}