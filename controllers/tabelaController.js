module.exports = function( srv, base, config ){

	function getTabela( req, res ){
		srv.m.tabela.getById({
			id: req.params.id,
			callback: function( err, tabela ){
				res.render( 'tabela', { 
					assinante: req.session.assinante,
					tabela: tabela 
				})
			}
		})
	}
	srv.get( '/tabela/:id', getTabela )

	function getBusca( req, res ){

		var vigencia = req.query.vigencia ? new Date( req.query.vigencia ) : undefined

		if ( vigencia ){

			function afterGet( err, data ){

				res.render( config.pathToViews+'/tabela/buscaTabela.html', {
					tabelas: data
				  , vigencia: vigencia
				  , assinante: req.session.assinante
				})
				
			}
			srv.m.tabela.getAllInTime( afterGet, vigencia )
		} else {
			
			res.send( 400 )
		}

	}
	srv.get( '/tabelas/busca.html', getBusca )
}