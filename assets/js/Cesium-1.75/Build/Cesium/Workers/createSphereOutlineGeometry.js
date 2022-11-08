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
	'./EllipsoidOutlineGeometry-7ef60a22',
], function (r, e, i, n, t, s, o, a, d, c, l, u, m) {
	'use strict'
	function p(e) {
		var i = r.defaultValue(e.radius, 1),
			e = {
				radii: new n.Cartesian3(i, i, i),
				stackPartitions: e.stackPartitions,
				slicePartitions: e.slicePartitions,
				subdivisions: e.subdivisions,
			}
		;(this._ellipsoidGeometry = new m.EllipsoidOutlineGeometry(e)),
			(this._workerName = 'createSphereOutlineGeometry')
	}
	;(p.packedLength = m.EllipsoidOutlineGeometry.packedLength),
		(p.pack = function (e, i, t) {
			return m.EllipsoidOutlineGeometry.pack(e._ellipsoidGeometry, i, t)
		})
	var f = new m.EllipsoidOutlineGeometry(),
		y = {
			radius: void 0,
			radii: new n.Cartesian3(),
			stackPartitions: void 0,
			slicePartitions: void 0,
			subdivisions: void 0,
		}
	return (
		(p.unpack = function (e, i, t) {
			i = m.EllipsoidOutlineGeometry.unpack(e, i, f)
			return (
				(y.stackPartitions = i._stackPartitions),
				(y.slicePartitions = i._slicePartitions),
				(y.subdivisions = i._subdivisions),
				r.defined(t)
					? (n.Cartesian3.clone(i._radii, y.radii),
					  (t._ellipsoidGeometry = new m.EllipsoidOutlineGeometry(y)),
					  t)
					: ((y.radius = i._radii.x), new p(y))
			)
		}),
		(p.createGeometry = function (e) {
			return m.EllipsoidOutlineGeometry.createGeometry(e._ellipsoidGeometry)
		}),
		function (e, i) {
			return r.defined(i) && (e = p.unpack(e, i)), p.createGeometry(e)
		}
	)
})
