import useNotice from '@/hooks/use-notice';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function Notices() {
	const { notice } = useNotice();
	return (
		notice.length > 0 && (
			<div className="flex flex-col gap-3">
				{notice.map((item) => (
					<Alert
						key={item.id}
						variant={item.type}
					>
						{item.icon && <item.icon className="h-4 w-4" />}
						<AlertTitle>{item.title}</AlertTitle>
						<AlertDescription>
							<p>{item.message}</p>
						</AlertDescription>
					</Alert>
				))}
			</div>
		)
	);
}
