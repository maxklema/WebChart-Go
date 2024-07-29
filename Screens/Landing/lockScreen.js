import { SafeAreaView } from "react-native-safe-area-context"
import InputButton from "../../Components/inputButton"
import * as FileSystem from 'expo-file-system';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect } from "react";

const LockScreen = ({ navigation }) => {

    useEffect(() => {
        (async () => {
            
            //set canAccessSessionID to false;
            const sessionURI = FileSystem.documentDirectory + "session.json";
            const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
                
            const result = await LocalAuthentication.authenticateAsync({
                "promptMessage": "Verify yourself"
            })
        
            if (result.success){
                sessionData["canAccessSessionID"] = true;
                await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            } else {
                console.log("FAILED AUTH");
            }
    
        })();
    }, []);

    return (
        <SafeAreaView>
            <InputButton text="GO BACK" onPress={() => navigation.goBack()}/>
        </SafeAreaView>
    );
}

export default LockScreen;