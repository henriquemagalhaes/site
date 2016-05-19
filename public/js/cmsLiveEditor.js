$.cms.updateComponent = function( el ){

	var el            = $( el )
	  , modelName     = el.attr( 'data-model' )
	  , propertyName  = el.attr( 'data-property' )
	  , docId         = el.attr( 'data-id' )
	  , componentName = el.attr( 'data-component' )
	  , content       = el.html()

	if ( modelName && propertyName && docId ) {
		var data = {}
		data[propertyName] = content

		$.ajax({
			url: '/cms/update/model/'+modelName+'/'+docId,
			data: data,
			type: 'PUT',
			error: function(){ alert('erro ao atualizar '+propertyName+' de '+modelName) }
		})

	}

	if ( componentName ) {

		$.ajax({
			url: '/cms/update/component/'+componentName,
			data: { body: content },
			type: 'PUT',
			error: function(){ alert('erro ao atualizar componentes!') }
		})

	}
}

$.cms.afterImportsDo( function(){

	console.log( 'tinyMCE CONFIG !!!')
	
	tinymce
	.init({
	    selector: "h1.editable, h2.editable, p.editable",
	    inline: true,
	    toolbar: "undo redo",
	    menubar: false,
	    setup: function(editor) {
	        editor.on('blur', function(e) {
				if ( !e.target.isNotDirty ){
					e.target.isNotDirty = true
					$.cms.updateComponent( e.target.bodyElement )	
				} 
	        })
	    }
	})

	tinymce
	.init({
	    selector: "div.editable",
	    inline: true,
	    plugins: [
	        "advlist autolink lists link image charmap print preview anchor",
	        "searchreplace visualblocks code fullscreen",
	        "insertdatetime media table contextmenu paste"
	    ],
	    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
	    setup: function(editor) {
	        editor.on('blur', function(e) {
				if ( !e.target.isNotDirty ){
					e.target.isNotDirty = true
					$.cms.updateComponent( e.target.bodyElement )	
				}
	        })
	    }
	})

})