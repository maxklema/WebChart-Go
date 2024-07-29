import * as LocalAuthentication from 'expo-local-authentication';
import * as FileSystem from 'expo-file-system';

const VerifyUser = async () => {

    //set canAccessSessionID to false;
    const sessionURI = FileSystem.documentDirectory + "session.json";
    const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));

    console.log("CAN ACCESS SESSION ID: " + sessionData["canAccessSessionID"]);

    const result = await LocalAuthentication.authenticateAsync({
        "promptMessage": "Verify yourself"
    })

    if (result.success){
        sessionData["canAccessSessionID"] = true;
        await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
    }

}

export default VerifyUser;