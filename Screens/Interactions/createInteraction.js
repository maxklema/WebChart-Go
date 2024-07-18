import mie from '@maxklema/mie-api-tools';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto'; 

const createInteraction = async (type, patID, contactHandle, patName) => {

        //check to see if interactions.JSON exists
        const interactionsURI = FileSystem.documentDirectory + "interactions.json";
        const interactionsInfo = await FileSystem.getInfoAsync(interactionsURI);

        //create new file if one does not exist
        if (!interactionsInfo.exists) {
            const initialContent = JSON.stringify({});
            await FileSystem.writeAsStringAsync(interactionsURI, initialContent);
        }
        
        let interactionsData = await FileSystem.readAsStringAsync(interactionsURI);
        interactionsData = JSON.parse(interactionsData);

        //check if handle exists
        if (!interactionsData[mie.practice.value])
            interactionsData[mie.practice.value] = {};
        
        //generate unique UUID for activity log
        const UUID = Crypto.randomUUID();

        const date = new Date();

        const interaction = {
            "type": `${type}`,
            "Pat_ID": patID,
            "Contact Handle": contactHandle,
            "Patient Name": patName,
            "Date": date
        }

        //write new data
        interactionsData[mie.practice.value][UUID] = interaction
        await FileSystem.writeAsStringAsync(interactionsURI, JSON.stringify(interactionsData));
}

export default createInteraction;