import { ChevronUp, Settings2, Star, StarOff } from 'lucide-preact'
import { styled } from 'styled-components'
import { colors } from './colors.js'
import { useDevices } from './context/Devices.js'
import { useSettings } from './context/Settings.js'

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

export const Settings = () => {
	const {
		settings: {
			showSettings,
			enableTestDevice,
			showFavorites,
			showUpdateWarning,
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
	const { devices, alias, lastUpdateTs } = useDevices()
	const {
		settings: { favorites },
		update,
	} = useSettings()

	return (
		<ul class="list-group">
			{Object.entries(devices)
				.filter(
					([, d]) =>
						(lastUpdateTs(d.id) ?? 0) > Date.now() - 24 * 60 * 60 * 1000,
				)
				.sort(([id1], [id2]) => {
					const i1 = favorites.indexOf(id1)
					const i2 = favorites.indexOf(id2)
					if (i1 === -1) return Number.MAX_SAFE_INTEGER
					if (i2 === -1) return -Number.MAX_SAFE_INTEGER
					return i1 - i2
				})
				.map(([id], i) => {
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
						</li>
					)
				})}
		</ul>
	)
}

/**
 * Toggle the Favorites
 */
export const FavoritesButton = () => {
	const {
		update,
		settings: { showFavorites },
	} = useSettings()
	return (
		<button
			type={'button'}
			class="btn btn-link"
			onClick={() => {
				update({ showFavorites: !showFavorites })
			}}
		>
			{showFavorites && (
				<Star
					strokeWidth={2}
					class={'mx-1'}
					style={{ color: colors['nordic-fall'] }}
				/>
			)}
			{!showFavorites && (
				<StarOff
					strokeWidth={2}
					class={'mx-1'}
					style={{ color: colors['nordic-middle-grey'] }}
				/>
			)}
		</button>
	)
}
