import mie from '@maxklema/mie-api-tools';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from "react-native";


const getEpochSeconds = () => {
    const epoch = new Date().getTime();
    return Math.round(epoch / 1000);
}

const saveDocument = async (docID) => {
    const sharingAvailable = await Sharing.isAvailableAsync();

    if (sharingAvailable){

        try {
            const document = await mie.downloadDoc(docID, "", 0);
            let documentInfo = await FileSystem.getInfoAsync(document);
            let documentExists = documentInfo.exists;
            const epoch = getEpochSeconds();

            while (!documentExists){
                documentInfo = await FileSystem.getInfoAsync(document);
                documentExists = documentInfo.exists;
                const currentEpoch = getEpochSeconds();
                
                if (currentEpoch - 12 >= epoch)
                    break;
                
            }
            if (documentExists){
                await Sharing.shareAsync(document);
                return document;
            }
            

        } catch (e) {
            Alert.alert("Save Failed", "There was an issue saving this file", [
                {
                    text: 'Okay',
                    style: 'cancel'
                }
            ])

        }
        
    } else {
        Alert.alert("Save Failed", "Sharing is not enabled on this device.", [
            {
                text: 'Okay',
                style: 'cancel'
            }
        ])

    }

    return "";

}

export default saveDocument;