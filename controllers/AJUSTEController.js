module.exports = function( srv, base, config ){

	function ajuste( req, res ){

		srv.m.noticia.getByQuery({
			query: {
				"$or": [
					{ "tags": { "$regex": "pis$",    "$options": "i" } },
					{ "tags": { "$regex": "cofins$", "$options": "i" } },
					{ "tags": { "$regex": "^csll",   "$options": "i" } }
				]
			},
			callback: function( err, noticias ){

				noticias.forEach( function( noticia ){

					noticia.tags.remove( /pis$/i    )
					noticia.tags.remove( /cofins$/i )
					noticia.tags.remove( /^csll/i   )

					noticia.tags.push( 'PIS Cofins CSLL' )

					var _id = noticia._id.clone()
					delete noticia._id

					srv.m.noticia.collection().updateById(
						_id 
					  , noticia
					  , { safe: true }
					  , function( err, pNoticia ){ console.log( 'err', err);console.log( 'noticia', pNoticia );console.log( '----------------------')}
					)
				})
			}
		})
	}

	srv.get( '/ajuste', ajuste )

}