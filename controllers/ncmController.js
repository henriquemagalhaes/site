module.exports = function( srv, base, config ){

	// GET /ferramentas/ncm
	function getNcmRoot( req, res ){

		function afterGet( err, data ){
			data.forEach( function( datum ){ datum.selector = datum._id.replace(/\./g, '-') })
			res.render( 'ncm', { assinante: req.session.assinante, items: data } )
		}

		srv.m.ncm.getAll({
			query: { "belongsTo": { "$exists": false } },
			config: { sort : [[ 'numericId', 1 ]] },
			callback: afterGet
		})
	}
	srv.get( '/ferramentas/ncm', getNcmRoot )

	// GET /ferramentas/ncm/childrenOf
	function getNcmChild( req, res ){
		var _id = req.params.fatherId

		
		function afterGet( err, data ){
			data.forEach( function( datum ){ 
				datum.selector = datum._id.replace(/\./g, '-') 
				datum.icon = datum._id.length === 10 ? 'unchecked' : 'expand'
			})
			res.send( { items: data } )
		}

		srv.m.ncm.getAll({
			query: { "belongsTo": _id },
			callback: afterGet
		})
	}
	srv.get( '/ferramentas/ncm/childrenOf/:fatherId', getNcmChild )

}