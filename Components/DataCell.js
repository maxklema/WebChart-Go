import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DataCell = ({data, type}) => {

    const [wcData, setWcData] = useState(`${data}`);

    const deleteData = async (type, data) => {
        if (type == 'session'){
            console.log(data);
            await AsyncStorage.removeItem('mie_session_id');
            setWcData('');//await AsyncStorage.getItem('mie_session_id'));
        }
    };

    return (
        <View>
            { data != '' ? 
                <View style={ styles.DataContainer}>
                    <View style={ styles.DataValue} >
                        <Text numberOfLines={1} ellipsizeMode="end">{wcData}</Text>
                    </View>
                    <View style={ styles.DeleteDataValue}>
                        <Button onPress={() => deleteData(type, wcData)}>
                            <Ionicons name="trash-outline" size={21} color='red'></Ionicons>
                        </Button>
                    </View>
                </View> 
                : <Text>No Cookie</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    DataContainer: {
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        backgroundColor: 'rgb(240,240,240)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    DataValue: {
        width: '85%',
    },
    DeleteDataValue: {
        width: '15%',
    },
})

export default DataCell;