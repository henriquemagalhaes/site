module.exports = function( srv, base, config ){

	// GET /proposta/:id
	function getProposta( req, res ){

		var validade = Date.create(req.params.validade, '{dd}-{MM}-{yyyy}')
		  , proposto = req.params.proposto.replace(/\+/g, ' ')
		  , query    = { validade: { "$gte": validade.clone().beginningOfDay(), "$lt": validade.clone().endOfDay() }, nomeProposto: proposto }

		console.log( query )

		if ( !validade || !validade.isDate() || !validade.isValid() || !proposto ){
			res.render( 'proposta', { 
				proposta: undefined,
				assinante: req.session.assinante
			})
			return
		}

		function afterGet( err, data ){
			if ( data.length > 0 ) 
				res.render( 'proposta', { 
					proposta: data[0],
					assinante: req.session.assinante
				})
			else 
				res.render( 'proposta', { 
					proposta: undefined,
					assinante: req.session.assinante
				})
		}

		srv.m.proposta.getAll( { query: query, callback: afterGet } )

	}
	srv.get( '/proposta/:validade/:proposto', getProposta )



	// POST /proposta/:id
	function postProposta( req, res ){

		var propostaId = req.params.id

		function afterGet( err, data ){
			console.log( data )
			data.merge( req.body )

			function afterUpdate( err, data ){
				res.send( 200 )
			}
			srv.m.proposta.update( data, afterUpdate )
		}

		srv.m.proposta.getById( { id: propostaId, callback: afterGet } )		

	}
	srv.post( '/proposta/:id', postProposta )

}