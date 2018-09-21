RickH.extend({

	// add static method

	ajaxSettings: {

		url: location.href,
		type: 'GET',
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		timeout: null,
		dataType: 'JSON',
		success: function() {},
		error: function() {},
		complete: function() {}

	},

	// transfer obj to url argument string
	urlStringify: function(data) {

		var result = '',
			key;
		if (!RickH.isObject(data)) {
			return result;
		}

		for (key in data) {
			result += window.encodeURIComponent(key) + '=' + window.encodeURIComponent(data[key]) + '&';
		}
		// remove the last '&'.
		return result.slice(0, -1);
	},

	// process data
	processOptions: function(options) {

		var optionsNew = {};

		RickH.extend(optionsNew, RickH.ajaxSettings, options);

		// process data
		optionsNew.data = RickH.urlStringify(optionsNew.data);

		optionsNew.type = optionsNew.type.toUpperCase();

		if (optionsNew.type === 'GET') {
			optionsNew.url += '?' + optionsNew.data;
			optionsNew.data = null;

		}
		return optionsNew;

	},

	ajax: function(options) {

		var optionsNew, xhr, result, timer;

		// process data
		optionsNew = RickH.processOptions(options);

		xhr = new XMLHttpRequest();

		/*if (optionsNew.type === 'GET') {

			// for IE8, add 'window.encodeURIComponent' method
			optionsNew.url += '?' + RickH.urlStringify(optionsNew.data);
		}*/

		xhr.open(optionsNew.type, optionsNew.url, optionsNew.async);

		// if post, add request head
		if (optionsNew.type === 'POST') {
			xhr.setRequestHeader('Content-Type', optionsNew.contentType);
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {

				// if completed within timeout term
				clearTimeout(timer);

				optionsNew.complete();

				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {

					// deal with data type
					switch (optionsNew.dataType) {
						case 'JSON':
							result = JSON.parse(xhr.responseText);
							break;

						case 'script':
							eval(xhr.responseText);
							result = xhr.responseText;
							break;

						case 'style':
							RH('<style></style>').html(xhr.responseText).appendTo('head');
							result = xhr.responseText;
							break;
						default:
							result = xhr.responseText;
							break;
					}

					optionsNew.success(result);

				} else {
					optionsNew.error(xhr.status);
				}
			}
		};

		// if set timeout
		if (optionsNew.timeout) {
			timer = setTimeout(function() {
				optionsNew.error('timeout');

				// callback do not operation.
				xhr.onreadystatechange = null;

			}, optionsNew.timeout)
		}

		xhr.send(optionsNew.data);
	},

	get: function(url, data, callback) {
		// if has two argument, the second one is callback
		callback = callback || data || function() {};

		RickH.ajax({
			url: url,
			data: data,
			success: callback
		});
	},

	post: function(url, data, callback) {

		callback = callback || data || function() {};

		RickH.ajax({
			type: 'POST',
			url: url,
			data: data,
			success: callback
		});
	},

	getCss: function(url, data, callback) {

		callback = callback || data || function() {};
		RickH.ajax({
			dataType: 'style',
			url: url,
			data: data,
			success: callback
		});

	}

});