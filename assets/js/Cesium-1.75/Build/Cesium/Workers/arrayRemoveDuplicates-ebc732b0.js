define([
	'exports',
	'./when-54c2dc71',
	'./Check-6c0211bc',
	'./Math-fc8cecf5',
], function (e, a, t, r) {
	'use strict'
	var h = r.CesiumMath.EPSILON10
	e.arrayRemoveDuplicates = function (e, t, r) {
		if (a.defined(e)) {
			r = a.defaultValue(r, !1)
			var c,
				n,
				f,
				i = e.length
			if (i < 2) return e
			for (c = 1; c < i && !t((n = e[c - 1]), (f = e[c]), h); ++c);
			if (c === i) return r && t(e[0], e[e.length - 1], h) ? e.slice(1) : e
			for (var u = e.slice(0, c); c < i; ++c)
				t(n, (f = e[c]), h) || (u.push(f), (n = f))
			return r && 1 < u.length && t(u[0], u[u.length - 1], h) && u.shift(), u
		}
	}
})
