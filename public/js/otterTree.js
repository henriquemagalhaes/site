if ( !$.view ) $.view = {}

$.view.loadChildrenOf = function( fatherId ){

	var selector = fatherId.replace(/\./g, '-')
	  , imYourFather = $( '#tree-item-'+selector )

	if ( $('#tree-item-'+selector+' > ul').length > 0 ){
		$('#tree-item-'+selector+' > ul').toggle()
	} else {
		
		var template = $('#tree-list-template').html()

		$.ajax({
			url: '/ferramentas/ncm/childrenOf/'+fatherId,
			context: { selector: selector },
			success: function( data ){
				$('#tree-item-'+this.selector).append( Mustache.render( template, data ) )
			}
		})

	}

}