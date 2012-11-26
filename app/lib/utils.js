window.utils = {
	UUID : function () {
		var s = [], itoh = '0123456789ABCDEF';

		for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);

		for (var i = 0; i <36; i++) s[i] = itoh[s[i]];

		return s.join('');
	}
}