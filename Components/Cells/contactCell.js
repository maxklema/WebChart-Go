import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ContactCell = ({data, practice, deleteMethod}) => {
    
    return (
        <View>
            { data != "" ? 
                <View style={ styles.DataContainer}>
                    <View style={styles.DataValue} >
                        <Text style={styles.handleText} numberOfLines={1} ellipsizeMode="end">{practice}</Text>
                        <Text numberOfLines={1} ellipsizeMode="end">{data['title'] != "" ? `${data['title']} ` : ""}{data['first_name']} {data['last_name']} {data['suffix']} - {data['contact_id']}</Text>
                    </View>
                    <View style={ styles.DeleteDataValue }>
                        <TouchableOpacity onPress={() => deleteMethod(data)}>
                            <Ionicons name="trash-outline" size={21} color='red'></Ionicons>
                        </TouchableOpacity>
                    </View>
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
    DeleteDataValue: {
        width: '10%',
        flexDirection: 'row-reverse'

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
})

export default ContactCell;