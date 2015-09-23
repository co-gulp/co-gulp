 /* ===========================
                              Dom Library
                          ===========================*/
 var Dom = (function() {
     var emptyArray = [],
         concat = emptyArray.concat,
         filter = emptyArray.filter,
         slice = emptyArray.slice,
         document = window.document,
         readyRE = /complete|loaded|interactive/,
         cssNumber = {
             'column-count': 1,
             'columns': 1,
             'font-weight': 1,
             'line-height': 1,
             'opacity': 1,
             'z-index': 1,
             'zoom': 1
         },
         simpleSelectorRE = /^[\w-]*$/,
         isAndroid = (/android/gi).test(navigator.appVersion),
         elementDisplay = {},
         class2type = {},
         classCache = {},
         table = document.createElement('table'),
         tableRow = document.createElement('tr'),
         toString = class2type.toString,
         isArray = Array.isArray ||
         function(object) {
             return object instanceof Array
         };

     function type(obj) {
         return obj == null ? String(obj) :
             class2type[toString.call(obj)] || "object"
     };

     function storage() {
         var ls = window.localStorage;
         if (isAndroid) {
             ls = os.localStorage();
         }
         return ls;
     };

     function isFunction(value) {
         return type(value) == "function"
     };

     function isWindow(obj) {
         return obj != null && obj == obj.window
     };

     function isDocument(obj) {
         return obj != null && obj.nodeType == obj.DOCUMENT_NODE
     };

     function isObject(obj) {
         return type(obj) == "object"
     };

     function flatten(array) {
         return array.length > 0 ? $.fn.concat.apply([], array) : array
     };

     function isPlainObject(obj) {
         return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
     };

     function likeArray(obj) {
         return typeof obj.length == 'number'
     };

     function camelize(str) {
         return str.replace(/-+(.)?/g, function(match, chr) {
             return chr ? chr.toUpperCase() : ''
         })
     };

     function uniq(array) {
         return filter.call(array, function(item, idx) {
             return array.indexOf(item) == idx
         })
     };

     function dasherize(str) {
         return str.replace(/::/g, '/')
             .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
             .replace(/([a-z\d])([A-Z])/g, '$1_$2')
             .replace(/_/g, '-')
             .toLowerCase()
     };

     function maybeAddPx(name, value) {
         return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
     };

     function defaultDisplay(nodeName) {
         var element, display
         if (!elementDisplay[nodeName]) {
             element = document.createElement(nodeName)
             document.body.appendChild(element)
             display = getComputedStyle(element, '').getPropertyValue("display")
             element.parentNode.removeChild(element)
             display == "none" && (display = "block")
             elementDisplay[nodeName] = display
         }
         return elementDisplay[nodeName]
     };

     function setAttribute(node, name, value) {
         value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
     };

     function deserializeValue(value) {
         try {
             return value ?
                 value == "true" ||
                 (value == "false" ? false :
                     value == "null" ? null :
                     +value + "" == value ? +value :
                     /^[\[\{]/.test(value) ? $.parseJSON(value) :
                     value) : value
         } catch (e) {
             return value
         }
     }

     function extend(target, source, deep) {
         for (key in source)
             if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                 if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                     target[key] = {}
                 if (isArray(source[key]) && !isArray(target[key]))
                     target[key] = []
                 extend(target[key], source[key], deep)
             } else if (source[key] !== undefined) target[key] = source[key]
     };

     function qsa(element, selector) {
         var found,
             maybeID = selector[0] == '#',
             maybeClass = !maybeID && selector[0] == '.',
             nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
             isSimple = simpleSelectorRE.test(nameOnly)
         return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
             ((found = element.getElementById(nameOnly)) ? [found] : []) :
             (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
             slice.call(
                 isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
                 maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
                 element.getElementsByTagName(selector) : // Or a tag
                 element.querySelectorAll(selector) // Or it's not simple, and we need to query all
             )
     };

     function matches(element, selector) {
         if (!selector || !element || element.nodeType !== 1) return false
         var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
             element.oMatchesSelector || element.matchesSelector
         if (matchesSelector) return matchesSelector.call(element, selector)
             // fall back to performing a selector:
         var match, parent = element.parentNode,
             temp = !parent
         if (temp)(parent = tempParent).appendChild(element)
         match = ~qsa(parent, selector).indexOf(element)
         temp && tempParent.removeChild(element)
         return match
     };

     var Dom = function(arr) {
         var _this = this,
             i = 0;
         // Create array-like object
         for (i = 0; i < arr.length; i++) {
             _this[i] = arr[i];
         }
         _this.length = arr.length;
         // Return collection with methods
         return this;
     };
     var $ = function(selector, context) {
         var arr = [],
             i = 0;
         if (selector && !context) {
             if (selector instanceof Dom) {
                 return selector;
             }
         }
         if (selector) {
             // String
             if (typeof selector === 'string') {
                 var els, container, html = selector.trim();
                 if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                     var toCreate = 'div';
                     if (html.indexOf('<li') === 0) toCreate = 'ul';
                     if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                     if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                     if (html.indexOf('<tbody') === 0) toCreate = 'table';
                     if (html.indexOf('<option') === 0) toCreate = 'select';
                     container = document.createElement(toCreate);
                     container.innerHTML = '' + html;
                     arr = $.each(slice.call(container.childNodes), function() {
                         container.removeChild(this)
                     })
                 } else {
                     if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                         // Pure ID selector
                         els = [document.getElementById(selector.split('#')[1])];
                     } else {
                         if (context !== undefined) els = $(context).find(selector)
                         else els = document.querySelectorAll(selector);
                         // Other selectors

                     }
                     for (i = 0; i < els.length; i++) {
                         if (els[i]) arr.push(els[i]);
                     }
                 }
             }
             // Node/element
             else if (selector.nodeType || selector === window || selector === document) {
                 arr.push(selector);
             } else if (isFunction(selector)) return $(document).ready(selector)
                 //Array of elements or instance of Dom
             else if (selector.length > 0 && selector[0].nodeType) {
                 for (i = 0; i < selector.length; i++) {
                     arr.push(selector[i]);
                 }
             }
         }
         return new Dom(arr);
     };

     Dom.isD = function(object) {
         return object instanceof Dom
     }

     Dom.prototype = {
         // Classes and attriutes
         addClass: function(className) {
             if (typeof className === 'undefined') {
                 return this;
             }
             var classes = className.split(' ');
             for (var i = 0; i < classes.length; i++) {
                 if (classes[i]) {
                     for (var j = 0; j < this.length; j++) {
                         if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
                     }
                 }
             }
             return this;
         },
         removeClass: function(className) {
             var classes = className.split(' ');
             for (var i = 0; i < classes.length; i++) {
                 if (classes[i]) {
                     for (var j = 0; j < this.length; j++) {
                         if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
                     }
                 }
             }
             return this;
         },
         hasClass: function(className) {
             if (!this[0]) return false;
             else return this[0].classList.contains(className);
         },
         toggleClass: function(className) {
             var classes = className.split(' ');
             for (var i = 0; i < classes.length; i++) {
                 if (classes[i]) {
                     for (var j = 0; j < this.length; j++) {
                         if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
                     }
                 }
             }
             return this;
         },

         ready: function(callback) {
             if (readyRE.test(document.readyState) && document.body) callback($)
             else document.addEventListener('DOMContentLoaded', function() {
                 callback($)
             }, false)
         },
         attr: function(attrs, value) {
             if (arguments.length === 1 && typeof attrs === 'string') {
                 // Get attr
                 if (this[0]) return this[0].getAttribute(attrs);
                 else return undefined;
             } else {
                 // Set attrs
                 for (var i = 0; i < this.length; i++) {
                     if (arguments.length === 2) {
                         // String
                         setAttribute(this[i], attrs, value)
                     } else {
                         // Object
                         for (var attrName in attrs) {
                             this[i][attrName] = attrs[attrName];
                             setAttribute(this[i], attrName, attrs[attrName]);
                         }
                     }
                 }
                 return this;
             }
         },
         removeAttr: function(attr) {
             for (var i = 0; i < this.length; i++) {
                 this[i].removeAttribute(attr);
             }
             return this;
         },
         prop: function(props, value) {
             if (arguments.length === 1 && typeof props === 'string') {
                 // Get prop
                 if (this[0]) return this[0][props];
                 else return undefined;
             } else {
                 // Set props
                 for (var i = 0; i < this.length; i++) {
                     if (arguments.length === 2) {
                         // String
                         this[i][props] = value;
                     } else {
                         // Object
                         for (var propName in props) {
                             this[i][propName] = props[propName];
                         }
                     }
                 }
                 return this;
             }
         },
         val: function(value) {
             if (typeof value === 'undefined') {
                 if (this[0]) return this[0].value;
                 else return undefined;
             } else {
                 for (var i = 0; i < this.length; i++) {
                     this[i].value = value;
                 }
                 return this;
             }
         },
         // Transforms
         transform: function(transform) {
             for (var i = 0; i < this.length; i++) {
                 var elStyle = this[i].style;
                 elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
             }
             return this;
         },
         transition: function(duration) {
             if (typeof duration !== 'string') {
                 duration = duration + 'ms';
             }
             for (var i = 0; i < this.length; i++) {
                 var elStyle = this[i].style;
                 elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
             }
             return this;
         },
         transitionEnd: function(callback) {
             var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                 i, j, dom = this;

             function fireCallBack(e) {
                 /*jshint validthis:true */
                 if (e.target !== this) return;
                 callback.call(this, e);
                 for (i = 0; i < events.length; i++) {
                     dom.off(events[i], fireCallBack);
                 }
             }
             if (callback) {
                 for (i = 0; i < events.length; i++) {
                     dom.on(events[i], fireCallBack);
                 }
             }
             return this;
         },
         animationEnd: function(callback) {
             var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
                 i, j, dom = this;

             function fireCallBack(e) {
                 callback(e);
                 for (i = 0; i < events.length; i++) {
                     dom.off(events[i], fireCallBack);
                 }
             }
             if (callback) {
                 for (i = 0; i < events.length; i++) {
                     dom.on(events[i], fireCallBack);
                 }
             }
             return this;
         },
         outerWidth: function(includeMargins) {
             if (this.length > 0) {
                 if (includeMargins) {
                     var styles = this.styles();
                     return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
                 } else
                     return this[0].offsetWidth;
             } else return null;
         },
         outerHeight: function(includeMargins) {
             if (this.length > 0) {
                 if (includeMargins) {
                     var styles = this.styles();
                     return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
                 } else
                     return this[0].offsetHeight;
             } else return null;
         },
         offset: function() {
             if (this.length > 0) {
                 var el = this[0];
                 var box = el.getBoundingClientRect();
                 var body = document.body;
                 var clientTop = el.clientTop || body.clientTop || 0;
                 var clientLeft = el.clientLeft || body.clientLeft || 0;
                 var scrollTop = window.pageYOffset || el.scrollTop;
                 var scrollLeft = window.pageXOffset || el.scrollLeft;
                 return {
                     top: box.top + scrollTop - clientTop,
                     left: box.left + scrollLeft - clientLeft,
                     width: Math.round(box.width),
                     height: Math.round(box.height)
                 };
             } else {
                 return null;
             }
         },
         hide: function() {
             return this.css("display", "none")
         },
         show: function() {
             return this.each(function() {
                 this.style.display == "none" && (this.style.display = '')
                 if (getComputedStyle(this, '').getPropertyValue("display") == "none")
                     this.style.display = defaultDisplay(this.nodeName)
             })
         },
         styles: function() {
             var i, styles;
             if (this[0]) return window.getComputedStyle(this[0], null);
             else return undefined;
         },
         css: function(property, value) {
             if (arguments.length < 2) {
                 var computedStyle, element = this[0]
                 if (!element) return
                 computedStyle = getComputedStyle(element, '')
                 if (typeof property == 'string')
                     return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
                 else if (isArray(property)) {
                     var props = {}
                     $.each(property, function(_, prop) {
                         props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
                     })
                     return props
                 }
             }

             var css = ''
             if (type(property) == 'string') {
                 if (!value && value !== 0)
                     this.each(function() {
                         this.style.removeProperty(dasherize(property))
                     })
                 else
                     css = dasherize(property) + ":" + maybeAddPx(property, value)
             } else {
                 for (key in property)
                     if (!property[key] && property[key] !== 0)
                         this.each(function() {
                             this.style.removeProperty(dasherize(key))
                         })
                     else
                         css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
             }

             return this.each(function() {
                 this.style.cssText += ';' + css
             })
         },

         //Dom manipulation
         each: function(callback) {
             emptyArray.every.call(this, function(el, idx) {
                 return callback.call(el, idx, el) !== false
             })
             return this
         },
         filter: function(selector) {
             if (isFunction(selector)) return this.not(this.not(selector))
             return $(filter.call(this, function(element) {
                 return matches(element, selector)
             }))
         },
         not: function(selector) {
             var nodes = []
             if (isFunction(selector) && selector.call !== undefined)
                 this.each(function(idx) {
                     if (!selector.call(this, idx)) nodes.push(this)
                 })
             else {
                 var excludes = typeof selector == 'string' ? this.filter(selector) :
                     (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
                 this.forEach(function(el) {
                     if (excludes.indexOf(el) < 0) nodes.push(el)
                 })
             }
             return $(nodes)
         },
         html: function(html) {
             if (typeof html === 'undefined') {
                 return this[0] ? this[0].innerHTML : undefined;
             } else {
                 for (var i = 0; i < this.length; i++) {
                     this[i].innerHTML = html;
                 }
                 return this;
             }
         },
         text: function(text) {
             if (typeof text === 'undefined') {
                 if (this[0]) {
                     return this[0].textContent.trim();
                 } else return null;
             } else {
                 for (var i = 0; i < this.length; i++) {
                     this[i].textContent = text;
                 }
             }
         },
         concat: function() {
             var i, value, args = []
             for (i = 0; i < arguments.length; i++) {
                 value = arguments[i]
                 args[i] = Dom.isD(value) ? value.toArray() : value
             }
             return concat.apply(Dom.isD(this) ? this.toArray() : this, args)
         },
         get: function(idx) {
             return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
         },
         toArray: function() {
             return this.get()
         },
         is: function(selector) {
             if (!this[0] || typeof selector === 'undefined') return false;
             var compareWith, i;
             if (typeof selector === 'string') {
                 var el = this[0];
                 if (el === document) return selector === document;
                 if (el === window) return selector === window;

                 if (el.matches) return el.matches(selector);
                 else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
                 else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
                 else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
                 else {
                     compareWith = $(selector);
                     for (i = 0; i < compareWith.length; i++) {
                         if (compareWith[i] === this[0]) return true;
                     }
                     return false;
                 }
             } else if (selector === document) return this[0] === document;
             else if (selector === window) return this[0] === window;
             else {
                 if (selector.nodeType || selector instanceof Dom) {
                     compareWith = selector.nodeType ? [selector] : selector;
                     for (i = 0; i < compareWith.length; i++) {
                         if (compareWith[i] === this[0]) return true;
                     }
                     return false;
                 }
                 return false;
             }

         },
         indexOf: function(el) {
             for (var i = 0; i < this.length; i++) {
                 if (this[i] === el) return i;
             }
         },
         index: function() {
             if (this[0]) {
                 var child = this[0];
                 var i = 0;
                 while ((child = child.previousSibling) !== null) {
                     if (child.nodeType === 1) i++;
                 }
                 return i;
             } else return undefined;
         },
         eq: function(index) {
             if (typeof index === 'undefined') return this;
             var length = this.length;
             var returnIndex;
             if (index > length - 1) {
                 return new Dom([]);
             }
             if (index < 0) {
                 returnIndex = length + index;
                 if (returnIndex < 0) return new Dom([]);
                 else return new Dom([this[returnIndex]]);
             }
             return new Dom([this[index]]);
         },
         first: function() {
             var el = this[0]
             return el && !isObject(el) ? el : $(el)
         },
         last: function() {
             var el = this[this.length - 1]
             return el && !isObject(el) ? el : $(el)
         },
         append: function(newChild) {
             var i, j;
             for (i = 0; i < this.length; i++) {
                 if (typeof newChild === 'string') {
                     var tempDiv = document.createElement('div');
                     tempDiv.innerHTML = newChild;
                     while (tempDiv.firstChild) {
                         this[i].appendChild(tempDiv.firstChild);
                     }
                 } else if (newChild instanceof Dom) {
                     for (j = 0; j < newChild.length; j++) {
                         this[i].appendChild(newChild[j]);
                     }
                 } else {
                     this[i].appendChild(newChild);
                 }
             }
             return this;
         },
         appendTo: function(target) {
             $(target).append(this);
             return this;
         },
         prepend: function(newChild) {
             var i, j;
             for (i = 0; i < this.length; i++) {
                 if (typeof newChild === 'string') {
                     var tempDiv = document.createElement('div');
                     tempDiv.innerHTML = newChild;
                     for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                         this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                     }
                     // this[i].insertAdjacentHTML('afterbegin', newChild);
                 } else if (newChild instanceof Dom) {
                     for (j = 0; j < newChild.length; j++) {
                         this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                     }
                 } else {
                     this[i].insertBefore(newChild, this[i].childNodes[0]);
                 }
             }
             return this;
         },
         prependTo: function(target) {
             $(target).prepend(this);
             return this;
         },
         insertBefore: function(selector) {
             var before = $(selector);
             for (var i = 0; i < this.length; i++) {
                 if (before.length === 1) {
                     before[0].parentNode.insertBefore(this[i], before[0]);
                 } else if (before.length > 1) {
                     for (var j = 0; j < before.length; j++) {
                         before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                     }
                 }
             }
             return this;
         },
         insertAfter: function(selector) {
             var after = $(selector);
             for (var i = 0; i < this.length; i++) {
                 if (after.length === 1) {
                     after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                 } else if (after.length > 1) {
                     for (var j = 0; j < after.length; j++) {
                         after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                     }
                 }
             }
             return this;
         },
         next: function(selector) {
             if (this.length > 0) {
                 if (selector) {
                     if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom([this[0].nextElementSibling]);
                     else return new Dom([]);
                 } else {
                     if (this[0].nextElementSibling) return new Dom([this[0].nextElementSibling]);
                     else return new Dom([]);
                 }
             } else return new Dom([]);
         },
         nextAll: function(selector) {
             var nextEls = [];
             var el = this[0];
             if (!el) return new Dom([]);
             while (el.nextElementSibling) {
                 var next = el.nextElementSibling;
                 if (selector) {
                     if ($(next).is(selector)) nextEls.push(next);
                 } else nextEls.push(next);
                 el = next;
             }
             return new Dom(nextEls);
         },
         prev: function(selector) {
             if (this.length > 0) {
                 if (selector) {
                     if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom([this[0].previousElementSibling]);
                     else return new Dom([]);
                 } else {
                     if (this[0].previousElementSibling) return new Dom([this[0].previousElementSibling]);
                     else return new Dom([]);
                 }
             } else return new Dom([]);
         },
         prevAll: function(selector) {
             var prevEls = [];
             var el = this[0];
             if (!el) return new Dom([]);
             while (el.previousElementSibling) {
                 var prev = el.previousElementSibling;
                 if (selector) {
                     if ($(prev).is(selector)) prevEls.push(prev);
                 } else prevEls.push(prev);
                 el = prev;
             }
             return new Dom(prevEls);
         },
         wrap: function(structure) {
             var func = isFunction(structure)
             if (this[0] && !func)
                 var dom = $(structure).get(0),
                     clone = dom.parentNode || this.length > 1

             return this.each(function(index) {
                 $(this).wrapAll(
                     func ? structure.call(this, index) :
                     clone ? dom.cloneNode(true) : dom
                 )
             })
         },
         wrapAll: function(structure) {
             if (this[0]) {
                 structure = $(structure);
                 structure.insertBefore($(this[0]))
                 var children
                     // drill down to the inmost element
                 while ((children = structure.children()).length) structure = children.first()
                 $(structure).append(this)
             }
             return this
         },
         parent: function(selector) {
             var parents = [];
             for (var i = 0; i < this.length; i++) {
                 if (selector) {
                     if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                 } else {
                     parents.push(this[i].parentNode);
                 }
             }
             return $($.unique(parents));
         },
         parents: function(selector) {
             var parents = [];
             for (var i = 0; i < this.length; i++) {
                 var parent = this[i].parentNode;
                 while (parent) {
                     if (selector) {
                         if ($(parent).is(selector)) parents.push(parent);
                     } else {
                         parents.push(parent);
                     }
                     parent = parent.parentNode;
                 }
             }
             return $($.unique(parents));
         },
         closest: function(selector, context) {
             var node = this[0],
                 collection = false
             if (typeof selector == 'object') collection = $(selector)
             while (node && !(collection ? collection.indexOf(node) >= 0 : matches(node, selector)))
                 node = node !== context && !isDocument(node) && node.parentNode
             return $(node)
         },
         find: function(selector) {
             var foundElements = [];
             for (var i = 0; i < this.length; i++) {
                 var found = this[i].querySelectorAll(selector);
                 for (var j = 0; j < found.length; j++) {
                     foundElements.push(found[j]);
                 }
             }
             return new Dom(foundElements);
         },
         children: function(selector) {
             var children = [];
             for (var i = 0; i < this.length; i++) {
                 var childNodes = this[i].childNodes;

                 for (var j = 0; j < childNodes.length; j++) {
                     if (!selector) {
                         if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                     } else {
                         if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                     }
                 }
             }
             return new Dom($.unique(children));
         },
         remove: function() {
             for (var i = 0; i < this.length; i++) {
                 if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
             }
             return this;
         },
         empty: function() {
             return this.each(function() {
                 this.innerHTML = ''
             })
         },
         detach: function() {
             return this.remove();
         },
         add: function(selector, context) {
             return $(uniq(this.concat($(selector, context))))
         },
     };

     // Link to prototype
     $.fn = Dom.prototype;

     // Generate the `width` and `height` functions
     ['width', 'height'].forEach(function(dimension) {
         var dimensionProperty =
             dimension.replace(/./, function(m) {
                 return m[0].toUpperCase()
             })

         $.fn[dimension] = function(value) {
             var offset, el = this[0]
             if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
                 isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
                 (offset = this.offset()) && offset[dimension]
             else return this.each(function(idx) {
                 el = $(this)
                 el.css(dimension, value)
             })
         }
     })

     // DOM Library Utilites
     $.type = type
     $.isFunction = isFunction
     $.isWindow = isWindow
     $.isArray = isArray
     $.isPlainObject = isPlainObject
     $.camelCase = camelize
     $.deserializeValue = deserializeValue
     if (window.JSON) $.parseJSON = JSON.parse
     $.parseUrlQuery = function(url) {
         var query = {},
             i, params, param;
         if (url.indexOf('?') >= 0) url = url.split('?')[1];
         else return query;
         params = url.split('&');
         for (i = 0; i < params.length; i++) {
             param = params[i].split('=');
             query[param[0]] = param[1];
         }
         return query;
     };
     $.map = function(elements, callback) {
         var value, values = [],
             i, key
         if (likeArray(elements))
             for (i = 0; i < elements.length; i++) {
                 value = callback(elements[i], i)
                 if (value != null) values.push(value)
             } else
                 for (key in elements) {
                     value = callback(elements[key], key)
                     if (value != null) values.push(value)
                 }
         return flatten(values)
     }
     $.isArray = function(arr) {
         if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
         else return false;
     };
     $.each = function(elements, callback) {
             var i, key
             if (likeArray(elements)) {
                 for (i = 0; i < elements.length; i++)
                     if (callback.call(elements[i], i, elements[i]) === false) return elements
             } else {
                 for (key in elements)
                     if (callback.call(elements[key], key, elements[key]) === false) return elements
             }

             return elements
         }
         // Populate the class2type map
     $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
             class2type["[object " + name + "]"] = name.toLowerCase()
         })
         // Copy all but undefined properties from one or more
         // objects to the `target` object.
     $.extend = function(target) {
         var deep, args = slice.call(arguments, 1)
         if (typeof target == 'boolean') {
             deep = target
             target = args.shift()
         }
         args.forEach(function(arg) {
             extend(target, arg, deep)
         })
         return target
     };
     $.trim = function(str) {
         return str == null ? "" : String.prototype.trim.call(str)
     };
     $.trimLeft = function(str) {
         return str == null ? "" : String.prototype.trimLeft.call(str)
     };
     $.trimRight = function(str) {
         return str == null ? "" : String.prototype.trimRight.call(str)
     };
     $.trimAll = function(str) {
         return str == null ? "" : str.replace(/\s*/g, '');
     };
     $.contains = document.documentElement.contains ?
         function(parent, node) {
             return parent !== node && parent.contains(node)
         } :
         function(parent, node) {
             while (node && (node = node.parentNode))
                 if (node === parent) return true
             return false
         };
     $.unique = function(arr) {
         var unique = [];
         for (var i = 0; i < arr.length; i++) {
             if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
         }
         return unique;
     };
     $.serializeObject = function(obj) {
         if (typeof obj === 'string') return obj;
         var resultArray = [];
         var separator = '&';
         for (var prop in obj) {
             if (obj.hasOwnProperty(prop)) {
                 if ($.isArray(obj[prop])) {
                     var toPush = [];
                     for (var i = 0; i < obj[prop].length; i++) {
                         toPush.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop][i]));
                     }
                     if (toPush.length > 0) resultArray.push(toPush.join(separator));
                 } else {
                     // Should be string
                     resultArray.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
                 }
             }

         }

         return resultArray.join(separator);
     };
     $.getTranslate = function(el, axis) {
         var matrix, curTransform, curStyle, transformMatrix;

         // automatic axis detection
         if (typeof axis === 'undefined') {
             axis = 'x';
         }

         curStyle = window.getComputedStyle(el, null);
         if (window.WebKitCSSMatrix) {
             // Some old versions of Webkit choke when 'none' is passed; pass
             // empty string instead in this case
             transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
         } else {
             transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
             matrix = transformMatrix.toString().split(',');
         }

         if (axis === 'x') {
             //Latest Chrome and webkits Fix
             if (window.WebKitCSSMatrix)
                 curTransform = transformMatrix.m41;
             //Crazy IE10 Matrix
             else if (matrix.length === 16)
                 curTransform = parseFloat(matrix[12]);
             //Normal Browsers
             else
                 curTransform = parseFloat(matrix[4]);
         }
         if (axis === 'y') {
             //Latest Chrome and webkits Fix
             if (window.WebKitCSSMatrix)
                 curTransform = transformMatrix.m42;
             //Crazy IE10 Matrix
             else if (matrix.length === 16)
                 curTransform = parseFloat(matrix[13]);
             //Normal Browsers
             else
                 curTransform = parseFloat(matrix[5]);
         }

         return curTransform || 0;
     };

     $.requestAnimationFrame = function(callback) {
         if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
         else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
         else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
         else {
             return window.setTimeout(callback, 1000 / 60);
         }
     };
     $.cancelAnimationFrame = function(id) {
         if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
         else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
         else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
         else {
             return window.clearTimeout(id);
         }
     };
     $.supportTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);



     // Plugins
     $.fn.scrollTo = function(left, top, duration, easing, callback) {
         if (arguments.length === 4 && typeof easing === 'function') {
             callback = easing;
             easing = undefined;
         }
         return this.each(function() {
             var el = this;
             var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
             var animateTop = top > 0 || top === 0;
             var animateLeft = left > 0 || left === 0;
             if (typeof easing === 'undefined') {
                 easing = 'swing';
             }
             if (animateTop) {
                 currentTop = el.scrollTop;
                 if (!duration) {
                     el.scrollTop = top;
                 }
             }
             if (animateLeft) {
                 currentLeft = el.scrollLeft;
                 if (!duration) {
                     el.scrollLeft = left;
                 }
             }
             if (!duration) return;
             if (animateTop) {
                 maxTop = el.scrollHeight - el.offsetHeight;
                 newTop = Math.max(Math.min(top, maxTop), 0);
             }
             if (animateLeft) {
                 maxLeft = el.scrollWidth - el.offsetWidth;
                 newLeft = Math.max(Math.min(left, maxLeft), 0);
             }
             var startTime = null;
             if (animateTop && newTop === currentTop) animateTop = false;
             if (animateLeft && newLeft === currentLeft) animateLeft = false;

             function render(time) {
                 if (time === undefined) {
                     time = new Date().getTime();
                 }
                 if (startTime === null) {
                     startTime = time;
                 }
                 var doneLeft, doneTop, done;
                 var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
                 var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos(progress * Math.PI) / 2);
                 if (animateTop) scrollTop = currentTop + (easeProgress * (newTop - currentTop));
                 if (animateLeft) scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
                 if (animateTop && newTop > currentTop && scrollTop >= newTop) {
                     el.scrollTop = newTop;
                     done = true;
                 }
                 if (animateTop && newTop < currentTop && scrollTop <= newTop) {
                     el.scrollTop = newTop;
                     done = true;
                 }

                 if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft) {
                     el.scrollLeft = newLeft;
                     done = true;
                 }
                 if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft) {
                     el.scrollLeft = newLeft;
                     done = true;
                 }

                 if (done) {
                     if (callback) callback();
                     return;
                 }
                 if (animateTop) el.scrollTop = scrollTop;
                 if (animateLeft) el.scrollLeft = scrollLeft;
                 $.requestAnimationFrame(render);
             }
             $.requestAnimationFrame(render);
         });
     };
     $.fn.scrollTop = function(top, duration, easing, callback) {
         if (arguments.length === 3 && typeof easing === 'function') {
             callback = easing;
             easing = undefined;
         }
         var dom = this;
         if (typeof top === 'undefined') {
             if (dom.length > 0) return dom[0].scrollTop;
             else return null;
         }
         return dom.scrollTo(undefined, top, duration, easing, callback);
     };
     $.fn.scrollLeft = function(left, duration, easing, callback) {
         if (arguments.length === 3 && typeof easing === 'function') {
             callback = easing;
             easing = undefined;
         }
         var dom = this;
         if (typeof left === 'undefined') {
             if (dom.length > 0) return dom[0].scrollLeft;
             else return null;
         }
         return dom.scrollTo(left, undefined, duration, easing, callback);
     };

     return $;
 })();

 // Export to Window
 window.Dom = Dom;
 window.$ === undefined && (window.$ = Dom);

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Dom)

;
(function($) {
  var jsonpID = 0,
    document = window.document,
    key,
    name,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = 'application/json',
    htmlType = 'text/html',
    blankRE = /^\s*$/,
    originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }

  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
      triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }

  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context,
      status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred) {
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = {
        abort: abort
      },
      abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType) {
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function() {
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function() {
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function() {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json: jsonType,
      xml: 'application/xml, text/xml',
      html: htmlType,
      text: 'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && (mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml') || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options) {
    var settings = $.extend({}, options || {}),
      deferred = $.Deferred && $.Deferred(),
      urlAnchor, hashIndex
    for (key in $.ajaxSettings)
      if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
        // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
    serializeData(settings)

    var dataType = settings.dataType,
      hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
        (!options || options.cache !== true) &&
        ('script' == dataType || 'jsonp' == dataType)
      ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
      headers = {},
      setHeader = function(name, value) {
        headers[name.toLowerCase()] = [name, value]
      },
      protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
      xhr = settings.xhr(),
      nativeSetHeader = xhr.setRequestHeader,
      abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers)
      for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')(1, eval)(result)
            else if (dataType == 'xml') result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) {
            error = e
          }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields)
      for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, settings, deferred)
    }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url,
      data: data,
      success: success,
      dataType: dataType
    }
  }

  $.get = function( /* url, data, success, dataType */ ) {
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function( /* url, data, success, dataType */ ) {
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function( /* url, data, success */ ) {
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success) {
    if (!this.length) return this
    var self = this,
      parts = url.split(/\s/),
      selector,
      options = parseArguments(url, data, success),
      callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response) {
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector) : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope) {
    var type, array = $.isArray(obj),
      hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
        // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
        // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional) {
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Dom)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($, undefined){
  var prefix = '', eventPrefix,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
    testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay    = prefix + 'transition-delay'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationDelay     = prefix + 'animation-delay'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback, delay){
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function(properties, duration, ease, callback, delay){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0){
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      setTimeout(function(){
        if (fired) return
        wrappedCallback.call(that)
      }, ((duration + delay) * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Dom)

//  fx
;(function($, undefined){
  var document = window.document, docElem = document.documentElement,
    origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

  function anim(el, speed, opacity, scale, callback) {
    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
    var props = { opacity: opacity }
    if (scale) {
      props.scale = scale
      el.css($.fx.cssPrefix + 'transform-origin', '0 0')
    }
    return el.animate(props, speed, null, callback)
  }

  function hide(el, speed, scale, callback) {
    return anim(el, speed, 0, scale, function(){
      origHide.call($(this))
      callback && callback.call(this)
    })
  }

  $.fn.show = function(speed, callback) {
    origShow.call(this)
    if (speed === undefined) speed = 0
    else this.css('opacity', 0)
    return anim(this, speed, 1, '1,1', callback)
  }

  $.fn.hide = function(speed, callback) {
    if (speed === undefined) return origHide.call(this)
    else return hide(this, speed, '0,0', callback)
  }

  $.fn.toggle = function(speed, callback) {
    if (speed === undefined || typeof speed == 'boolean')
      return origToggle.call(this, speed)
    else return this.each(function(){
      var el = $(this)
      el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
    })
  }

  $.fn.fadeTo = function(speed, opacity, callback) {
    return anim(this, speed, opacity, null, callback)
  }

  $.fn.fadeIn = function(speed, callback) {
    var target = this.css('opacity')
    if (target > 0) this.css('opacity', 0)
    else target = 1
    return origShow.call(this).fadeTo(speed, target, callback)
  }

  $.fn.fadeOut = function(speed, callback) {
    return hide(this, speed, null, callback)
  }

  $.fn.fadeToggle = function(speed, callback) {
    return this.each(function(){
      var el = $(this)
      el[
        (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
      ](speed, callback)
    })
  }

})(Dom)



;(function($){
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key]
      })
    })
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName]
    $.fn[methodName] = function() {
      var elements = this.find('*')
      if (methodName === 'remove') elements = elements.add(this)
      elements.removeData()
      return origFn.call(this)
    }
  })
})(Dom)

/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import zepto.js
 */
;(function( $ ) {
    var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时

    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );

        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     * 
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );

            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                    .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                        this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
})( Dom );



;(function($){
  function detect(ua, platform){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
      android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      osx = !!ua.match(/\(Macintosh\; Intel /),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      win = /Win\d{2}|Windows/.test(platform),
      wp = ua.match(/Windows Phone ([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
      ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
      webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
      safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios || win)) {
      browser.safari = true
      if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
      (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
      (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent, navigator.platform)
  // make available to unit tests
  $.__detect = detect

})(Dom)



;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
        }
      })
      .on('touchstart MSPointerDown pointerdown', function(e){
        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Dom);

/**
 * @file 媒体查询
 */

;(function ($) {

    /**
     * 是原生的window.matchMedia方法的polyfill，对于不支持matchMedia的方法系统和浏览器，按照[w3c window.matchMedia](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)的接口
     * 定义，对matchMedia方法进行了封装。原理是用css media query及transitionEnd事件来完成的。在页面中插入media query样式及元素，当query条件满足时改变该元素样式，同时这个样式是transition作用的属性，
     * 满足条件后即会触发transitionEnd，由此创建MediaQueryList的事件监听。由于transition的duration time为0.001ms，故若直接使用MediaQueryList对象的matches去判断当前是否与query匹配，会有部分延迟，
     * 建议注册addListener的方式去监听query的改变。$.matchMedia的详细实现原理及采用该方法实现的转屏统一解决方案详见
     *
     * 返回值MediaQueryList对象包含的属性<br />
     * - ***matches*** 是否满足query<br />
     * - ***query*** 查询的css query，类似\'screen and (orientation: portrait)\'<br />
     * - ***addListener*** 添加MediaQueryList对象监听器，接收回调函数，回调参数为MediaQueryList对象<br />
     * - ***removeListener*** 移除MediaQueryList对象监听器<br />
     *
     *
     * @method $.matchMedia
     * @grammar $.matchMedia(query)  ⇒ MediaQueryList
     * @param {String} query 查询的css query，类似\'screen and (orientation: portrait)\'
     * @return {Object} MediaQueryList
     * @example
     * $.matchMedia('screen and (orientation: portrait)').addListener(fn);
     */
    $.matchMedia = (function() {
        var mediaId = 0,
            cls = 'media-detect',
            transitionEnd = $.fx.transitionEnd,
            cssPrefix = $.fx.cssPrefix,
            $style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; clip: rect(1px, 1px, 1px, 1px);}\n').appendTo('head');

        return function (query) {
            var id = cls + mediaId++,
                $mediaElem,
                listeners = [],
                ret;

            $style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n') ;   //原生matchMedia也需要添加对应的@media才能生效

            // 统一用模拟的，时机更好。
            // if ('matchMedia' in window) {
            //     return window.matchMedia(query);
            // }

            $mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>')
                .appendTo('body')
                .on(transitionEnd, function() {
                    ret.matches = $mediaElem.width() === 1;
                    $.each(listeners, function (i,fn) {
                        $.isFunction(fn) && fn.call(ret, ret);
                    });
                });

            ret = {
                matches: $mediaElem.width() === 1 ,
                media: query,
                addListener: function (callback) {
                    listeners.push(callback);
                    return this;
                },
                removeListener: function (callback) {
                    var index = listeners.indexOf(callback);
                    ~index && listeners.splice(index, 1);
                    return this;
                }
            };

            return ret;
        };
    }());
})(Dom);
/*===============================================================================
************   $ extend   ************
===============================================================================*/
        (function($){
            $.animationFrame = function(cb) {
                var args, isQueued, context;
                return function() {
                    args = arguments;
                    context = this;
                    if (!isQueued) {
                        isQueued = true;
                        requestAnimationFrame(function() {
                            cb.apply(context, args);
                            isQueued = false;
                        });
                    }
                };
            };
            $.cellPhone = function(v) {
                var cellphone = /^1[3|4|5|8][0-9]\d{8}$/; 
                return cellphone.test(v);
            };

        }($));
/*===============================================================================
************   $ extend end  ************
===============================================================================*/        

$(function () {
    /**
     * @name ortchange
     * @desc 扩展转屏事件orientation，解决原生转屏事件的兼容性问题
     * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备，利用css media query实现，解决了转屏延时及orientation事件的兼容性问题
     * $(window).on('ortchange', function () {        //当转屏的时候触发
     *     console.log('ortchange');
     * });
     */
    //扩展常用media query
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    //通过matchMedia派生转屏事件
    $.matchMedia($.mediaQuery.ortchange).addListener(function () {
        $(window).trigger('ortchange');
    });
});