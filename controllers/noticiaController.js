module.exports = function( srv, base, model, config ){
	
	function getNoticiaById( req, res, next ){
		
		function callback( err, noticia ){
			if ( err || !noticia ) res.send( 404 )
			else {
				req.noticia = noticia
				next()
			}
		}
		srv.m.noticia.getById({ id: req.params.id, callback: callback } )
	}

	function getNoticiaByDesc( req, res, next ){

		var codigo = req.query.codigoDoAto
		  , tipo   = req.query.tipoDeAto
		  , query  = { tipoDeAto: { $regex: tipo, $options: "i"}, codigoDoAto: codigo }

		if ( !codigo || !tipo ) return res.send( 404 )

		function callback( err, noticias ){
			if ( err || !noticias || noticias.constructor != Array || noticias.length === 0 )
				return res.send( 404 )

			req.noticia = noticias[0]
			next()
		}
		srv.m.noticia.getByQuery({ query: query, callback: callback })
	}

	function getTiposDeAto( req, res, next ){

		if ( srv.get( 'tiposDeAto' ) ){
			req.tiposDeAto = srv.get( 'tiposDeAto' )
			return next()
		}
		function callback( err, tiposDeAto ){
			if ( err || !tiposDeAto ){
				req.tiposDeAto = []
				next()
			} else {
				req.tiposDeAto = tiposDeAto
				srv.set( 'tiposDeAto', tiposDeAto )
				next()
			}
		}
		srv.m.tipoDeAto.getAll({ callback: callback })
	}

	function buildLinks( req, res, next ){ 

		var exps = [ 
				' n&ordm; ?[+\\d\\.]*\\d?, de \\d{1,2} de \\w{4,} de \\d{4}', 
				' n&ordm; ?[+\\d\\.]*\\d?, de \\d{4}', 
				' n&ordm; ?[+\\d\\.]*\\d?\\/\\d{2}' 
			]	
		  , html = req.noticia.corpo || ''

		html = html.replace( /nº/gi, 'n&ordm;' )

		req.tiposDeAto.forEach( function( tipo ){
			
			exps.forEach( function( exp ){
		
				var regex = new RegExp( tipo.nome+exp, 'gi' )
				  , matches = html.match( regex ) || []
				
				matches.forEach( function( str ){
					console.log( str )
					var codigoDoAto = str.match( / n&ordm; ?[+\d\.]*\d/gi )
					  , tipoDeAto = str.toLowerCase().split( ' n&ordm; ' )

					if ( codigoDoAto && codigoDoAto.constructor == Array && codigoDoAto.length > 0 )
						codigoDoAto = codigoDoAto[0].replace(' n&ordm; ', '' )
					else return

					if ( tipoDeAto && tipoDeAto.constructor == Array && tipoDeAto.length > 0 )
						tipoDeAto = tipoDeAto[0].replace( ' ', '+' )
					else return

					html = html.replace( new RegExp( str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), '<a href="/noticia?codigoDoAto='+codigoDoAto+'&tipoDeAto='+tipoDeAto+'">'+str+'</a>' )
				})
			})
		})
		req.noticia.corpo = html
		next()
	}

	function getMaisNoticias( req, res, next ){

		if ( !req.noticia.tags ){
			req.noticia.maisNoticias = []
			return next()	
		} 

		function callback( err, noticias ){
			if ( err || !noticias ){
				req.noticias.maisNoticias = []
				return res.next()	
			} 
			req.noticia.maisNoticias = noticias
			next()
		}		

		srv.m.noticia.getByTags( callback, req.noticia.tags, 10 )
	}

	function renderNoticia( req, res ){

		var noticia = req.noticia
		noticia.tags = noticia.tags.sortBy()
		
		res.render( 'noticia', { 
			htmlTitle:  noticia.titulo,
			noticia:    noticia,
			assinante:  req.session.assinante
		})	
	}
	srv.get( '/noticia/:id', getNoticiaById, getTiposDeAto, buildLinks, getMaisNoticias, renderNoticia )
	srv.get( '/noticia', getNoticiaByDesc, getTiposDeAto, buildLinks, getMaisNoticias, renderNoticia )

	// GET /noticia/:date/:title.html
	function getNoticiaByTitulo( req, res ){
		var data  = Date.create( req.params.date )
		  , titulo = req.params.title.spacify()

		function afterGetNoticia( err, noticias ){
			
			if ( noticias.length > 0 ) {
				var noticia = noticias[0] 
				noticia.tags = noticia.tags.sortBy()
				noticia.corpo = buildLinks( noticia.corpo )

				res.render( 'noticia', { 
					htmlTitle:  noticias.titulo,
					noticia:    noticias,
					assinante:  req.session.assinante
				})			

			} else {

				res.send( 404 )
			}
		}
		
		srv.m.noticia.getAll({ 
			query: { dataPublicacao: { $gte: data.clone().beginningOfDay(), $lte: data.clone().endOfDay() }, titulo: new RegExp( titulo, 'i' ) },
			callback: afterGetNoticia
		})
	}
	srv.get( '/noticia/:date/:title.html', getNoticiaByTitulo )
}