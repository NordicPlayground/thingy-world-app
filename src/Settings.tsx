import { ChevronUp, Settings2, Star, StarOff } from 'lucide-preact'
import styled from 'styled-components'
import { CodeInput } from './CodeInput'
import { isLightBulb, isMeshGateway, useDevices } from './context/Devices'
import { useSettings } from './context/Settings'

const SettingsPanel = styled.aside`
	font-family: 'Inter', sans-serif;
	margin: 0;
	@media (min-width: 600px) {
		width: 75vw;
		margin: 2rem auto;
	}
	@media (min-width: 900px) {
		width: 50vw;
	}
`

const NodeList = styled.ul`
	list-style: none;
	margin: 0 0 0 1rem;
	padding: 0;
	li {
		&:before {
			content: '└';
		}
	}
`

export const Settings = () => {
	const { devices, alias } = useDevices()
	const {
		settings: {
			showSettings,
			enableTestDevice,
			gainReferenceEveryMinute,
			gainReferenceEveryHour,
			showFavorites,
			consumptionThreshold,
			showUpdateWarning,
			favorites,
		},
		update,
		reset,
	} = useSettings()
	if (!showSettings) return null

	return (
		<SettingsPanel>
			<div class="card">
				<div class="card-header">
					<h1 class="card-title h5 mt-2">Settings</h1>
				</div>
				<div class="card-body">
					<h2 class="h4">Visible devices</h2>
					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							id="showFavorites"
							checked={showFavorites}
							onClick={() => update({ showFavorites: !showFavorites })}
						/>
						<label class="form-check-label" htmlFor="showFavorites">
							Show only favorited devices?
						</label>
					</div>
					{showFavorites && (
						<>
							<p>
								Click the star to show/hide a device.
								<br />
								Click the arrows to move devices up.
							</p>
							<FavoriteSelector />
						</>
					)}
					<div class="form-check mt-2">
						<input
							class="form-check-input"
							type="checkbox"
							id="showTestDevice"
							checked={enableTestDevice}
							onClick={() => update({ enableTestDevice: !enableTestDevice })}
						/>
						<label class="form-check-label" htmlFor="showTestDevice">
							Show test device?
						</label>
					</div>
					<h2 class="h4 mt-4">Devices</h2>
					<div class="form-check mt-2">
						<input
							class="form-check-input"
							type="checkbox"
							id="showUpdateWarning"
							checked={showUpdateWarning}
							onClick={() => update({ showUpdateWarning: !showUpdateWarning })}
						/>
						<label class="form-check-label" htmlFor="showUpdateWarning">
							Show firmware update warning?
						</label>
					</div>
					<h3 class="h5 mt-3">Management</h3>
					<p>Below you can provide the device's code to manage it.</p>
					{/* Code input for Lightbulbs */}
					{Object.values(devices)
						.filter(isLightBulb)
						?.filter(({ id }) => {
							if (!showFavorites) return true
							return favorites.includes(id)
						})
						.map((device) => (
							<CodeInput
								device={device}
								key={device.id}
								alias={alias(device.id)}
							/>
						))}
					{/* Code input for Mesh nodes */}
					{Object.values(devices)
						.filter(isMeshGateway)
						.map(({ meshNodes }) =>
							meshNodes
								?.filter(({ id }) => {
									if (!showFavorites) return true
									return favorites.includes(id)
								})
								.map((device) => (
									<CodeInput
										device={device}
										key={device.id}
										alias={alias(device.id)}
									/>
								)),
						)}
					<h2 class="h4 mt-4">Solar</h2>
					<label htmlFor={'consumptionThreshold'}>
						Above this value, charge is considered sufficiently high enough so
						device does not use battery:
					</label>
					<div class="input-group mb-3">
						<input
							type="number"
							class="form-control"
							id="consumptionThreshold"
							placeholder="e.g. '3.6 mA'"
							step={0.1}
							min={0}
							value={consumptionThreshold}
							onChange={(e) => {
								update({
									consumptionThreshold: parseFloat(
										(e.target as HTMLInputElement).value,
									),
								})
							}}
						/>
						<span class="input-group-text">mA</span>
					</div>
					<p class={'mb-0'}>
						Configure the reference values shown in the Gain chart. Power
						consumption when sending updates:
					</p>
					<div class="d-md-flex mb-3">
						<div class="input-group">
							<span class="input-group-text">every minute</span>
							<input
								type="number"
								class="form-control"
								id="gainReferenceEveryMinute"
								placeholder="e.g. '2 mA'"
								step={0.1}
								min={0}
								value={gainReferenceEveryMinute}
								onChange={(e) => {
									update({
										gainReferenceEveryMinute: parseFloat(
											(e.target as HTMLInputElement).value,
										),
									})
								}}
							/>
							<span class="input-group-text">mA</span>
						</div>
						<div class="ms-md-3 input-group">
							<span class="input-group-text">every hour</span>
							<input
								type="number"
								class="form-control"
								id="gainReferenceEveryHour"
								placeholder="e.g. '1 mA'"
								step={0.1}
								min={0}
								value={gainReferenceEveryHour}
								onChange={(e) => {
									update({
										gainReferenceEveryHour: parseFloat(
											(e.target as HTMLInputElement).value,
										),
									})
								}}
							/>
							<span class="input-group-text">mA</span>
						</div>
					</div>
				</div>
				<div class="card-footer d-flex justify-content-between">
					<button
						type="button"
						class="btn btn-outline-danger"
						onClick={() => {
							reset()
						}}
					>
						Reset
					</button>
					<button
						type="button"
						class="btn btn-outline-secondary"
						onClick={() => {
							update({ showSettings: false })
						}}
					>
						Close
					</button>
				</div>
			</div>
		</SettingsPanel>
	)
}

/**
 * Toggle the settings UI
 */
export const SettingsButton = () => {
	const {
		update,
		settings: { showSettings },
	} = useSettings()
	return (
		<button
			type={'button'}
			class="btn btn-link"
			onClick={() => {
				update({ showSettings: !showSettings })
			}}
		>
			<Settings2 strokeWidth={2} />
		</button>
	)
}

const FavButton = ({ id }: { id: string }) => {
	const {
		settings: { favorites },
		update,
	} = useSettings()
	const favorited = favorites.includes(id)
	return (
		<button
			type="button"
			class="btn btn-link"
			onClick={() => {
				if (favorited) {
					update({
						favorites: favorites.filter((i) => i !== id).filter(Boolean),
					})
				} else {
					update({ favorites: [...favorites, id] })
				}
			}}
		>
			{favorited ? <Star /> : <StarOff />}
		</button>
	)
}

const FavoriteSelector = () => {
	const { devices, alias } = useDevices()
	const {
		settings: { favorites },
		update,
	} = useSettings()

	return (
		<ul class="list-group">
			{Object.entries(devices)
				.sort(([id1], [id2]) => {
					const i1 = favorites.indexOf(id1)
					const i2 = favorites.indexOf(id2)
					if (i1 === -1) return Number.MAX_SAFE_INTEGER
					if (i2 === -1) return -Number.MAX_SAFE_INTEGER
					return i1 - i2
				})
				.map(([id, device], i) => {
					const favorited = favorites.includes(id)
					return (
						<li class="list-group-item">
							<FavButton id={id} />
							{i > 0 && favorited && (
								<button
									type="button"
									class="btn btn-link"
									onClick={() => {
										const index = favorites.indexOf(id)
										const prev = favorites[index - 1] as string
										update({
											favorites: [
												...favorites.slice(0, index - 1),
												id,
												prev,
												...favorites.slice(index + 1),
											].filter(Boolean),
										})
									}}
								>
									<ChevronUp />
								</button>
							)}
							<span>{alias(id) ?? id}</span>
							{isMeshGateway(device) && (
								<NodeList>
									{device.meshNodes.map((node) => (
										<li>
											<span>
												<FavButton id={node.id} />
												{alias(node.id) ?? node.id}
											</span>
										</li>
									))}
								</NodeList>
							)}
						</li>
					)
				})}
		</ul>
	)
}