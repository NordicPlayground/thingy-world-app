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
	'./GeometryOffsetAttribute-7350d9af',
	'./arrayRemoveDuplicates-ebc732b0',
	'./EllipsoidTangentPlane-64140317',
	'./EllipsoidRhumbLine-c704bf4c',
	'./PolygonPipeline-b9585f01',
	'./PolylineVolumeGeometryLibrary-abc37e8c',
	'./EllipsoidGeodesic-30fae80b',
	'./PolylinePipeline-fa11d71d',
	'./CorridorGeometryLibrary-7feb157b',
], function (M, e, u, R, p, t, i, B, U, F, Y, r, o, v, f, a, n, A, q, s, l, W) {
	'use strict'
	var J = new R.Cartesian3(),
		j = new R.Cartesian3(),
		z = new R.Cartesian3()
	function _(e, t) {
		var i,
			r = [],
			o = e.positions,
			a = e.corners,
			n = e.endPositions,
			s = new F.GeometryAttributes(),
			l = 0,
			d = 0,
			u = 0
		for (w = 0; w < o.length; w += 2)
			(l += i = o[w].length - 3), (u += (i / 3) * 4), (d += o[w + 1].length - 3)
		for (l += 3, d += 3, w = 0; w < a.length; w++) {
			O = a[w]
			var p = a[w].leftPositions
			M.defined(p)
				? (l += i = p.length)
				: (d += i = a[w].rightPositions.length),
				(u += (i / 3) * 2)
		}
		var f,
			h = M.defined(n)
		h && ((l += f = n[0].length - 3), (d += f), (u += 4 * (f /= 3)))
		var y,
			c,
			b,
			g,
			m,
			v,
			e = l + d,
			A = new Float64Array(e),
			_ = 0,
			E = e - 1,
			C = f / 2,
			G = Y.IndexDatatype.createTypedArray(e / 3, u + 4),
			T = 0
		if (((G[T++] = _ / 3), (G[T++] = (E - 2) / 3), h)) {
			r.push(_ / 3), (v = J), (m = j)
			for (var P = n[0], w = 0; w < C; w++)
				(v = R.Cartesian3.fromArray(P, 3 * (C - 1 - w), v)),
					(m = R.Cartesian3.fromArray(P, 3 * (C + w), m)),
					W.CorridorGeometryLibrary.addAttribute(A, m, _),
					W.CorridorGeometryLibrary.addAttribute(A, v, void 0, E),
					(g = (c = _ / 3) + 1),
					(b = (y = (E - 2) / 3) - 1),
					(G[T++] = y),
					(G[T++] = b),
					(G[T++] = c),
					(G[T++] = g),
					(_ += 3),
					(E -= 3)
		}
		var L = 0,
			D = o[L++],
			k = o[L++]
		for (
			A.set(D, _),
				A.set(k, E - k.length + 1),
				i = k.length - 3,
				r.push(_ / 3, (E - 2) / 3),
				w = 0;
			w < i;
			w += 3
		)
			(g = (c = _ / 3) + 1),
				(b = (y = (E - 2) / 3) - 1),
				(G[T++] = y),
				(G[T++] = b),
				(G[T++] = c),
				(G[T++] = g),
				(_ += 3),
				(E -= 3)
		for (w = 0; w < a.length; w++) {
			var N,
				O,
				V,
				x = (O = a[w]).leftPositions,
				H = O.rightPositions,
				I = z
			if (M.defined(x)) {
				for (E -= 3, V = b, r.push(g), N = 0; N < x.length / 3; N++)
					(I = R.Cartesian3.fromArray(x, 3 * N, I)),
						(G[T++] = V - N - 1),
						(G[T++] = V - N),
						W.CorridorGeometryLibrary.addAttribute(A, I, void 0, E),
						(E -= 3)
				r.push(V - Math.floor(x.length / 6)),
					t === q.CornerType.BEVELED && r.push((E - 2) / 3 + 1),
					(_ += 3)
			} else {
				for (_ += 3, V = g, r.push(b), N = 0; N < H.length / 3; N++)
					(I = R.Cartesian3.fromArray(H, 3 * N, I)),
						(G[T++] = V + N),
						(G[T++] = V + N + 1),
						W.CorridorGeometryLibrary.addAttribute(A, I, _),
						(_ += 3)
				r.push(V + Math.floor(H.length / 6)),
					t === q.CornerType.BEVELED && r.push(_ / 3 - 1),
					(E -= 3)
			}
			for (
				D = o[L++],
					k = o[L++],
					D.splice(0, 3),
					k.splice(k.length - 3, 3),
					A.set(D, _),
					A.set(k, E - k.length + 1),
					i = k.length - 3,
					N = 0;
				N < k.length;
				N += 3
			)
				(c = (g = _ / 3) - 1),
					(y = (b = (E - 2) / 3) + 1),
					(G[T++] = y),
					(G[T++] = b),
					(G[T++] = c),
					(G[T++] = g),
					(_ += 3),
					(E -= 3)
			;(_ -= 3), (E += 3), r.push(_ / 3, (E - 2) / 3)
		}
		if (h) {
			;(_ += 3), (E -= 3), (v = J), (m = j)
			var S = n[1]
			for (w = 0; w < C; w++)
				(v = R.Cartesian3.fromArray(S, 3 * (f - w - 1), v)),
					(m = R.Cartesian3.fromArray(S, 3 * w, m)),
					W.CorridorGeometryLibrary.addAttribute(A, v, void 0, E),
					W.CorridorGeometryLibrary.addAttribute(A, m, _),
					(c = (g = _ / 3) - 1),
					(y = (b = (E - 2) / 3) + 1),
					(G[T++] = y),
					(G[T++] = b),
					(G[T++] = c),
					(G[T++] = g),
					(_ += 3),
					(E -= 3)
			r.push(_ / 3)
		} else r.push(_ / 3, (E - 2) / 3)
		return (
			(G[T++] = _ / 3),
			(G[T++] = (E - 2) / 3),
			(s.position = new U.GeometryAttribute({
				componentDatatype: B.ComponentDatatype.DOUBLE,
				componentsPerAttribute: 3,
				values: A,
			})),
			{ attributes: s, indices: G, wallIndices: r }
		)
	}
	function h(e) {
		var t = (e = M.defaultValue(e, M.defaultValue.EMPTY_OBJECT)).positions,
			i = e.width,
			r = M.defaultValue(e.height, 0),
			o = M.defaultValue(e.extrudedHeight, r)
		;(this._positions = t),
			(this._ellipsoid = R.Ellipsoid.clone(
				M.defaultValue(e.ellipsoid, R.Ellipsoid.WGS84),
			)),
			(this._width = i),
			(this._height = Math.max(r, o)),
			(this._extrudedHeight = Math.min(r, o)),
			(this._cornerType = M.defaultValue(e.cornerType, q.CornerType.ROUNDED)),
			(this._granularity = M.defaultValue(
				e.granularity,
				u.CesiumMath.RADIANS_PER_DEGREE,
			)),
			(this._offsetAttribute = e.offsetAttribute),
			(this._workerName = 'createCorridorOutlineGeometry'),
			(this.packedLength =
				1 + t.length * R.Cartesian3.packedLength + R.Ellipsoid.packedLength + 6)
	}
	h.pack = function (e, t, i) {
		i = M.defaultValue(i, 0)
		var r = e._positions,
			o = r.length
		t[i++] = o
		for (var a = 0; a < o; ++a, i += R.Cartesian3.packedLength)
			R.Cartesian3.pack(r[a], t, i)
		return (
			R.Ellipsoid.pack(e._ellipsoid, t, i),
			(i += R.Ellipsoid.packedLength),
			(t[i++] = e._width),
			(t[i++] = e._height),
			(t[i++] = e._extrudedHeight),
			(t[i++] = e._cornerType),
			(t[i++] = e._granularity),
			(t[i] = M.defaultValue(e._offsetAttribute, -1)),
			t
		)
	}
	var y = R.Ellipsoid.clone(R.Ellipsoid.UNIT_SPHERE),
		c = {
			positions: void 0,
			ellipsoid: y,
			width: void 0,
			height: void 0,
			extrudedHeight: void 0,
			cornerType: void 0,
			granularity: void 0,
			offsetAttribute: void 0,
		}
	return (
		(h.unpack = function (e, t, i) {
			t = M.defaultValue(t, 0)
			for (
				var r = e[t++], o = new Array(r), a = 0;
				a < r;
				++a, t += R.Cartesian3.packedLength
			)
				o[a] = R.Cartesian3.unpack(e, t)
			var n = R.Ellipsoid.unpack(e, t, y)
			t += R.Ellipsoid.packedLength
			var s = e[t++],
				l = e[t++],
				d = e[t++],
				u = e[t++],
				p = e[t++],
				f = e[t]
			return M.defined(i)
				? ((i._positions = o),
				  (i._ellipsoid = R.Ellipsoid.clone(n, i._ellipsoid)),
				  (i._width = s),
				  (i._height = l),
				  (i._extrudedHeight = d),
				  (i._cornerType = u),
				  (i._granularity = p),
				  (i._offsetAttribute = -1 === f ? void 0 : f),
				  i)
				: ((c.positions = o),
				  (c.width = s),
				  (c.height = l),
				  (c.extrudedHeight = d),
				  (c.cornerType = u),
				  (c.granularity = p),
				  (c.offsetAttribute = -1 === f ? void 0 : f),
				  new h(c))
		}),
		(h.createGeometry = function (e) {
			var t = e._positions,
				i = e._width,
				r = e._ellipsoid,
				t = (function (e, t) {
					for (var i = 0; i < e.length; i++)
						e[i] = t.scaleToGeodeticSurface(e[i], e[i])
					return e
				})(t, r),
				o = f.arrayRemoveDuplicates(t, R.Cartesian3.equalsEpsilon)
			if (!(o.length < 2 || i <= 0)) {
				var a,
					n = e._height,
					s = e._extrudedHeight,
					t = !u.CesiumMath.equalsEpsilon(n, s, 0, u.CesiumMath.EPSILON2),
					i = {
						ellipsoid: r,
						positions: o,
						width: i,
						cornerType: e._cornerType,
						granularity: e._granularity,
						saveAttributes: !1,
					}
				t
					? ((i.height = n),
					  (i.extrudedHeight = s),
					  (i.offsetAttribute = e._offsetAttribute),
					  (a = (function (e) {
							var t = e.ellipsoid,
								i = (l = _(
									W.CorridorGeometryLibrary.computePositions(e),
									e.cornerType,
								)).wallIndices,
								r = e.height,
								o = e.extrudedHeight,
								a = l.attributes,
								n = l.indices,
								s = (d = a.position.values).length
							;(u = new Float64Array(s)).set(d)
							var l = new Float64Array(2 * s),
								d = A.PolygonPipeline.scaleToGeodeticHeight(d, r, t),
								u = A.PolygonPipeline.scaleToGeodeticHeight(u, o, t)
							l.set(d),
								l.set(u, s),
								(a.position.values = l),
								(s /= 3),
								M.defined(e.offsetAttribute) &&
									((u = new Uint8Array(2 * s)),
									(u =
										e.offsetAttribute === v.GeometryOffsetAttribute.TOP
											? v.arrayFill(u, 1, 0, s)
											: ((e =
													e.offsetAttribute === v.GeometryOffsetAttribute.NONE
														? 0
														: 1),
											  v.arrayFill(u, e))),
									(a.applyOffset = new U.GeometryAttribute({
										componentDatatype: B.ComponentDatatype.UNSIGNED_BYTE,
										componentsPerAttribute: 1,
										values: u,
									})))
							var p = n.length,
								f = Y.IndexDatatype.createTypedArray(
									l.length / 3,
									2 * (p + i.length),
								)
							f.set(n)
							for (var h, y, c = p, b = 0; b < p; b += 2) {
								var g = n[b],
									m = n[b + 1]
								;(f[c++] = g + s), (f[c++] = m + s)
							}
							for (b = 0; b < i.length; b++)
								(y = (h = i[b]) + s), (f[c++] = h), (f[c++] = y)
							return { attributes: a, indices: f }
					  })(i)))
					: (((a = _(
							W.CorridorGeometryLibrary.computePositions(i),
							i.cornerType,
					  )).attributes.position.values = A.PolygonPipeline.scaleToGeodeticHeight(
							a.attributes.position.values,
							n,
							r,
					  )),
					  M.defined(e._offsetAttribute) &&
							((l = a.attributes.position.values.length),
							(d = new Uint8Array(l / 3)),
							(l =
								e._offsetAttribute === v.GeometryOffsetAttribute.NONE ? 0 : 1),
							v.arrayFill(d, l),
							(a.attributes.applyOffset = new U.GeometryAttribute({
								componentDatatype: B.ComponentDatatype.UNSIGNED_BYTE,
								componentsPerAttribute: 1,
								values: d,
							}))))
				var l = a.attributes,
					d = p.BoundingSphere.fromVertices(l.position.values, void 0, 3)
				return new U.Geometry({
					attributes: l,
					indices: a.indices,
					primitiveType: U.PrimitiveType.LINES,
					boundingSphere: d,
					offsetAttribute: e._offsetAttribute,
				})
			}
		}),
		function (e, t) {
			return (
				M.defined(t) && (e = h.unpack(e, t)),
				(e._ellipsoid = R.Ellipsoid.clone(e._ellipsoid)),
				h.createGeometry(e)
			)
		}
	)
})
