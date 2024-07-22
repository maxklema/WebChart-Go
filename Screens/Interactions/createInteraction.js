import mie from '@maxklema/mie-api-tools';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';

const createInteraction = async (type, patID, contactHandle, patName) => {

        const interactionsURI = FileSystem.documentDirectory + "interactions.json";        
        let interactionsData = JSON.parse(await FileSystem.readAsStringAsync(interactionsURI));

        //check if handle exists
        if (!interactionsData[mie.practice.value])
            interactionsData[mie.practice.value] = {};
        
        //generate unique UUID for activity log
        const epoch = Date.now();

        const date = new Date();

        const interaction = {
            "type": `${type}`,
            "Pat_ID": patID,
            "Contact Handle": contactHandle,
            "Patient Name": patName,
            "Date": format(date, "MM/dd/yyyy hh:mm:ss a")
        }

        //write new data
        interactionsData[mie.practice.value][epoch] = interaction
        await FileSystem.writeAsStringAsync(interactionsURI, JSON.stringify(interactionsData));
}

export default createInteraction;