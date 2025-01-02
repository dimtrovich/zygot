import{in_array as t}from"php-in-js/modules/array";import{trim as e,rtrim as n,ltrim as r,str_replace as i,strpos as s,substr_replace as o,strlen as l}from"php-in-js/modules/string";import{is_array as u,is_object as h,empty as a,is_string as c}from"php-in-js/modules/types";import{parse_url as d,urlencode as p,http_build_query as f}from"php-in-js/modules/url";function m(){return m=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},m.apply(this,arguments)}class g{constructor(t=!0,e){this.t=e||("undefined"!=typeof Zygot?Zygot:null==globalThis?void 0:globalThis.Zygot),this.t=m({},this.t,{absolute:t}),this.i=this.t.routes}get params(){const{params:t,query:e}=this.o();return m({},t,e)}current(t,e){const{name:n}=this.o();return t?new RegExp(`^${t.replace(/\./g,"\\.").replace(/\*/g,".*")}$`).test(n):n}has(t){return Object.keys(this.i).includes(this.l(t))}make(i,s){if(i=(s=[...arguments]).shift(),i=this.l(i),s=s.shift(),t(s,[null,void 0,"undefined","null",""],!0)&&(s=[]),!this.has(i)){if(this.t.defaults.throwOnUnavailable)throw new Error(`Zygot error: route '${i}' is not in the route list.`);return e(this.t.url,"/")}let o=this.u(this.i[i],s);if(!this.t.absolute)return n(o,"/");const l=d(this.t.url);o=o.includes(l.host)?`${l.scheme}://`+r(o.replace(`${l.scheme}://`,""),"/"):this.t.url+o;const u=d(o),h=u.port||l.port||this.t.port||80,a=u.query||l.query;return e(`${u.scheme||l.scheme}://${u.host||l.host}${80==h?"":":"+h}${u.path||l.path}${a?"?"+a:""}`,"/")}u(n,c){t(c,[null,void 0,"undefined","null",""],!0)||u(c)||(c=[c]),c.length&&h(c[0])&&(c=c[0]);let d=e(n.domain||"","/")+"/"+e(n.uri,"/");if(d.includes("{locale}")){let t=null;c&&c.locale&&(t=c.locale,delete c.locale),d=this.h(d,t)}let m=d.match(new RegExp(/\{([A-Za-z_?]+)\}/,"g"));return m&&m.forEach((e,n)=>{let r=i(["{","}","?"],"",e);if(c[r]||(t(c[n],[null,void 0,"undefined","null",""],!0)?c.id&&!m.includes("{id}")&&(r="id"):r=n),!e.endsWith("?}")&&0!==c[r]&&a(c[r]))throw new Error(`'${r}' parameter is required`);const s=t(c[r],[null,void 0,"undefined","null"],!0)?"":c[r];d=i(e,p(s),d),delete c[r]}),h(c)&&Object.keys(c).length&&(d+="?"+f(c)),m=d.match(new RegExp(/\([^)]+\)/,"g")),m&&m.forEach((t,e)=>{const n=String(c[e]);if(!n.match(new RegExp(`^${t}$`,"g")))throw new Error(`Zygot error: Invalid parameter type: '${n}'.`);const r=s(d,t);d=o(d,n,r,l(t))}),"/"+r(d,"/")}h(e,n){return!1===s(e,"{locale}")?e:(null!==n&&(t(n,this.t.defaults.supportedLocales||[],!0)||(n=null)),null===n&&(n=this.t.defaults.locale||"en"),i("{locale}",n,e))}l(t){const e=this.t.defaults.routeNamePrefix||null;return e&&c(e)?e+(t=t.replace(RegExp(`^${e}`,"i"),"")):t}p(t,n){if(!t.methods.includes("GET"))return!1;n=e(n,"/");let r=t.uri.replace(/:([\w]+)/,t=>"([^/]+)");const i=new RegExp(`^${r}$`,"i"),s=n.match(i);return null!=s&&(s.shift(),s)}o(t){t?this.t.absolute&&t.startsWith("/")&&(t=this.m().host+t):t=this.g();let e={};const[n,r]=Object.entries(this.i).find(([n,r])=>e=this.p(r,t))||[void 0,void 0];return m({name:n},e,{route:r})}m(){var t,e,n,r,i,s;const{host:o="",pathname:l="",search:u=""}="undefined"!=typeof window?window.location:{};return{host:null!=(t=null==(e=this.t.location)?void 0:e.host)?t:o,pathname:null!=(n=null==(r=this.t.location)?void 0:r.pathname)?n:l,search:null!=(i=null==(s=this.t.location)?void 0:s.search)?i:u}}g(){const{host:t,pathname:e,search:n}=this.m();return(this.t.absolute?t+e:e.replace(this.t.url.replace(/^\w*:\/\/[^/]+/,""),"").replace(/^\/+/,"/"))+n}}function w(t,e,n,r){const i=new g(n,r);return t?i.make(t,e):i}const v={install:(t,e)=>{const n=(t,n,r,i=e)=>w(t,n,r,i);t.mixin({methods:{route:n}}),parseInt(t.version)>2&&t.provide("route",n)}};export{v as ZygotVue,w as route};
