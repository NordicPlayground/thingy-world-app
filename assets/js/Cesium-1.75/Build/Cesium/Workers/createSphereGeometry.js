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
], function (i, e, t, a, r, o, n, s, c, d, l, m, u, p) {
	'use strict'
	function y(e) {
		var t = i.defaultValue(e.radius, 1),
			e = {
				radii: new a.Cartesian3(t, t, t),
				stackPartitions: e.stackPartitions,
				slicePartitions: e.slicePartitions,
				vertexFormat: e.vertexFormat,
			}
		;(this._ellipsoidGeometry = new p.EllipsoidGeometry(e)),
			(this._workerName = 'createSphereGeometry')
	}
	;(y.packedLength = p.EllipsoidGeometry.packedLength),
		(y.pack = function (e, t, r) {
			return p.EllipsoidGeometry.pack(e._ellipsoidGeometry, t, r)
		})
	var f = new p.EllipsoidGeometry(),
		G = {
			radius: void 0,
			radii: new a.Cartesian3(),
			vertexFormat: new u.VertexFormat(),
			stackPartitions: void 0,
			slicePartitions: void 0,
		}
	return (
		(y.unpack = function (e, t, r) {
			t = p.EllipsoidGeometry.unpack(e, t, f)
			return (
				(G.vertexFormat = u.VertexFormat.clone(
					t._vertexFormat,
					G.vertexFormat,
				)),
				(G.stackPartitions = t._stackPartitions),
				(G.slicePartitions = t._slicePartitions),
				i.defined(r)
					? (a.Cartesian3.clone(t._radii, G.radii),
					  (r._ellipsoidGeometry = new p.EllipsoidGeometry(G)),
					  r)
					: ((G.radius = t._radii.x), new y(G))
			)
		}),
		(y.createGeometry = function (e) {
			return p.EllipsoidGeometry.createGeometry(e._ellipsoidGeometry)
		}),
		function (e, t) {
			return i.defined(t) && (e = y.unpack(e, t)), y.createGeometry(e)
		}
	)
})
