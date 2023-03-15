import * as Keychain from 'react-native-keychain';

export async function getGenericPassword() {
    try {
        const credentials: any = await Keychain.getGenericPassword();
        const {username, password} = credentials;

        return {
            username,
            password
        }
    } catch (e: any) {
        console.log(e);
    }
}

export async function setGenericPassword({ username, password }) {
    try {
        await Keychain.setGenericPassword(username, password);
    } catch (e: any) {
        console.log(e);
    }
}
