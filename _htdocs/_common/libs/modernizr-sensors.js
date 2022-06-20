/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-ambientlight-devicemotion_deviceorientation-proximity-websockets-setclasses !*/
!function(e,n,t){function i(e,n){return typeof e===n}function o(){var e,n,t,o,s,r,a;for(var u in f)if(f.hasOwnProperty(u)){if(e=[],n=f[u],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=i(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)r=e[s],a=r.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),c.push((o?"":"no-")+a.join("-"))}}function s(e){var n=p.className,t=Modernizr._config.classPrefix||"";if(v&&(n=n.baseVal),Modernizr._config.enableJSClass){var i=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(i,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),v?p.className.baseVal=n:p.className=n)}function r(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):v?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e,n){if("object"==typeof e)for(var t in e)h(e,t)&&a(t,e[t]);else{e=e.toLowerCase();var i=e.split("."),o=Modernizr[i[0]];if(2==i.length&&(o=o[i[1]]),"undefined"!=typeof o)return Modernizr;n="function"==typeof n?n():n,1==i.length?Modernizr[i[0]]=n:(!Modernizr[i[0]]||Modernizr[i[0]]instanceof Boolean||(Modernizr[i[0]]=new Boolean(Modernizr[i[0]])),Modernizr[i[0]][i[1]]=n),s([(n&&0!=n?"":"no-")+i.join("-")]),Modernizr._trigger(e,n)}return Modernizr}var c=[],f=[],u={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){f.push({name:e,fn:n,options:t})},addAsyncTest:function(e){f.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=u,Modernizr=new Modernizr;var l=!1;try{l="WebSocket"in e&&2===e.WebSocket.CLOSING}catch(d){}Modernizr.addTest("websockets",l),Modernizr.addTest("devicemotion","DeviceMotionEvent"in e),Modernizr.addTest("deviceorientation","DeviceOrientationEvent"in e);var p=n.documentElement,v="svg"===p.nodeName.toLowerCase(),m=function(){function e(e,n){var o;return e?(n&&"string"!=typeof n||(n=r(n||"div")),e="on"+e,o=e in n,!o&&i&&(n.setAttribute||(n=r("div")),n.setAttribute(e,""),o="function"==typeof n[e],n[e]!==t&&(n[e]=t),n.removeAttribute(e)),o):!1}var i=!("onblur"in n.documentElement);return e}();u.hasEvent=m,Modernizr.addTest("ambientlight",m("devicelight",e));var h;!function(){var e={}.hasOwnProperty;h=i(e,"undefined")||i(e.call,"undefined")?function(e,n){return n in e&&i(e.constructor.prototype[n],"undefined")}:function(n,t){return e.call(n,t)}}(),u._l={},u.on=function(e,n){this._l[e]||(this._l[e]=[]),this._l[e].push(n),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},u._trigger=function(e,n){if(this._l[e]){var t=this._l[e];setTimeout(function(){var e,i;for(e=0;e<t.length;e++)(i=t[e])(n)},0),delete this._l[e]}},Modernizr._q.push(function(){u.addTest=a}),Modernizr.addAsyncTest(function(){function n(){clearTimeout(t),e.removeEventListener("deviceproximity",n),a("proximity",!0)}var t,i=300;"ondeviceproximity"in e&&"onuserproximity"in e?(e.addEventListener("deviceproximity",n),t=setTimeout(function(){e.removeEventListener("deviceproximity",n),a("proximity",!1)},i)):a("proximity",!1)}),o(),s(c),delete u.addTest,delete u.addAsyncTest;for(var g=0;g<Modernizr._q.length;g++)Modernizr._q[g]();e.Modernizr=Modernizr}(window,document);