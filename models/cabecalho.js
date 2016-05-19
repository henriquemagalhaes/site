module.exports = {
	name: "cabecalho",
	label: "Cabeçalho",
	menu: "Conteúdo",
	onlyFor: ["admin", "landlord"],
	cache: "elasticache",
	
	fields: [
		{ name: "descricao", label: "Descrição" },
		{ name: "termos", label: "Termos (separados por virgula)" },
		{ name: "corpo", label: "Corpo", type: "html" }
	],
	format: "{{descricao}}",

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