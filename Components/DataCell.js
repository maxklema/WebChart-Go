import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const DataCell = ({data, type, deleteMethod, openMethod, practice=""}) => {

    const [isSession, setIsSession] = useState(true);    
    const [interaction, setInteraction] = useState({});
    const [contactIcon, setContactIcon] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            
            if (type == 'interactions') {
                setInteraction(JSON.parse(data));
                setInteractionIcon(interaction["type"]);
            }
            
            if (type == 'system')
                setIsSession(false);

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
        return <Text>Loading...</Text>
    }
    return (
        <View>
            { (data != "") ? 
                <View style={ styles.DataContainer}>
                    { type == "interactions" ?
                        <View style={styles.contact_type}>
                            <Ionicons name={contactIcon} size={21} color='#D65B27'></Ionicons> 
                        </View> :
                        <></>
                    }
                    <View style={[isSession && styles.DataValue, !isSession && styles.DataValueSy ]} >
                        { type == "contacts" ? 
                            <Text style={styles.handleText} numberOfLines={1} ellipsizeMode="end">{practice}</Text> :
                            <>
                                {type == "interactions" ? 
                                    <Text style={styles.date} numberOfLines={1} ellipsizeMode="end">{interaction["Date"]}</Text> :
                                <></> }
                            </>
                        }
                        { type == "contacts" ?
                            <Text numberOfLines={1} ellipsizeMode="end">{data['title'] != "" ? `${data['title']} ` : ""}{data['first_name']} {data['last_name']} {data['suffix']} - {data['contact_id']}</Text> :
                            <>
                                { type == "interactions" ? 
                                    <Text numberOfLines={1} ellipsizeMode="end">{interaction["Patient Name"]} — {interaction["Contact Handle"]}</Text> : 
                                    <Text numberOfLines={1} ellipsizeMode="end">{data}</Text> }
                            </>
                        }
                    </View>
                    { type == "system" ?
                        <View style={ styles.DeleteDataValueSy }>
                            <TouchableOpacity style={styles.trashIcon} onPress={() => deleteMethod(type, data)}>
                                <Ionicons name="trash-outline" size={21} color='red'></Ionicons>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openMethod(data)}>
                                <Ionicons name="open-outline" size={21} color='#1992d4'></Ionicons>
                            </TouchableOpacity>
                        </View>  :
                        <>
                            { type != "interactions" ? 
                                <View style={ styles.DeleteDataValue }>
                                    <TouchableOpacity onPress={() => deleteMethod(type, data)}>
                                        <Ionicons name="trash-outline" size={21} color='red'></Ionicons>
                                    </TouchableOpacity>
                                </View>
                                : <></>
                            }
                        </>
                        
                    }
                </View> :
                <View style={styles.noData}>
                    <Text>No session cookies present. A cookie will appear here when you successfully log in into a WebChart System.</Text>
                </View>
                
            }
        </View>
    );
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
    DataValueSy: {
        width: '80%',
    },
    DeleteDataValue: {
        width: '10%',
        flexDirection: 'row-reverse'

    },
    DeleteDataValueSy: {
        width: '20%',
        padding: 0,
        margin: 0,
        flexDirection: 'row-reverse',
    },
    trashIcon: {
        marginLeft: '15%'
    },
    noData: {
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        borderRadius: 12
    },
    handleText: {
        fontSize: 13,
        marginBottom: '1%'
    },
    date: {
        fontSize: 11,
        marginBottom: '1%'
    },
    contact_type: {
        marginRight: '5%' 
    }
})

export default DataCell;