import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import * as Open from 'expo-linking';
import getContacts from '../../Screens/WebView/Contacts/getContacts';

const InteractionCell = ({data, removeInteraction}) => {

    const [interaction, setInteraction] = useState({});
    const [contactIcon, setContactIcon] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setInteraction(JSON.parse(data));
            setInteractionIcon(interaction["type"]);
        }, [])
    )
    
    useEffect(() => {
        if (interaction) {
            setInteractionIcon(interaction["type"]);
            setIsLoading(false);
        }
    }, [interaction]);

    useEffect(() => {
        setInteraction(JSON.parse(data));
        setInteractionIcon(interaction["type"]);
    }, [data]);

    const setInteractionIcon = (type) => {
        switch(type) {
            case "Email":
                setContactIcon("mail-outline");
                break;
            case "SMS":
                setContactIcon("chatbubble-outline");
                break;
            case "CALL":
                setContactIcon("call-outline");
                break;
        }
    }

    
    const contactPatient = (type) => {
        switch(type) {
            case "Email":
                Open.openURL(`mailto:${data["Contact Handle"]}`)
                break;
            case "SMS":
                Open.openURL(`sms:${data["Contact Handle"]}`)
                break;
            case "CALL":
                Open.openURL(`tel:${data["Contact Handle"]}`)
                break;
        }
    }

    const interactionOptions = () => {
        
        Alert.alert("Choose an Action", "", [
            {
                text: `${interaction["type"].charAt(0).toUpperCase() + interaction["type"].slice(1).toLowerCase()} patient again`,
                onPress: () => contactPatient(interaction["type"])
            },
            {
                text: `Add to contacts`,
                onPress: () => getContacts(interaction["Pat_ID"])
            },
            {
                text: `Remove interaction`,
                onPress: () => removeInteraction()
            },
            {
                text: 'Cancel',
                style: 'cancel'
            },
        ]);
    }

    if (isLoading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator/>
            </View>
        )
    } else {
        return (
            <View>
                <TouchableOpacity 
                    activeOpacity={0.7} 
                    onPress={() => interactionOptions()} 
                    style={styles.DataContainer}
                >
                    <View style={styles.contact_type}>
                        <Ionicons name={contactIcon} size={21} color='#D65B27'></Ionicons> 
                    </View>
                    <View style={styles.DataValue}>
                        <Text style={styles.date} numberOfLines={1} ellipsizeMode="end">{interaction["Date"]}</Text>
                        <Text numberOfLines={1} ellipsizeMode="end">{interaction["Patient Name"]} — {interaction["Contact Handle"]}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
        )
    }

}

const styles = StyleSheet.create({
    DataContainer: {
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        backgroundColor: 'rgb(240,240,240)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center'
    },
    DataValue: {
        width: '90%',
    },
    date: {
        fontSize: 11,
        marginBottom: '1%'
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    contact_type: {
        marginRight: '5%' 
    }

})

export default InteractionCell


