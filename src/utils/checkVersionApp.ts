import {VERSION_APP_STAFF} from "@data/Constants";
import firestore from "@react-native-firebase/firestore";
import openLink from "@utils/openLink";
import {Alert, Platform} from "react-native";

export default async function checkVersionApp() {
    const versionCollection = await firestore().collection('Config').doc("Version").get();
    if (Platform.OS === "ios"){
        if (versionCollection?.data()?.ios !== VERSION_APP_STAFF) {
            Alert.alert("Update app", `The app has new version (${versionCollection?.data()?.ios}), please update to use the latest features!`,
                [{ text: "Update", onPress:() => openLink("https://apps.apple.com/us/app/yubao/id1537911842")}]
            )
        }
    } else if (Platform.OS === "android") {
        if (versionCollection?.data()?.android !== VERSION_APP_STAFF) {
            Alert.alert("Update app", `The app has new version (${versionCollection?.data()?.android}), please update to use the latest features!`,
                [{ text: "Update", onPress:() => openLink("https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.mis.chailease.staff")}]
            )
        }
    }
}
