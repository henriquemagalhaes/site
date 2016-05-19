(function($) {

	if (!$.otter) $.otter = {}
	if (!$.otter.cal) $.otter.cal = {
		loadEvents: function(dias){
			var self = this
			$.otter.cal.events = dias
			dias.forEach(function(dia){
				dia.items.forEach( function( event ){
					$.otter.cal.loadEvent( event )
				})
			})
		},

		loadEvent: function( evento ){
			var data = Date.create(evento.data, 'pt-br')
			  , selector = data.___format('#day-{dd}-{MM}-{yyyy}')

			$(selector+' ul').append('<li><a href="{url}">{titulo}</a></li>'.___set(evento))
			if ( !$(selector).hasClass( 'otter-cal-cell-busy' ) ) {
				$(selector).click( $.otter.cal.cellClick )
			}
			$(selector).addClass('otter-cal-cell-busy')
		},

		nextClick: function(){
			var element = $(this)
			  , selector = element.attr('data-selector')
			  , date = new Date( $(selector).attr('data-day') )
			date.advance({month:1})

			$(selector).otterCalendar('', date)
		},

		prevClick: function(){
			var element = $(this)
			  , selector = element.attr('data-selector')
			  , date = new Date( $(selector).attr('data-day') )
			date.rewind({month:1})

			$(selector).otterCalendar('', date)
		},

		cellClick: function(){

			if ( !$(this).hasClass( 'otter-cal-cell-busy' ) ) return
			
			var ulSelector = '#'+$(this).attr('id')+' ul'
			  , listItems = $(ulSelector).html()

			$('.otter-cal-row').hide()
			$('.otter-cal-details ul').html(listItems)
			$('.otter-cal-details').show()
		},

		backClick: function(){
			$('.otter-cal-details').hide()
			$('.otter-cal-details ul').html('')
			$('.otter-cal-row').show()
		}

	}

	$.fn.otterCalendar = function( events, date, locale ){
		locale = locale || 'pt'

		var weekdays = {
			  	pt: { sun: 'D', mon: 'S', tue: 'T', wed: 'Q', thu: 'Q', fri: 'S', sat: 'S', back: 'voltar' },
			    en: { sun: 'S', mon: 'M', tue: 'T', wed: 'W', thu: 'T', fri: 'F', sat: 'S', back: 'back' }
			}

		var element = this
		  , today = new Date()
		  , date = date || new Date()
		  , mon = date.___format('{MMM}')
		  , m = date.___format('{MM}')
		  , yyyy = date.___format('{yyyy}')
		  , url = element.attr('data-url')+'?mes='+ m +'&ano='+ yyyy
		  , firstWeekday = date.___firstDayOfMonth().getWeekday()
		  , lastDay = date.___lastDayOfMonth()
		  , headerTpl = ""
		+ "<div class='otter-cal-topbar'>"
		+ "  <a class='btn otter-cal-btn otter-cal-prev-btn' data-selector='"+element.selector+"'>"
		+ "    <i class='glyphicon glyphicon-circle-arrow-left'></i>"
		+ "  </a>"
		+ "  <p class='otter-cal-title'></p>"
		+ "  <a class='btn otter-cal-btn otter-cal-next-btn' style='float:right;' data-selector='"+element.selector+"'>"
		+ "    <i class='glyphicon glyphicon-circle-arrow-right'></i>"
		+ "  </a>"
		+ "</div>"
		+ "<div class='otter-cal-row otter-cal-header'>"
		+ "  <div class='otter-cal-cell'>{sun}</div>"
		+ "  <div class='otter-cal-cell'>{mon}</div>"
		+ "  <div class='otter-cal-cell'>{tue}</div>"
		+ "  <div class='otter-cal-cell'>{wed}</div>"
		+ "  <div class='otter-cal-cell'>{thu}</div>"
		+ "  <div class='otter-cal-cell'>{fri}</div>"
		+ "  <div class='otter-cal-cell'>{sat}</div>"
		+ "</div>"
		+ "<div class='otter-cal-details'><a class='back'>{back}</a><ul><ul></div>"
		  , cellTpl = "<div id='day-{dd}-{MM}-{yyyy}' class='otter-cal-cell'>{dd}<ul class='otter-cal-evt-list'></ul></div>"
		  , emptyCellTpl = "<div class='otter-cal-cell otter-cal-empty-cell'></div>"
		  , cells = []

		firstWeekday.times( function(i){
			cells.push( emptyCellTpl )
		})

		lastDay.getDate().times( function(i){
			cells.push( cellTpl.___set( { dd: i+1, MM: m, yyyy: yyyy } ) )
		})

		rows = cells.inGroupsOf( 7, emptyCellTpl )

		$(element).html('')
		$(element).addClass('otter-calendar')
		$(element).append( headerTpl.___set( weekdays[ locale ] ) )

		rows.each( function( cells ){
			element.append("<div class='otter-cal-row'>" + cells.join('') + '</div>')
		})

		$(today.___format('#day-{dd}-{MM}-{yyyy}')).addClass('today')

		$('.otter-cal-topbar p').html( 'Obrigações de '+mon+'.' )
		$('.otter-cal-prev-btn').click( $.otter.cal.prevClick )
		$('.otter-cal-next-btn').click( $.otter.cal.nextClick )
		$('.otter-cal-details .back').click( $.otter.cal.backClick )

		element.attr( 'data-day', date.___firstDayOfMonth() )

		$.ajax({ 
			url: url, 
			type: 'GET', 
			contentType: 'application/json',
			context: this,
			success: $.otter.cal.loadEvents
		})
		
		return element

	}

})(jQuery)

$(document).ready(function(){
	$('.calendar').otterCalendar()
})