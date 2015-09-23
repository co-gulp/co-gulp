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