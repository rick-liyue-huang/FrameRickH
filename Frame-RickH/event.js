// add event on frame static method
RH.extend({

	/*
		on: bind event
		DOM.on+eventname = function(){} 
		DOM.addEventListener(eventname, function() {})
		DOM.attachEvent('on'+eventname, function() {})
	*/
	addEvent: function(elem, type, callback) {

		if (!elem.nodeType || !RickH._isString(type) || !RickH._isFunction(callback)) {
			return;
		}

		if (elem.addEventListener) {
			elem.addEventListener(type, callback);

		} else {
			elem.attachEvent('on' + type, callback);
		}
	},

	/*
		off method
		1. DOM.on+eventname = null
		2. DOM.removeEventListener(eventname, function() {})
		3. DOM.dettachEvent(on+eventname, function() {})

	*/

	removeEvent: function(elem, type, callback) {

		if (!elem.nodeType || !RickH._isString(type) || !RickH._isFunction(callback)) {
			return;
		}

		if (elem.removeEventListener) {
			elem.removeEventListener(type, callback);

		} else {
			elem.detachEvent('on' + type, callback);
		}
	}

});

RickH.fn.extend({

	// the simple ones
	on: function(type, callback) {
		/*
			1. traverse all elems
			2. and bind types
			3. return this
		*/
		this.each(function() {
			RickH.addEvent(this, type, callback);
		});

		return this;

	},

	off: function(type, callback) {
		/*
			1. traverse all elems
			2. and untie types
			3. return this
		*/

		this.each(function() {
			RickH.removeEvent(this, type, callback);
		});
		return this;
	},

	/*
		problems:
		1. for IE8, 'this' in callback points to 'window',
		2. for IE8, callback invoke sequence is different from other browsers
		3. off method also need to remove by null argument

	*/

	/*
		solve:
		1. only bind one callback array, and store the true callbacks, and then traverse the callback array.
		2. add 'call' to change the point target
		3. add argument 'e' to get more information
	*/


	/*
		REMEMBER: !!!!!!!
		elem.RH_event_cache = {
			type1: [],
			type2: [],
			.......

		}

	*/

	/*
		how to remove callback
		1. if remove one 'callback', it will remove pointed one,
		2. if no arguments, it will set callback array as null array. 

	*/

	_on: function(type, callback) {
		/*
			1. traverse all elems,
			2. confirm each elem has RH_event_cache property value,
			3. if has, use it, otherwise initiate one,
			4. then confirm each elem has event array,
			5. if not, it means it first bind RH_event_cache type key 
			如果没有说明是第一次绑定事件
			那么需要给RH_event_cache这个对象以type为key添加一个数组，然后把传入的回调push进去，最后还得绑定对应的事件，这个事件回调里面去遍历对应事件的数组，得到每一个事件回调，一次执行。执行时候，需要改变内部的this，还需要把事件对象传递过去。
			6.如果，直接把传入的回调push到对应事件的数组就可以了
			7.return this
		*/

		// traverse all elems
		this.each(function() {

			var self = this;
			// here 'this' is the each elem
			// if has 'RH_event_cache' use it before, otherwise create new one.
			this.RH_event_cache = this.RH_event_cache || {};

			// confirm whether has the relative event array
			// if has not, it means it is the first time
			if (!this.RH_event_cache[type]) {
				// it will create new type array
				this.RH_event_cache[type] = [];
				// and then add callback to the new array
				this.RH_event_cache[type].push(callback);

				// traverse the type array, and 
				// if it is the first time, has to true invoke browser method to bind event.
				RickH.addEvent(this, type, function(e) {

					// use static method to traverse array.
					RickH.each(self.RH_event_cache[type], function(key, val) {
						// here 'this' means 'val'.
						this.call(self, e);
					});


					/*
						for(var i = 0, len = self.RH_event_cache[type].length; i < len; i++) {

						// and invoke the callback
						self.RH_event_cache[type][i].call(self, e);
					}*/
				});

			} else {
				// if not the first time
				this.RH_event_cache[type].push(callback);
			}
		});

		return this;
	},


	_off: function(type, callback) {
		/*
			1. 如果没有传参，那么遍历所有的元素
			2. 每一个元素RH_event_cache属性，分别清除这个对象中每一个数组，
			3. 如果传参了，只传入一个，那么把元素RH_event_cache指定类型的数组清空即可
			4. 如果传两个以上，那么把元素RH_event_cache对象指定类型的数组中指定的回调删除即可。
			5. return this 

		*/

		var argLen = arguments.length;

		this.each(function() {


			// if before has not bind RH_event_cache, directly jump out loop
			if (!this.RH_event_cache) {
				return;

			} else {

				// if has RH_event_cache

				// confirm outer function arguments length
				if (argLen === 0) {

					// traverse RH_event_cache object 
					for (var key in this.RH_event_cache) {
						// remove all type array in RH_event_cache object
						this.RH_event_cache[key] = [];
					}

				} else if (argLen === 1) {
					// if has arguments, just remove named type array
					this.RH_event_cache[type] = [];

				} else {
					// if has more one arguments, clear the named type array


					/*for(var i = 0, len = this.RH_event_cache[type].length; i < len; i++) {

						// 依次和传入的callback 比较，如果相等，则从数组中删除
						// compare the inputed callback to the arguments, if equal, remove it.
						if(this.RH_event_cache[type][i] == callback) {
							this.RH_event_cache[type].splice(i, 1);
						}
					}*/

					// note: avoid the length change to effect traverse time, we count down.
					for (var i = this.RH_event_cache[type].length - 1; i >= 0; i--) {
						// 依次和传入的callback 比较，如果相等，则从数组中删除
						// compare the inputed callback to the arguments, if equal, remove it.
						if (this.RH_event_cache[type][i] == callback) {
							this.RH_event_cache[type].splice(i, 1);
						}
					}
				}

			}
		});
		return this;
	},

	click: function(callback) {
		return this._on('click', callback);
	},

	mouseout: function(callback) {
		return this._on('mouseout', callback);
	}



});