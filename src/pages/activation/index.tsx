import AdCard from '@/components/ad-card';
import { AppPageShell } from '@/components/body/page-shell';
import { MarketingSlot } from '@/components/page/marketing-slot';
import { PageSection } from '@/components/page/page-section';
import { Button } from '@/components/ui/button';
import useActivation from '@/hooks/use-activation';
import { __ } from '@/lib/i18n';
import LicenseStatus from '../_components/license-status';
import RegisterLicenseForm from './_components/register-license';

export default function Component() {
	const {
		activated,
		deactivate,
		isDeactivatePending,
		isFetching,
		isLoading
	} = useActivation();

	return (
		<AppPageShell
			title={__('License Activation')}
			description={
				activated
					? __(
							'Your license is linked to this site. You can deactivate it here if needed.'
						)
					: __(
							'Enter your license key to unlock updates and the full catalog.'
						)
			}
			isFetching={isFetching}
			isLoading={isLoading}
			breadcrump={[
				{
					label: activated
						? __('Activation Detail')
						: __('Activate License')
				}
			]}
			headerActions={
				activated ? (
					<Button
						variant="outline"
						onClick={() => {
							if (
								confirm(
									__(
										'Are you sure you want to deactivate your license?'
									)
								)
							) {
								deactivate();
							}
						}}
						disabled={isDeactivatePending}
						className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
					>
						{__('Deactivate')}
					</Button>
				) : undefined
			}
		>
			<div className="gm-reveal-stagger flex flex-col gap-8 sm:gap-10">
				{activated ? (
					<PageSection
						title={__('Current license')}
						description={__(
							'Plan, limits, and activation status for this installation.'
						)}
					>
						<LicenseStatus />
					</PageSection>
				) : (
					<PageSection
						title={__('Activate')}
						description={__(
							'Use the license key from your GrootMade account email or dashboard.'
						)}
					>
						<RegisterLicenseForm />
					</PageSection>
				)}
				<MarketingSlot>
					<AdCard />
				</MarketingSlot>
			</div>
		</AppPageShell>
	);
}
