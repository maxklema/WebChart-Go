import React, { useState } from "react";
import { Button, Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View } from "react-native";
import Container from "../../Components/Container";

const InteractionsPage = () => {

    const [recentInteractions, setRecentInteractions] = useState([]);


    useFocusEffect(
        React.useCallback(() => {
            const readInteractionsData = async () => {
                    try {
                        const fileUri = FileSystem.documentDirectory + "interactions.json";

                        const fileInfo = await FileSystem.getInfoAsync(fileUri);
                            if (!fileInfo.exists) {
                            const initialContent = JSON.stringify({ });
                            await FileSystem.writeAsStringAsync(fileUri, initialContent);
                        } else {
                            let interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                            interactionsData = interactionsData[mie.practice.value];
                            // console.log(mie.practice.value);
                            // console.log(JSON.stringify(interactionsData));

                            // add file contents to state varaible
                            let interactions = [];
                            for (const interaction in interactionsData){
                                interactions.push(interactionsData[interaction]);
                            }

                            setRecentInteractions(interactions.reverse());
                            console.log(recentInteractions);

                        }
                } catch (error) {
                    console.error('Error handling interactions file:', error);
                }
            };

        readInteractionsData();

        }, [])
    );

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>

                {/* Recent Interactions */}
                <View style={styles.recent_interactions_container}>
                    <Text style={styles.header}>Recent Interactions</Text>
                </View>

                <Button onPress={() => clearData()}>Clear Data</Button>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({

    parent_container: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
    },
    header: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)'
    },
})

export default InteractionsPage;
