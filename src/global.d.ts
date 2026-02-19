declare module '*.png';
declare module '*.svg';
interface Window {
	grootmade: {
		logo: string;
	};
	AVAILABLE_I18NS: { locale: string; available: Array<string> };
}
