import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Pressable,
} from 'react-native';

const InputButton = ({ style, textStyle, text, ...props}) => {

  return (
    <Pressable style={[styles.button, style]} {...props} >
        <Text style={[styles.text, textStyle]}>{ text }</Text>
    </Pressable>
  );
  
}

const styles = StyleSheet.create({
  
  button: {
    backgroundColor: '#e87848',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '3%'
  },
  text: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 21,
  },
});

export default InputButton;
