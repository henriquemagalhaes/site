module.exports = function( srv, base, config ){

	var resumoLimit = 25

	function getBusca( req, res ){

		var termos        = req.query.termos
		  , campos        = req.query.campos || 'titulo tags'
		  , page          = req.query.page ? new Number( req.query.page ) : 0
		  , template      = req.query.template || 'assunto'
		  , metodo        = req.query.metodo || 'contem'
		  , pageSize      = 20
		  , pagelessURL   = req.url.remove(/\&page=(\d*)/).remove(/page=(\d*)\&/).remove(/page=(\d*)/)
		
		function callback( err, noticias ){

			noticias.forEach( function( noticia ){

				if ( noticia.resumo && noticia.resumo.split(' ').length > resumoLimit ) 
					noticia.resumo = noticia.resumo.split(' ').to(resumoLimit).join(' ') + ' ...'
			})

			res.render( 'busca/'+template+'.html',
				{   noticias: noticias
				  , assinante: req.session.assinante
				  , url: pagelessURL+'&page='
				  , page: page
			  	  , cabecalhoPars: ['termo='+req.query.termos] }
			)
		}
		
		srv.m.noticia.search(
			{   values: termos
			  , fields: campos
			  , page: page
			  , pageSize: pageSize
			  , callback: callback }
		)

	}
	srv.get( '/noticias/busca.html', getBusca ) 




	function getCategoria( req, res ){

		var query         = { $and: [] }
		  , page          = req.query.page ? new Number( req.query.page ) : 0
		  , template      = req.query.template || 'assunto'
		  , pageSize      = 20
		  , values        = []
		  , pagelessURL   = req.url.remove(/\&page=(\d*)/).remove(/page=(\d*)\&/).remove(/page=(\d*)/)
		  , skip          = pageSize * page
		  , sort          = [[ 'dataPublicacao', -1 ], [ 'codigoDoAto', -1 ]]
		  , fields        = ['dataPublicacao', 'titulo', 'resumo', 'tipoDeAto', 'codigoDoAto', 'complemento', 'dataDoAto', 'tags']
		  , config        = { limit: pageSize, skip: skip, sort: sort, fields: fields }
		  , cabecalhoPars = []

		for ( par in req.query ){ 
		
			if ( par !== 'page' && par !== 'template' && par !== 'ordem' && par !== '__proto__' ){
				
				if ( req.query[ par ].isArray() ){

					if ( par === 'tags' ){
						req.query[ par ].forEach( function( p ){
							var arg = {}
							arg[ par ] = { $regex: '^'+p+'$', $options: 'i' }
							query.$and.push( arg )

							cabecalhoPars.push( 'termo='+p.replace(/ /g, '+') )
						})
					} else {
						var or = { $or: [] }
						req.query[ par ].forEach( function( p ){
							var arg = {}
							arg[ par ] = { $regex: '^'+p+'$', $options: 'i' }
							or.$or.push( arg )

							cabecalhoPars.push( 'termo='+p.replace(/ /g, '+') )
						})
						query.$and.push( or )
					}
				} else {
					var arg = {}
					arg[ par ] = { $regex: '^'+req.query[ par ]+'$', $options: 'i' }
					query.$and.push( arg )

					console.log( 'query', par, req.query )
					cabecalhoPars.push( 'termo='+req.query[ par ].replace(/ /g, '+') )
				}
				values.push( req.query[par] )
			}
		}

		function callback( err, noticias ){

			noticias.forEach( function( noticia ){

				if ( noticia.resumo && noticia.resumo.split(' ').length > resumoLimit ) 
					noticia.resumo = noticia.resumo.split(' ').to(resumoLimit).join(' ') + ' ...'
			})

			res.render( 'busca/'+template+'.html',
				{   noticias: noticias
				  , assinante: req.session.assinante
				  , url: pagelessURL+'&page='
				  , page: page
				  , cabecalhoPars: cabecalhoPars }
			)
		}

		srv.m.noticia.getAll(
			{   query: query
			  , config: config
			  , callback: callback }
		)

	}
	srv.get( '/noticias/categoria.html', getCategoria ) 




	function getCabecalho( req, res ){

		var query  = { $and: [] }
		  , termos = req.query.termo.isString() ? req.query.termo.split( ' ' ) : req.query.termo

		termos.forEach( function( termo ){
			query.$and.push( { termos: { $regex: termo, $options: 'i' } } )
		})

		srv.m.cabecalho.getAll({
			query: query,
			callback: function( err, data ){
				if ( data && data.length > 0 ){
					var html = data[0].corpo
					res.render( 'busca/cabecalho.html', {
						termos: termos,
						cabecalho: data[0]
					})
				} else {
					res.render( 'busca/cabecalho.html', {
						termos: termos,
						cabecalho: undefined
					})
				}
			}
		})
	}
	srv.get( '/busca/cabecalho.html', getCabecalho )




}