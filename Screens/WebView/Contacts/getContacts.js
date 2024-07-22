import * as Contacts from 'expo-contacts';
import formatContacts from './formatContacts';
import { Alert } from 'react-native';
import mie from '@maxklema/mie-api-tools';
import * as FileSystem from 'expo-file-system';

const getPatientInfo = async (patID) => {
        
    const fields = ["address1", "address2", "address3", "birth_date", "employer_name", "email", "emergency_phone", "first_name", "last_name", "middle_name", "suffix", "title", "home_phone", "cell_phone", "work_phone" ]

    let patInfo = await mie.retrieveRecord("patients", fields, { pat_id: patID})
    return patInfo;
}

const getContacts = (patID) => {
    (async () => {
        try {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {

                const updateContact = async (contact_id) => {
                    let patInfo = await getPatientInfo(patID);
                    let ID = await formatContacts(patInfo, contact_id);
                    let patientData = {
                        'contact_id': ID,
                        'first_name': patInfo[0]['first_name'],
                        'last_name': patInfo[0]['last_name'],
                        'title': patInfo[0]['title'],
                        'suffix': patInfo[0]['suffix'],
                        'wc_handle': mie.practice.value
                    }

                    const contactURI = FileSystem.documentDirectory + "contacts.json";
                    let patientContactData = await FileSystem.readAsStringAsync(contactURI);
                    patientContactData = JSON.parse(patientContactData); //contacts JSON parsed.

                    patientContactData[mie.practice.value][`${patID}`] = patientData;

                    await FileSystem.writeAsStringAsync(contactURI, JSON.stringify(patientContactData));
                }

                //add to JSON storage.

                const contactURI = FileSystem.documentDirectory + "contacts.json";
                const contactInfo = await FileSystem.getInfoAsync(contactURI); 

                if (!contactInfo.exists) {
                    const initialContent = JSON.stringify({ });
                    await FileSystem.writeAsStringAsync(contactURI, initialContent)
                }

                let contactData = await FileSystem.readAsStringAsync(contactURI);
                contactData = JSON.parse(contactData); //contacts JSON parsed.

                if (!contactData[mie.practice.value])
                    contactData[mie.practice.value] = {};

                if (!contactData[mie.practice.value][`${patID}`]){

                    let patInfo = await getPatientInfo(patID);
                    const contactId = await formatContacts(patInfo, '');

                    let patientData = {
                        'contact_id': contactId,
                        'first_name': patInfo[0]['first_name'],
                        'last_name': patInfo[0]['last_name'],
                        'title': patInfo[0]['title'],
                        'suffix': patInfo[0]['suffix'],
                        'wc_handle': mie.practice.value
                    }
                    
                    contactData[mie.practice.value][`${patID}`] = patientData;
                    await FileSystem.writeAsStringAsync(contactURI, JSON.stringify(contactData));
                
                    Alert.alert('Success', (patInfo[0]["suffix"] == "" ? `${patInfo[0]["title"]} ${patInfo[0]["first_name"]} ${patInfo[0]["last_name"]} added to contacts.` : `${patInfo[0]["title"]} ${patInfo[0]["first_name"]} ${patInfo[0]["last_name"]}  ${patInfo[0]["suffix"]} added to contacts.`), [
                        {
                            text: 'Ok'
                        }
                    ]);

                } else {
                    Alert.alert('Contact Found', "This patient already has a contact on your device. Would you like to update their contact?", [
                        {
                            text: 'Update',
                            onPress: () => {updateContact(contactData[mie.practice.value][`${patID}`]['contact_id']);}
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        }
                    ]);
                }
                
            } else {
                alert('Cannot add Patient to Contacts');
            }
        } catch (e) {
            const { canAskAgain } = await Contacts.requestPermissionsAsync();
            if (canAskAgain)
                Linking.openSettings();
        }
    })();
}

export default getContacts;