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
], function (r, e, t, c, n, a, u, o, m, s, b, d, f) {
	'use strict'
	return function (e, t) {
		return (
			r.defined(t) && (e = f.FrustumGeometry.unpack(e, t)),
			f.FrustumGeometry.createGeometry(e)
		)
	}
})
