import { chartMath, type ChartData } from './chartMath.js'
import { generateLabels } from './generateLabels.js'

export const HistoryChart = ({
	data,
	padding,
	height,
	width,
	fontSize: f,
}: {
	data: ChartData
	padding?: number
	height?: number
	width?: number
	fontSize?: number
}) => {
	const h = height ?? 300
	const w = width ?? 600
	const fontSize = f ?? 14

	const m = chartMath({
		width: w,
		height: h,
		padding: padding ?? 30,
		startDate: new Date(),
		minutes: data.xAxis.minutes,
		labelEvery: data.xAxis.labelEvery,
	})

	const labels = generateLabels(m, data.xAxis)
	const yAxisLegendLineWidth = fontSize - (fontSize * 1) / 3
	const dataset0 = data.datasets[0]
	const dataset1 = data.datasets[1]

	return (
		<svg
			width={w}
			height={h}
			viewBox={`0 0 ${w} ${h}`}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* x axis labels and lines */}
			<g>
				{labels.map((label, index) => (
					<>
						<path
							style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;fill:none`}
							d={`M ${
								m.paddingLeft + m.xSpacing * data.xAxis.labelEvery * index
							},${m.paddingY * 2} v ${m.yAxisHeight}`}
						/>
						{!data.xAxis.hideLabels && index > 0 && (
							<text
								x={m.paddingLeft + m.xSpacing * data.xAxis.labelEvery * index}
								y={h - m.paddingY}
								text-anchor="middle"
								font-size={fontSize}
								fill={data.xAxis.color}
								stroke="#000000"
								stroke-width={4}
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-miterlimit={4}
								paint-order={'markers stroke fill'}
							>
								{label}
							</text>
						)}
					</>
				))}
			</g>
			{/* y axis labels */}
			<g>
				{dataset0 !== undefined && (
					<>
						{/* line, first dataset, top */}
						<path
							style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:stroke fill markers`}
							d={`M ${m.paddingLeft - yAxisLegendLineWidth},${m.paddingY * 2} h ${yAxisLegendLineWidth}`}
						/>
						{/* line, first dataset, bottom */}
						<path
							style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:stroke fill markers`}
							d={`M ${m.paddingLeft - yAxisLegendLineWidth},${m.paddingY * 2 + m.yAxisHeight} h ${yAxisLegendLineWidth}`}
						/>
						{/* text, first dataset, top */}
						<text
							style={`fill:${data.xAxis.color};opacity:0.5;font-weight:700`}
							x={m.paddingLeft - yAxisLegendLineWidth - 2}
							y={m.paddingY * 2 + fontSize / 3}
							text-anchor={'end'}
							font-size={fontSize}
						>
							{dataset0.format(dataset0.max)}
						</text>
						{/* text, first dataset, bottom */}
						<text
							style={`fill:${data.xAxis.color};opacity:0.5;font-weight:700`}
							x={m.paddingLeft - yAxisLegendLineWidth - 2}
							y={m.paddingY * 2 + m.yAxisHeight + fontSize / 3}
							text-anchor={'end'}
							font-size={fontSize}
						>
							{dataset0.format(dataset0.min)}
						</text>
					</>
				)}
				{dataset1 !== undefined && (
					<>
						{/* line, second dataset, top */}
						<path
							style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:stroke fill markers`}
							d={`M ${m.paddingLeft + m.xSpacing * (labels.length - 1) * data.xAxis.labelEvery},${m.paddingY * 2} h ${yAxisLegendLineWidth}`}
						/>
						{/* line, second dataset, bottom */}
						<path
							style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:stroke fill markers`}
							d={`M ${m.paddingLeft + m.xSpacing * (labels.length - 1) * data.xAxis.labelEvery},${m.paddingY * 2 + m.yAxisHeight} h ${yAxisLegendLineWidth}`}
						/>
						{/* text, first dataset, top */}
						<text
							style={`fill:${data.xAxis.color};opacity:0.5;font-weight:700`}
							x={
								m.paddingLeft +
								m.xSpacing * (labels.length - 1) * data.xAxis.labelEvery +
								yAxisLegendLineWidth +
								2
							}
							y={m.paddingY * 2 + fontSize / 3}
							text-anchor={'start'}
							font-size={fontSize}
						>
							{dataset1.format(dataset1.max)}
						</text>
						{/* text, first dataset, bottom */}
						<text
							style={`fill:${data.xAxis.color};opacity:0.5;font-weight:700`}
							x={
								m.paddingLeft +
								m.xSpacing * (labels.length - 1) * data.xAxis.labelEvery +
								yAxisLegendLineWidth +
								2
							}
							y={m.paddingY * 2 + m.yAxisHeight + fontSize / 3}
							text-anchor={'start'}
							font-size={fontSize}
						>
							{dataset1.format(dataset1.min)}
						</text>
					</>
				)}
			</g>
			{/*
			<g>
				{data.datasets.map(({ min, max, format }, index) => {
					const width = fontSize - (fontSize * 1) / 3
					const xPos =
						index === 0
							? m.paddingLeft - fontSize
							: m.paddingLeft +
							m.xSpacing * data.xAxis.labelEvery * (labels.length - 1) +
							fontSize
					const anchor = index === 0 ? 'end' : 'start'
					return (
						<>
							<path
								style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:stroke fill markers`}
								d={`M ${xPos + (fontSize * 1) / 3},${m.paddingY * 2} h ${width
									}`}
							/>
							<path
								style={`stroke:${data.xAxis.color};stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:stroke fill markers`}
								d={`M ${xPos + (fontSize * 1) / 3},${m.paddingY * 2 + m.yAxisHeight
									} h ${fontSize - (fontSize * 1) / 3}`}
							/>
							<text
								style={`fill:${data.xAxis.color};opacity:0.5;font-weight:700`}
								x={xPos}
								y={m.paddingY * 2 + fontSize / 3}
								text-anchor={anchor}
								font-size={fontSize}
							>
								{format(max)}
							</text>
							<text
								style={`fill:${data.xAxis.color};opacity:0.5;font-weight:700`}
								x={xPos}
								y={m.paddingY * 2 + m.yAxisHeight + fontSize / 3}
								text-anchor={anchor}
								font-size={fontSize}
							>
								{format(min)}
							</text>
						</>
					)
				})}
			</g>
			*/}
			{/* helper lines */}
			{data.datasets
				.filter(({ helperLines }) => helperLines !== undefined)
				.map(({ helperLines, min, max, format }) =>
					helperLines?.map(({ label, value }) => {
						const y = m.yPosition({ min, max }, value)
						return (
							<g>
								<path
									stroke={data.xAxis.color}
									stroke-width={1}
									stroke-dasharray={'2 2'}
									d={`M ${m.paddingLeft},${y + m.paddingY} h ${m.xAxisWidth}`}
								/>
								<text
									fill={data.xAxis.color}
									font-size={fontSize * 0.8}
									y={y + m.paddingY + 3}
									x={m.paddingLeft - 3}
									text-anchor="end"
								>
									{format(value)}
								</text>
								<text
									fill={data.xAxis.color}
									font-size={fontSize * 0.8}
									y={y + m.paddingY + 3}
									x={m.paddingLeft + 3 + m.xAxisWidth}
									text-anchor="start"
								>
									{label}
								</text>
							</g>
						)
					}),
				)}
			{/* datasets lines */}
			{data.datasets.map((dataset) => {
				const lineDefinition: string[] = []
				for (let i = 0; i < dataset.values.length; i++) {
					const [v, ts] = dataset.values[i] as [number, Date]
					const x = m.xPosition(ts)
					if (x === null) continue
					if (i === 0) {
						lineDefinition.push(
							`M ${x},${m.yPosition(dataset, v) + m.paddingY}`,
						)
					} else {
						lineDefinition.push(
							`L ${x},${m.yPosition(dataset, v) + m.paddingY}`,
						)
					}
				}
				return (
					<path
						style={`stroke:${dataset.color};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;fill:none`}
						d={lineDefinition.join(' ')}
					/>
				)
			})}
			{/* dataset labels */}
			{data.datasets.map((dataset) => {
				const labels = []
				for (let i = 0; i < dataset.values.length; i++) {
					if (i % data.xAxis.labelEvery === 0) {
						const [v, ts] = dataset.values[i] as [number, Date]
						const x = m.xPosition(ts)
						if (x === null) continue
						labels.push(
							<circle
								style={`fill:none;stroke:${dataset.color};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;paint-order:markers fill stroke`}
								cy={m.yPosition(dataset, v) + m.paddingY}
								cx={x}
								r="6"
							/>,
						)
						labels.push(
							<text
								style={`fill:${dataset.color};font-weight:700;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:2;stroke-opacity:1;paint-order:stroke fill markers`}
								y={m.yPosition(dataset, v) + m.paddingY - m.padding / 2}
								x={x}
								text-anchor="middle"
								font-size={fontSize}
							>
								{dataset.format(v)}
							</text>,
						)
					}
				}
				return labels
			})}
		</svg>
	)
}
