import { Provider as DevicesProvider } from './context/Devices'
import { Provider as MapProvider } from './context/Map'
import { Provider as SettingsProvider } from './context/Settings'
import { Provider as HistoryChartProvider } from './context/showHistoryChart'
import { Provider as WebsocketProvider } from './context/WebsocketConnection'
import { Dashboard } from './Dashboard'
import { TestDevice } from './TestDevice'
import { WithCredentials as CredentialsProvider } from './WithCredentials'

export const App = () => (
	<CredentialsProvider>
		{(credentials) => (
			<SettingsProvider>
				<DevicesProvider>
					<WebsocketProvider>
						<MapProvider credentials={credentials}>
							<HistoryChartProvider>
								<Dashboard />
								<TestDevice />
							</HistoryChartProvider>
						</MapProvider>
					</WebsocketProvider>
				</DevicesProvider>
			</SettingsProvider>
		)}
	</CredentialsProvider>
)
