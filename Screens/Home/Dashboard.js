import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import InputButton from "../../Components/inputButton";
import mie from '@maxklema/mie-api-tools';

const Dashboard = ({navigation}) => {

    function getData(){
        
      let JSON_data;
      try {
        mie.retrieveRecord("documents", ["pat_id"], { doc_id: 100 })
        .then((result) => {
          JSON_data = result;
          console.log(JSON_data);
          mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;
          console.log(mie.User_PatID.value);
        })
        .catch((err) => {
          console.log(err);
        })
     
      } catch (e) {
        console.log(e);
      }
      
     

    }

    return (
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.kbContainer}>
          <InputButton 
                text="Get Pat ID"
                onPress={() => getData() }
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    kbContainer: {
      flex: 1,
    },
   
  });

export default Dashboard;