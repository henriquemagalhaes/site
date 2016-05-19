module.exports = {
	name: "obrigacao",
	label: "Obrigação",
	menu: "Conteúdo",
	onlyFor: ["admin", "landlord"],
	cache: "elasticache",
	
	fields: [
		{ name: "titulo", label: "Título", checks: "hasValue" },
		{ name: "resumo", label: "Resumo", type: "text" },
		{ name: "urlReferencia", label: "Link (a partir da raiz do site, tipo '/pagina/...' ou '/noticia/...' " },
		{ name: "dia", label: "Dia do Mês", type: "number", checks: "hasValue" },
		{ name: "tipoDoDia", label: "Tipo do Dia", type: "combo", of: ["Útil", "Corrido"], checks: "hasValue" },
		{ name: "comportamento", label: "Comportamento", type: "combo", of: [ "Antecipar em feriados", "Postergar em feriados", "Mantém em feriados" ] }
	],
	format: "{{titulo}}",

	getAllFromMonth: function( date, callback ){
		var self = this
		  , async = require('async')
		  , from = date.clone().beginningOfMonth()
		  , to = date.clone().endOfMonth()
		  
		function getFeriados(cb){
			self.models().feriado.getAllFromMonth( date, cb )
		}

		function getNoticias(cb){
			self.models().noticia.getObrigacoes( date, cb )
		}

		function getObrigacoes(cb){
			self.getAll({callback: cb})
		}

		function finish( err, results ){
			if ( err ){
				callback( err )
			} else {
				var feriados    = results[0]
				  , noticias    = results[1]
				  , recorrentes = results[2]
				  , obrigacoes  = []

				noticias.forEach( function( noticia ){
					obrigacoes.push({
						url: '/noticia/'+noticia._id
					  , titulo: noticia.titulo
					  , resumo: noticia.resumo
					  , data: noticia.dataDaObrigacao.format('{dd}/{MM}/{yyyy}')
					})
				})

				recorrentes.forEach( function( obrigacao ){
					var date
					  , count = 0
					  , diaObrig = to.getDate() < new Number( obrigacao.dia ) ? to.getDate() : new Number( obrigacao.dia )

					if ( obrigacao.tipoDoDia === 'Corrido' ) date = from.clone().advance( { days: diaObrig - 1 } )
					if ( obrigacao.tipoDoDia === 'Útil' ) {

						from.daysUntil( to ).times( function ( i ){ // repeat for each day of the month
							var day = from.clone().addDays( i )
							if ( 
								day.getDay() !== 6 && 
								day.getDay() !== 0 &&
								!feriados.find({ data: day })
							) count++

							if ( count == diaObrig ) date = day
						})

						if ( !date ) date = to
					} 


					function nextWorkDay( day, cb ){
						if ( day.getDay() === 0 || day.getDay() === 6 || feriados.find({ data: day }) ){
							nextWorkDay( day.advance({days: 1}), cb )
						} else {
							cb( day )
						}
					}
					function lastWorkDay( day, cb ){
						if ( day.getDay() === 0 || day.getDay() === 6 || feriados.find({ data: day }) ){
							lastWorkDay( day.rewind({days: 1}), cb )
						} else {
							cb( day )
						}
					}

					if ( obrigacao.comportamento === 'Antecipar em feriados') lastWorkDay( date, function( day ){ date = day })
					if ( obrigacao.comportamento === 'Postergar em feriados') nextWorkDay( date, function( day ){ date = day })

					if ( !date ) console.log( '!!!!!!!!!!!!', obrigacao._id, obrigacao )

					obrigacoes.push({
						url: obrigacao.urlReferencia
					  , titulo: obrigacao.titulo
					  , resumo: obrigacao.resumo
					  , data: date.format('{dd}/{MM}/{yyyy}')
					})

				})

				obrigacoes = obrigacoes.groupBy( 'data' )
				obrigacoesPorData = []
				for( data in obrigacoes ){ obrigacoesPorData.push( { data: data, items: obrigacoes[data] } ) }
				obrigacoes = obrigacoesPorData.sortBy( 'data' )

				callback( undefined, obrigacoes )
			}
		}

		async.parallel(
			[ getFeriados, getNoticias, getObrigacoes ],
			finish
		)
		
	}
}