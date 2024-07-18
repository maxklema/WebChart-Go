import * as Contacts from 'expo-contacts';
import formatContacts from './formatContacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import mie from '@maxklema/mie-api-tools';

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

                    let patientContactInfo = await AsyncStorage.getItem("patient-contacts");
                    patientContactInfo = JSON.parse(patientContactInfo);
                    patientContactInfo[`${patID}`] = patientData;

                    await AsyncStorage.setItem("patient-contacts", JSON.stringify(patientContactInfo));                        
                }

                //add to local storage

                let miePatient = await AsyncStorage.getItem("patient-contacts");

                if (!miePatient || !(JSON.parse(miePatient))[`${patID}`]){

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

                    //determine whether this is the first patient contact to store
                    
                    if (!miePatient) {
                        let patient_contacts = {};
                        patient_contacts[`${patID}`] = patientData;
                        await AsyncStorage.setItem("patient-contacts", JSON.stringify(patient_contacts));
                    } else {
                        miePatient = JSON.parse(miePatient);
                        miePatient[`${patID}`] = patientData;
                        await AsyncStorage.setItem("patient-contacts", JSON.stringify(miePatient));
                    }
                
                    Alert.alert('Success', (patInfo[0]["suffix"] == "" ? `${patInfo[0]["title"]} ${patInfo[0]["first_name"]} ${patInfo[0]["last_name"]} added to contacts.` : `${patInfo[0]["title"]} ${patInfo[0]["first_name"]} ${patInfo[0]["last_name"]}  ${patInfo[0]["suffix"]} added to contacts.`), [
                        {
                            text: 'Ok'
                        }
                    ]);

                } else {
                    Alert.alert('Contact Found', "This patient already has a contact on your device. Would you like to update their contact?", [
                        {
                            text: 'Update',
                            onPress: () => {
                                miePatient = JSON.parse(miePatient);
                                updateContact(miePatient[`${patID}`]['contact_id']);
                            }
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