define([
	'./when-54c2dc71',
	'./Check-6c0211bc',
	'./Math-fc8cecf5',
	'./Cartesian2-bddc1162',
	'./Transforms-d07bb42c',
	'./RuntimeError-2109023a',
	'./WebGLConstants-76bb35d1',
	'./ComponentDatatype-6d99a1ee',
	'./GeometryAttribute-be1a3386',
	'./GeometryAttributes-4fcfcf40',
	'./IndexDatatype-53503fee',
	'./IntersectionTests-8abf6dba',
	'./Plane-c8971487',
	'./arrayRemoveDuplicates-ebc732b0',
	'./EllipsoidRhumbLine-c704bf4c',
	'./EllipsoidGeodesic-30fae80b',
	'./PolylinePipeline-fa11d71d',
	'./WallGeometryLibrary-24ceb832',
], function (b, e, v, C, H, i, t, A, k, w, G, a, n, r, o, s, l, L) {
	'use strict'
	var x = new C.Cartesian3(),
		P = new C.Cartesian3()
	function d(e) {
		var i = (e = b.defaultValue(e, b.defaultValue.EMPTY_OBJECT)).positions,
			t = e.maximumHeights,
			a = e.minimumHeights,
			n = b.defaultValue(e.granularity, v.CesiumMath.RADIANS_PER_DEGREE),
			e = b.defaultValue(e.ellipsoid, C.Ellipsoid.WGS84)
		;(this._positions = i),
			(this._minimumHeights = a),
			(this._maximumHeights = t),
			(this._granularity = n),
			(this._ellipsoid = C.Ellipsoid.clone(e)),
			(this._workerName = 'createWallOutlineGeometry')
		i = 1 + i.length * C.Cartesian3.packedLength + 2
		b.defined(a) && (i += a.length),
			b.defined(t) && (i += t.length),
			(this.packedLength = i + C.Ellipsoid.packedLength + 1)
	}
	d.pack = function (e, i, t) {
		var a
		t = b.defaultValue(t, 0)
		var n = e._positions,
			r = n.length
		for (i[t++] = r, a = 0; a < r; ++a, t += C.Cartesian3.packedLength)
			C.Cartesian3.pack(n[a], i, t)
		var o = e._minimumHeights,
			r = b.defined(o) ? o.length : 0
		if (((i[t++] = r), b.defined(o))) for (a = 0; a < r; ++a) i[t++] = o[a]
		var s = e._maximumHeights
		if (((r = b.defined(s) ? s.length : 0), (i[t++] = r), b.defined(s)))
			for (a = 0; a < r; ++a) i[t++] = s[a]
		return (
			C.Ellipsoid.pack(e._ellipsoid, i, t),
			(i[(t += C.Ellipsoid.packedLength)] = e._granularity),
			i
		)
	}
	var u = C.Ellipsoid.clone(C.Ellipsoid.UNIT_SPHERE),
		p = {
			positions: void 0,
			minimumHeights: void 0,
			maximumHeights: void 0,
			ellipsoid: u,
			granularity: void 0,
		}
	return (
		(d.unpack = function (e, i, t) {
			i = b.defaultValue(i, 0)
			for (
				var a, n, r = e[i++], o = new Array(r), s = 0;
				s < r;
				++s, i += C.Cartesian3.packedLength
			)
				o[s] = C.Cartesian3.unpack(e, i)
			if (0 < (r = e[i++]))
				for (a = new Array(r), s = 0; s < r; ++s) a[s] = e[i++]
			if (0 < (r = e[i++]))
				for (n = new Array(r), s = 0; s < r; ++s) n[s] = e[i++]
			var l = C.Ellipsoid.unpack(e, i, u),
				m = e[(i += C.Ellipsoid.packedLength)]
			return b.defined(t)
				? ((t._positions = o),
				  (t._minimumHeights = a),
				  (t._maximumHeights = n),
				  (t._ellipsoid = C.Ellipsoid.clone(l, t._ellipsoid)),
				  (t._granularity = m),
				  t)
				: ((p.positions = o),
				  (p.minimumHeights = a),
				  (p.maximumHeights = n),
				  (p.granularity = m),
				  new d(p))
		}),
		(d.fromConstantHeights = function (e) {
			var i = (e = b.defaultValue(e, b.defaultValue.EMPTY_OBJECT)).positions,
				t = e.minimumHeight,
				a = e.maximumHeight,
				n = b.defined(t),
				r = b.defined(a)
			if (n || r)
				for (
					var o = i.length,
						s = n ? new Array(o) : void 0,
						l = r ? new Array(o) : void 0,
						m = 0;
					m < o;
					++m
				)
					n && (s[m] = t), r && (l[m] = a)
			return new d({
				positions: i,
				maximumHeights: l,
				minimumHeights: s,
				ellipsoid: e.ellipsoid,
			})
		}),
		(d.createGeometry = function (e) {
			var i = e._positions,
				t = e._minimumHeights,
				a = e._maximumHeights,
				n = e._granularity,
				e = e._ellipsoid,
				t = L.WallGeometryLibrary.computePositions(e, i, a, t, n, !1)
			if (b.defined(t)) {
				var r = t.bottomPositions,
					o = t.topPositions,
					s = o.length,
					n = 2 * s,
					l = new Float64Array(n),
					m = 0
				for (s /= 3, h = 0; h < s; ++h) {
					var d = 3 * h,
						u = C.Cartesian3.fromArray(o, d, x),
						d = C.Cartesian3.fromArray(r, d, P)
					;(l[m++] = d.x),
						(l[m++] = d.y),
						(l[m++] = d.z),
						(l[m++] = u.x),
						(l[m++] = u.y),
						(l[m++] = u.z)
				}
				for (
					var t = new w.GeometryAttributes({
							position: new k.GeometryAttribute({
								componentDatatype: A.ComponentDatatype.DOUBLE,
								componentsPerAttribute: 3,
								values: l,
							}),
						}),
						p = n / 3,
						n = 2 * p - 4 + p,
						f = G.IndexDatatype.createTypedArray(p, n),
						c = 0,
						h = 0;
					h < p - 2;
					h += 2
				) {
					var g = h,
						y = h + 2,
						_ = C.Cartesian3.fromArray(l, 3 * g, x),
						E = C.Cartesian3.fromArray(l, 3 * y, P)
					C.Cartesian3.equalsEpsilon(_, E, v.CesiumMath.EPSILON10) ||
						((_ = h + 1),
						(E = h + 3),
						(f[c++] = _),
						(f[c++] = g),
						(f[c++] = _),
						(f[c++] = E),
						(f[c++] = g),
						(f[c++] = y))
				}
				return (
					(f[c++] = p - 2),
					(f[c++] = p - 1),
					new k.Geometry({
						attributes: t,
						indices: f,
						primitiveType: k.PrimitiveType.LINES,
						boundingSphere: new H.BoundingSphere.fromVertices(l),
					})
				)
			}
		}),
		function (e, i) {
			return (
				b.defined(i) && (e = d.unpack(e, i)),
				(e._ellipsoid = C.Ellipsoid.clone(e._ellipsoid)),
				d.createGeometry(e)
			)
		}
	)
})
