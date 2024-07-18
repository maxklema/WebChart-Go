import mie from '@maxklema/mie-api-tools';
import { Alert } from "react-native";
import * as Open from 'expo-linking';

const getPhoneNumbers = async (patID) => {

    const fields = ["work_phone", "home_phone", "cell_phone", "emergency_phone"]
    const numbers = await mie.retrieveRecord("patients", fields, { pat_id: patID })
    
    delete numbers['0']['pat_id'];

    //parses numbers for only ones that are not blank
    for (number in numbers['0']){
        if (numbers['0'][number] == "")
            delete numbers['0'][number];
    }
    
    return numbers['0'];
}

const sendMessage = async (patID) => {

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
                Open.openURL(`sms:${number}`)
            }
        }
        callOptions.push(option);
    }

    if (callOptions.length == 0){
        Alert.alert(`Cannot Text ${patName}`, `${patName} has no phone numbers linked to their WebChart.`);
    } else {
        callOptions.push({ text: 'Cancel' ,style: 'cancel' });
        Alert.alert(`Text ${patName}`, `Which number would you like to use to text ${patName}?`, callOptions);
    }

}

export default sendMessage;