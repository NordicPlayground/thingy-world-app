import { PinIcon, PinOffIcon } from 'lucide-preact'
import { withCancel } from './cancelEvent.js'
import { colors } from './colors.js'
import { useSettings } from './context/Settings.js'

export const PinTile = ({ device }: { device: { id: string } }) => {
	const {
		settings: { favorites },
		update,
	} = useSettings()

	const favorited = favorites.includes(device.id)

	return favorited ? (
		<button
			type={'button'}
			class="btn btn-link"
			onClick={withCancel(() => {
				update({ favorites: favorites.filter((id) => id !== device.id) })
			})}
		>
			<PinIcon
				strokeWidth={1}
				class="ms-1"
				style={{ color: colors['nordic-fall'] }}
			/>
		</button>
	) : (
		<button
			type={'button'}
			class="btn btn-link"
			onClick={withCancel(() => {
				update({ favorites: [...favorites, device.id] })
			})}
		>
			<PinOffIcon
				strokeWidth={1}
				class="ms-1"
				style={{ color: colors['nordic-middle-grey'] }}
			/>
		</button>
	)
}
