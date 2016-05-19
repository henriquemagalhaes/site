var totalCounter = 0
  , waitCounter = 0
  , urls = []

$.cms = {
	beforeImports: [],
	beforeImportsDo: function( cb ){
		this.beforeImports.push( cb )
	},
	afterImports: [],
	afterImportsDo: function( cb ){
		this.afterImports.push( cb )
	},
	importsDone: function(){
		this.afterImports.forEach( function( cb ){
			cb()
		})
	},
	afterWait: [],
	afterWaitDo: function( cb ){ this.afterWait.push( cb ) },
	waitDone: function(){
		this.afterWait.forEach( function( cb ){
			cb()
		})
	},
	startLoadingImportsFrom: function( parentElement ){
		this.beforeImports.forEach( function( cb ){
			cb()
		})
		this.loadImportsFrom( parentElement )
	},
	loadImportsFrom: function loadImports( parentElement ){
	
		$('div[data-action=import]', parentElement).each( function(){
			var el = $( this )
			  , url = el.attr( 'data-url' )
			  , noWait = el.attr( 'data-nowait' )

			if ( !urls.___contains( url ) ) {

				urls.push( url )

				totalCounter++
				if ( !noWait ) waitCounter++
				
				function success( xhr ){
					var html = xhr.responseText
					el.html( html )
					$.cms.loadImportsFrom( el )

					if ( !noWait ){
						waitCounter--
						if ( waitCounter === 0 ) $.cms.waitDone()
					}
					totalCounter--
					if ( totalCounter === 0 ) $.cms.importsDone()
				}

				function error( xhr ){
					if ( !noWait ) {
						waitCounter--
						if ( waitCounter === 0 ) $.cms.waitDone()
					}
					totalCounter--
					if ( totalCounter === 0 ) $.cms.importsDone()
				}

				url.___getURL( success, error )

				// $.ajax({
				// 	url: url,
				// 	success: success,
				// 	error: error,
				// 	context: this
				// })
			}
		})
	}
}

$.cms.beforeImportsDo( function(){ $( 'body' ).hide() } )
$.cms.afterWaitDo( function(){ $('body').fadeIn() } )