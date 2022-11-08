define([
	'exports',
	'./when-54c2dc71',
	'./Check-6c0211bc',
	'./Cartesian2-bddc1162',
], function (e, h, n, i) {
	'use strict'
	function r() {
		;(this.high = i.Cartesian3.clone(i.Cartesian3.ZERO)),
			(this.low = i.Cartesian3.clone(i.Cartesian3.ZERO))
	}
	r.encode = function (e, n) {
		var i
		return (
			h.defined(n) || (n = { high: 0, low: 0 }),
			0 <= e
				? ((i = 65536 * Math.floor(e / 65536)), (n.high = i), (n.low = e - i))
				: ((i = 65536 * Math.floor(-e / 65536)),
				  (n.high = -i),
				  (n.low = e + i)),
			n
		)
	}
	var t = { high: 0, low: 0 }
	r.fromCartesian = function (e, n) {
		h.defined(n) || (n = new r())
		var i = n.high,
			o = n.low
		return (
			r.encode(e.x, t),
			(i.x = t.high),
			(o.x = t.low),
			r.encode(e.y, t),
			(i.y = t.high),
			(o.y = t.low),
			r.encode(e.z, t),
			(i.z = t.high),
			(o.z = t.low),
			n
		)
	}
	var a = new r()
	;(r.writeElements = function (e, n, i) {
		r.fromCartesian(e, a)
		var o = a.high,
			e = a.low
		;(n[i] = o.x),
			(n[i + 1] = o.y),
			(n[i + 2] = o.z),
			(n[i + 3] = e.x),
			(n[i + 4] = e.y),
			(n[i + 5] = e.z)
	}),
		(e.EncodedCartesian3 = r)
})
