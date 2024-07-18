import mie from '@maxklema/mie-api-tools';
import { Alert } from "react-native";
import * as Open from 'expo-linking';
import getPhoneNumbers from '../crawlNumbers';

const patientCallText = async (patID, type) => {

    const numbers = await getPhoneNumbers(patID);
    let patName = await mie.retrieveRecord("patients", ["first_name"], {pat_id: patID});
    patName = patName[0]["first_name"];
    let callOptions = [];

    //iterate over each number to put in the alert
    for (numberObj in numbers){
        
        let numberType = numberObj.replace('_', ' ');
        let number = numbers[numberObj];
        let option = {
            text: `${numberType.charAt(0).toUpperCase() + numberType.slice(1)}`,
            onPress: () => {
                number = number.replace(/\D/g, ''); //remove all chars that are not digits
                type == "Text" ? Open.openURL(`sms:${number}`) : Open.openURL(`tel:${number}`);

                //eventually store local data for activity page about recent messages.
            }
        }
        callOptions.push(option);
    }

    if (callOptions.length == 0){
        Alert.alert(`Cannot ${type} ${patName}`, `${patName} has no phone numbers linked to their WebChart.`);
    } else {
        callOptions.push({ text: 'Cancel', style: 'cancel' });
        Alert.alert(`${type} ${patName}`, `Which number would you like to use to ${type.charAt(0).toLowerCase() + type.slice(1)} ${patName}?`, callOptions);
    }

}

export default patientCallText;