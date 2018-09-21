RH.extend({

	// get the style in different browsers
	getStyle: function(dom, style) {

		// prioritily confirm new browsers
		if (window.getComputedStyle) {

			return window.getComputedStyle(dom)[style];
		} else {
			// IE8
			return dom.currentStyle[style];
		}
	}
});

RH.fn.extend({


	/*
		1. addClass: add class to all elem
		2. removeClass: remove class to all elem
		3. hasClass: confirm whether one has class
		4. toggleClass: !operation
		5. attr: 'set' or 'get' elem attribute node
		6. prop: 'set' or 'get' elem property value.
		7. val: 'get' or 'set' 'value' property
		8. css 'get' or 'set' css style
	*/

	/*
		hasClass method
		1. traverse all elems
		2. get all elem of className, add ' ' on both ends
		3.use indexOf method return true or false

	*/
	hasClass: function(className) {

		for (var i = 0, len = this.length; i < len; i++) {
			// only if has one, return true
			if ((' ' + this[i].className + ' ').indexOf(' ' + className + ' ') > -1) {
				return true;
			}
		}

		return false;
	},

	_hasClass: function(className) {

		var has = false;

		this.each(function() {
			if ((' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1) {
				has = true;
			}
		});
		return has;
	},

	/*
		1. add clas to all elems
		2. if had, ignore it.
		3. add different class by ' ' space
		4. return this.
	*/
	addClass: function(className) {

		this.each(function() {
			// confirm it has named className or not
			if (!RickH(this).hasClass(className)) {
				this.className += ' ' + className;
			}
		});

		return this;
	},

	_addClass: function(classNames) {

		// support more than one classnames
		// 1. 'split' the classnames to single classname
		// 2. outer traverse the 'this' elems
		// 3. inner traverse the classnames 
		// 4. the rest is same as 'addClass()' method

		// transfer string to array
		classNames = RickH.trim(classNames).split(' ');

		// traverse all 'this' elems
		this.each(function() {

			// here 'this' is original DOM elem, so need to encapsulte.
			var RHself = RickH(this);

			// traverse classnames array
			RickH.each(classNames, function(k, val) {

				// if has the pointed classname, will addClass
				if (!RHself.hasClass(val)) {
					// RHself[0] is the original DOM elem.
					RHself[0].className += ' ' + val;
				};
			});
		});
		return this;
	},

	/*
		if no arguments, remove all class
		otherwise remove pointed class
	*/
	removeClass: function(className) {

		if (arguments.length === 0) {
			this.each(function() {
				this.className = '';
			});

		} else {

			// ' a b c d ' => ' a b c '
			this.each(function() {
				this.className = (' ' + this.className + ' ').replace(' ' + className + ' ', ' ');
			});
		}

		return this;
	},

	_removeClass: function(classNames) {

		// support more than one classnames
		// 1. if has not arguments, remove all classname on all 'this' elems,
		// 2. if has arguments, remove the ' ' space on both ends, and 'split' the classnames to single classname
		// 3. outer traverse the 'this' elems
		// 4. inner traverse the classnames 
		// 5. the rest is same as 'removeClass()' method

		// if has no arguments, remove all classname on all DOM elems
		if (arguments.length === 0) {
			this.each(function() {
				this.className = '';
			});
		} else {
			// transfer 'string' to array
			classNames = RickH.trim(classNames).split(' ');

			// outer traverse this elem
			this.each(function() {
				var self = this;
				// inner traverse classnames 
				RickH.each(classNames, function(k, val) {

					// remove 'val' classname
					// self.className = (' ' + self.className + ' ').replace(' ' + val + ' ', ' ');
					var reg = new RegExp('\\b' + val + '\\b');
					self.className = self.className.replace(reg, ' ')
				});
			});

			return this;
		}


	},

	/*
		if has remove, otherwise add, use addClass and removeClass
	*/
	toggleClass: function(className) {

		this.each(function() {

			var RHthis = RickH(this);

			if (RHthis.hasClass(className)) {
				RHthis.removeClass(className);
			} else {
				RHthis.addClass(className);
			}

		});

		return this;
	},

	_toggleClass: function(classNames) {
		/*
			1. if has arguments, remove the ' ' space on both end, and then 'split' the classnames
			2. outer traverse 'this' elems
			3. inner traverse classnames
			4. the rest are same as 'toggleClass()' method
		*/

		classNames = RickH.trim(classNames).split(' ');

		this.each(function() {

			var RHself = RickH(this);
			RickH.each(classNames, function(key, val) {

				if (RHself.hasClass(val)) {
					RHself.removeClass(val);

				} else {
					RHself.addClass(val);
				}
			});
		});
		return this;
	},

	/*
		attr method.

		process:
		1.confirm attr is string or object, if not will return this
		2. if is string type, will confirm argument length, if length is 1, will get the first element and return,
		3. if arguments.length == 2, will traverse all elements and set the attribute value.
		4.if is object, will traverse all elements and set attribute value.
		5. return this.
	*/

	attr: function(attr, val) {
		if (!RickH._isString(attr) && !RickH.isObject(attr)) {
			return this;
		}

		if (RickH._isString(attr)) {

			// get attribute value of first elem
			if (arguments.length === 1) {

				return this.get(0).getAttribute(attr);

			} else {
				// set all elem attribute
				for (var i = 0, len = this.length; i < len; i++) {
					this[i].setAttribute(attr, val);
				}

			}
			// attr is object type, set all elem attribute
		} else {

			// traverse all attr object 
			for (var key in attr) {

				// traverse all elem
				for (var i = 0, len = this.length; i < len; i++) {

					this[i].setAttribute(key, attr[key]);
				}
			}
		}
		// chain programming.
		return this;
	},

	_attr: function(attr, val) {

		/*
			1. confirm arguments.length == 1, if attr is string, get the first elem, else if attr is object type, set all elem attribute value as obj[key].
			2. arguments.length >= 2, set all elem attribute value as val.
		*/

		var self = this;

		if (arguments.length === 1) {

			if (RickH._isString(attr)) {

				return this[0].getAttribute(attr);

			} else if (RickH.isObject(attr)) {
				// use RickH static each method to traverse attr object
				RickH.each(attr, function(key, val) {
					//  notice 'self'
					self.each(function() {
						this.setAttribute(key, val);
					});
				});
			}

		} else if (arguments.length >= 2) {

			this.each(function() {
				this.setAttribute(attr, val);
			});

		}
		return this;
	},

	prop: function(attr, val) {

		// same as attr method
		if (!RickH._isString(attr) && !RickH.isObject(attr)) {
			return this;
		}

		// string type
		if (RickH._isString(attr)) {
			if (arguments.length === 1) {
				// only '[]' or '.'
				return this[0][attr];

			} else {
				for (var i = 0, len = this.length; i < len; i++) {

					this[i][attr] = val;
				}
			}

		} else {

			// object type
			for (var key in attr) {
				for (var i = 0, len = this.length; i < len; i++) {
					this[i][key] = attr[key];
				}
			}
		}

		return this;
	},

	_prop: function(prop, value) {

		if (arguments.length === 1) {

			if (RickH._isString(prop)) {
				return this[0][prop];
			} else if (RickH.isObject(prop)) {

				var self = this;
				RickH.each(prop, function(key, val) {
					self.each(function() {

						this[key] = val;
					});
				});
			}

		} else if (arguments.length >= 2) {

			this.each(function() {
				this[prop] = value;
			});
		}

		return this;
	},

	// same as attr
	// but should note: getComputedStyle(div).height
	// or currentStyle (IE8)
	// import getStyle() method

	css: function(styleName, style) {


		/*

			1. if arguments.length === 1
			2. confirm styleName is string, if yes get the first elem
			3.confirm styleName is object , if yes set all elem
			4.if arguments.length >= 2, set all elem 
			5. return this
		*/

		if (arguments.length === 1) {

			if (RickH._isString(styleName)) {

				// use encapsulated static method
				return RickH.getStyle(this[0], styleName);
			} else if (RickH.isObject(styleName)) {

				for (var key in styleName) {

					for (var i = 0, len = this.length; i < len; i++) {

						// set all elems
						this[i]['style'][key] = styleName[key];
					}
				}
			}

		} else {

			for (var i = 0, len = this.length; i < len; i++) {

				// set all elems
				this[i]['style'][styleName] = style;
			}
		}

		return this;
	},

	_css: function(styleName, style) {

		if (arguments.length === 1) {

			if (RickH._isString(styleName)) {

				return RickH.getStyle(this[0], styleName);
			} else if (RickH.isObject(styleName)) {

				var self = this;
				RickH.each(styleName, function(key, val) {
					self.each(function() {
						this['style'][key] = val;
					});
				});
			}

		} else if (arguments.length >= 2) {

			this.each(function() {
				this['style'][styleName] = style;
			});
		}

		return this;
	},

	/*

		1. if arguments.length === 0, return the first element 'value' value,
		2. otherwise, traverse all elems and set 'value'.
	*/
	val: function(value) {

		// if no arguments,
		if (arguments.length === 0) {
			return this[0].value;

		} else {
			// has value arguments
			for (var i = 0, len = this.length; i < len; i++) {
				this[i].value = value;
			}
		}

		return this;
	},

	_val: function(value) {

		if (arguments.length === 0) {
			// return this[0].value;
			return this.prop('value');

		} else {

			// this.each(function() {
			// 	this.value = value;
			// });
			return this.prop('value', value);
		}

		// return this;
	}



});