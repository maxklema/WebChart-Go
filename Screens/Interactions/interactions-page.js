import React, { useState } from "react";
import { Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View } from "react-native";
import Container from "../../Components/Container";
import InteractionCell from "../../Components/Cells/interactionCell";
import ValidateSession from "../../Components/validateSession";

const InteractionsPage = () => {

    const [recentInteractions, setRecentInteractions] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const readInteractionsData = async () => {
        
                // Load Interactions Data
                const fileUri = FileSystem.documentDirectory + "interactions.json";

                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                if (!fileInfo.exists) {
                    const initialContent = JSON.stringify({ });
                    await FileSystem.writeAsStringAsync(fileUri, initialContent);
                } else {
                    let interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                    parseInteractions(interactionsData);
                }
                
            };
        readInteractionsData();

        }, [mie.practice.value])
    );

    const parseInteractions = (interactionsData) => {
        interactionsData = interactionsData[mie.practice.value];

        // add file contents to state varaible
        let interactions = [];
        for (const interaction in interactionsData){
            interactions.push(interactionsData[interaction]);
        }

        setRecentInteractions(interactions.reverse());
    }

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
        setRecentInteractions([]);
    }


    return (
        <Container style={styles}>
            <View style={styles.parent_container}>

                {/* Recent Interactions */}
                <ValidateSession data={recentInteractions} header={"Recent Interactions"} clearData={clearData}>
                    <>
                        { recentInteractions.length > 0 ? 
                            <View>
                                { recentInteractions?.map((interaction, index) => (
                                    <InteractionCell key={index} data={JSON.stringify(interaction)}/>
                                ))}
                            </View> :
                            <View style={styles.noData}>
                                <Text>You have no recent patient interactions. An interaction will appear when you contact a patient (SMS, Email, Call) through their WebChart.</Text>
                            </View> 
                        }
                    </>
                </ValidateSession>                       

            </View>
        </Container>
    );

}

const styles = StyleSheet.create({
    parent_container: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
        flex: 1
    },
    noData: {
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        borderRadius: 12
    },
})

export default InteractionsPage;
