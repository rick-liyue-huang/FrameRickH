// add DOM method on prototype extend, so init instance(RickH instance) can use them.
RH.fn.extend({

	/*
	1.empty: clear all elements content
	2.remove: remove all eleemnts
	3.html: set all element content, or get the first element 
	4. text: set all element text, or get all element text
	5.appendTo: add all elements to the named element
	6. append: add new content(element) on all elements
	7.prependTo: add all elements to the front of named element
	8.prepend: add new element on the front of all elements.
	*/

	// test by RickH
	// RH('span').empty();
	// RH('span').remove();
	// console.log(RH('span').html());
	// RH('span').html('<li>li</li>');
	// console.log(RH('span').text());
	// RH('span').text('<li>li</li>');



	/*
		empty method:
		1. traverse likeArray
		2.get all elements and clear their content. 

	*/

	empty: function() {
		for (var i = 0, len = this.length; i < len; i++) {
			this[i].innerHTML = '';
		}

		// for chain programming
		return this;
	},

	_empty: function() {
		this.each(function() {
			// here 'this' points to each traversed element
			this.innerHTML = '';
		});

		return this;
	},

	/*
		remove method:
		1. traverse the likeArray,
		2. get all elements and get its parent element, and then remove itself.
	*/

	remove: function() {

		for (var i = 0, len = this.length; i < len; i++) {
			this[i].parentNode.removeChild(this[i]);
		}

		return this;
	},

	_remove: function() {

		this.each(function() {
			this.parentNode.removeChild(this);
		});

		return this;
	},

	/*
		html method
		1. confirm whether has arguments or not,
		2. if no arguments, get the first element, and return
		3. if has arguments, traverse the likeArray, and get all elements and set the content (innerHTML).

	*/

	html: function(html) {

		// if only has likeArray, get first likearray element
		if (arguments.length === 0) {
			return this[0].innerHTML;

		} else if (arguments.length >= 1) {
			for (var i = 0, len = this.length; i < len; i++) {
				this[i].innerHTML = html;
			}
			// set operation can do chain programming
			return this;
		}
	},

	_html: function(html) {

		if (arguments.length === 0) {
			return this.get(0).innerHTML;

		} else {

			this.each(function() {
				this.innerHTML = html;
			});

			return this;
		}
	},

	/*
		text method:
		1. confirm whether has arguments or not,
		2. if no arguments, get the all element, and return the added content,
		3. if has arguments, traverse the likeArray, and get all elements and set the content (innerText).
	*/

	text: function(text) {

		if (arguments.length === 0) {

			var str = '';
			for (var i = 0, len = this.length; i < len; i++) {
				str += this[i].innerText;
			}
			return str;

		} else {
			for (var i = 0, len = this.length; i < len; i++) {
				this[i].innerText = text;
			}
			// set operation can do chain programming.
			return this;
		}

	},

	_text: function(text) {

		if (arguments.length === 0) {
			var str = '';
			this.each(function() {
				str += this.innerText;
			});
			return str;

		} else {

			this.each(function() {
				this.innerText = text;
			});

			return this;
		}
	},

	/*
		
		add all elements to the named element.
		1.define an array, used to store the added elements,
		2. use RickH to encapsulate different type of selector to RickH instance, 
		3. outer to traverse all this
		4. inner to traverse all RickH(selector).
		5. inside inner, if its first time, put the original outer (this) element to the inner RickH(selector) element, 
		6. else clone the outer(this) element to the inner RickH(selector) element.
		7. return the RickH encapsulated to the new array.
	*/
	appendTo: function(selector) {

		// used to store the gotten array.
		var result = [],
			tempNode = null;
		// RickH encapsulate the different type of selector to RickH instance.
		var RHselector = RH(selector);

		for (var i = 0, len = this.length; i < len; i++) {

			for (var j = 0, jlen = RHselector.length; j < jlen; j++) {

				// add the original one
				if (j === 0) {
					tempNode = this[i];
					RHselector[j].appendChild(tempNode);

					// remember to return 'this'.
					result.push(tempNode);

				} else {
					// add the cloned one
					tempNode = this[i].cloneNode(true);
					RHselector[j].appendChild(tempNode);

					result.push(tempNode);
				}
			}
		}

		return RickH(result);
	},

	// use each function
	_appendTo: function(selector) {

		var result = [],
			tempNode = null;
		var RHselector = RH(selector);

		this.each(function() {
			// 'this' points to outer
			var self = this;
			RHselector.each(function(i) {
				// means jqury encapsulted selector

				// if first time, use original one
				tempNode = i === 0 ?
					self :
					self.cloneNode(true);

				this.appendChild(tempNode);
				result.push(tempNode);
			});
		});
		return RickH(result);
	},

	/*
		prepend
		1.get all a and div
		2.traverse all div elements, and then by 'insertBefore' to add new elements.
		3. first time add original one
		4. else add cloned one.

	*/
	prependTo: function(selector) {

		var result = [],
			tempNode = null;
		var RHselector = RH(selector);

		// traverse the outer 'this'
		for (var i = 0, len = this.length; i < len; i++) {

			// traverse the inner RHselector
			for (var j = 0, jlen = RHselector.length; j < jlen; j++) {

				tempNode = j === 0 ?
					this[i] :
					this[i].cloneNode(true);

				// add the elm to the front of pointed elemnet 
				RHselector[j].insertBefore(tempNode, RHselector[j].firstChild);

				result.push(tempNode);
			}
		}

		return RickH(result);

	},

	_prependTo: function(selector) {

		var result = [],
			tempNode = null;
		var RHsel = RH(selector);

		this.each(function() {

			var self = this;

			RHsel.each(function(i) {

				tempNode = i === 0 ?
					self :
					self.cloneNode(true);

				RHsel[i].insertBefore(tempNode, RHsel[i].firstChild);
				result.push(tempNode);
			});
		});
		return RickH(result);
	},


	/*
		append() method

		1. if arguments is 'string' type, will add the string in the innerHTML, append('a')
		2. if arguments is jq instance, will add each instance add in teh innerHTML, append(RH('a'))
		3. if arguments is DOM, will add each dom in the innerHTML. append(document.querySelectorAll('span'))

		PROCESS:
		firstly confirm its string or not its similar as appendTo()

	*/

	append: function(context) {

		if (RickH._isString(context)) {

			for (var i = 0, len = this.length; i < len; i++) {
				this[i].innerHTML += context;
			}

		} else {
			// add each RHcontext to each this
			var RHcontext = RH(context);
			RHcontext.appendTo(this);
		}
		return this;
	},


	_append: function(context) {

		if (RickH._isString(context)) {

			this.each(function() {
				this.innerHTML += context;
			});

		} else {
			var RHcontext = RH(context);
			RHcontext.appendTo(this);
		}

		return this;
	},

	// similar as 'append'
	prepend: function(context) {

		if (RickH._isString(context)) {

			for (var i = 0, len = this.length; i < len; i++) {

				this[i].innerHTML = context + this[i].innerHTML;
			}

		} else {
			var RHcontext = RH(context);
			RHcontext.prependTo(this);
		}

		return this;
	},

	_prepend: function(context) {

		if (RickH._isString(context)) {
			this.each(function() {
				this.innerHTML = context + this.innerHTML;
			});

		} else {
			var RHcontext = RH(context);
			RHcontext.prependTo(this);
		}
		return this;

	}


});