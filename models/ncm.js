module.exports = {

	name: "ncm",
	label: "NCM",
	menu: "Aplicativos",
	onlyFor: ["admin"],
	cache: "elasticache",
	
	fields: [
		{ name: "ncmId", label: "Código" },
		{ name: "desc", label: "Descrição" },
		{ name: "ipi", label: "Alíquota do IPI" },
		{ name: "section", label: "Sessão" },
		{ name: "chapter", label: "Capítulo" },
		{ name: "position", label: "Posição" },
		{ name: "subposition", label: "Subposição" },
		{ name: "item", label: "Item" },
		{ name: "belongsTo", label: "Código ao qual pertence" }
	],
	format: "{{_id}} - {{desc}}"
}