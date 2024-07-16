import React, { useState } from 'react';
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

    useFocusEffect(
        React.useCallback(() => {
            
            if (type == 'system')
                setIsSession(false);
        }, [])
    )

    return (
        <View>
            { (data != "") ? 
                <View style={ styles.DataContainer}>
                    <View style={[isSession && styles.DataValue, !isSession && styles.DataValueSy ]} >
                        { type == "contacts" ? 
                            <Text style={styles.handleText} numberOfLines={1} ellipsizeMode="end">{practice}</Text> :
                            <></>
                        }
                        { type == "contacts" ?
                            <Text numberOfLines={1} ellipsizeMode="end">{data['title'] != "" ? `${data['title']} ` : ""}{data['first_name']} {data['last_name']} {data['suffix']} - {data['contact_id']}</Text> :
                            <Text numberOfLines={1} ellipsizeMode="end">{data}</Text> 
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
                        <View style={ styles.DeleteDataValue }>
                            <TouchableOpacity onPress={() => deleteMethod(type, data)}>
                                <Ionicons name="trash-outline" size={21} color='red'></Ionicons>
                            </TouchableOpacity>
                        </View>
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
    }
})

export default DataCell;