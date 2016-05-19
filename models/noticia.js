module.exports = {
	name: "noticia",
	label: "Notícias",
	menu: "Conteúdo",
	onlyFor: ["admin", "landlord"],
	cache: "elasticache",
	
	fields: [
		{ name: "titulo", label: "Título", checks: "hasValue" },
		{ name: "resumo", label: "Resumo", type: "text" },
		{ name: "corpo", label: "Corpo da Notícia", type: "html" },
		{ name: "dataPublicacao", label: "Data de Publicação", type: "date", checks: "hasValue" },
		{ name: "palavrasChave", label: "Palavras Chave" },
		{ name: "tags", label: "Categorias", type: "tags", of: ["esfera", "assunto", "setor", "orgao"] },
		{ name: "capa", label: "Vai para a capa do site", type: "boolean" },
		{ name: "destaque", label: "Vai para Destaques", type: "boolean" },
		{ name: "newsLetter", label: "Vai para News Letter", type: "boolean" },
		{ name: "obrigacao", label: "Vai para Obrigações", type: "boolean" },
		{ name: "dataDaObrigacao", label: "Data da obrigação (no calendário)", type: "date" },
		{ name: "dataDoAto", label: "Data do Ato", type: "date" },
		{ name: "complemento", label: "Complemento" },
		{ name: "tipoDeAto", label: "Tipo de Ato", type: "combo", of: "tipoDeAto", descOnly: true },
		{ name: "codigoDoAto", label: "Código do Ato" }
	],
	format: "{{{dataPublicacao}}} - {{titulo}}",
	sort: [[ "dataPublicacao" , -1 ]],
	
	getByTags: function( callback, tags, limit ){

		if ( tags.constructor != Array ) tags = [ tags ]
		if ( tags.length === 0 ) return callback()

		var sort = [[ 'dataPublicacao', -1 ]]
		  , config = { limit: limit, sort: sort, fields: ['titulo'] }
		  , query = { tags: { $in: tags } }
		
		this.getByQuery({ 
			query: query, 
			config: config, 
			callback: callback
		})
	},

	getTop: function( callback, page, pageSize ){
		var config = configFind( page, pageSize )
		  , query = { capa: true }

		this.getAll({
			query: query,
			config: config, 
			callback: callback 
		})
	},

	getTopCategoria: function( callback, cat, page, pageSize ){
		var config = configFind( page, pageSize )
		  , query  = { $and: [] }
		  , values = cat.spacify().split(' ')

		values.forEach( function( value ){
			var val = { $regex: value, $options: 'i' }
			query.$and.push( { $or: [ { tags: val }, { palavrasChave: val }, { tipoDeAto: val } ] } )
		})

		this.getByQuery({
			query: query, 
			config: config,
			callback: callback
		})
	},

	getDestaques: function( callback, limit ){
		var sort   = [[ 'dataPublicacao', -1 ]]
		  , query  = { destaque: true }
		  , config = { sort: sort, fields: ['dataPublicacao', 'titulo', 'resumo'] }

		if ( limit ) config.limit = limit

		this.getByQuery({
			query: query, 
			config: config,
			callback: callback
		})
	},

	getObrigacoes: function( date, callback ){
		var date   = date ? date : new Date()
		  , from   = date.clone().beginningOfMonth()
		  , to     = date.clone().endOfMonth()
		  , query  = { 
				$and: [
					{ obrigacao: true },
					{ dataDaObrigacao: { $gt: from } },
					{ dataDaObrigacao: { $lt: to } }
				]
			}
		  , sort   = [[ 'dataDaObrigacao', 1 ]]
		  , config = { sort: sort, fields: ['dataDaObrigacao', 'titulo', 'id'] }

		this.getAll({
			query: query,
			config: config,
			callback: callback
		})
	},

	search: function( par ){

		var config     = configFind( par.page, par.pageSize )
		  , values     = par.values.split( ' ' )
		  , fields     = par.fields.split( ' ' )
		  , callback   = par.callback
		  , query      = {}
		  , fieldMatch = {}

		if ( fields.length === 1 && values.length === 1 ){
			query[ fields[0] ] = { $regex: values[0], $options: 'i' }
		}
		if ( fields.length === 1 && values.length > 1 ){
			query.$and = []
			values.forEach( function( value ){
				var and = {}
				and[ fields[0] ] = { $regex: value, $options: 'i' }
				query.$and.push( and )
			})
		}
		if ( fields.length > 1 && values.length === 1 ){
			query.$or = []
			fields.forEach( function( field ){
				var or = {}
				or[ field ] = { $regex: values[0], $options: 'i' }
				query.$or.push( or )
			})
		}
		if ( fields.length > 1 && values.length > 1 ){
			query.$and = []
			values.forEach( function( value ){
				var and = { $or: [] }
				fields.forEach( function( field ){
					var or = {}
					or[ field ] = { $regex: value, $options: 'i' }
					and.$or.push( or )
				})
				query.$and.push( and )
			})
		}

		this.getByQuery({
			query: query, 
			config: config,
			callback: callback
		})
	}
}

function configFind( page, pageSize ){
	var page     = page || 0
	  , pageSize = pageSize || 20
	  , skip     = pageSize * page
	  , sort     = [[ 'dataPublicacao', -1 ]]
	  , fields   = ['dataPublicacao', 'titulo', 'resumo', 'tipoDeAto', 'codigoDoAto', 'complemento', 'dataDoAto', 'tags']
	  , config   = { limit: pageSize, skip: skip, sort: sort, fields: fields }
	
	return config
}