import {Platform} from "react-native";
import TouchID from "react-native-touch-id";

import * as I18n from "@i18n";

let type = ""
let isChecked = false;
export const isBiometrySupported = async () => {
    try {
        if (isChecked) return type;
        type = await TouchID.isSupported({
            unifiedErrors: false, // use unified error messages (default false)
        });
        isChecked = true;
        return type;
    } catch (e: any) {
        // Alert.alert('Error', e.message);
    }
}

const textAuthFail = I18n.t('authFail');
const textTryManyTime = I18n.t('tryManyTime');
const textNotSupportFingerprint = I18n.t('notSupportFingerprint');
const textNotSetupFingerprint = I18n.t('notSetupFingerprint');
const optionalConfigObject = {
    title: 'Authentication Required',
    imageColor: '#f1c40f',
    imageErrorColor: '#ff0000',
    sensorDescription: 'Touch sensor',
    sensorErrorDescription: 'Failed',
    cancelText: 'Cancel',
    fallbackLabel: 'Using password',
    unifiedErrors: false,
    passcodeFallback: true,
};
export const checkBiometryAuth = async ({reason}) => {
    try {
        await TouchID.authenticate(
            reason,
            optionalConfigObject,
        );
    } catch (err: any) {
        if (Platform.OS === 'ios') {
            switch (err.name) {
                case 'LAErrorAuthenticationFailed':
                    return Promise.reject(textAuthFail);
                case 'LAErrorUserCancel':
                    return Promise.reject(textAuthFail);
                case 'LAErrorUserFallback':
                    return Promise.reject(textAuthFail);
                case 'LAErrorTouchIDLockout':
                    return Promise.reject(textTryManyTime);
                case 'RCTTouchIDNotSupported':
                    return Promise.reject(textNotSupportFingerprint);
                case 'LAErrorTouchIDNotAvailable':
                    return Promise.reject(textNotSetupFingerprint);
                case 'LAErrorTouchIDNotEnrolled':
                    return Promise.reject(textNotSetupFingerprint);
                default:
                    return Promise.reject("Cannot Verify!");
            }
        } else {
            switch (err.code) {
                case 'AUTHENTICATION_FAILED':
                    return Promise.reject(textAuthFail);
                case 'AUTHENTICATION_CANCELED':
                    return Promise.reject(textAuthFail);
                case 'FINGERPRINT_ERROR_LOCKOUT_PERMANENT':
                    return Promise.reject(textTryManyTime);
                case 'NOT_AVAILABLE':
                    return Promise.reject(textNotSetupFingerprint);
                case 'NOT_ENROLLED':
                    return Promise.reject(textNotSetupFingerprint);
                case 'NOT_SUPPORTED':
                    return Promise.reject(textNotSupportFingerprint);
                case 'NOT_PRESENT':
                    return Promise.reject(textNotSupportFingerprint);
                default:
                    return Promise.reject("Something wrong! Please try again!");
            }
        }
    }
}
