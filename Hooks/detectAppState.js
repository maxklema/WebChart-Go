import { useEffect } from "react";
import { AppState } from "react-native";
import * as FileSystem from 'expo-file-system';

const detectAppState = (navigation) => {

    const handleInActiveState = async () => {

        //set canAccessSessionID to false;
        const sessionURI = FileSystem.documentDirectory + "session.json";
        const sessionInfo = await FileSystem.getInfoAsync(sessionURI);

        if (sessionInfo.exists){
            const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
            sessionData["canAccessSessionID"] = false;
            await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
        }
    };

    useEffect(() => {
        (async () => {        

            let previousAppState = AppState.currentState;

            const handleAppStateChange = async (currentAppState) => {
                if (currentAppState == "background" || currentAppState == "inactive"){
                    await handleInActiveState();
                } else if (currentAppState === 'active' && previousAppState != 'active') {
                    // console.log(previousAppState);
                    //set canAccessSessionID to false;
                    await navigation.navigate("Lock Screen");

                }
                previousAppState = currentAppState;
            };
    
            AppState.addEventListener("change", handleAppStateChange);

            return () => {
                AppState.removeEventListener("change", handleAppStateChange);
            };

        })();
    }, []);
}

export default detectAppState;