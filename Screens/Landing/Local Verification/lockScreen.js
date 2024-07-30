import { SafeAreaView } from "react-native-safe-area-context"
import InputButton from "../../../Components/Inputs/inputButton"
import * as FileSystem from 'expo-file-system';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useContext } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import mie from '@maxklema/mie-api-tools';
import { SettingsContext } from "../../Context/context";
import { CommonActions } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";

import lockGraphic from '../../../Assets/Misc Graphics/lock-graphic.png';

const LockScreen = ({ navigation }) => {

    const { isToggled } = useContext(SettingsContext);

    useEffect(() => {
        (async () => {
            
            //set canAccessSessionID to false;

            const sessionURI = FileSystem.documentDirectory + "session.json";
            const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
                
            console.log("SESSION DATA LAUNCH? " + sessionData["hasLaunched"]);

            const result = await LocalAuthentication.authenticateAsync({
                "promptMessage": "WebChart Go requests that you verify yourself."
            })
        
            if (result.success){
                sessionData["canAccessSessionID"] = true;
                await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
                
                 //load systems data
                const systemsURI = FileSystem.documentDirectory + "systems.json";            
                const user_systems = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));

                if (isToggled.automatic_wc_launch && !sessionData["hasLaunched"]){
                    
                     sessionData["hasLaunched"] = true;
                        await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
                    if (user_systems.system_URLS.length > 0){
                    
                        // console.log("HERE?");
                        const recentWC = user_systems.system_URLS[0];
                        mie.practice.value = recentWC.substring(8, recentWC.indexOf('.'));
                        if (!recentWC.includes("/webchart.cgi")) {
                            mie.URL.value = recentWC.substring(0,recentWC.indexOf(".com")+4) + '/webchart.cgi';
                        } else {
                            mie.URL.value = recentWC;
                        }

                        setTimeout(() => {
                            // navigation.dispatch(
                            //     CommonActions.reset({
                            //         index: 0,
                            //         routes: [ 
                            //             { name: 'WebChart' }
                            //         ],
                            //     })
                            // );
                            navigation.navigate("WebChart")
                        }, 1500);

                        console.log("after?");
                        navigation.dispatch(StackActions.popToTop());


                    }
                } else {

                    console.log("HERE?????");

                    sessionData["hasLaunched"] = true;
                    await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));

                    setTimeout(() => {
                        navigation.goBack();
                    }, 1500);
                    
                }
            } else {
                // Authentication Failed - Navigate back to "Enter URL" page
                sessionData["canAccessSessionID"] = false;
                await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
                setTimeout(() => {
                    navigation.navigate("Back");
                }, 1500);                
            }
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Image style={styles.graphic} source={lockGraphic} />
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Authenticating</Text>
                    <Text style={styles.regular}>In an effort to keep your WebChart data secure, we require re-authentication everytime you re-open the app.</Text>
                </View>
                <InputButton style={styles.backButton} text="Back" onPress={() => navigation.goBack()}/>                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '8%',
    },
    backButton: {
        maxWidth: 100,
        alignSelf: 'center',
    },
    textContainer: {
        marginBottom: '15%',
        marginTop: '40%'
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    regular: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphic: {
        alignSelf: 'center',
        marginBottom: '5%',
        height: 140,
        width: 140,
        borderRadius: 10,
    }

});

export default LockScreen;