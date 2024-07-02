import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

const Dashboard = ({navigation}) => {

    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.kbContainer}>
        
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    kbContainer: {
      flex: 1,
    },
   
  });

export default Dashboard;