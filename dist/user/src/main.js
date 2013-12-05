define("happy/app/BaseApp",[],function(){var e=function(){var e=this,t=function(){};e.container=document.body,e.setup=t,e.update=t,e.draw=t,e.onKeyUp=t,e.onKeyDown=t,e.onMouseOver=t,e.onMouseOut=t,e.onMouseDown=t,e.onMouseUp=t,e.onMouseMove=t,e.onClick=t,e.onDoubleClick=t,e.onResize=t,e.setFPS=t,e.enterFullscreen=t,e.exitFullscreen=t,e.toggleFullscreen=t,e.isFullscreen=t};return e}),function(e){function t(e,t,n,r,i){this._listener=t,this._isOnce=n,this.context=r,this._signal=e,this._priority=i||0}function n(e,t){if(typeof e!="function")throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",t))}function r(){this._bindings=[],this._prevParams=null;var e=this;this.dispatch=function(){r.prototype.dispatch.apply(e,arguments)}}t.prototype={active:!0,params:null,execute:function(e){var t,n;return this.active&&!!this._listener&&(n=this.params?this.params.concat(e):e,t=this._listener.apply(this.context,n),this._isOnce&&this.detach()),t},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal,delete this._listener,delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}},r.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(e,n,r,i){var s=this._indexOfListener(e,r),o;if(s!==-1){o=this._bindings[s];if(o.isOnce()!==n)throw new Error("You cannot add"+(n?"":"Once")+"() then add"+(n?"Once":"")+"() the same listener without removing the relationship first.")}else o=new t(this,e,n,r,i),this._addBinding(o);return this.memorize&&this._prevParams&&o.execute(this._prevParams),o},_addBinding:function(e){var t=this._bindings.length;do--t;while(this._bindings[t]&&e._priority<=this._bindings[t]._priority);this._bindings.splice(t+1,0,e)},_indexOfListener:function(e,t){var n=this._bindings.length,r;while(n--){r=this._bindings[n];if(r._listener===e&&r.context===t)return n}return-1},has:function(e,t){return this._indexOfListener(e,t)!==-1},add:function(e,t,r){return n(e,"add"),this._registerListener(e,!1,t,r)},addOnce:function(e,t,r){return n(e,"addOnce"),this._registerListener(e,!0,t,r)},remove:function(e,t){n(e,"remove");var r=this._indexOfListener(e,t);return r!==-1&&(this._bindings[r]._destroy(),this._bindings.splice(r,1)),e},removeAll:function(){var e=this._bindings.length;while(e--)this._bindings[e]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(e){if(!this.active)return;var t=Array.prototype.slice.call(arguments),n=this._bindings.length,r;this.memorize&&(this._prevParams=t);if(!n)return;r=this._bindings.slice(),this._shouldPropagate=!0;do n--;while(r[n]&&this._shouldPropagate&&r[n].execute(t)!==!1)},forget:function(){this._prevParams=null},dispose:function(){this.removeAll(),delete this._bindings,delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var i=r;i.Signal=r,typeof define=="function"&&define.amd?define("happy/_libs/signals",[],function(){return i}):typeof module!="undefined"&&module.exports?module.exports=i:e.signals=i}(this),define("UserSocketInterface",["happy/_libs/signals"],function(e){var t=function(t){var n=this,r,i=["announcement","gift"],s=["clap","wow","booh","question"],o,u,a,f,l,c=function(n){o=t.connect(n),o.on("error",function(){setTimeout(function(){o.socket.connect()},1e3)}),o.on("connect",g),o.on("login",y),o.on("announcement",b),o.on("gift",w),a=new e,u=new e,f=new e,l=new e},h=function(){o.emit("clap"),console.log("clap")},p=function(){o.emit("wow"),console.log("wow")},d=function(){o.emit("booh"),console.log("booh")},v=function(e){o.emit("question",{question:e}),console.log("question",{question:e})},m=function(){x("user_gift"),console.log("Gift Collected"),l.dispatch()},g=function(){o.emit("identity",{uuid:localStorage.getItem("user_uuid"),listens:i,reports:s})},y=function(e){r=e,localStorage.setItem("user_uuid",r),console.log("login",r),a.dispatch();var t=S("user_gift");t&&w(t)},b=function(e,t){t&&t(localStorage.getItem("user_uuid")),console.log("announcement",e,t),u.dispatch(e)},w=function(e,t){t&&t(localStorage.getItem("user_uuid")),E("user_gift",e),console.log("gift",e),f.dispatch(e)},E=function(e,t){localStorage.setItem(e,JSON.stringify(t))},S=function(e){var t;try{t=JSON.parse(localStorage.getItem(e))}catch(n){console.log(n)}return t},x=function(e){localStorage.removeItem(e)},T=function(){return localStorage.getItem("user_gift")},N=function(){return a},C=function(){return u},k=function(){return f},L=function(){return l};Object.defineProperty(n,"connect",{value:c}),Object.defineProperty(n,"clap",{value:h}),Object.defineProperty(n,"wow",{value:p}),Object.defineProperty(n,"booh",{value:d}),Object.defineProperty(n,"question",{value:v}),Object.defineProperty(n,"collectGift",{value:m}),Object.defineProperty(n,"gift",{get:T}),Object.defineProperty(n,"loginSignal",{get:N}),Object.defineProperty(n,"announcementSignal",{get:C}),Object.defineProperty(n,"giftCollectedSignal",{get:L}),Object.defineProperty(n,"giftSignal",{get:k})};return t}),define("App",["happy/app/BaseApp",_HOST+"/socket.io/socket.io.js","UserSocketInterface"],function(e,t,n){var r="ontouchstart"in document.documentElement?"touchstart":"mousedown",i="ontouchend"in document.documentElement?"touchend":"mouseup",s=function(){var e=this,s,o,u,a,f,l=10,c=5;e.setup=function(){o=document.createElement("div"),o.id="portrait-warning",e.container.appendChild(o),f={},h(),p(),v(),d(),m(),e.container.appendChild(f.main.container),s=new n(t),s.connect(_HOST),s.loginSignal.add(function(t){s.gift&&(y(s.gift),e.container.classList.add("has-gift"))}),s.announcementSignal.add(function(e){g(e),b("announcement")}),s.giftSignal.add(function(t){y(t),e.container.classList.add("has-gift"),b("gift")}),s.giftCollectedSignal.add(function(t){e.container.classList.remove("has-gift")})};var h=function(){var e=document.createElement("div");e.id="main-screen",e.className="screen";var t={container:e};f.main=t,t.logo=document.createElement("div"),t.logo.id="logo",e.appendChild(t.logo),t.clap=document.createElement("div"),t.clap.className="clap main-button",t.clap.innerHTML="<span>clap</span>",e.appendChild(t.clap),t.clap.addEventListener(r,function(){s.clap(),t.clap.className="clap main-button pressed"}),t.clap.addEventListener(i,function(){t.clap.className="clap main-button"}),t.spacer=document.createElement("div"),t.spacer.className="spacer",e.appendChild(t.spacer),t.wow=document.createElement("div"),t.wow.className="wow main-button",t.wow.innerHTML="<span>yay</span>",e.appendChild(t.wow),t.wow.addEventListener(r,function(){s.wow(),t.wow.className="wow main-button pressed"}),t.wow.addEventListener(i,function(){t.wow.className="wow main-button"}),t.booh=document.createElement("div"),t.booh.className="booh main-button",t.booh.innerHTML="<span>boo</span>",e.appendChild(t.booh),t.booh.addEventListener(r,function(){s.booh(),t.booh.className="booh main-button pressed"}),t.booh.addEventListener(i,function(){t.booh.className="booh main-button"}),t.tab=document.createElement("div"),t.tab.id="tab",e.appendChild(t.tab),t.spacer2=document.createElement("div"),t.spacer2.className="spacer2",t.tab.appendChild(t.spacer2),t.questionButton=document.createElement("div"),t.questionButton.className="question tab-button",t.questionButton.innerHTML="<span>ask question</span>",t.tab.appendChild(t.questionButton),t.questionButton.addEventListener(i,function(){b("question")}),t.giftButton=document.createElement("div"),t.giftButton.className="gift tab-button",t.giftButton.innerHTML="<span>get gift</span>",t.tab.appendChild(t.giftButton),t.giftButton.addEventListener(i,function(){b("gift")}),t.infoButton=document.createElement("div"),t.infoButton.className="info tab-button",t.infoButton.innerHTML="<span>i</span>",t.tab.appendChild(t.infoButton),t.infoButton.addEventListener(i,function(){b("info")})},p=function(){var e=document.createElement("form");e.id="question-screen",e.className="screen";var t={container:e};f.question=t,t.close=document.createElement("div"),t.close.className="close",t.close.innerHTML="<span>close</span>",e.appendChild(t.close),t.close.addEventListener(r,function(){t.container.parentNode.removeChild(t.container),a=null}),t.text=document.createElement("textarea"),t.text.required="required",t.text.rows=6,t.text.setAttribute("maxlength",140),t.text.className="text",t.text.placeholder="Write your question in maximum 140 characters.",e.appendChild(t.text),t.ask=document.createElement("div"),t.ask.className="ask push-button",t.ask.innerHTML="<span>ask</span>",e.appendChild(t.ask),t.ask.addEventListener(r,function(e){e.preventDefault();if(t.text.value){s.question(t.text.value),t.text.value="";var n=t.text.placeholder;t.text.placeholder="Thank you for your question!",setTimeout(function(){t.text.placeholder=n},4e3)}})},d=function(){var e=document.createElement("div");e.id="announcement-screen",e.className="screen";var t={container:e};f.announcement=t,t.close=document.createElement("div"),t.close.className="close",t.close.innerHTML="<span>close</span>",e.appendChild(t.close),t.close.addEventListener(r,function(){t.container.parentNode.removeChild(t.container),a=null}),t.title=document.createElement("div"),t.title.className="title",e.appendChild(t.title),t.content=document.createElement("div"),t.content.className="content",e.appendChild(t.content)},v=function(){var e=document.createElement("div");e.id="gift-screen",e.className="screen";var t={container:e};f.gift=t,t.close=document.createElement("div"),t.close.className="close",t.close.innerHTML="close",e.appendChild(t.close),t.close.addEventListener(i,function(){t.container.parentNode.removeChild(t.container),a=null}),t.title=document.createElement("div"),t.title.className="title",e.appendChild(t.title),t.content=document.createElement("div"),t.content.className="content",e.appendChild(t.content);var n;t.container.addEventListener(r,function(){n=setTimeout(function(){confirm("Remove gift?")&&(console.log("aaaa"),s.collectGift(),t.container.parentNode.removeChild(t.container),a=null)},1e3)}),t.container.addEventListener(i,function(){clearTimeout(n)})},m=function(){var e=document.createElement("div");e.id="info-screen",e.className="screen";var t={container:e};f.info=t,t.close=document.createElement("div"),t.close.className="close",t.close.innerHTML="<span>close</span>",e.appendChild(t.close),t.close.addEventListener(r,function(){t.container.parentNode.removeChild(t.container),a=null}),t.title=document.createElement("div"),t.title.className="title",t.title.innerHTML="The Silent Swede",e.appendChild(t.title),t.content=document.createElement("div"),t.content.className="content",t.content.innerHTML="<b>The Silent Swede</b> is a tool created to make it easier for you to speak up! Give your instant feedback to the speaker and/or ask a question!",e.appendChild(t.content)},g=function(e){f.announcement.title.innerHTML=e.title,f.announcement.content.innerHTML=e.content,e.color&&(f.announcement.container.style.backgroundColor=e.color)},y=function(e){f.gift.title.innerHTML=e.title,f.gift.content.innerHTML=e.content,e.color&&(f.gift.container.style.backgroundColor=e.color)},b=function(t){a&&e.container.removeChild(a.container),a=f[t],e.container.appendChild(a.container)};e.onResize=function(t){t.width>t.height?e.container.className="landscape":e.container.className=""}};return s.prototype=new e,s}),define("happy/utils/DOM",[],function(){var e=function(){var e=this,t=function(e,t){return typeof e.classList=="undefined"?e.className.match(new RegExp("(\\s|^)"+t+"(\\s|$)")):e.classList.contains(t)},n=function(e,t){typeof e.classList=="undefined"?this.hasClass(e,t)||(e.className+=" "+t):e.classList.add(t)},r=function(e,n){if(typeof e.classList=="undefined"){if(t(e,n)){var r=new RegExp("(\\s|^)"+n+"(\\s|$)");e.className=e.className.replace(r," ")}}else e.classList.remove(n)},i=function(e){while(e.lastChild)e.removeChild(e.lastChild)},s=function(e){var t=e.offsetWidth,n=e.offsetHeight;return{width:t,height:n}};Object.defineProperty(e,"hasClass",{value:t}),Object.defineProperty(e,"addClass",{value:n}),Object.defineProperty(e,"removeClass",{value:r}),Object.defineProperty(e,"empty",{value:i}),Object.defineProperty(e,"measure",{value:s})};return e}),define("happy/polyfill/console",[],function(){return window.console||{info:function(){},log:function(){},debug:function(){},warn:function(){},error:function(){}}}),define("happy/_libs/mout/array/forEach",[],function(){function e(e,t,n){if(e==null)return;var r=-1,i=e.length;while(++r<i)if(t.call(n,e[r],r,e)===!1)break}return e}),define("happy/_libs/mout/array/indexOf",[],function(){function e(e,t,n){n=n||0;var r=e.length,i=n<0?r+n:n;while(i<r){if(e[i]===t)return i;i+=1}return-1}return e}),define("happy/_libs/mout/array/combine",["./indexOf"],function(e){function t(t,n){var r,i=n.length;for(r=0;r<i;r++)e(t,n[r])===-1&&t.push(n[r]);return t}return t}),define("happy/_libs/mout/lang/toString",[],function(){function e(e){return e==null?"":e.toString()}return e}),define("happy/_libs/mout/string/replaceAccents",["../lang/toString"],function(e){function t(t){return t=e(t),t.search(/[\xC0-\xFF]/g)>-1&&(t=t.replace(/[\xC0-\xC5]/g,"A").replace(/[\xC6]/g,"AE").replace(/[\xC7]/g,"C").replace(/[\xC8-\xCB]/g,"E").replace(/[\xCC-\xCF]/g,"I").replace(/[\xD0]/g,"D").replace(/[\xD1]/g,"N").replace(/[\xD2-\xD6\xD8]/g,"O").replace(/[\xD9-\xDC]/g,"U").replace(/[\xDD]/g,"Y").replace(/[\xDE]/g,"P").replace(/[\xE0-\xE5]/g,"a").replace(/[\xE6]/g,"ae").replace(/[\xE7]/g,"c").replace(/[\xE8-\xEB]/g,"e").replace(/[\xEC-\xEF]/g,"i").replace(/[\xF1]/g,"n").replace(/[\xF2-\xF6\xF8]/g,"o").replace(/[\xF9-\xFC]/g,"u").replace(/[\xFE]/g,"p").replace(/[\xFD\xFF]/g,"y")),t}return t}),define("happy/_libs/mout/string/removeNonWord",["../lang/toString"],function(e){function t(t){return t=e(t),t.replace(/[^0-9a-zA-Z\xC0-\xFF \-]/g,"")}return t}),define("happy/_libs/mout/string/upperCase",["../lang/toString"],function(e){function t(t){return t=e(t),t.toUpperCase()}return t}),define("happy/_libs/mout/string/lowerCase",["../lang/toString"],function(e){function t(t){return t=e(t),t.toLowerCase()}return t}),define("happy/_libs/mout/string/camelCase",["../lang/toString","./replaceAccents","./removeNonWord","./upperCase","./lowerCase"],function(e,t,n,r,i){function s(s){return s=e(s),s=t(s),s=n(s).replace(/\-/g," ").replace(/\s[a-z]/g,r).replace(/\s+/g,"").replace(/^[A-Z]/g,i),s}return s}),define("happy/_libs/mout/string/pascalCase",["../lang/toString","./camelCase","./upperCase"],function(e,t,n){function r(r){return r=e(r),t(r).replace(/^[a-z]/,n)}return r}),define("happy/utils/Vendor",["../polyfill/console","../_libs/mout/array/forEach","../_libs/mout/array/combine","../_libs/mout/string/pascalCase"],function(e,t,n,r){var i=["WebKit","Moz","O","Ms"],s=[],o=[];t(i,function(e){s.push(r(e)),o.push(e.toLowerCase())});var u=n(s,o),a=function(){var t=this,n=function(t,n){if(!t)return;var i=r(t);n=n||window;var s=t,o=n[s];if(typeof o=="undefined")for(var a=0;a<u.length;a++){s=u[a]+i,o=n[s];if(typeof o!="undefined")break}if(typeof o=="undefined"){e.log(t+" is not implemented.");return}return{name:s,context:n}},i=function(e,t){var r=n(e,t);if(!r)return;return function(){r.context[r.name].apply(r.context,arguments)}},s=function(e,t){var r=n(e,t);if(!r)return;return r.context[r.name]},o=function(e,t){var r=n(e,t);if(!r)return;return r.name};Object.defineProperty(t,"validateMethod",{value:i}),Object.defineProperty(t,"validateConstructor",{value:s}),Object.defineProperty(t,"validateName",{value:o})};return a}),define("happy/_libs/mout/object/hasOwn",[],function(){function e(e,t){return Object.prototype.hasOwnProperty.call(e,t)}return e}),define("happy/_libs/mout/lang/kindOf",[],function(){function r(r){return r===null?"Null":r===n?"Undefined":e.exec(t.call(r))[1]}var e=/^\[object (.*)\]$/,t=Object.prototype.toString,n;return r}),define("happy/_libs/mout/lang/isPlainObject",[],function(){function e(e){return!!e&&typeof e=="object"&&e.constructor===Object}return e}),define("happy/_libs/mout/object/forIn",[],function(){function n(){t=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],e=!0;for(var n in{toString:null})e=!1}function r(r,s,o){var u,a=0;e==null&&n();for(u in r)if(i(s,r,u,o)===!1)break;if(e)while(u=t[a++])if(r[u]!==Object.prototype[u]&&i(s,r,u,o)===!1)break}function i(e,t,n,r){return e.call(r,t[n],n,t)}var e,t;return r}),define("happy/_libs/mout/object/forOwn",["./hasOwn","./forIn"],function(e,t){function n(n,r,i){t(n,function(t,s){if(e(n,s))return r.call(i,n[s],s,n)})}return n}),define("happy/_libs/mout/object/mixIn",["./forOwn"],function(e){function t(t,r){var i=0,s=arguments.length,o;while(++i<s)o=arguments[i],o!=null&&e(o,n,t);return t}function n(e,t){this[t]=e}return t}),define("happy/_libs/mout/lang/clone",["./kindOf","./isPlainObject","../object/mixIn"],function(e,t,n){function r(t){switch(e(t)){case"Object":return i(t);case"Array":return u(t);case"RegExp":return s(t);case"Date":return o(t);default:return t}}function i(e){return t(e)?n({},e):e}function s(e){var t="";return t+=e.multiline?"m":"",t+=e.global?"g":"",t+=e.ignorecase?"i":"",new RegExp(e.source,t)}function o(e){return new Date(+e)}function u(e){return e.slice()}return r}),define("happy/_libs/mout/lang/deepClone",["./clone","../object/forOwn","./kindOf","./isPlainObject"],function(e,t,n,r){function i(t,r){switch(n(t)){case"Object":return s(t,r);case"Array":return o(t,r);default:return e(t)}}function s(e,n){if(r(e)){var s={};return t(e,function(e,t){this[t]=i(e,n)},s),s}return n?n(e):e}function o(e,t){var n=[],r=-1,s=e.length,o;while(++r<s)n[r]=i(e[r],t);return n}return i}),define("happy/_libs/mout/lang/isKind",["./kindOf"],function(e){function t(t,n){return e(t)===n}return t}),define("happy/_libs/mout/lang/isObject",["./isKind"],function(e){function t(t){return e(t,"Object")}return t}),define("happy/_libs/mout/object/merge",["./hasOwn","../lang/deepClone","../lang/isObject"],function(e,t,n){function r(){var i=1,s,o,u,a;a=t(arguments[0]);while(u=arguments[i++])for(s in u){if(!e(u,s))continue;o=u[s],n(o)&&n(a[s])?a[s]=r(a[s],o):a[s]=t(o)}return a}return r}),define("happy/app/Runner",["../utils/DOM","../utils/Vendor","../_libs/mout/object/merge"],function(e,t,n){var r=new t,i=new e,s=r.validateMethod("requestAnimationFrame"),o=r.validateConstructor("MutationObserver"),u=function(e){function y(){l(y);var t=g(),n=t-a;a=t,f=a-u,e.update.apply(e,[n,f]),e.draw.apply(e,[n,f])}var t=this,n=e.container,u,a,f,l;n.tabIndex="1",n.addEventListener("keyup",function(t){e.onKeyUp.apply(e,[t])},!1),n.addEventListener("keydown",function(t){e.onKeyDown.apply(e,[t])},!1),n.addEventListener("mouseover",function(t){e.onMouseOver.apply(e,[t])},!1),n.addEventListener("mouseout",function(t){e.onMouseOut.apply(e,[t])},!1),n.addEventListener("mousedown",function(t){e.onMouseDown.apply(e,[t])},!1),n.addEventListener("mouseup",function(t){e.onMouseUp.apply(e,[t])},!1),n.addEventListener("mousemove",function(t){e.onMouseMove.apply(e,[t])},!1),n.addEventListener("click",function(t){e.onClick.apply(e,[t])},!1),n.addEventListener("dblclick",function(t){e.onDoubleClick.apply(e,[t])},!1);var c=i.measure(n),h=function(){var t=i.measure(n);(t.width!=c.width||t.height!=c.height)&&e.onResize.apply(e,[t]),c=t};window.addEventListener("resize",h,!1),window.addEventListener("scroll",h,!1);if(o){var p=new o(h);p.observe(document.body,{subtree:!0,childList:!0,characterData:!0,attribute:!0})}var d=function(){r.validateMethod("cancelFullScreen",document).apply(document)},v=function(){r.validateMethod("requestFullScreen",n).apply(n,[Element.ALLOW_KEYBOARD_INPUT])},m=!1;e.enterFullscreen=function(){m=!0,v(),n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100%",n.style.minWidth="100%",n.style.minHeight="100%",n.style.maxWidth="100%",n.style.maxHeight="100%"},e.exitFullscreen=function(){m=!1,n.removeAttribute("style"),d()},e.toggleFullscreen=function(){m?e.exitFullscreen():e.enterFullscreen()},e.isFullscreen=function(){return m},e.setFPS=function(e){e<0&&(e=0);switch(e){case"auto":s?l=s:l=function(e){setTimeout(e,1e3/60)};break;case 0:l=function(e){};break;default:l=function(t){setTimeout(t,1e3/e)}}};var g;window.performance&&window.performance.now?g=function(){return window.performance.now()*.001}:window.performance&&window.performance.webkitNow?g=function(){return window.performance.webkitNow()*.001}:g=function(){return(new Date).getTime()*.001},e.setFPS("auto"),e.setup.apply(e),e.onResize.apply(e,[c]),u=g(),a=u,f=0,y()};return u}),require(["App","happy/app/Runner"],function(e,t){var n=new e,r=new t(n)}),define("main",function(){});