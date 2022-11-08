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
	'./Plane-c8971487',
	'./VertexFormat-7572c785',
	'./FrustumGeometry-5d17caee',
], function (o, e, t, c, m, r, n, h, d, f, a, u, g) {
	'use strict'
	var s = 0,
		i = 1
	function p(e) {
		var t,
			r,
			n = e.frustum,
			a = e.orientation,
			u = e.origin,
			e = o.defaultValue(e._drawNearPlane, !0)
		n instanceof g.PerspectiveFrustum
			? ((t = s), (r = g.PerspectiveFrustum.packedLength))
			: n instanceof g.OrthographicFrustum &&
			  ((t = i), (r = g.OrthographicFrustum.packedLength)),
			(this._frustumType = t),
			(this._frustum = n.clone()),
			(this._origin = c.Cartesian3.clone(u)),
			(this._orientation = m.Quaternion.clone(a)),
			(this._drawNearPlane = e),
			(this._workerName = 'createFrustumOutlineGeometry'),
			(this.packedLength =
				2 + r + c.Cartesian3.packedLength + m.Quaternion.packedLength)
	}
	p.pack = function (e, t, r) {
		r = o.defaultValue(r, 0)
		var n = e._frustumType,
			a = e._frustum
		return (
			(t[r++] = n) === s
				? (g.PerspectiveFrustum.pack(a, t, r),
				  (r += g.PerspectiveFrustum.packedLength))
				: (g.OrthographicFrustum.pack(a, t, r),
				  (r += g.OrthographicFrustum.packedLength)),
			c.Cartesian3.pack(e._origin, t, r),
			(r += c.Cartesian3.packedLength),
			m.Quaternion.pack(e._orientation, t, r),
			(t[(r += m.Quaternion.packedLength)] = e._drawNearPlane ? 1 : 0),
			t
		)
	}
	var _ = new g.PerspectiveFrustum(),
		k = new g.OrthographicFrustum(),
		l = new m.Quaternion(),
		y = new c.Cartesian3()
	return (
		(p.unpack = function (e, t, r) {
			t = o.defaultValue(t, 0)
			var n,
				a = e[t++]
			a === s
				? ((n = g.PerspectiveFrustum.unpack(e, t, _)),
				  (t += g.PerspectiveFrustum.packedLength))
				: ((n = g.OrthographicFrustum.unpack(e, t, k)),
				  (t += g.OrthographicFrustum.packedLength))
			var u = c.Cartesian3.unpack(e, t, y)
			t += c.Cartesian3.packedLength
			var i = m.Quaternion.unpack(e, t, l),
				e = 1 === e[(t += m.Quaternion.packedLength)]
			if (!o.defined(r))
				return new p({
					frustum: n,
					origin: u,
					orientation: i,
					_drawNearPlane: e,
				})
			t = a === r._frustumType ? r._frustum : void 0
			return (
				(r._frustum = n.clone(t)),
				(r._frustumType = a),
				(r._origin = c.Cartesian3.clone(u, r._origin)),
				(r._orientation = m.Quaternion.clone(i, r._orientation)),
				(r._drawNearPlane = e),
				r
			)
		}),
		(p.createGeometry = function (e) {
			var t = e._frustumType,
				r = e._frustum,
				n = e._origin,
				a = e._orientation,
				u = e._drawNearPlane,
				e = new Float64Array(24)
			g.FrustumGeometry._computeNearFarPlanes(n, a, t, r, e)
			for (
				var i,
					o,
					r = new f.GeometryAttributes({
						position: new d.GeometryAttribute({
							componentDatatype: h.ComponentDatatype.DOUBLE,
							componentsPerAttribute: 3,
							values: e,
						}),
					}),
					c = u ? 2 : 1,
					s = new Uint16Array(8 * (1 + c)),
					p = u ? 0 : 1;
				p < 2;
				++p
			)
				(o = 4 * p),
					(s[(i = u ? 8 * p : 0)] = o),
					(s[i + 1] = o + 1),
					(s[i + 2] = o + 1),
					(s[i + 3] = o + 2),
					(s[i + 4] = o + 2),
					(s[i + 5] = o + 3),
					(s[i + 6] = o + 3),
					(s[i + 7] = o)
			for (p = 0; p < 2; ++p)
				(o = 4 * p),
					(s[(i = 8 * (c + p))] = o),
					(s[i + 1] = o + 4),
					(s[i + 2] = o + 1),
					(s[i + 3] = o + 5),
					(s[i + 4] = o + 2),
					(s[i + 5] = o + 6),
					(s[i + 6] = o + 3),
					(s[i + 7] = o + 7)
			return new d.Geometry({
				attributes: r,
				indices: s,
				primitiveType: d.PrimitiveType.LINES,
				boundingSphere: m.BoundingSphere.fromVertices(e),
			})
		}),
		function (e, t) {
			return o.defined(t) && (e = p.unpack(e, t)), p.createGeometry(e)
		}
	)
})
