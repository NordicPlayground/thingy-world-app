define([
	'./when-54c2dc71',
	'./Check-6c0211bc',
	'./Math-fc8cecf5',
	'./Cartesian2-bddc1162',
	'./AttributeCompression-9fc99391',
	'./createTaskProcessorWorker',
], function (a, e, C, g, b, r) {
	'use strict'
	var w = 32767,
		k = new g.Cartographic(),
		v = new g.Cartesian3(),
		y = new g.Rectangle(),
		A = new g.Ellipsoid(),
		M = { min: void 0, max: void 0 }
	return r(function (a, e) {
		var r = new Uint16Array(a.positions)
		!(function (a) {
			a = new Float64Array(a)
			var e = 0
			;(M.min = a[e++]),
				(M.max = a[e++]),
				g.Rectangle.unpack(a, 2, y),
				(e += g.Rectangle.packedLength),
				g.Ellipsoid.unpack(a, e, A)
		})(a.packedBuffer)
		var t = y,
			n = A,
			i = M.min,
			s = M.max,
			c = r.length / 3,
			o = r.subarray(0, c),
			u = r.subarray(c, 2 * c),
			p = r.subarray(2 * c, 3 * c)
		b.AttributeCompression.zigZagDeltaDecode(o, u, p)
		for (var f = new Float64Array(r.length), h = 0; h < c; ++h) {
			var l = o[h],
				d = u[h],
				m = p[h],
				l = C.CesiumMath.lerp(t.west, t.east, l / w),
				d = C.CesiumMath.lerp(t.south, t.north, d / w),
				m = C.CesiumMath.lerp(i, s, m / w),
				m = g.Cartographic.fromRadians(l, d, m, k),
				m = n.cartographicToCartesian(m, v)
			g.Cartesian3.pack(m, f, 3 * h)
		}
		return e.push(f.buffer), { positions: f.buffer }
	})
})
