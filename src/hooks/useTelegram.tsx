const TG = window.Telegram.WebApp;

export function useTelegram() {
	const onToggleButton = () => {
		if (TG.MainButton.isVisible) {
			TG.MainButton.hide();
		} else {
			TG.MainButton.show();
		}
	}

	return {
		TG,
		user: TG.initDataUnsafe?.user,
	}
}