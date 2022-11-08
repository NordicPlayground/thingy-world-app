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
	'./VertexFormat-7572c785',
	'./arrayRemoveDuplicates-ebc732b0',
	'./EllipsoidRhumbLine-c704bf4c',
	'./EllipsoidGeodesic-30fae80b',
	'./PolylinePipeline-fa11d71d',
	'./WallGeometryLibrary-24ceb832',
], function (S, e, I, N, M, t, a, W, B, U, q, i, n, p, r, o, s, m, J) {
	'use strict'
	var Y = new N.Cartesian3(),
		Z = new N.Cartesian3(),
		j = new N.Cartesian3(),
		K = new N.Cartesian3(),
		Q = new N.Cartesian3(),
		X = new N.Cartesian3(),
		$ = new N.Cartesian3()
	function d(e) {
		var t = (e = S.defaultValue(e, S.defaultValue.EMPTY_OBJECT)).positions,
			a = e.maximumHeights,
			i = e.minimumHeights,
			n = S.defaultValue(e.vertexFormat, p.VertexFormat.DEFAULT),
			r = S.defaultValue(e.granularity, I.CesiumMath.RADIANS_PER_DEGREE),
			e = S.defaultValue(e.ellipsoid, N.Ellipsoid.WGS84)
		;(this._positions = t),
			(this._minimumHeights = i),
			(this._maximumHeights = a),
			(this._vertexFormat = p.VertexFormat.clone(n)),
			(this._granularity = r),
			(this._ellipsoid = N.Ellipsoid.clone(e)),
			(this._workerName = 'createWallGeometry')
		t = 1 + t.length * N.Cartesian3.packedLength + 2
		S.defined(i) && (t += i.length),
			S.defined(a) && (t += a.length),
			(this.packedLength =
				t + N.Ellipsoid.packedLength + p.VertexFormat.packedLength + 1)
	}
	d.pack = function (e, t, a) {
		var i
		a = S.defaultValue(a, 0)
		var n = e._positions,
			r = n.length
		for (t[a++] = r, i = 0; i < r; ++i, a += N.Cartesian3.packedLength)
			N.Cartesian3.pack(n[i], t, a)
		var o = e._minimumHeights,
			r = S.defined(o) ? o.length : 0
		if (((t[a++] = r), S.defined(o))) for (i = 0; i < r; ++i) t[a++] = o[i]
		var s = e._maximumHeights
		if (((r = S.defined(s) ? s.length : 0), (t[a++] = r), S.defined(s)))
			for (i = 0; i < r; ++i) t[a++] = s[i]
		return (
			N.Ellipsoid.pack(e._ellipsoid, t, a),
			(a += N.Ellipsoid.packedLength),
			p.VertexFormat.pack(e._vertexFormat, t, a),
			(t[(a += p.VertexFormat.packedLength)] = e._granularity),
			t
		)
	}
	var c = N.Ellipsoid.clone(N.Ellipsoid.UNIT_SPHERE),
		y = new p.VertexFormat(),
		f = {
			positions: void 0,
			minimumHeights: void 0,
			maximumHeights: void 0,
			ellipsoid: c,
			vertexFormat: y,
			granularity: void 0,
		}
	return (
		(d.unpack = function (e, t, a) {
			t = S.defaultValue(t, 0)
			for (
				var i, n, r = e[t++], o = new Array(r), s = 0;
				s < r;
				++s, t += N.Cartesian3.packedLength
			)
				o[s] = N.Cartesian3.unpack(e, t)
			if (0 < (r = e[t++]))
				for (i = new Array(r), s = 0; s < r; ++s) i[s] = e[t++]
			if (0 < (r = e[t++]))
				for (n = new Array(r), s = 0; s < r; ++s) n[s] = e[t++]
			var m = N.Ellipsoid.unpack(e, t, c)
			t += N.Ellipsoid.packedLength
			var l = p.VertexFormat.unpack(e, t, y),
				u = e[(t += p.VertexFormat.packedLength)]
			return S.defined(a)
				? ((a._positions = o),
				  (a._minimumHeights = i),
				  (a._maximumHeights = n),
				  (a._ellipsoid = N.Ellipsoid.clone(m, a._ellipsoid)),
				  (a._vertexFormat = p.VertexFormat.clone(l, a._vertexFormat)),
				  (a._granularity = u),
				  a)
				: ((f.positions = o),
				  (f.minimumHeights = i),
				  (f.maximumHeights = n),
				  (f.granularity = u),
				  new d(f))
		}),
		(d.fromConstantHeights = function (e) {
			var t = (e = S.defaultValue(e, S.defaultValue.EMPTY_OBJECT)).positions,
				a = e.minimumHeight,
				i = e.maximumHeight,
				n = S.defined(a),
				r = S.defined(i)
			if (n || r)
				for (
					var o = t.length,
						s = n ? new Array(o) : void 0,
						m = r ? new Array(o) : void 0,
						l = 0;
					l < o;
					++l
				)
					n && (s[l] = a), r && (m[l] = i)
			return new d({
				positions: t,
				maximumHeights: m,
				minimumHeights: s,
				ellipsoid: e.ellipsoid,
				vertexFormat: e.vertexFormat,
			})
		}),
		(d.createGeometry = function (e) {
			var t = e._positions,
				a = e._minimumHeights,
				i = e._maximumHeights,
				n = e._vertexFormat,
				r = e._granularity,
				o = e._ellipsoid,
				i = J.WallGeometryLibrary.computePositions(o, t, i, a, r, !0)
			if (S.defined(i)) {
				for (
					var s = i.bottomPositions,
						m = i.topPositions,
						a = i.numCorners,
						l = m.length,
						r = 2 * l,
						u = n.position ? new Float64Array(r) : void 0,
						p = n.normal ? new Float32Array(r) : void 0,
						d = n.tangent ? new Float32Array(r) : void 0,
						c = n.bitangent ? new Float32Array(r) : void 0,
						y = n.st ? new Float32Array((r / 3) * 2) : void 0,
						f = 0,
						g = 0,
						h = 0,
						v = 0,
						C = 0,
						b = $,
						x = X,
						A = Q,
						_ = !0,
						E = 0,
						w = 1 / ((l /= 3) - a - 1),
						F = 0;
					F < l;
					++F
				) {
					var L,
						k = 3 * F,
						H = N.Cartesian3.fromArray(m, k, Y),
						V = N.Cartesian3.fromArray(s, k, Z)
					n.position &&
						((u[f++] = V.x),
						(u[f++] = V.y),
						(u[f++] = V.z),
						(u[f++] = H.x),
						(u[f++] = H.y),
						(u[f++] = H.z)),
						n.st && ((y[C++] = E), (y[C++] = 0), (y[C++] = E), (y[C++] = 1)),
						(n.normal || n.tangent || n.bitangent) &&
							((L = N.Cartesian3.clone(N.Cartesian3.ZERO, K)),
							(V = N.Cartesian3.subtract(H, o.geodeticSurfaceNormal(H, Z), Z)),
							F + 1 < l && (L = N.Cartesian3.fromArray(m, 3 + k, K)),
							_ &&
								((k = N.Cartesian3.subtract(L, H, j)),
								(V = N.Cartesian3.subtract(V, H, Y)),
								(b = N.Cartesian3.normalize(N.Cartesian3.cross(V, k, b), b)),
								(_ = !1)),
							N.Cartesian3.equalsEpsilon(H, L, I.CesiumMath.EPSILON10)
								? (_ = !0)
								: ((E += w),
								  n.tangent &&
										(x = N.Cartesian3.normalize(
											N.Cartesian3.subtract(L, H, x),
											x,
										)),
								  n.bitangent &&
										(A = N.Cartesian3.normalize(
											N.Cartesian3.cross(b, x, A),
											A,
										))),
							n.normal &&
								((p[g++] = b.x),
								(p[g++] = b.y),
								(p[g++] = b.z),
								(p[g++] = b.x),
								(p[g++] = b.y),
								(p[g++] = b.z)),
							n.tangent &&
								((d[v++] = x.x),
								(d[v++] = x.y),
								(d[v++] = x.z),
								(d[v++] = x.x),
								(d[v++] = x.y),
								(d[v++] = x.z)),
							n.bitangent &&
								((c[h++] = A.x),
								(c[h++] = A.y),
								(c[h++] = A.z),
								(c[h++] = A.x),
								(c[h++] = A.y),
								(c[h++] = A.z)))
				}
				i = new U.GeometryAttributes()
				n.position &&
					(i.position = new B.GeometryAttribute({
						componentDatatype: W.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: u,
					})),
					n.normal &&
						(i.normal = new B.GeometryAttribute({
							componentDatatype: W.ComponentDatatype.FLOAT,
							componentsPerAttribute: 3,
							values: p,
						})),
					n.tangent &&
						(i.tangent = new B.GeometryAttribute({
							componentDatatype: W.ComponentDatatype.FLOAT,
							componentsPerAttribute: 3,
							values: d,
						})),
					n.bitangent &&
						(i.bitangent = new B.GeometryAttribute({
							componentDatatype: W.ComponentDatatype.FLOAT,
							componentsPerAttribute: 3,
							values: c,
						})),
					n.st &&
						(i.st = new B.GeometryAttribute({
							componentDatatype: W.ComponentDatatype.FLOAT,
							componentsPerAttribute: 2,
							values: y,
						}))
				var G = r / 3
				r -= 6 * (a + 1)
				var D = q.IndexDatatype.createTypedArray(G, r),
					P = 0
				for (F = 0; F < G - 2; F += 2) {
					var T = F,
						z = F + 2,
						O = N.Cartesian3.fromArray(u, 3 * T, Y),
						R = N.Cartesian3.fromArray(u, 3 * z, Z)
					N.Cartesian3.equalsEpsilon(O, R, I.CesiumMath.EPSILON10) ||
						((O = F + 1),
						(R = F + 3),
						(D[P++] = O),
						(D[P++] = T),
						(D[P++] = R),
						(D[P++] = R),
						(D[P++] = T),
						(D[P++] = z))
				}
				return new B.Geometry({
					attributes: i,
					indices: D,
					primitiveType: B.PrimitiveType.TRIANGLES,
					boundingSphere: new M.BoundingSphere.fromVertices(u),
				})
			}
		}),
		function (e, t) {
			return (
				S.defined(t) && (e = d.unpack(e, t)),
				(e._ellipsoid = N.Ellipsoid.clone(e._ellipsoid)),
				d.createGeometry(e)
			)
		}
	)
})
