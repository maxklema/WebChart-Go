import React from 'react';
import { StyleSheet, Text, View,} from 'react-native';

const Warning = ({ style, textStyle, text, ...props}) => {

  return (
    <View style={ [styles.warning_container, style ]}>
        <Text style={ [styles.warning, textStyle] }>{ text }</Text>
    </View>
   
  );
}

const styles = StyleSheet.create({
  
    warning_container: {
        backgroundColor: '#b56969',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: '3%',
        display: 'none',
        width: '100%',
    },

    warning: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
        textAlign: 'center'
    }

});

export default Warning;
