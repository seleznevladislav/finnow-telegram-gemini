
import { useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    }
  }
}

export function useTelegram() {
	const TG = typeof window !== 'undefined' && window.Telegram?.WebApp;

	useEffect(() => {
		if (TG && typeof TG.ready === 'function') {
			TG.ready();
		}
	}, [TG]);

	const toggleMainButton = () => {
		if (!TG) return;
		if (TG.MainButton.isVisible) {
			TG.MainButton.hide();
		} else {
			TG.MainButton.show();
		}
	};

	return {
		TG,
		user: TG?.initDataUnsafe?.user,
		toggleMainButton,
	};
}
