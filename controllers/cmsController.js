module.exports = function( srv, base, config ){

	// GET /pagina/:page
	function getPage( req, res ){

		var pageName = req.params.page
		function afterGet( err, pageData ){ 
			if ( pageData.isArray() && pageData.length > 0 ) {
				pageData = pageData[0]
				pageData.assinante = req.session ? req.session.assinante : undefined
				var template = config.pathToViews+'/cms/template/' + pageData.template
				res.render( template, pageData )
			} else {
				res.send( 404 )
			}
		}
		srv.m.pagina.getByQuery({ query: { nome: pageName }, callback: afterGet })

	}

	srv.get( '/pagina/:page', getPage )

	// PUT /cms/update/model/:modelName/:docId
	function putModelContent( req, res ){
		
		if ( req.session.assinante && req.session.assinante.admin ){
			
			var content      = req.body
			  , modelName    = req.params.modelName
			  , docId        = req.params.docId

			if ( !modelName || !srv.m[modelName] || !docId || !content ){
				res.send( 400 )
			} else {
				srv.m[modelName].collection().updateById( docId, { $set: content }, function( err, data ){
					if ( !err ) res.send( 200 )
					else res.send( 500 )
				})
			}

		} else {			
			res.send( 403 )
		}
	}
              
	srv.put( '/cms/update/model/:modelName/:docId', putModelContent )

	// PUT /cms/update/component/:componentName
	function putComponentContent( req, res ){

		if ( req.session.assinante && req.session.assinante.admin ){
			
			var body          = req.body
			  , componentName = req.params.componentName

			if ( !componentName || !srv.m.component || !body ){
				res.send( 400 )
			} else {
				srv.m.component.collection().findAndModify( 
					{ description: new RegExp( componentName, 'i' ) }, 
					[['_id','asc']], 
					{ $set: body }, 
					{},
					function( err, data ){
						if ( !err ) res.send( 200 )
						else {
							log( err )
							res.send( 500 )
						}
					}
				)
			}

		} else {			
			res.send( 403 )
		}
	}

	srv.put( '/cms/update/component/:componentName', putComponentContent )
}