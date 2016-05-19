module.exports = {
	name: "orgao",
	label: "Órgão",
	menu: "Conteúdo",
	onlyFor: ["admin"],
	cache: "elasticache",
	
	fields: [
		{ name: "nome", label: "Nome", checks: "hasValue" },
		{ name: "sigla", label: "Sigla" },
		{ name: "esfera", label: "Esfera", type: "combo", of: "esfera" }
	],
	format: "{{nome}}"
}