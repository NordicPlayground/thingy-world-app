import styled from 'styled-components'
import { DisconnectedWarning } from './DisconnectedWarning.js'
import { HistoryOnly } from './HistoryOnly.js'
import { Tracker } from './Tracker.js'
import {
	DeviceType,
	isNRPlusGateway,
	isTracker,
	isWirepasGateway,
	useDevices,
	type Device,
} from './context/Devices.js'
import { useSettings } from './context/Settings.js'
import { useHistoryChart } from './context/showHistoryChart.js'
import { NRPlusGatewayTile } from './NRPlusGatewayTile.js'
import { WirepasGatewayTile } from './wirepas/WirepasGatewayTile.js'

const DeviceState = styled.section`
	color: var(--color-nordic-light-grey);
	position: absolute;
	right: 0;
	top: 0;
	user-select: none;
	overflow: hidden;
	max-height: 100vh;
	overflow-y: auto;
	> ul {
		list-style: none;
		margin: 0;
		padding: 0;
		> li {
			margin: 2px 2px 2px 0;
			padding: 0.5rem;
			text-align: left;
			border: 0;
			background-color: var(--color-panel-bg);
			color: inherit;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			position: relative;
			button {
				border: 0;
				background: transparent;
				color: inherit;
				padding: 0;
			}
		}
	}
`

export const Properties = styled.dl`
	margin: 0;
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: 1fr;
	grid-auto-rows: auto;
	grid-column-gap: 0px;
	grid-row-gap: 0px;
	font-size: 85%;
	dd {
		margin-bottom: 0;
		white-space: nowrap;
	}
	dt {
		display: flex;
		align-items: center;
		margin-right: 0.5rem;
		.lucide {
			margin-right: 4px;
			margin-left: 4px;
		}
	}
	.icon {
		width: 25px;
		height: 25px;
	}
`

export const ShieldIcon = styled.span`
	margin-right: 0.25rem;
`

export const LastUpdate = styled.abbr`
	margin-left: 0.5rem;
	opacity: 0.8;
	font-size: 85%;
	svg {
		margin-right: 0.5rem;
	}
`

export const Title = styled.button`
	display: flex;
	width: 100%;
	align-items: center;
	.icon {
		width: 32px;
		height: 32px;
		margin-right: 0.5rem;
	}
	.info {
		flex-grow: 1;
		text-align: left;
	}
`

export const IssuerName = styled.dd`
	max-width: 20vw;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const DeviceList = () => {
	const { devices, lastUpdateTs, type } = useDevices()
	const { show: showHistoryChart } = useHistoryChart()
	const {
		settings: { showFavorites, favorites, enableWirepas5GMeshGateways },
	} = useSettings()

	const devicesToShow = (
		[
			...Object.entries(devices),
			...Object.entries(devices)
				.filter(
					([gwId]) =>
						type(gwId) === DeviceType.WIREPAS_5G_MESH_GW &&
						enableWirepas5GMeshGateways,
				)
				.map(([gwId, gw]) => [
					gwId,
					{ ...gw, type: DeviceType.WIREPAS_5G_MESH_GW },
				]),
		] as [string, Device][]
	)
		.filter(([deviceId]) => {
			if (!showFavorites) return true
			return favorites.includes(deviceId)
		})
		.filter(([deviceId, device]) => {
			const ts = lastUpdateTs(deviceId)
			if (ts === null) return device.history !== undefined // show devices that have history available (history will have a cut-off of 60 minutes)
			if (ts < Date.now() - 60 * 60 * 1000) return false
			return true
		})
		.sort(([id1], [id2]) => {
			if (!showFavorites)
				return (lastUpdateTs(id2) ?? 0) - (lastUpdateTs(id1) ?? 0)
			return favorites.indexOf(id1) - favorites.indexOf(id2)
		})

	return (
		<DeviceState>
			<DisconnectedWarning />
			<ul>
				{devicesToShow.map(([, device]) => {
					if (isTracker(device))
						return (
							<li>
								<Tracker key={`device:${device.id}`} device={device} />
							</li>
						)
					if (isNRPlusGateway(device)) {
						return (
							<li>
								<NRPlusGatewayTile gateway={device} key={device.id} />
							</li>
						)
					}
					if (isWirepasGateway(device)) {
						return (
							<li>
								<WirepasGatewayTile gateway={device} key={device.id} />
							</li>
						)
					}
					if (device.history !== undefined)
						return (
							<li>
								<HistoryOnly
									device={device}
									onClick={() => {
										showHistoryChart(device.id)
									}}
								/>
							</li>
						)
					return null
				})}
			</ul>
		</DeviceState>
	)
}
