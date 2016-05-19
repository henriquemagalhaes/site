module.exports = function( srv, base, model, config ){

	// QUERY/:model/DISTINCT/:field

	function queryDistinct( req, res ){
		var model = req.params.model
		  , field = req.params.field

		srv.m[model].collection().distinct( field, function( err, data ){
			log( data )
		})
	}

	srv.get( '/query/:model/distinct/:field', queryDistinct )
	
	/////////////////////////////////////////////////////////

	// 
}