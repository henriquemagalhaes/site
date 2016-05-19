/*
	___ is a lib that extends Javascript syntax.
	Because I dont like underscore and sugar creates conflicts.
*/


/*
	Extending Date prototype
*/

Date.prototype.___locale = 'pt'
Date.prototype.___months = {
		pt: [ { M: '1',  MM: '01', MMM: 'Jan', MMMM: 'Janeiro'    }
			, { M: '2',  MM: '02', MMM: 'Fev', MMMM: 'Fevereiro'  }
			, { M: '3',  MM: '03', MMM: 'Mar', MMMM: 'Março'      }
			, { M: '4',  MM: '04', MMM: 'Abr', MMMM: 'Abril'      }
			, { M: '5',  MM: '05', MMM: 'Mai', MMMM: 'Maio'       }
			, { M: '6',  MM: '06', MMM: 'Jun', MMMM: 'Junho'      }
			, { M: '7',  MM: '07', MMM: 'Jul', MMMM: 'Julho'      }
			, { M: '8',  MM: '08', MMM: 'Ago', MMMM: 'Agosto'     }
			, { M: '9',  MM: '09', MMM: 'Set', MMMM: 'Setembro'   }
			, { M: '10', MM: '10', MMM: 'Out', MMMM: 'Outubro'    }
			, { M: '11', MM: '11', MMM: 'Nov', MMMM: 'Novembro'   }
			, { M: '12', MM: '12', MMM: 'Dec', MMMM: 'Dezembro'   } ]
	}
Date.prototype.___weekdays = {
		pt: [ { d: 'D', ddd: 'Dom', dddd: 'Domingo' }
			, { d: 'S', ddd: 'Seg', dddd: 'Segunda' }
			, { d: 'T', ddd: 'Ter', dddd: 'Terça'   }
			, { d: 'Q', ddd: 'Qua', dddd: 'Quarta'  }
			, { d: 'Q', ddd: 'Qui', dddd: 'Quinta'  }
			, { d: 'S', ddd: 'Sex', dddd: 'Sexta'   }
			, { d: 'S', ddd: 'Sab', dddd: 'Sabado'  } ]
	}
Date.prototype.___preFormats = {
		pt: { date: '{dd}/{MM}/{yyyy}'
			, mediumDate: '{dd} de {MMMM} de {yyyy}'
			, longDate: '{dddd}, {dd} de {MMMM} de {yyyy}'
			, time: '{hh}:{mm}'
			, longTime: '{hh}:{mm}:{ss}'
			, dateTime: '{dd}/{MM}/{yyyy} {hh}:{mm}'
			, mediumDateTime: '{dd} de {MMMM} de {yyyy}, às {hh}:{mm}'
			, longDateTime: '{dddd}, {dd} de {MMMM} de {yyyy}, às {hh}:{mm}' }
	}
Date.prototype.___getMonths = function(){ return this.___months[ this.___locale ] }
Date.prototype.___getWeekdays = function(){ return this.___weekdays[ this.___locale ] }
Date.prototype.___getPreFormats = function(){ return this.___preFormats[ this.___locale ] }
Date.prototype.___firstDayOfMonth = function(){
		var y = this.getFullYear(), m = this.getMonth()
		return new Date(y, m, 1)
	}
Date.prototype.___lastDayOfMonth = function(){
  		var y = this.getFullYear(), m = this.getMonth()
		return lastDay = new Date(y, m + 1, 0)
	}
Date.prototype.___format = function( format ){
		if ( !this.___isValid() ) return

		var preFormats = this.___getPreFormats()
		  , month      = this.___getMonths()[ this.getMonth() ]
		  , weekday    = this.___getWeekdays()[ this.getDay() ]
		  , values     = {
				d     : weekday.d
			  , dd    : this.getDate().length === 1 ? '0'+this.getDate() : this.getDate()
			  , ddd   : weekday.ddd
			  , dddd  : weekday.dddd
			  , M     : month.M
			  , MM    : month.MM
			  , MMM   : month.MMM
			  , MMMM  : month.MMMM
			  , h     : this.getHours()
			  , hh    : this.getHours().length === 1 ? '0'+this.getHours() : this.getHours()
			  , m     : this.getMinutes()
			  , mm    : this.getMinutes().length === 1 ? '0'+this.getMinutes() : this.getMinutes()
			  , s     : this.getSeconds()
			  , ss    : this.getSeconds().length === 1 ? '0'+thie.getSeconds() : this.getSeconds()
			  , yy    : this.getFullYear().toString().substr(2,2)
			  , yyyy  : this.getFullYear()
			}

		if ( preFormats[ format ] ) format = preFormats[ format ]

		return format.___set( values )
	}
Date.prototype.___isValid = function(){
		return !isNaN( this.getTime())
	}


/*
	Extending String prototype
*/
String.prototype.___set = function( obj ){
		var result = this
		for ( var key in obj ){ 
			result = result.replace( new RegExp('{'+key+'}', 'g'), obj[key] ) 
		}
		return result
	}
String.prototype.___getURL = function( success, error ) {
		var xhr
		  , url = this.toString()

		if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest()
		else {
			var versions = ["MSXML2.XmlHttp.5.0", 
							"MSXML2.XmlHttp.4.0",
							"MSXML2.XmlHttp.3.0", 
							"MSXML2.XmlHttp.2.0",
							"Microsoft.XmlHttp"]

			for(var i = 0, len = versions.length; i < len; i++) {
				try {
					xhr = new ActiveXObject(versions[i])
					break
				}
				catch(e){}
			}
		}

		xhr.onreadystatechange = function(){
			if (xhr.readyState < 4) return
			if (xhr.status === 200) success( xhr )
			else error( xhr )
		}

		xhr.open('GET', url, true);
		xhr.send('');
	}

/*
	Extending Array prototype
*/
Array.prototype.___contains = function( obj ){
		return this.indexOf( obj ) > -1
	}
Array.prototype.___inGroupsOf = function( n, empty ){

	}