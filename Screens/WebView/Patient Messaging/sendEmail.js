import mie from '@maxklema/mie-api-tools-lite';
import { Alert } from "react-native";
import * as Open from 'expo-linking';
import createInteraction from '../../Landing/Interactions/createInteraction';

const sendEmail = async (patId) => {
    
    const patientData = await mie.retrieveRecord("patients", ["email", "first_name", "last_name", "title", "suffix"], {pat_id: patId});
    let patientName = patientData['0']['first_name'];
    let patientEmail = patientData['0']['email'];
    let patientFullName = `${patientData['0']['title'] != "" ? patientData['0']['title'] : ""}${patientData['0']['first_name']} ${patientData['0']['last_name']} ${patientData['0']['suffix']}`;

    if (patientEmail != ""){
        Open.openURL(`mailto:${patientEmail}`);
        await createInteraction("Email", patId, patientEmail, patientFullName);
        
    } else {
        Alert.alert(`Cannot Email ${patientName}`, `${patientName} does not have an email linked to their WebChart.`,
            [
                {
                    text: 'Okay',
                    style: 'cancel'
                }
            ]
        )
    }
} 

export default sendEmail;