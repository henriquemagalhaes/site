$.view = {

	login: function( _id, pwd, error, success ){
		
		if ( _id && pwd ){
			$.ajax({ 
				url: '/assinante/login',
				data: { _id: _id, pwd: pwd },
				type: 'GET',
				contentType: 'application/json',
				context: this,
				error: error,
				success: success
			})
		}

	},
	afterLogin: function(){
		location.reload()
	},
	topbarLoginFail: function(jqXHR, status, error){
		if ( jqXHR.status === 404 ) {
			$('#site-topbar-id-field').focus()
			$('#site-topbar-pwd-field').val('')
			$('#site-topbar-id-field').val('')
			alert('Não encontramos o usuário ou email.')
		} else if ( jqXHR.status === 401 ) {
			$('#site-topbar-pwd-field').focus()
			$('#site-topbar-pwd-field').val('')
			alert('Senha inválida.')
		} else if ( jqXHR.status === 409 ) {
			$('#site-topbar-pwd-field').focus()
			$('#site-topbar-pwd-field').val('')
			alert('Seu usuário de visitante expirou, entre em contato conosco.')
		} else {
			$('#site-topbar-id-field').focus()
			alert('Não foi possível validar seu usuário')
		}
	},
	pleaseLoginFail: function(jqXHR, status, error){
		if ( jqXHR.status === 404 ) {
			$('#please-login .id-field').focus()
			alert('Não encontramos o usuário ou email.')
		} else if ( jqXHR.status === 401 ) {
			$('#please-login .pwd-field').focus()
			alert('Senha inválida.')
		} else if ( jqXHR.status === 409 ) {
			$('#site-topbar-pwd-field').focus()
			$('#site-topbar-pwd-field').val('')
			alert('Seu usuário de visitante expirou, entre em contato conosco.')
		} else {
			$('#please-login .id-field').focus()
			alert('Não foi possível validar seu usuário')
		}
	},

	openSearch: function( html ){
		$('#content-place').hide()
		$('#search-place').html( html )
	},
	closeSearch: function(){
		$('#search-place').html('')
		$('#content-place').show()
	},

	topLoginBtnClick: function(){
		var _id = $('#site-topbar-id-field').val()
		  , pwd = $('#site-topbar-pwd-field').val()

		if ( _id && pwd ) $.view.login( _id, pwd, $.view.topbarLoginFail, $.view.afterLogin )		
	},
	plsLoginBtnClick: function(){
		var _id = $('#please-login .id-field').val()
		  , pwd = $('#please-login .pwd-field').val()

		if ( _id && pwd ) $.view.login( _id, pwd, $.view.pleaseLoginFail, $.view.afterLogin )
	}

}

$(document).ready( function(){

 
    function stickyNav(){  
        var scrollTop = $(window).scrollTop()
		$('.stickable').each( function( idx, el ){

			if ( !$(el).attr('data-top') ) $(el).attr('data-top', $(el).offset().top )
			var $el = $(el)
			  , stickyTop = $el.attr('data-top')
			  , shouldStick = scrollTop > stickyTop
			  , isSticky = $el.hasClass('sticky')
 
	        if ( shouldStick && !isSticky ) 
	        	$el.addClass('sticky')
	        if ( !shouldStick && isSticky ) 
	        	$el.removeClass('sticky')
	    })
    }
  
    $(window).scroll( stickyNav )
})