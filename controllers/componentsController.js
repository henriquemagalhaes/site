module.exports = function( srv, base, config ){

	// GET /components/head.html
	function getHead( req, res ){
		var template = config.pathToViews+'/components/head.html'

		res.render( template )
	}
	srv.get( '/components/head.html', getHead )

	// GET /components/siteTopbar.html
	function getSiteTopbar( req, res ){
		res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  		
		var template = config.pathToViews+'/components/siteTopbar.html'
		  , parameters = { assinante: req.session.assinante }

		console.log( parameters )
		res.render( template, parameters )
	}
	srv.get( '/components/siteTopbar.html', getSiteTopbar )

	// GET /components/banner.html
	function getBanner( req, res ){
		var query = req.session.assinante ? { assinantes: true } : { naoAssinantes: true }
		  , conf = { sort: [[ 'ordem', 1 ]] }
		srv.m.banner.getAll({ 
			query: query, 
			config: conf,
			callback: function( err, banners ){
				var template = config.pathToViews+'/components/banner.html'
				res.render( template, { banners: banners })
			}
		})
	}
	srv.get( '/components/banner.html', getBanner )

	// GET /components/newsTopbar.html
	function getNewsTopbar( req, res ){
		var template = config.pathToViews+'/components/newsTopbar.html'

		res.render( template )
	}
	srv.get( '/components/newsTopbar.html', getNewsTopbar )

	// GET /components/pleaseLogin.html
	function getPleaseLogin( req, res ){
		var template = config.pathToViews+'/components/pleaseLogin.html'

		res.render( template )
	}
	srv.get( '/components/pleaseLogin.html', getPleaseLogin )

	// GET /components/siteFooter.html
	function getSiteFooter( req, res ){
		var template = config.pathToViews+'/components/siteFooter.html'

		res.render( template )
	}
	srv.get( '/components/siteFooter.html', getSiteFooter )

	// GET /components/assineForm.html
	function getAssineForm( req, res ){
		var template = config.pathToViews+'/components/assineForm.html'

		res.render( template )
	}
	srv.get( '/components/assineForm.html', getAssineForm )

	// GET /components/formVisitante.html
	function getFormVisitante( req, res ){
		var template = config.pathToViews+'/components/formVisitante.html'

		res.render( template )
	}
	srv.get( '/components/formVisitante.html', getFormVisitante )

	// GET /components/tabelas.html
	function getTabelas( req, res ){
		var template = config.pathToViews+'/components/listaTabelas.html'
		  , tipo = req.query.tipo ? req.query.tipo.spacify() : undefined
		
		srv.m.tabela.getAllVigentes(
			function( err, tabelas ){ res.render( template, { tabelas: tabelas } ) }
		  , tipo 
		)
	}
	srv.get( '/components/tabelas.html', getTabelas )

	// GET /components/obrigacoes.html
	function getObrigacoes( req, res ){
		var month     = req.query.mes 
		  , year      = req.query.ano
		  , date      = Date.create( year ).advance({ months: new Number( month ) -1, days: 3 })
		  , nextMonth = date.clone().advance({months:1})
		  , prevMonth = date.clone().rewind({months:1})
		  , template  = config.pathToViews+'/components/obrigacoes.html'

		srv.m.obrigacao.getAllFromMonth( date, function( err, obrigacoes ){ 
			res.render( 
				template, 
				{ 
					obrigacoes: obrigacoes, 
					nextMonth: nextMonth.getMonth() + 1, 
					nextYear: nextMonth.getFullYear(),
					prevMonth: prevMonth.getMonth() + 1, 
					prevYear: prevMonth.getFullYear(),
					currentMonth: date.format('{Month}, {yyyy}', 'pt')
				} 
			)
		})
	}
	srv.get( '/components/obrigacoes.html', getObrigacoes )
	// GET /components/obrigacoes.html
	
	function getObrigacoesJSON( req, res ){
		var month     = req.query.mes 
		  , year      = req.query.ano
		  , date      = Date.create( year ).advance({ months: new Number( month ) -1, days: 3 })
		  
		srv.m.obrigacao.getAllFromMonth( date, function( err, obrigacoes ){ 
			res.send( obrigacoes )
		})
	}
	srv.get( '/components/obrigacoes.json', getObrigacoesJSON )

	// GET /components/general/:desc.html
	function getComponentGeneral( req, res ){
		srv.m.component.get( req.params.desc, function( err, html ){
			html = '<div class="editable" data-component="'+req.params.desc+'">' + html + '</div>'
			res.send( html )
		})
	}
	srv.get( '/components/general/:desc.html', getComponentGeneral )
}