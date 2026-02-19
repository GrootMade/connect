import { routes } from '@generouted/react-router/lazy';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Providers } from './components/providers';
export default function App() {
	const router = createHashRouter(routes, {
		future: {
			v7_relativeSplatPath: true
		}
	});
	return (
		<Providers>
			<RouterProvider
				router={router}
				future={{ v7_startTransition: true }}
			/>
		</Providers>
	);
}
