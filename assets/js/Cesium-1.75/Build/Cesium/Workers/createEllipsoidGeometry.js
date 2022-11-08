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
	'./GeometryOffsetAttribute-7350d9af',
	'./VertexFormat-7572c785',
	'./EllipsoidGeometry-2c4c641e',
], function (r, e, t, c, n, o, a, i, d, f, s, b, m, u) {
	'use strict'
	return function (e, t) {
		return (
			r.defined(t) && (e = u.EllipsoidGeometry.unpack(e, t)),
			u.EllipsoidGeometry.createGeometry(e)
		)
	}
})
