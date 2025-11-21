const TG = window.Telegram.WebApp;

export function useTelegram() {
	const onToggleButton = () => {
		if (TG.MainButton.isVisible) {
			TG.MainButton.hide();
		} else {
			TG.MainButton.show();
		}
	}

	// Определение мобильной платформы
	// Telegram WebApp предоставляет информацию о платформе через TG.platform
	// Мобильные платформы: "android", "ios"
	// Десктопные: "macos", "tdesktop", "weba", "webk", "unigram", "unknown"
	const isMobilePlatform = () => {
		const platform = TG.platform || 'unknown';
		return platform === 'android' || platform === 'ios';
	}

	return {
		TG,
		user: TG.initDataUnsafe?.user,
		isMobile: isMobilePlatform(),
		platform: TG.platform || 'unknown',
	}
}