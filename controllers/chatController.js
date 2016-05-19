module.exports = function( srv, base, config ){

	srv.io.on( 'connection', function( socket ){

		socket.on( 'join', function( room ){
			if ( !room.messages ) room.messages = []
			socket._room = room
			socket.join( room.name, function(){
				if ( !srv.rooms ) srv.rooms = {}
				if ( !srv.rooms[ room.name ] ){
					srv.rooms[ room.name ] = room
					srv.io.to( 'rooms' ).emit( 'add room', room )
				} 
			})

		})
		socket.on( 'join room list', function(){
			socket.join( 'rooms' )
		})
		socket.on( 'message', function( message ){
			if ( message.room ){
				message.room = message.room
				srv.io.to( message.room ).emit( 'message', message )
				srv.rooms[ message.room ].messages.push( message )
			}
		})
		socket.on( 'disconnect', function(){
			// delete srv.rooms[ socket._room ]
			if ( socket._room )
				srv.io.to( 'rooms' ).emit( 'remove room', socket._room.name )
		})
	})

	function getChatHtml( req, res ){

		var userId = req.query.userId

		srv.m.assunto.options({
			callback: function( err, subjects ){

				res.render( 'chat', { user: req.session.assinante, subjects: subjects } )				
			}
		})

	}
	srv.get( '/chat.html', getChatHtml )


	function getChatRoomJson( req, res ){

		var subjectId = req.query.subjectId
		  , userName  = req.session.assinante.nome

		srv.m.assunto.getById({
			id: subjectId
		  , callback: function( err, subject ){
		  		res.send( { name: subject.nome + ' - ' + userName, subject: subject.nome, customer: userName } )
			}
		})
	}
	srv.get( '/chatRoom.json', getChatRoomJson )


	function suportChat( req, res ){
		var viewData = { 
			baseURL: '/admin/'
		  , tenant: ''
		  , brand: config.brand
		  , user: req.session.user
		  , label: 'Chat Room'
		  , rooms: srv.rooms || undefined
		}

		res.render( 'chat/chatRoom.html', viewData )
	}
	srv.get( '/admin/suporteChat', base.auth, suportChat )


	return {
		menu: 'Assinantes'
	  , url: '/admin/suporteChat'
	  , label: 'Chat Suporte'
	}
}