define([
	'exports',
	'./Check-6c0211bc',
	'./Cartesian2-bddc1162',
	'./Transforms-d07bb42c',
	'./OrientedBoundingBox-11af7c9d',
], function (n, t, g, l, f) {
	'use strict'
	var e = {},
		i = new g.Cartesian3(),
		x = new g.Cartesian3(),
		B = new g.Cartesian3(),
		P = new g.Cartesian3(),
		M = new f.OrientedBoundingBox()
	function o(n, t, e, r, a) {
		;(t = g.Cartesian3.subtract(n, t, i)),
			(e = g.Cartesian3.dot(e, t)),
			(t = g.Cartesian3.dot(r, t))
		return g.Cartesian2.fromElements(e, t, a)
	}
	;(e.validOutline = function (n) {
		var t = f.OrientedBoundingBox.fromPoints(n, M).halfAxes,
			e = l.Matrix3.getColumn(t, 0, x),
			n = l.Matrix3.getColumn(t, 1, B),
			t = l.Matrix3.getColumn(t, 2, P),
			e = g.Cartesian3.magnitude(e),
			n = g.Cartesian3.magnitude(n),
			t = g.Cartesian3.magnitude(t)
		return !((0 === e && (0 === n || 0 === t)) || (0 === n && 0 === t))
	}),
		(e.computeProjectTo2DArguments = function (n, t, e, r) {
			var a,
				i,
				o = f.OrientedBoundingBox.fromPoints(n, M),
				u = o.halfAxes,
				s = l.Matrix3.getColumn(u, 0, x),
				c = l.Matrix3.getColumn(u, 1, B),
				C = l.Matrix3.getColumn(u, 2, P),
				m = g.Cartesian3.magnitude(s),
				d = g.Cartesian3.magnitude(c),
				n = g.Cartesian3.magnitude(C),
				u = Math.min(m, d, n)
			return (
				(0 !== m || (0 !== d && 0 !== n)) &&
				(0 !== d || 0 !== n) &&
				((u !== d && u !== n) || (a = s),
				u === m ? (a = c) : u === n && (i = c),
				(u !== m && u !== d) || (i = C),
				g.Cartesian3.normalize(a, e),
				g.Cartesian3.normalize(i, r),
				g.Cartesian3.clone(o.center, t),
				!0)
			)
		}),
		(e.createProjectPointsTo2DFunction = function (r, a, i) {
			return function (n) {
				for (var t = new Array(n.length), e = 0; e < n.length; e++)
					t[e] = o(n[e], r, a, i)
				return t
			}
		}),
		(e.createProjectPointTo2DFunction = function (e, r, a) {
			return function (n, t) {
				return o(n, e, r, a, t)
			}
		}),
		(n.CoplanarPolygonGeometryLibrary = e)
})
