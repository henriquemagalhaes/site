$('.news-menu-btn').click( function(){

	var menu = $(this).attr('data-menu')

	$('html, body').animate({
		scrollTop: $("#news-topbar").offset().top + 1
	}, 170)
	
	$('#news-topbar .menu-content').removeClass('open')
	$('.news-menu-btn').removeClass('open')
	$('#news-topbar .menu-content[data-menu='+menu+']').addClass('open')
	$(this).addClass("open")
	$('.close-btn').show()

	// $.view.adjustNewsHeight()
})

$('#news-topbar .close-btn').click( function(){

	$('.close-btn').hide()
	$('#news-topbar .menu-content.open').removeClass('open')
	$(".news-menu-btn").removeClass("open")
})

$('#search-field').change( function(){

	var url = '/noticias/busca.html?campos=titulo+resumo+tags+tipoDeAto+palavrasChave+codigoDoAto&termos=' + $( this ).val().replace(' ', '+')
	url = url.escapeURL()

	window.location.assign( url )
})

$('#data-vigencia-tabelas').change( function(){

	var url = '/tabelas/busca.html?vigencia=' + Date.create( $('.datepicker').val(), 'dd/MM/yyyy' ).format('{yyyy}+{MM}+{dd}')
	url = url.escapeURL()

	window.location.assign( url )
})


$('#search-field-place').popover({
	content: 'Sem resultados para este valor.',
	placement: 'left',
	trigger: 'manual'
})

$.view.getNews = function( url ){

	function success( xhr ){

		console.log( 'Sucesso!!' )

		html = xhr.responseText

		$('#news-topbar .menu-content').removeClass('open')
		$("#news-topbar").removeClass("open")
		$(".news-menu-btn").removeClass("open")
		$('#news-topbar').height( 50 )
		$('html, body').animate({
			scrollTop: $("#news-topbar").offset().top + 1
		}, 170)
		
		$('#content-place').hide()
		$('#search-place').html( html )
		$('#search-field').val( '' )
	}
	function error( xhr ){

		console.log( xhr.status )
		
		$('#search-field-place').popover('show')
		setTimeout( function(){ $('#search-field-place').popover('hide') }, 3000 )
	}

	// $.ajax({
	// 	url: url,
	// 	error: error,
	// 	success: success
	// })

	url.___getURL( success, error )

}

$.view.closeSearch = function(){
	$('#content-place').show()
	$('#search-place').html('')
}

$.view.loadObrigacoes = function( url ){
	$.ajax({
		url: url,
		success: function( html ){
			$('.menu-content[data-menu=obrigacoes]').html( html )
			$.view.adjustNewsHeight()
		}
	})
}

$.view.adjustNewsHeight = function(){
	console.log('oi')
	var height = $('#news-topbar .menu-content.open').height()
	$('#news-topbar').height( height + 70 )
}

$.cms.afterImportsDo( function(){
	$('#news-topbar a.search').click( function(){
		var url = $(this).attr('data-url')
		$.view.getNews( url )
		return false
	})
})