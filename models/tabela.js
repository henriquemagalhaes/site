module.exports = {
	name: "tabela",
	label: "Tabelas",
	menu: "Conteúdo",
	onlyFor: ["admin", "landlord"],
	cache: "elasticache",
	
	fields: [
		{ name: "tipo", label: "Tipo", type: "combo", of: ["tabelas mensais", "tabelas de uso frequente", "outras tabelas"] },
		{ name: "titulo", label: "Título", checks: "hasValue" },
		{ name: "resumo", label: "Resumo", type: "text" },
		{ name: "corpo", label: "Corpo da Notícia", type: "html" },
		{ name: "dataPublicacao", label: "Data de Publicação", type: "date", checks: "hasValue" },
		{ name: "dataVigenciaInicio", label: "Data de Início da Vigência", type: "date", checks: "hasValue" },
		{ name: "dataVigenciaFim", label: "Data de Fim da Vigência", type: "date" }
	],
	format: "{{dataPublicacao}} - {{titulo}}",
	sort: [[ "dataPublicacao" , -1 ]],

	getAllVigentes: function( callback, tipo ){
		var beginningOfToday = Date.create().beginningOfDay()
		  , endOfToday = Date.create().endOfDay()
		  , query = {}

		if ( tipo ) query.tipo = tipo

		query.$or = [ 
			{ $and: [ { dataVigenciaFim : { $gte: beginningOfToday } }, { dataVigenciaInicio: { $lte: endOfToday } } ] }
	  	  , { $and: [ { dataVigenciaFim : { $gte: null             } }, { dataVigenciaInicio: { $lte: endOfToday } } ] }
	  	]
		
		this.getAll( { callback: callback, query: query } )
	},

	getAllInTime: function( callback, date ){
		var beginningOfToday = date.beginningOfDay()
		  , endOfToday = date.endOfDay()
		  , query = {}
		  , config = { fields: [ 'titulo', 'tipo' ] }

		query.$or = [ 
			{ $and: [ { dataVigenciaFim : { $gte: beginningOfToday } }, { dataVigenciaInicio: { $lte: endOfToday } } ] }
	  	  , { $and: [ { dataVigenciaFim : { $gte: null             } }, { dataVigenciaInicio: { $lte: endOfToday } } ] }
	  	]
		
	  	function afterGet( err, data ){
	  		var groupedData = data.length > 0 ?  data.groupBy( 'tipo' ) : undefined
	  		callback( err, groupedData )
	  	}

		this.getAll( { callback: afterGet, query: query, config: config } )	
	}
}