import { merge } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export type ButtonPress = {
	v: number // 4398
	ts: number // 1669741244042
}

/**
 * @deprecated Use FuelGauge
 */
export type BatteryInfo = {
	v: number // 4398
	ts: number // 1669741244042
}

export type NoData = 'gnss' | 'ncell'

/**
 * @see https://infocenter.nordicsemi.com/topic/ref_at_commands/REF/at_commands/mob_termination_ctrl_status/coneval_set.html
 */
export enum EnergyEstimate {
	/**
	 * Bad conditions. Difficulties in setting up connections.
	 * Maximum number of repetitions might be needed for data.
	 */
	Bad = 5,
	/**
	 * Poor conditions.
	 * Setting up a connection might require retries and a higher number of
	 * repetitions for data.
	 */
	Poor = 6,
	/**
	 * Normal conditions for cIoT device.
	 * No repetitions for data or only a few repetitions in the worst case.
	 */
	Normal = 7,
	/**
	 * Good conditions. Possibly very good conditions for small amounts of data.
	 */
	Good = 8,
	/**
	 * Excellent conditions.
	 * Efficient data transfer estimated also for larger amounts of data.
	 */
	Excellent = 9,
}

export type Reported = Partial<{
	cfg: {
		act: boolean
		loct: number
		actwt: number
		mvres: number
		mvt: number
		accath: number
		accith: number
		accito: number
		nod: NoData[]
	}
	dev: {
		v: {
			imei: string // '351358815341265'
			iccid?: string // '89457387300008502281'
			modV: string // 'mfw_nrf9160_1.3.2'
			brdV: string // 'thingy91_nrf9160'
			appV: string // '1.1.0-thingy91_nrf9160_ns'
			bat?: string
		}
		ts: number // 1669731049109
	}
	roam: {
		v: {
			band?: number // 20
			nw?: string // 'LTE-M'
			rsrp?: number // -88
			area?: number // 30401
			mccmnc?: number // 24201
			cell?: number // 21679616
			ip?: string // '100.74.127.54'
			eest?: EnergyEstimate // 8
		}
		ts: number // 1669741244010
	}
	env: {
		v: {
			temp?: number // 27.75
			hum?: number // 13.257
			atmp?: number // 101.497
			/*
			 * @see https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf
			 */
			bsec_iaq?: number // 137
		}
		ts: number //1669741243982
	}
	/**
	 * @deprecated Use `fg`
	 */
	bat: BatteryInfo
	btn: ButtonPress
	gnss: {
		v: {
			lng: number // 10.4383147713927
			lat: number // 63.42503380159108
			acc?: number // 19.08224868774414
			alt?: number // 117.34368896484375
			spd?: number // 5.4213972091674805
			hdg?: number // 170.65904235839844
		}
		ts: number // 1670245539000
	}
	// Device has a fixed geo location
	geo: {
		lng: number // 10.4383147713927
		lat: number // 63.42503380159108
	}
	// Fuel gauge, see https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/pull/836
	fg: {
		v: {
			V?: number // e.g. 2754
			I?: number // e.g. -250
			T?: number // e.g. 231
			SoC?: number // e.g. 93
			TTF?: number // e.g. 4652
			TTE?: number // e.g. 4652
		}
		ts: number // 1563968747123
	}
}>

export enum GeoLocationSource {
	GNSS = 'gnss',
	fixed = 'fixed',
	MCELL = 'MCELL',
	SCELL = 'SCELL',
	WIFI = 'WIFI',
}

export type GeoLocation = {
	lat: number
	lng: number
	accuracy?: number
	source: GeoLocationSource
	label?: string
	ts: Date
}

export enum DeviceType {
	SOFT_SIM = 'soft-sim',
}
export type Location = Record<GeoLocationSource, GeoLocation>
export type Device = {
	id: string
	state?: Reported
	location?: Location
	history?: Summary
	type?: DeviceType
}

export type Devices = Record<string, Device>

export type Reading = [
	v: number,
	// Delta to the base date in seconds
	d: number,
]
export type Summary = {
	base: Date // '2022-12-07T12:09:59.488Z'
	/**
	 * @deprecated use fuel gauge data
	 */
	bat?: Array<Reading>
	temp?: Array<Reading>
	// Fuel gauge readings, see https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/4713549af719a7e119324853aa117d752ac856e3/docs/cloud-protocol/Reported.ts#L111
	fgSoC?: Array<Reading>
	fgI?: Array<Reading>
}

export const isTracker = (device: Device): boolean => {
	if (!('state' in device)) return false
	const { appV, brdV } = device.state?.dev?.v ?? {}
	return appV !== undefined && brdV !== undefined
}

export const hasSoftSIM = (device: Device): boolean =>
	device.state?.dev?.v?.appV?.includes('softsim') ?? false

export const DevicesContext = createContext<{
	devices: Devices
	updateState: (deviceId: string, reported: Reported) => void
	updateLocation: (
		deviceId: string,
		location: GeoLocation,
		originalSource: string,
	) => void
	updateHistory: (deviceId: string, history: Summary) => void
	updateAlias: (deviceId: string, alias: string) => void
	updateType: (deviceId: string, type: DeviceType) => void
	lastUpdateTs: (deviceId: string) => number | null
	alias: (deviceId: string) => string | undefined
	type: (deviceId: string) => DeviceType | undefined
}>({
	updateState: () => undefined,
	updateLocation: () => undefined,
	updateHistory: () => undefined,
	updateAlias: () => undefined,
	alias: () => undefined,
	updateType: () => undefined,
	type: () => undefined,
	lastUpdateTs: () => null,
	devices: {},
})

const deviceAliases: Record<string, string> = {}
const deviceTypes: Record<string, DeviceType> = {}

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [knownDevices, updateDevices] = useState<Devices>({})

	return (
		<DevicesContext.Provider
			value={{
				devices: knownDevices,
				updateState: (deviceId, reported) => {
					updateDevices((devices) => {
						const updated: Device = {
							...devices[deviceId],
							id: deviceId,
							state: merge(devices[deviceId]?.state ?? {}, reported),
						}
						// Use GNSS location from shadow
						if (
							reported.gnss !== undefined &&
							reported.gnss.ts > Date.now() - 60 * 60 * 1000
						) {
							updated.location = {
								...(updated.location ?? {}),
								[GeoLocationSource.GNSS]: {
									lat: reported.gnss.v.lat,
									lng: reported.gnss.v.lng,
									accuracy: reported.gnss.v.acc,
									source: GeoLocationSource.GNSS,
									ts: new Date(reported.gnss.ts),
								},
							} as Location
						}
						// Use fixed location from shadow
						if (reported.geo !== undefined) {
							updated.location = {
								...(updated.location ?? {}),
								[GeoLocationSource.fixed]: {
									lat: reported.geo.lat,
									lng: reported.geo.lng,
									accuracy: 1,
									source: GeoLocationSource.fixed,
								},
							} as Location
						}
						// Remove values not sent by the device (merge only adds new values)
						if (reported.fg !== undefined && updated.state?.fg !== undefined) {
							updated.state = {
								...updated.state,
								fg: reported.fg,
							}
						}
						// Convert legacy battery info to fuel gauge
						if (reported.bat !== undefined) {
							if ((reported.fg?.ts ?? 0) < reported.bat.ts) {
								reported.fg = {
									v: {
										...(reported.fg?.v ?? {}),
										V: reported.bat.v,
									},
									ts: reported.bat.ts,
								}
							}
						}
						return {
							...devices,
							[deviceId]: updated,
						}
					})
				},
				updateLocation: (deviceId, location) => {
					updateDevices((devices) => ({
						...devices,
						[deviceId]: {
							...devices[deviceId],
							id: deviceId,
							location: {
								...(devices[deviceId]?.location ?? {}),
								[location.source]: location,
							} as Location,
						},
					}))
				},
				updateHistory: (deviceId, history) => {
					updateDevices((devices) => ({
						...devices,
						[deviceId]: {
							...devices[deviceId],
							id: deviceId,
							history: {
								...history,
								base: new Date(history.base),
							},
						},
					}))
				},
				lastUpdateTs: (deviceId) => {
					const device = knownDevices[deviceId]
					if (device === undefined) return null
					return getDeviceLastUpdateTime(knownDevices[deviceId])
				},
				updateAlias: (deviceId, alias) => {
					deviceAliases[deviceId] = alias
				},
				alias: (deviceId) => deviceAliases[deviceId],
				updateType: (deviceId, type) => {
					deviceTypes[deviceId] = type
				},
				type: (deviceId) => deviceTypes[deviceId],
			}}
		>
			{children}
		</DevicesContext.Provider>
	)
}

export const Consumer = DevicesContext.Consumer

export const useDevices = () => useContext(DevicesContext)

const getDeviceLastUpdateTime = (device?: Device): null | number => {
	const state = device?.state
	return getLastUpdateTime([
		state?.btn?.ts,
		state?.dev?.ts,
		state?.env?.ts,
		state?.gnss?.ts,
		state?.roam?.ts,
		state?.fg?.ts,
	])
}

export const getLastUpdateTime = (
	lastUpdateTimeStamps: (number | undefined)[],
): null | number => {
	const nonEmpty = lastUpdateTimeStamps.filter((s) => s !== undefined)
	return nonEmpty.length > 0 ? Math.max(...nonEmpty) : null
}
