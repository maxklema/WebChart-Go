import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

const DataLocked = ({navigation}) => {
    
    
    return (
        <View style={styles.widget}>
            <Ionicons style={styles.lock_icon} name="lock-closed-outline" size={21} color='#FFF'></Ionicons> 
            <View style={styles.left_widget_text}>
                <Text style={{color: '#fff'}}>This content is locked because we could not verify you. To verify yourself, log in to your WebChart account again or complete</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Lock Screen")}>
                    <Text style={{color: '#fff', textDecorationLine: 'underline'}}>local authentication.</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    widget: {
        marginTop: '3%',
        paddingHorizontal: '6.5%',
        paddingVertical: '2.5%',
        backgroundColor: '#278dd6',
        borderRadius: 12,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    left_widget_text: {
        textAlign: 'left',
        marginLeft: '3%',
        width: '90%'
    },
})

export default DataLocked;