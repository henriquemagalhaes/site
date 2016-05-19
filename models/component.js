module.exports = {
	name: "component",
	label: "Componente",
	menu: "Conteúdo",
	onlyFor: ["admin", "landlord"],
	cache: "elasticache",
	
	fields: [
		{ name: "description", label: "Descrição" },
		{ name: "body", label: "Corpo", type: "html" }
	],
	format: "{{description}}",

	get: function( desc, callback ){
		var query = { description: new RegExp( desc, 'i' ) }

		this.getAll({ 
			query: query, 
			callback: function(err, data){
				if (data.length > 0) callback(err, data[0].body ) 
				else callback( 404 )
			}
		})
	}
}