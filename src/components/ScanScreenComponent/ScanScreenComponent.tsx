

import DocumentScanner from 'react-native-document-scanner-plugin'


export async function ScanScreenComponent(_props?: any) {
    let scanText: string | string[] | undefined = ""
    try {
        scanText = await DocumentScanner.scanDocument().then(i => {

            if (i.status === "cancel") {
                return ""

            }
            else if (i.scannedImages)
                return i.scannedImages
        }).catch(err => {
            console.log(err)
            return ""
        })
    } catch (err) {
        console.log(err)
        return ""
    }

    return scanText
}