module.exports = function( srv, base, model, config ){

	
	// GET /assinante/login
	function login( req, res ){
		var _id = req.query._id
		  , pwd = req.query.pwd

		// req.session.assinante = { _id: _id, name: ' Assinante FAKE' }
		// return res.send( 200 )

		function afterAuth( err, assinante ){
			if ( assinante ){
				if ( assinante.indAtivo ){
					req.session.assinante = assinante
					res.send( 200 )	
				} else {
					res.send( 400 )
				}
			} else {
				
				if ( 404 === err ){

					function afterVisAuth( err, user ){
						if ( user ){
							req.session.assinante = user
							res.send( 200 )
						} else {
							
							if ( 404 === err ){

								function afterUsrAuth( err, user ){
									if ( user ){
										req.session.assinante = user
										req.session.assinante.admin = true
										res.send( 200 )
									} else {
										res.send( err )
									}
								}
								srv.m.usuario.auth( _id, pwd, afterUsrAuth )
							}
						}
					}
					srv.m.visitante.auth( _id, pwd, afterVisAuth )

				} else {
					res.send( err )
				}

			}
		}
		srv.m.assinante.auth( _id, pwd, afterAuth )
	}
	srv.get( '/assinante/login', login )

	// GET /assinante/logout
	function logout( req, res ){
		delete req.session.assinante
		res.send( 200 )
	}
	srv.get( '/assinante/logout', logout )

	// GET /assinante/perfil
	function getPerfil( req, res ){
		if ( !req.session.assinante ) res.send( 401 )
		else res.render( 'perfil', { assinante: req.session.assinante } )
	}
	srv.get( '/assinante/perfil', getPerfil )

	// POST /assinante/perfil
	function postPerfil( req, res ){
		if ( !req.session.assinante ) res.send( 401, 'Acesso negado.' )
		else {
			if ( req.session.assinante.admin ){
				res.send( 500, 'Administrador não é atualizado por esta tela.' )
			} else {
				var model = req.session.assinante.visitante ? srv.m.visitante : srv.m.assinante
				  , _id   = req.session.assinante._id

				model.collection().updateById( _id, { $set: req.body }, function( err, data ){
					if ( !err )res.send( 200, 'Sucesso.' )
					else res.send( 404, err )
				})	
			}
		}
	}
	srv.post( '/assinante/perfil', postPerfil )

	// POST /visitante
	function postVisitante( req, res ){
		var pessoa = req.body
		  , err =  []
		  
		if ( !pessoa.nome      ) err.push( { field: 'nome'     , message: 'Nome é campo obrigatório'      } )
		if ( !pessoa.email     ) err.push( { field: 'email'    , message: 'Email é campo obrigatório'     } )
		if ( !pessoa.pwdHash   ) err.push( { field: 'pwdHash'  , message: 'Senha é campo obrigatório'     } )
		// if ( !pessoa.atividade ) err.push( { field: 'atividade', message: 'Atividade é campo obrigatório' } )
		if ( !pessoa.cidade    ) err.push( { field: 'cidade'   , message: 'Cidade é campo obrigatório'    } )
		if ( !pessoa.uf        ) err.push( { field: 'uf'       , message: 'Estado é campo obrigatório'    } )
		if ( !pessoa.fone1     ) err.push( { field: 'fone1'    , message: 'Telefone é campo obrigatório'  } )
		// if ( !pessoa.contato   ) err.push( { field: 'contato'  , message: 'contato é campo obrigatório'   } )
		// if ( !pessoa.cpfCnpj   ) err.push( { field: 'cpfCnpj'  , message: 'cpf/Cnpj é campo obrigatório'  } )
		
		if ( pessoa.news === "true" ) pessoa.news = true
		else pessoa.news = false
		
		pessoa.ativo = false
		pessoa.dataDeFim = Date.create('15 days from today')
		pessoa.audit = {
			who: {
				usr: 'public',
				name: 'site - Assinatura'
			},
			when: new Date()
		}

		if ( err.length > 0 ) {
			res.send( 500, err )
		} else {
			function afterInsert( err, record ){
				log( 'afterInsert visitante: ', record )
				if ( record ) res.send( 200 )
				else res.send( 500, err )
			}
			
			srv.m.visitante.insert( pessoa, afterInsert )
		}

	}
	srv.post( '/visitante', postVisitante  )

	// POST /assinante
	function postAssinante( req, res ){
		var pessoa = req.body
		  , err =  []
		  
		if ( !pessoa.nome      ) err.push( { field: 'nome'     , message: 'Nome é campo obrigatório'      } )
		if ( !pessoa.email     ) err.push( { field: 'email'    , message: 'Email é campo obrigatório'     } )
		if ( !pessoa.pwdHash   ) err.push( { field: 'pwdHash'  , message: 'Senha é campo obrigatório'     } )
		if ( !pessoa.atividade ) err.push( { field: 'atividade', message: 'Atividade é campo obrigatório' } )
		if ( !pessoa.cidade    ) err.push( { field: 'cidade'   , message: 'Cidade é campo obrigatório'    } )
		if ( !pessoa.uf        ) err.push( { field: 'uf'       , message: 'Estado é campo obrigatório'    } )
		if ( !pessoa.fone1     ) err.push( { field: 'fone1'    , message: 'Telefone é campo obrigatório'  } )
		if ( !pessoa.cpfCnpj   ) err.push( { field: 'cpfCnpj'  , message: 'cpf/Cnpj é campo obrigatório'  } )
		
		if ( pessoa.news === "true" ) pessoa.news = true
		else pessoa.news = false
		
		pessoa.ativo = false
		pessoa.audit = {
			who: {
				usr: 'public',
				name: 'site - Assinatura'
			},
			when: new Date()
		}

		if ( err.length > 0 ) {
			res.send( 500, err )
		} else {
			function afterInsert( err, record ){

				if ( record ) res.send( 200 )
				else res.send( 500, err )
			}
			
			srv.m.assinante.insert( pessoa, afterInsert )
		}

	}
	srv.post( '/assinante', postAssinante  )

	
	// POST /assinante/mensagem
	function postMensagem( req, res ){
		var mensagem = req.body
		  , err = []

		if ( !req.session.assinante ){
			res.send( 401, 'O suporte é um serviço exclusivo para assinantes.' )
		}

		if ( !mensagem.motivo   ) err.push( { field: 'motivo',   message: 'Motivo é campo obrigatório.'   } ) 
		if ( !mensagem.mensagem ) err.push( { field: 'mensagem', message: 'Mensagem é campo obrigatório.' } ) 
		mensagem.respondida = false 
		mensagem.autor = req.session.assinante
		mensagem.audit = {
			who: req.session.assinante,
			when: new Date()
		}

		if ( err.length > 0 ) {
			res.send( 500, err )
		} else {
			function afterInsert( err, record ){
				if ( record ) res.send( 200 )
				else res.send( 500, err )
			}
			srv.m.mensagem.insert( visitante, afterInsert )
		}


	}
	srv.post( '/assinante/mensagem', postMensagem )

	// GET opcoesDeAssinatura
	function getOpcoesDeAssinatura( req, res ){
		function afterGet( err, opcoes ){
			var html = ''

			opcoes.sortBy( 'ordem' ).forEach( function( opcao ){
				html += '<option>'+opcao.descricao+'</option>'
			})

			res.send( html )
		}
		srv.m.opcoesDeAssinatura.getAll({ callback: afterGet })
	}
	srv.get( '/opcoesDeAssinatura', getOpcoesDeAssinatura )
}