module.exports = {
	name: "feriado",
	label: "Feriados",
	menu: "Conteúdo",
	onlyFor: ["admin", "landlord"],
	cache: "elasticache",
	
	fields: [
		{ name: "nome", label: "Nome", checks: "hasValue" },
		{ name: "data", label: "Data", type: "date" }
	],
	format: "{{data}} - {{nome}}",

	getAllFromMonth: function( date, callback ){
		this.getAll({
			query: { 
		  		$and: [
		  			{ data: { $gt: date.clone().beginningOfMonth() } }, 
		  			{ data: { $lt: date.clone().endOfMonth() } }
		  		]
		  	},
		  	callback: callback
		})
	}
}