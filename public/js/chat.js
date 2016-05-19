if ( !this.jQuery )
	console.log( 'Chat uses jQuery, everything will break without it...')

$.chat = {

	open: function(){

		if ( $( '#mensario-chat' ).length === 0 ){

			$.ajax({
				url: '/chat.html'
				// url: 'http://mensariofiscal.com.br/chat.html'
			  , success: function loadChat( chatHtml ){
					$( 'body' ).append( chatHtml )
					$( '#mensario-chat' ).addClass( 'open' )
				}
			  , error: function error(){
					console.log( 'error loading user data.' )
				}
			})
	
		} else {

			$( '#mensario-chat' ).addClass( 'open' )

		}
	}

  , close: function(){

  		$( '#mensario-chat form' ).reset()
  		$( '#mensario-chat' ).removeClass( 'open' )

	}

  , requestRoom: function(){

		var subjectId = $( '#chat-subject' ).val()

		if ( subjectId )
			
			$.ajax({
				url: '/chatRoom.json?subjectId='+subjectId
				// url: 'http://mensariofiscal.com.br/chatRoom.json?subjectId='+subjectId
			  , success: function( room ){
			  		$.chat.room = room
			  		$.chat.socket = io()
			  		$( '#chat' ).addClass( 'chatting' )
			  		$.chat.socket.emit( 'join', room )
			  		$.chat.socket.on( 'message', function( message ){ 
			  			var yourOwn = message.author === $.chat.user.nome ? 'your-own' : ''
			  			  , lastAuthor = $( '.chat-message:last-child small' ).html()
			  			  , sameAuthor = lastAuthor === message.author ? 'same-author' : ''

		  				$( '#chat-messages' ).append( 
			  				'<div class="chat-message '+yourOwn+' '+sameAuthor+'">'+
			  					'<div><small>'+message.author+'</small></div>'+
			  					'<div>'+message.text+'</div>'+
			  				'</div>'
			  			)
			  		})
				}
			  , error: function(){
			  		console.log( 'unable to create a chat room' )
				}
			})

	}

  , sendNewMessage: function(){

  		var message = {
  			text: $( '#chat-new-message' ).val()
  		  , author: $.chat.user.nome
  		  , room: $.chat.room.name
  		}

  		$.chat.socket.emit( 'message', message )
  		$( '#chat-new-message' ).val( '' )
	}
}