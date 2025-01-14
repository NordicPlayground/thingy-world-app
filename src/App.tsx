import { Provider as DevicesProvider } from './context/Devices.js'
import { Provider as LwM2MProvider } from './context/LwM2M.js'
import { Provider as MapProvider } from './context/Map.js'
import { Provider as SettingsProvider } from './context/Settings.js'
import { Provider as VisibleDevicesProvider } from './context/VisibleDevices.js'
import { Provider as WebsocketProvider } from './context/WebsocketConnection.js'
import { Dashboard } from './Dashboard.js'
import { Provider as MemfaultProvider } from './memfault/Context.js'
import { FakeTracker } from './test-device/FakeTracker.js'
import { WithMapAuthHelper as MapAuthHelperProvider } from './WithMapAuthHelper.js'

export const App = () => (
	<MapAuthHelperProvider>
		{(authHelper) => (
			<SettingsProvider>
				<DevicesProvider>
					<VisibleDevicesProvider>
						<WebsocketProvider>
							<LwM2MProvider>
								<MemfaultProvider>
									<MapProvider authHelper={authHelper}>
										<Dashboard />
									</MapProvider>
								</MemfaultProvider>
							</LwM2MProvider>
						</WebsocketProvider>
					</VisibleDevicesProvider>
					<FakeTracker />
				</DevicesProvider>
			</SettingsProvider>
		)}
	</MapAuthHelperProvider>
)
