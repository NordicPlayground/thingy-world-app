import { identifyIssuer } from 'e118-iin-list'
import { UploadCloud, Wifi } from 'lucide-preact'
import { styled } from 'styled-components'
import { ButtonPress } from './ButtonPress.js'
import { CountryFlag } from './CountryFlag.js'
import {
	IssuerName,
	LastUpdate,
	Properties,
	ShieldIcon,
	Title,
} from './DeviceList.js'
import { DeviceName } from './DeviceName.js'
import { EnvironmentInfo } from './EnvironmentInfo.js'
import { FuelGauge } from './FuelGauge.js'
import { LocationInfo } from './LocationInfo.js'
import { PinTile } from './PinTile.js'
import { RelativeTime } from './RelativeTime.js'
import { SignalQuality } from './SignalQuality.js'
import { UpdateWarning } from './UpdateWarning.js'
import { wifiColor } from './colors.js'
import {
	hasSoftSIM,
	useDevices,
	type Device,
	type GeoLocation,
} from './context/Devices.js'
import { useSettings } from './context/Settings.js'
import { showDetails } from './hooks/useDetails.js'
import { DKIcon } from './icons/DKIcon.js'
import { SIMIcon } from './icons/SIMIcon.js'
import { SoftSIMIcon } from './icons/SoftSIMIcon.js'
import { ThingyIcon } from './icons/ThingyIcon.js'
import { ThingyXIcon } from './icons/ThingyXIcon.js'
import { Reboots } from './memfault/Reboots.js'
import { removeOldLocation } from './removeOldLocation.js'
import { sortLocations } from './sortLocations.js'

const StyledSIMIcon = styled(SIMIcon)`
	width: 20px;
	height: 18px;
	margin: 0 0 0 4px;
`
const StyledSoftSIMIcon = styled(SoftSIMIcon)`
	width: 20px;
	height: 18px;
	margin: 0 0 0 4px;
`

export const Tracker = ({
	device,
	onCenter,
}: {
	device: Device
	onCenter: (location: GeoLocation) => void
}) => {
	const { lastUpdateTs } = useDevices()
	const {
		settings: { showUpdateWarning },
	} = useSettings()

	const { location, state } = device
	const rankedLocations = Object.values(location ?? [])
		.sort(sortLocations)
		.filter(removeOldLocation)
	const deviceLocation = rankedLocations[0]

	const buttonPress = state?.btn
	const { brdV, appV, iccid } = state?.dev?.v ?? {}

	const lastUpdateTime = lastUpdateTs(device.id) as number

	const BoardIcon =
		(brdV?.includes('nrf9160dk') ?? false)
			? DKIcon
			: (brdV?.includes('thingy91x') ?? false)
				? ThingyXIcon
				: ThingyIcon

	return (
		<>
			<Title
				onClick={() => {
					if (deviceLocation !== undefined) {
						onCenter(deviceLocation)
					}
					showDetails(device.id)
				}}
			>
				<BoardIcon class="icon" />
				<span class="info">
					{appV?.includes('wifi') === true && (
						<ShieldIcon>
							<Wifi
								style={{
									color: wifiColor,
								}}
							/>
						</ShieldIcon>
					)}
					<DeviceName device={device} />
				</span>
				<CountryFlag device={device} />
				{lastUpdateTime !== undefined && (
					<LastUpdate title="Last update">
						<UploadCloud strokeWidth={1} />
						<RelativeTime time={new Date(lastUpdateTime)} />
					</LastUpdate>
				)}
				<PinTile device={device} />
			</Title>
			<Properties>
				<SignalQuality device={device} />
				{iccid !== undefined && (
					<>
						<dt>
							{hasSoftSIM(device) ? (
								<abbr title="SoftSIM">
									<StyledSoftSIMIcon />
								</abbr>
							) : (
								<StyledSIMIcon />
							)}
						</dt>
						<IssuerName>{identifyIssuer(iccid)?.companyName ?? '?'}</IssuerName>
					</>
				)}
				{buttonPress !== undefined && (
					<ButtonPress
						key={`${device.id}-press-${buttonPress.ts}`}
						buttonPress={buttonPress}
					/>
				)}
				<EnvironmentInfo
					device={device}
					onClick={() => {
						showDetails(device.id)
					}}
				/>
				{state?.fg !== undefined && (
					<FuelGauge
						fg={state.fg}
						onClick={() => {
							showDetails(device.id)
						}}
					/>
				)}
				<LocationInfo device={device} />
				{showUpdateWarning && device.state !== undefined && (
					<UpdateWarning reported={device.state} />
				)}
				<Reboots device={device} />
			</Properties>
		</>
	)
}
