/* Hata.js framework (c) 2013 */
(function(e,t,n){var r=h,i={},s=false,o=[],u=function(e,t){if(Array.isArray(e)){for(var n=0,r=e.length;n<r;n++){if(t.call(e[n],e[n],n)===false)break}}else{for(var i in e){if(t.call(e[i],e[i],i)===false)break}}},a=function(){if(!s){s=true;u(o,function(e,t){o[t]()});o=[]}},f={Tag:/^[-_a-z0-9]+$/i,Class:/^\.[-_a-z0-9]+$/i,Id:/^#[-_a-z0-9]+$/i},l=function(e,t){if(!(e.indexOf(t)>=0)){e.push(t)}return e},c=function(e){return Array.prototype.slice.call(e)},h=function(r,i){if(!(this instanceof h)){return new h(r,i)}if(i!==n){return(new h(i||t)).find(r)}if(!r){this.elems=[];return this}if(r instanceof h){return r}var s=r==="body"?[t.body]:typeof r==="string"?h._query(t,r):r===e||r.nodeType?[r]:c(r);if(s.length===1&&s[0]==null){s.length=0}this.elems=s;return this};h.extend=function(e){u(Array.prototype.slice.call(arguments,1),function(t){u(t,function(t,n){e[n]=t})});return e};t.addEventListener("DOMContentLoaded",a,false);e.addEventListener("load",a,false);h.extend(h,{ready:function(e){if(s){e()}else{o.push(e)}return this},noConflict:function(){if(e.hata===h){e.hata=r}return h},fn:h.prototype,each:u,_query:function(e,n){if(f.Id.test(n)){return[(e.getElementById?e:t).getElementById(n.substr(1))]}if(f.Class.test(n)){return c(e.getElementsByClassName(n.substr(1)))}if(f.Tag.test(n)){return c(e.getElementsByTagName(n))}return c(e.querySelectorAll(n))},_find:function(e,t){if(!t){return e==null?[]:[e]}var n=t.nodeName?[t]:typeof t==="string"?h._query(e,t):[e];return n.length===1&&n[0]==null?[]:n}});h.extend(h.fn,{get:function(e){var t=this.elems;if(e!==n){var r=e<0?t.length+e:e;return t[r]}return t},eq:function(e){return new h(this.get(e))},is:function(e){return this.filter(e).get().length>0},each:function(e){u(this.get(),e);return this},find:function(e){var t=[];this.each(function(n){var r=0,i=h._find(n,e),s=i.length;while(r<s){l(t,i[r++])}});return new h(t)},closest:function(e){var n,r=[],i=(new h(e)).get();this.each(function(s){n=s;while(n!==t&&i.indexOf(n)<0){n=n.parentNode}if(n!==t||e===t){l(r,n)}});return new h(r)},parents:function(e){var n,r=[],i=(new h(e)).get();this.each(function(e){n=e.parentNode;while(n!==t){if(i.indexOf(n)>-1){l(r,n)}n=n.parentNode}});return new h(r)},filter:function(e){var t=new h(e),n=[];this.each(function(e){if(t.get().indexOf(e)>=0){l(n,e)}});return new h(n)}});e.hata=h})(window,window.document);

/**
 * @param  {String} str
 * @return {Node}
 */
var createNode = function( str ) {
  var node;

  if ( /^<([^>]+)>(.*)<\/(.+)>/.test( hata.trim( str ) ) ) {
    html = hata.trim( str );
    var htmlArr = html.match(/^<([^>]+)>(.*)<\/(.+)>$/);
    var params = htmlArr[1].split(" ");

    node = document.createElement(params[0]);
    hata.each( Array.prototype.slice.call( params, 1), function( value, key ) {
      var attribute = hata.trim( value ).match(/^(.+)="(.*)"$/);
      node.setAttribute(attribute[1], attribute[2]);
    });

    node.innerHTML = htmlArr[2];

  } else {
    node = document.createTextNode( str );
  }

  return node;
};

var methods = {
  trim: function( str ) {
    return str.replace(/^\s+|\s+$/g, "");
  },

  inArray: function( target, obj ) {
    return obj.indexOf( target );
  },

  animParams: {
    duration: 200,
    delay: 10,
    done: function() {}
  },

  animate: function( opts ) {
    var start = new Date;

    var timer = setInterval(function() {
      var progress = ( new Date - start ) / (opts.duration || hata.animParams.duration);
      if ( progress > 1 ) {
        progress = 1;
      }

      opts.step( progress );

      if ( progress === 1 ) {
        clearInterval( timer );
        (opts.done || hata.animParams.done).call(this);
      }

    }, opts.delay || hata.animParams.delay );
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
      return this.get(0).value;
    }
  },

  attr: function( name, value ) {
    if ( value != null ) {
      return this.each(function( elem ) {
        elem.setAttribute( name, value );
      });

    } else {
      return this.get(0) ? this.get(0).getAttribute( name ) : "";
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
      return this.get(0).innerHTML;
    }
  },

  text: function( value ) {
    if ( value ) {
      return this.each(function( elem ) {
        elem.textContent = value;
      });

    } else {
      // Check for correct work with empty Hata object
      return this.get(0) ? this.get(0).textContent : "";
    }
  },

  size: function() {
    return this.get().length;
  },

  parent: function() {
    return hata( this.get(0).parentNode );
  },

  css: function( obj ) {
    if ( typeof obj === "string" ) {
      return window.getComputedStyle( this.get(0) )[ obj ];

    } else {
      return this.each(function( elem ) {
        for ( var key in obj ) {
          elem.style[ key ] = obj[ key ];
        }
      });
    }
  },

  bind: function( eventType, callback ) {
    return this.each(function() {
      this.addEventListener( eventType, callback, false);
    });
  },

  unbind: function( eventType, callback ) {
    if ( callback ) {
      return this.each(function() {
        this.removeEventListener( eventType, callback );
      });

    } else {
      return this.each(function() {
        this.parentNode.replaceChild( this.cloneNode(true), this );
      });
    }
  }
};

hata.extend( hata.fn, extensions );
hata.extend( hata, methods );
