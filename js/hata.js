// Hata
// API: http://ezhlobo.github.io/hata/
(function(e,t){var n=e.document,r=Array.isArray||function(e){return e&&Object.prototype.toString.call(e)==="[object Array]"},i=function(e,t){if(e.indexOf(t)===-1){e.push(t)}return e},s=function(e){if(!e)return[];if(/number|string/.test(typeof e))return[e];return[].slice.call(e)},o=false,u=[],a=function(){if(o)return;o=true;var e=0,t=u.length;for(;e<t;e++){u[e]()}u=[]},f={Tag:/^[-_a-z0-9]+$/i,Class:/^\.[-_a-z0-9]+$/i,Id:/^#[-_a-z0-9]+$/i},l=function(e,t){if(f.Id.test(t)&&e.getElementById){return[e.getElementById(t.substr(1))]}if(f.Class.test(t)){return s(e.getElementsByClassName(t.substr(1)))}if(f.Tag.test(t)){return s(e.getElementsByTagName(t))}return s(e.querySelectorAll(t))},c=function(e,t){if(!t){return e==null?[]:[e]}var n=t.nodeName?[t]:typeof t==="string"?l(e,t):[e];return n.length===1&&n[0]==null?[]:n};var h=function(r,i){if(!(this instanceof h)){return new h(r,i)}if(r instanceof h){return r}if(!r){this.elems=[];this.length=0;return this}if(i!==t){return(new h(i||n)).find(r)}var o=r==="body"?[n.body]:typeof r==="string"?l(n,r):r===e||r.nodeType?[r]:s(r);if(o.length===1&&o[0]==null){o.length=0}this.elems=o;this.length=this.elems.length;return this};h.each=function(e,t){if(e==null)return;var n=0,i=e.length;if(r(e)||e.toString()=="[object NodeList]"){for(;n<i;n++){if(t.call(e[n],e[n],n)===false)break}}else{for(n in e){if(t.call(e[n],e[n],n)===false)break}}};h.extend=function(e){h.each([].slice.call(arguments,1),function(t){h.each(t,function(t,n){e[n]=t})});return e};h.extend(h.prototype,{get:function(e){var t=this.elems;return e==null?t:e<0?t[this.length+e]:t[e]},eq:function(e){return new h(this.get(e))},each:function(e){h.each(this.get(),e);return this},filter:function(e){var t=new h(e),n=[];this.each(function(e){if(t.get().indexOf(e)!==-1){i(n,e)}});return new h(n)},is:function(e){return this.filter(e).length>0},find:function(e){var t=[];this.each(function(n){var r=0,s=c(n,e),o=s.length;while(r<o){i(t,s[r++])}});return new h(t)},closest:function(e){var t,r=[],s=(new h(e)).get();this.each(function(e){t=e;while(t!==n&&s.indexOf(t)===-1){t=t.parentNode}if(t!==n){i(r,t)}});return new h(r)},parent:function(){var e=[];this.each(function(t){i(e,t.parentNode)});return new h(e)},parents:function(e){var t,r=[],s=(new h(e)).get();this.each(function(e){t=e.parentNode;while(t!==n){if(s.indexOf(t)!==-1){i(r,t)}t=t.parentNode}});return new h(r)}});h.extend(h,{ready:function(e){if(o){e()}else{u.push(e)}return this},pushUniq:i,toArray:s,fn:h.prototype});n.addEventListener("DOMContentLoaded",a,false);e.addEventListener("load",a,false);e.hata=h})(window);

var createNode = function( str ) {
	var node;

	if ( /^<([^>]+)>(.*)<\/(.+)>/.test( hata.trim( str ) ) ) {
		var html = hata.trim( str ),
			htmlArr = html.match( /^<([^>]+)>(.*)<\/(.+)>$/ ),
			params = htmlArr[ 1 ].split( " " );

		node = document.createElement( params[ 0 ] );
		hata.each( Array.prototype.slice.call( params, 1 ), function( value, key ) {
			var attribute = hata.trim( value ).match( /^(.+)='(.*)'$/ );

			node.setAttribute( attribute[ 1 ], attribute[ 2 ] );
		});

		node.innerHTML = htmlArr[ 2 ];

	} else {
		node = document.createTextNode( str );
	}

	return node;
};

var methods = {
	trim: function( str ) {
		return str.replace( /^\s+|\s+$/g, "" );
	},

	inArray: function( target, obj ) {
		return obj.indexOf( target );
	},

	animParams: {
		duration: 200,
		delay: 10,
		delta: function( progress ) {
			return Math.sin( progress * Math.PI / 2 );
		},
		done: function() {}
	},

	animate: function( step, opts ) {
		var timer,
			start = new Date,
			opts = hata.extend({}, hata.animParams, opts ),

		timer = setInterval(function() {
			var progress = ( new Date - start ) / opts.duration;

			if ( progress > 1 ) {
				progress = 1;
			}

			step( opts.delta( progress ) );

			if ( progress === 1 ) {
				clearInterval( timer );
				opts.done.call( this );
			}

		}, opts.delay );
	}
};

var extensions = {
	addClass: function( value ) {
		return this.each(function( elem ) {
			elem.classList.add( value );
		});
	},

	removeClass: function( value ) {
		return this.each(function( elem ) {
			elem.classList.remove( value );
		});
	},

	val: function( value ) {
		if ( value ) {
			return this.each(function( elem ) {
				elem.value = value;
			});

		} else {
			return this.get( 0 ).value;
		}
	},

	attr: function( name, value ) {
		if ( value != null ) {
			return this.each(function( elem ) {
				elem.setAttribute( name, value );
			});

		} else {
			return this.get( 0 ) ? this.get( 0 ).getAttribute( name ) : "";
		}
	},

	removeAttr: function( name ) {
		return this.each(function( elem ) {
			elem.removeAttribute( name );
		});
	},

	prepend: function( html ) {
		var node = createNode( html );

		return this.each(function( elem ) {
			elem.insertBefore( node, elem.firstChild );
		});
	},

	append: function( html ) {
		var node = createNode( html );

		return this.each(function( elem ) {
			elem.appendChild( node );
		});
	},

	remove: function() {
		return this.each(function( elem ) {
			elem.removeNode( true );
		});
	},

	html: function( value ) {
		if ( value ) {
			return this.each(function( elem ) {
				elem.innerHTML = value;
			});

		} else {
			return this.get( 0 ).innerHTML;
		}
	},

	text: function( value ) {
		if ( value ) {
			return this.each(function( elem ) {
				elem.textContent = value;
			});

		} else {
			// Check for correct work with empty Hata object
			return this.get( 0 ) ? this.get( 0 ).textContent : "";
		}
	},

	size: function() {
		return this.get().length;
	},

	css: function( obj ) {
		if ( typeof obj === "string" ) {
			return window.getComputedStyle( this.get( 0 ) )[ obj ];

		} else {
			return this.each(function( elem ) {
				var key;

				for ( key in obj ) {
					elem.style[ key ] = obj[ key ];
				}
			});
		}
	},

	bind: function( eventType, callback ) {
		return this.each(function() {
			this.addEventListener( eventType, callback, false );
		});
	},

	unbind: function( eventType, callback ) {
		if ( callback ) {
			return this.each(function() {
				this.removeEventListener( eventType, callback );
			});

		} else {
			return this.each(function() {
				this.parentNode.replaceChild( this.cloneNode( true ), this );
			});
		}
	}
};

hata.extend( hata.fn, extensions );
hata.extend( hata, methods );
