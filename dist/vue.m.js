import{in_array as t}from"php-in-js/modules/array";import{trim as r,rtrim as n,ltrim as i,str_replace as e,strpos as o,substr_replace as u,strlen as l}from"php-in-js/modules/string";import{is_array as s,is_object as a,empty as f,is_string as v}from"php-in-js/modules/types";import{parse_url as h,urlencode as d,http_build_query as c}from"php-in-js/modules/url";function p(){return p=Object.assign?Object.assign.bind():function(t){for(var r=1;r<arguments.length;r++){var n=arguments[r];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},p.apply(this,arguments)}var g=/*#__PURE__*/function(){function g(t,r){void 0===t&&(t=!0),this.t=r||("undefined"!=typeof Zygot?Zygot:null==globalThis?void 0:globalThis.Zygot),this.t=p({},this.t,{absolute:t}),this.i=this.t.routes}var m,w,y=g.prototype;return y.current=function(t,r){var n=this.o().name;return t?new RegExp("^"+t.replace(/\./g,"\\.").replace(/\*/g,".*")+"$").test(n):n},y.has=function(t){return Object.keys(this.i).includes(this.u(t))},y.make=function(e,o){if(e=(o=Array.prototype.slice.call(arguments)).shift(),e=this.u(e),o=o.shift(),t(o,[null,void 0,"undefined","null",""],!0)&&(o=[]),!this.has(e)){if(this.t.defaults.throwOnUnavailable)throw new Error("Zygot error: route '"+e+"' is not in the route list.");return r(this.t.url,"/")}var u=this.l(this.i[e],o);if(!this.t.absolute)return n(u,"/");var l=h(this.t.url);u=u.includes(l.host)?l.scheme+"://"+i(u.replace(l.scheme+"://",""),"/"):this.t.url+u;var s=h(u),a=s.port||l.port||this.t.port||80,f=s.query||l.query;return r((s.scheme||l.scheme)+"://"+(s.host||l.host)+(80==a?"":":"+a)+(s.path||l.path)+(f?"?"+f:""),"/")},y.l=function(n,v){t(v,[null,void 0,"undefined","null",""],!0)||s(v)||(v=[v]),v.length&&a(v[0])&&(v=v[0]);var h=r(n.domain||"","/")+"/"+r(n.uri,"/");if(h.includes("{locale}")){var p=null;v&&v.locale&&(p=v.locale,delete v.locale),h=this.v(h,p)}var g=h.match(new RegExp(/\{([A-Za-z_?]+)\}/,"g"));return g&&g.forEach(function(r,n){var i=e(["{","}","?"],"",r);if(v[i]||(t(v[n],[null,void 0,"undefined","null",""],!0)?v.id&&!g.includes("{id}")&&(i="id"):i=n),!r.endsWith("?}")&&0!==v[i]&&f(v[i]))throw new Error("'"+i+"' parameter is required");var o=t(v[i],[null,void 0,"undefined","null"],!0)?"":v[i];h=e(r,d(o),h),delete v[i]}),a(v)&&Object.keys(v).length&&(h+="?"+c(v)),(g=h.match(new RegExp(/\([^)]+\)/,"g")))&&g.forEach(function(t,r){var n=String(v[r]);if(!n.match(new RegExp("^"+t+"$","g")))throw new Error("Zygot error: Invalid parameter type: '"+n+"'.");var i=o(h,t);h=u(h,n,i,l(t))}),"/"+i(h,"/")},y.v=function(r,n){return!1===o(r,"{locale}")?r:(null!==n&&(t(n,this.t.defaults.supportedLocales||[],!0)||(n=null)),null===n&&(n=this.t.defaults.locale||"en"),e("{locale}",n,r))},y.u=function(t){var r=this.t.defaults.routeNamePrefix||null;return r&&v(r)?r+(t=t.replace(RegExp("^"+r,"i"),"")):t},y.h=function(t,n){if(!t.methods.includes("GET"))return!1;n=r(n,"/");var i=t.uri.replace(/:([\w]+)/,function(t){return"([^/]+)"}),e=new RegExp("^"+i+"$","i"),o=n.match(e);return null!=o&&(o.shift(),o)},y.o=function(t){var r=this;t?this.t.absolute&&t.startsWith("/")&&(t=this.p().host+t):t=this.g();var n={},i=Object.entries(this.i).find(function(i){return n=r.h(i[1],t)})||[void 0,void 0];return p({name:i[0]},n,{route:i[1]})},y.p=function(){var t,r,n,i,e,o,u="undefined"!=typeof window?window.location:{},l=u.host,s=u.pathname,a=u.search;return{host:null!=(t=null==(r=this.t.location)?void 0:r.host)?t:void 0===l?"":l,pathname:null!=(n=null==(i=this.t.location)?void 0:i.pathname)?n:void 0===s?"":s,search:null!=(e=null==(o=this.t.location)?void 0:o.search)?e:void 0===a?"":a}},y.g=function(){var t=this.p(),r=t.pathname,n=t.search;return(this.t.absolute?t.host+r:r.replace(this.t.url.replace(/^\w*:\/\/[^/]+/,""),"").replace(/^\/+/,"/"))+n},m=g,(w=[{key:"params",get:function(){var t=this.o();return p({},t.params,t.query)}}])&&function(t,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,"symbol"==typeof(e=function(t,r){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var i=n.call(t,"string");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(i.key))?e:String(e),i)}var e}(m.prototype,w),Object.defineProperty(m,"prototype",{writable:!1}),g}();function m(t,r,n,i){var e=new g(n,i);return t?e.make(t,r):e}var w={install:function(t,r){var n=function(t,n,i,e){return void 0===e&&(e=r),m(t,n,i,e)};t.mixin({methods:{route:n}}),parseInt(t.version)>2&&t.provide("route",n)}};export{w as ZygotVue,m as route};
