module.exports = function( srv, base, config ){

	var resumoLimit = 25

	function getIndex( req, res ){

		var qtNoticias = 10 // tem que ser par
		  , qtDestaques = 6
		
		// callbacks
		function afterGetNoticias( err, noticias ){
			return noticias
		}

		// final
		function finalCB( actions ){
			console.log( ' >>>>>> ACTIONS', actions )
			actions.noticia.results.forEach( function( noticia ){
				if (noticia.resumo && noticia.resumo.split(' ').length > resumoLimit) noticia.resumo = noticia.resumo.split(' ').to(resumoLimit).join(' ') + ' ...'
			})
			actions.destaque.results.forEach( function( noticia ){
				if (noticia.resumo && noticia.resumo.split(' ').length > resumoLimit) noticia.resumo = noticia.resumo.split(' ').to(resumoLimit).join(' ') + ' ...'
			})

			var data = { 
				htmlTitle:   'Mensário Fiscal',
				noticias:    actions.noticia.results,
				destaques:   actions.destaque.results,
				assinante:   req.session.assinante,
				listTitle:   'Últimas notícias',
				page:        0,
				nextPageURL: '/noticias/pagina/1'
			}

			res.render( 'index', data )			
		}
		
		p30(
			{
				noticia:   { cb: afterGetNoticias,  fn: function(){ srv.m.noticia.getTop( this.end('noticia'), 0, qtNoticias ) } },
				destaque:  { cb: afterGetNoticias,  fn: function(){ srv.m.noticia.getDestaques( this.end('destaque'), qtDestaques ) } }
			}, 
			finalCB
		)
	}
	srv.get( '/index.html', getIndex )
	srv.get( '/', getIndex )




	function getLista( req, res ){
		var page = req.params.page || 0
		page = new Number( page )

		function afterGet( err, noticias ){
			if ( noticias.size() === 0 ){
				res.send( 404 )
			} else {
				noticias.forEach( function( noticia ){
					if (noticia.resumo && noticia.resumo.split(' ').length > resumoLimit) noticia.resumo = noticia.resumo.split(' ').to(resumoLimit).join(' ') + ' ...'
				})

				res.render('busca/assunto.html', { 
					listTitle: 'Últimas notícias', 
					noticias: noticias, 
					assinante: req.session.assinante,
					cabecalhoPars: undefined,
					url: '/noticias/pagina/',
					page: page
				})
			}
		}
		srv.m.noticia.getTop( afterGet, page, 10 )
	}
	srv.get( '/noticias/pagina/:page', getLista )




	function getObrigacoes( req, res ){
		res.send( [] )
		
		// function afterGet( err, noticias ){ 
		// 	var obrigacoes = noticias.map( 
		// 		function(n){ 
		// 			return {
		// 				date:n.dataDaObrigacao, 
		// 				title:n.titulo, 
		// 				url:'/noticia/'+n._id 
		// 			} 
		// 		} 
		// 	)

		// 	res.send( obrigacoes ) 
		// }
		// srv.m.noticia.getObrigacoes( afterGet, 50 )
	}
	srv.get( '/obrigacoes/list', getObrigacoes )




}