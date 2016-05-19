module.exports = function( srv, base, config ){

	// POST /suporte/mensagem
	function postMensagem( req, res ){

		if ( req.session.assinante ){

			var mensagem = req.body

			mensagem.estado = 'PENDENTE'
			if ( req.session.assinante ){
				mensagem.codAssinante = req.session.assinante.codAssinante
				mensagem.nomeAssinante = req.session.assinante.nome
				mensagem.emailResposta = req.session.assinante.email
				mensagem.telefoneAssinante = req.session.assinante.fone1
			} 
			mensagem.dataDeEnvio = new Date()
			if ( req.session.assinante ){
				mensagem.audit = { 
					who: {
						usr: req.session.assinante.codAssinante
					  , email: req.session.assinante.email
					  , role: 'assinante'
					}
				  , when: new Date()
				} 
			} else { 
				mensagem.audit = { who: { usr: 'site', role: 'public' }, when: new Date() }
			}

			srv.m.mensagem.insert( mensagem, function( err, mensagem ){
				if ( mensagem ) res.send( 200, mensagem[0] )
				else res.send( 500, err )
			})

		} else {
			
			res.send( 401 )	

		}

	}

	srv.post( '/suporte/mensagem', postMensagem )

}