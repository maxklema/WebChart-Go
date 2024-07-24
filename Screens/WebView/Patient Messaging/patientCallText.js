import mie from '@maxklema/mie-api-tools';
import { Alert } from "react-native";
import * as Open from 'expo-linking';
import getPhoneNumbers from '../crawlNumbers';
import createInteraction from '../../Interactions/createInteraction';

const patientCallText = async (patID, type) => {

    const numbers = await getPhoneNumbers(patID);
    const patNameData = await mie.retrieveRecord("patients", ["email", "first_name", "last_name", "title", "suffix"], {pat_id: patID});
    let patName = patNameData[0]["first_name"];
    let patFullName = `${patNameData['0']['title'] != "" ? patNameData['0']['title'] : ""}${patNameData['0']['first_name']} ${patNameData['0']['suffix'] == "" ? patNameData['0']['last_name'] : patNameData['0']['last_name'] + " " + patNameData['0']['suffix']}`;
    let callOptions = [];

    //iterate over each number to put in the alert
    for (numberObj in numbers){
        
        let numberType = numberObj.replace('_', ' ');
        let number = numbers[numberObj];
        let option = {
            text: `${numberType.charAt(0).toUpperCase() + numberType.slice(1)}`,
            onPress: async () => {
                number = number.replace(/\D/g, ''); //remove all chars that are not digits
                if (type == "Text"){
                    Open.openURL(`sms:${number}`);
                    await createInteraction("SMS", patID, number, patFullName);
                } else {
                    Open.openURL(`tel:${number}`);
                    await createInteraction("CALL", patID, number, patFullName);
                }
                


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