module.exports = {
	name: "pagina",
	label: "Paginas",
	menu: "Conteúdo",
	onlyFor: ["admin"],
	cache: "elasticache",
	
	fields: [
		{ name: "nome", label: "Nome", checks: "hasValue" },
		{ name: "titulo", label: "Título", checks: "hasValue" },
		{ name: "corpo", label: "Corpo da Notícia", type: "html" },
		{ name: "dataDePublicacao", label: "Data de Publicação", type: "date", checks: "hasValue" },
		{ name: "tags", label: "Tags (separadas por virgula)" },
		{ name: "template", label: "Template" }
	],
	format: "{{nome}}"
}