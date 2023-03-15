import firebaseAnalytics from '@react-native-firebase/analytics';
import config from '../../../config';
import events from './events';

const isFDroidBuild = true;
const bugsnag: any = '';
let crashlytics;

if (!isFDroidBuild) {
	crashlytics = require('@react-native-firebase/crashlytics').default;
	// bugsnag = new Client(config.BUGSNAG_API_KEY);
}

// export const loggerConfig = bugsnag.config;
// export const { leaveBreadcrumb } = bugsnag;
export { events };

let metadata = {};

export const logServerVersion = (serverVersion) => {
	metadata = {
		serverVersion
	};
};

export const logEvent = (eventName, payload) => {
	try {
		if (!isFDroidBuild) {
			firebaseAnalytics().logEvent(eventName, payload);
			// leaveBreadcrumb(eventName, payload);
		}
	} catch {
		// Do nothing
	}
};

export const setCurrentScreen = (currentScreen) => {
	if (!isFDroidBuild) {
		// @ts-ignore
		firebaseAnalytics().setCurrentScreen(currentScreen);
		// leaveBreadcrumb(currentScreen, { type: 'navigation' });
	}
};

export default (e) => {
	if (e instanceof Error && bugsnag && e.message !== 'Aborted' && !__DEV__) {
		bugsnag.notify(e, (report) => {
			report.metadata = {
				details: {
					...metadata
				}
			};
		});
		if (!isFDroidBuild) {
			crashlytics().recordError(e);
		}
	} else {
		if (__DEV__) {
			console.log(e);
		}
	}
};
