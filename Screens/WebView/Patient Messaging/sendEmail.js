import mie from '@maxklema/mie-api-tools';
import { Alert } from "react-native";
import * as Open from 'expo-linking';

const sendEmail = async (patId) => {
    
    const patientData = await mie.retrieveRecord("patients", ["email", "first_name"], {pat_id: patId});
    let patientName = patientData['0']['first_name'];
    let patientEmail = patientData['0']['email'];

    if (patientEmail != ""){
        Open.openURL(`mailto:${patientEmail}`);
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