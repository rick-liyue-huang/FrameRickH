/*
	add init constructed function on frame.
*/

(function(w) {


	var version = '1.0.0';

	/*
	**********************************
	factory function
	************************************
	*/

	function RickH(selector) {
		return new RickH.fn.init(selector);
	}

	/*
	****************************
	replace prototype of RickH
	****************************8
	*/

	RickH.fn = RickH.prototype = {

		constructor: RickH,

		/*
		***********************************
		1.RickH: version, means version number
		2.selector: '', means stance is RickH type,
		3.length: 0, means default instance length,
		4.toArray: transfer instance to array,
		5.get: get the indexed original dom element
		6.each: go through RickH instance
		7.map: go through instance, and transfer to callback , and collect the return value and get array.
		8.slice:slice parts of instance and get the new RickH instance.
		9. first: get the first RickH instance element
		10.last:get the last element of RickH instance
		11.eq: get the indexed RickH instance object
		12.push: add new element on RickH instance
		13. sort: sort the RickH instance
		14.splice: add, remove or replace the RickH instance 

		************************************
			
		*/
		// 1.RickH: version, means version number
		rickh: version,
		// 2.selector: '', means stance is RickH type,
		selector: '',

		// 3.length: 0, means default instance length,
		length: 0,

		// 4.toArray: transfer instance to array,
		toArray: function() {
			return [].slice.call(this);
		},

		// 5.get: get the indexed original dom element
		get: function(index) {
			// if null or undefined, will return
			if (index == null) {
				// return array
				return this.toArray();
			}
			// if > 0, return indexed element
			if (index >= 0) {
				return this[index];
			}
			// if < 0, return indexed eleemnt from end
			else {
				return this[this.length + index];
			}

		},

		_get: function(index) {
			return index == null ?
				this.toArray() :
				index >= 0 ?
				this[index] :
				this[this.length + index];
		},

		// 6.each: go through RickH instance
		each: function(callback) {
			return RickH.each(this, callback);
		},

		// 7.map: go through instance, and transfer to callback , and collect the return value and get array.
		map: function(callback) {

			return RickH.map(this, callback);
		},

		// 8.slice:slice parts of instance and get the new RickH instance.
		slice: function() {
			// through array slice method to get new array, and then transfer to RickH instance

			// because slice arguments are changable, so use 'arguments', we need to transfer each item of 'arguments' to 'nodes'
			var nodes = [].slice.apply(this, arguments);

			// get the RickH instance
			return RickH(nodes);
		},

		// 9.eq: get the indexed RickH instance object
		eq: function(index) {
			// if null or undefined return new instance, if > 0 return new indexed instance, if < 0, return new indexed instance from end.
			if (index == null) {
				return RickH();
			}

			if (index >= 0) {
				return RickH(this[index]);
			} else {
				return RickH(this[this.length + index]);
			}

		},

		_eq: function(index) {
			return index == null ?
				RickH() :
				RickH(this.get(index));
		},

		// 10.first: get the first RickH instance element
		first: function() {
			return this.eq(0);
		},

		// 11.last:get the last element of RickH instance
		last: function() {
			return this.eq(-1);
		},

		// 12.push: add new element on RickH instance
		push: [].push,

		// 13. sort: sort the RickH instance
		sort: [].sort,

		// 14.splice: add, remove or replace the RickH instance 
		splice: [].splice
	};


	/*
		*******************************
		add extend method
		*********************************
	*/
	// by mix-in inheritance
	/*RickH.extend = RickH.prototype.extend = function(obj) {
		for (var key in obj) {
			this[key] = obj[key];
		}
	}*/

	// improve 'extend' method
	RickH.extend = RickH.fn.extend = function() {

		/*
			1. if has one argument, directly mix in
			2. if has more than one arguments, mix object 
		*/

		// the mixed-in target
		var target = arguments[0];

		if (arguments.length === 1) {

			target = this;

			for (var key in arguments[0]) {
				this[key] = arguments[0][key];
			}

		} else if (arguments.length >= 2) {
			// traverse all object from second index
			for (var i = 1, len = arguments.length; i < len; i++) {

				// max the other object in the first one
				for (var key in arguments[i]) {
					target[key] = arguments[i][key];
				}
			}
		}

		return target;
	}

	/*
	*************************************
		add static methods on RickH
	**************************************
	*/
	RickH.extend({



		/*

		*********************************************
		 ADD static methods on RickH !!!!!
		***********************************************
		*/


		isString: function(str) {
			if (typeof str === 'string') {
				return true;
			}
			return false;
		},


		_isString: function(str) {
			return typeof str == 'string';
		},


		trim: function(str) {

			// if not string, return original one
			if (!str) {
				return str;
			}

			// use the original function
			if (str.trim) {
				return str.trim();
			}

			// self-defined method
			return str.replace(/^\s+|\s+$/g, '');

		},

		// html fragment confirmation
		/*
			isHtml : function(html) {
				if(!html) {
					return false;
				}

				// < >
				if(html.charAt(0) === '<' && html.charAt(html.length - 1) === '>' && html.length >= 3) {
					return true;
				}

				return false;
			},
		*/

		_isHtml: function(html) {
			return !!html && html.charAt(0) === '<' && html.charAt(html.length - 1) === '>' && html.length >= 3;
		},
		/*
			isFunction(fn) : {
				if(typeof fn === 'function') {
					return true;
				}
				return false;
			},
		*/
		_isFunction: function(fn) {
			return typeof fn === 'function';
		},

		// window confirmation

		/*
			isWindow : function(w) {

				if (!w) {
					return false;
				}

				if(w.window === w) {
					return true;
				}
				return false;
			},
		*/
		_isWindow: function(w) {
			return !!w && w.window === w;
		},

		// confirm object
		isObject: function(obj) {

			// avoid null is object to affect typeof
			if (obj === null) {
				return false;
			}

			if (typeof obj === 'object' || typeof obj === 'function') {
				return true;
			}
			return false;
		},

		// array confirmation
		isLikeArray: function(arr) {

			// Function, Window, !Object
			if (RickH._isFunction(arr) || RickH._isWindow(arr) || !RickH.isObject(arr)) {
				return false;
			}

			// confirm is true array 
			if (({}).toString.call(arr) === '[object Array]') {
				return true;
			}

			// or pseudo array
			if ('length' in arr && (arr.length === 0 || arr.length - 1 in arr)) {
				return true;
			}

			return false;
		},

		ready: function(fn) {

			//  
			/*
				confirm DOMContentLoaded firstly,
				through document.readyState === 'complete'
				if true, fn can invoke 
				if is false, will confirm 
				suport addEventListener
				if support, use DOMContentLoaded event

				if no support, use attachEvent bind 'onreadystatechange'
				note: need apply in 'document.readyState === 'complete' {}, 


			*/

			// DOM analys finish
			if (document.readyState === 'complete') {
				fn();
			}
			// if DOM analyze no finish, will confirm addEventListener
			else if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', fn);
			} else {

				// ie8
				document.attachEvent('onreadystatechange', function() {

					// avoid invoke too many times.
					if (document.readyState === 'complete') {
						fn();
					}
				})
			}
		},

		// go through object or array
		each: function(obj, callback) {
			/*

				1. confirm its array or pseudo array
				if not use 'for in'
				transfer each key and value to callback
			*/
			var i, len, key;

			if (RickH.isLikeArray(obj)) {
				for (i = 0, len = obj.length; i < len; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (key in obj) {
					if (callback.call(obj[key], key, obj[key]) === false) {
						break;
					}
				}
			}

		},

		map: function(obj, callback) {

			var i, len, key, result = [];

			if ('length' in obj) {
				for (i = 0, len = obj.length; i < len; i++) {
					result.push(callback.call(obj[i], obj[i], i));
				}
			} else {
				for (key in obj) {
					result.push(callback.call(obj[key], obj[key], key));
				}
			}

			return result;
		}

	});


	/*
		***********************************
		the true constructor
		**************************************
	*/
	var init = RickH.fn.init = function(selector) {

		// null undefined, '', 0, NaN
		if (!selector) {
			return this;
		}

		// selector is function ---- page onload function
		if (RickH._isFunction(selector)) {
			RickH.ready(selector);
		}


		// string
		if (RickH._isString(selector)) {

			// trim the string firstly
			selector = RickH.trim(selector);

			// html or selector
			if (RickH._isHtml(selector)) {

				// create tempt div to contain the pseudo array
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = selector;

				[].push.apply(this, tempDiv.childNodes);
				// also cannot write return this, by default new method.
				return this;

			} else {

				try {

					var nodes = document.querySelectorAll(selector);
					[].push.apply(this, nodes);
					return this;
				} catch (e) {
					// if get error
					this.length = 0;
					return this;
				}
			}
		}
		// pseudo array or array
		// array or isLikeArray
		else if (RickH.isLikeArray(selector)) {
			// through 'slice' method, change pseudo array to true array. for IE8
			[].push.apply(this, [].slice.call(selector));
			return this;

		}
		// other type
		else {

			/*[].push.call(this, selector);
			return this;*/
			// or
			this[0] = selector;
			this.length = 1;
			return this;
		}

	};



	/*
		******************************
		replace init prototype to factory prototype, so that others can create instance by RickH.
		*************************************************

	*/
	init.prototype = RickH.fn;


	/*
	**************************
	expose the factory to outside
	**********************************8
	*/
	w.RickH = w.RH = RickH;

}(window));