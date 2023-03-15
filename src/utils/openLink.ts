// import * as WebBrowser from 'expo-web-browser';
// temporary fix for build
import { Linking, Platform } from 'react-native';
import parse from 'url-parse';

export const DEFAULT_BROWSER_KEY = 'DEFAULT_BROWSER_KEY';

const scheme = {
	chrome: 'googlechrome:',
	chromeSecure: 'googlechrome:',
	firefox: 'firefox:',
	brave: 'brave:',
};

const appSchemeURL = (url, browser) => {
	let schemeUrl = url;
	const parsedUrl = parse(url, true);
	const { protocol } = parsedUrl;
	const isSecure = ['https:'].includes(protocol);

	if (browser === 'googlechrome') {
		if (!isSecure) {
			schemeUrl = url.replace(protocol, scheme.chrome);
		} else {
			schemeUrl = url.replace(protocol, scheme.chromeSecure);
		}
	} else if (browser === 'firefox') {
		schemeUrl = `${scheme.firefox}//open-url?url=${url}`;
	} else if (browser === 'brave') {
		schemeUrl = `${scheme.brave}//open-url?url=${url}`;
	}

	return schemeUrl;
};

const openLink = async url => {
	try {
		const browser: any = '';

		if (browser) {
			const schemeUrl = appSchemeURL(url, browser.replace(':', ''));
			await Linking.openURL(schemeUrl);
		} else {
			await Linking.openURL(url);
			// disable the webrower. im worst case the linking will open the url, and the second support is that
			// depend on the user plat the default browswer will be set
			// posible solution use normal linking
			// await WebBrowser.openBrowserAsync(url, {
			// 	// toolbarColor: themes[theme].headerBackground,
			// 	// controlsColor: themes[theme].headerTintColor,
			// 	enableBarCollapsing: true,
			// 	showTitle: true,
			// });
		}
	} catch {
		try {
			await Linking.openURL(url);
		} catch {
			// do nothing
		}
	}
};

export const openChrome = async url => {
	const chromePackage = 'com.android.chrome';
	const schemeUrl = appSchemeURL(url, 'googlechrome');

	try {
		// const supported = await Linking.canOpenURL(schemeUrl);

		await Linking.openURL(url);

		// if (supported) {
		// 	await Linking.openURL(schemeUrl);
		// } else {
		// 	console.warn('Cannot open URL in Chrome browser');

		// }
	} catch (err) {
		try {
			if (Platform.OS === 'ios') {
				// fallback to Safari or another browser
				await Linking.openURL(
					'itms-apps://itunes.apple.com/app/google-chrome/id535886823',
				);
			} else {
				// fallback to Google Play Store
				await Linking.openURL('market://details?id=' + chromePackage);
			}
		} catch (err) {
			console.error('Failed to open URL in Chrome browser: ', err);
		}
	}
};

export default openLink;
