import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

const InputBox = ({ style, text, onPressIn, ...props}) => {

  return (
    <TextInput
        style={[styles.input, style]}
        value={ text }
        keyboardType="" // This sets the keyboard type to optimize for URLs
        autoCapitalize="none" // Prevents auto-capitalization
        autoCorrect={false}
        onPressIn={onPressIn}
        { ...props }
    />   
  );

}

const styles = StyleSheet.create({

  input: {
    height: 50,
    width: '75%',
    margin: 12,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 10
  }

});

export default InputBox;
