import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const InteractionCell = ({data}) => {

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

    if (isLoading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator/>
            </View>
        )
    } else {
        return (
            <View>
                <View style={styles.DataContainer}>
                    <View style={styles.contact_type}>
                        <Ionicons name={contactIcon} size={21} color='#D65B27'></Ionicons> 
                    </View>
                    <View style={styles.DataValue}>
                        <Text style={styles.date} numberOfLines={1} ellipsizeMode="end">{interaction["Date"]}</Text>
                    <Text numberOfLines={1} ellipsizeMode="end">{interaction["Patient Name"]} — {interaction["Contact Handle"]}</Text>
                </View>
                </View>
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


