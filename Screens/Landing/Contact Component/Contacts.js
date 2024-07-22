import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import * as Contacts from 'expo-contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as FileSystem from 'expo-file-system';
import ContactCell from '../../../Components/Cells/contactCell';
import ValidateSession from '../../../Components/validateSession';
import mie from '@maxklema/mie-api-tools';

const ContactsWidget = () => {

    const [userContacts, setUserContacts] = useState([]);
    
    useFocusEffect(
        React.useCallback(() => {
            const getContacts = async () => {

                //display JSON contacts
                const contactURI = FileSystem.documentDirectory + "contacts.json";
                const contactInfo = await FileSystem.getInfoAsync(contactURI); 

                if (!contactInfo.exists) {
                    const initialContent = JSON.stringify({ });
                    await FileSystem.writeAsStringAsync(contactURI, initialContent)
                }

                let contactData = await FileSystem.readAsStringAsync(contactURI);
                parseContacts(contactData);
            }

            getContacts();

        }, [])
    )

    const parseContacts = (user_contacts) => {
        const parsed_contacts = JSON.parse(user_contacts);
        let contacts = []
        for (const contact in parsed_contacts[mie.practice.value]){
            contacts.push(parsed_contacts[mie.practice.value][contact]);
        }
        setUserContacts(contacts);
    }

    const deleteContact = async (data) => {
        
        let contact_id = data['contact_id'];
        try { await Contacts.removeContactAsync(contact_id); } catch {}

        const contactURI = FileSystem.documentDirectory + "contacts.json";
        let contactData = JSON.parse(await FileSystem.readAsStringAsync(contactURI));
    
        for (let key in contactData[mie.practice.value]){
            if (contactData[mie.practice.value][key]["contact_id"] == contact_id) {
                delete contactData[mie.practice.value][key];
                await FileSystem.writeAsStringAsync(contactURI, JSON.stringify(contactData));
                break;
            }
        }

        parseContacts(JSON.stringify(contactData));
        
    };

    const clearAllContacts = async () => {
        const contactURI = FileSystem.documentDirectory + "contacts.json";
        let contactData = JSON.parse(await FileSystem.readAsStringAsync(contactURI));
        
        for (let contact in contactData[mie.practice.value]){
            try { await Contacts.removeContactAsync(contactData[mie.practice.value][contact]["contact_id"]); } catch {}
            delete contactData[mie.practice.value][contact];
        }
                
        await FileSystem.writeAsStringAsync(contactURI, JSON.stringify(contactData));
        setUserContacts([]);
    }

    return (
        
        <View style={styles.contacts_container}>
            <ValidateSession data={userContacts} header={"Contacts"} clearData={clearAllContacts}>
                { userContacts.length > 0 ? 
                    <>
                        <View style={styles.contact_warning}>
                            <Ionicons name="alert-circle-outline" size={21} color='white'></Ionicons>
                            <Text style={styles.contact_warning_text }>Deleting a contact will remove it from your local storage and your device's contacts.</Text>
                        </View>
                        <View>
                            { userContacts?.map((contact, index) => (
                                <ContactCell deleteMethod={deleteContact} key={index} data={contact} practice={contact['wc_handle']}/>
                            ))}
                        </View>
                    </> :
                    <View style={styles.noData}>
                        <Text>No stored contacts. Contacts of users will appear here when you add them to your device's contacts from your WebChart system.</Text>
                    </View>
                }
            </ValidateSession>
        </View>
    );

}

const styles = StyleSheet.create({
    
    contacts_container: {
        marginBottom: '10%',
    },

    contact_warning: {
        marginTop: '2%',
        paddingHorizontal: '6.5%',
        paddingVertical: '2.5%',
        backgroundColor: '#d65b27',
        borderRadius: 12,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    contact_warning_text: {
        textAlign: 'left',
        color: 'white',
        marginLeft: '3%',
    },
    noData: {
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        borderRadius: 12
    },
    header: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)'
    },

});

export default ContactsWidget;