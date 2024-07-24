import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View } from "react-native";
import Container from "../../Components/Container";
import InteractionCell from "../../Components/Cells/interactionCell";
import ValidateSession from "../../Components/validateSession";
import InputButton from "../../Components/inputButton";

const InteractionsPage = () => {

    const [interactions, setInteractions] = useState({});
    const [loadedInteractions, setLoadedInteractions] = useState([]);
    const [displayLoadMoreButton, setDisplayLoadMoreButton] = useState(true);
    const multiple = 2;

    useFocusEffect(
        React.useCallback(() => {
            const readInteractionsData = async () => {
        
                // Load Interactions Data
                const fileUri = FileSystem.documentDirectory + "interactions.json";
                let interactionsRaw = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                if (interactionsRaw[mie.practice.value] != null)
                    setInteractions(interactionsRaw[mie.practice.value]);
                
            };
        readInteractionsData();

        }, [mie.practice.value])
    );

    useEffect(() => {

        const interactionKeys = Object.keys(interactions);

        //looks nice? no. Works? yes.

        //ran on first load
        if (loadedInteractions.length == 0 && Object.keys(interactions).length > multiple){
            updateLoadedInterations(interactionKeys, multiple);
            setDisplayLoadMoreButton(true);
        } else if (loadedInteractions.length == 0 && Object.keys(interactions).length <= multiple) {
            updateLoadedInterations(interactionKeys, Object.keys(interactions).length);
            setDisplayLoadMoreButton(false); 

        //adds enough to reach the next multiple, then sees if there are more interactions that need to be loaded
        } else if (loadedInteractions.length % multiple != 0 && loadedInteractions.length + (loadedInteractions.length % multiple) == Object.keys(interactions).length) {
            setDisplayLoadMoreButton(false);
            updateLoadedInterations(interactionKeys, loadedInteractions.length % multiple);
        } else if (loadedInteractions.length % multiple != 0 && loadedInteractions.length + (loadedInteractions.length % multiple) < Object.keys(interactions).length) {
            setDisplayLoadMoreButton(true);
            updateLoadedInterations(interactionKeys, loadedInteractions.length % multiple);
        }

        //interacts equal to a multiple, checks if there are more interactions
        else if (loadedInteractions.length % multiple == 0 && loadedInteractions.length < Object.keys(interactions).length) {
            setDisplayLoadMoreButton(true);
        } else if (loadedInteractions.length % multiple == 0 && loadedInteractions.length == Object.keys(interactions).length) {
            setDisplayLoadMoreButton(false);
        }
            

    }, [interactions])

    useEffect(() => {}, [displayLoadMoreButton, loadedInteractions]);

    const updateLoadedInterations = (interactionKeys, amount) => {

        const nextKeySet = interactionKeys.slice(loadedInteractions.length, loadedInteractions.length + amount);
        const newInteractions = nextKeySet.map(key => interactions[key]);
        
        setLoadedInteractions(prevLoadedInteractions => [...newInteractions, ...prevLoadedInteractions]);
    }

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
        setLoadedInteractions([]);
        setInteractions({});
        setDisplayLoadMoreButton(false);
    }

    const loadMoreInteractions = () => {
        
        const interactionKeys = Object.keys(interactions);

        if ((loadedInteractions.length + multiple) < interactionKeys.length){
            updateLoadedInterations(interactionKeys, multiple);
        } else {
            let interactionsLeft = interactionKeys.length - loadedInteractions.length;
            updateLoadedInterations(interactionKeys, interactionsLeft);
            setDisplayLoadMoreButton(false);
        }

    }

    const removeInteraction = async (index) => {

        // const interactionKeys = Object.keys(interactionsData)
        // const key = interactionKeys[interactionKeys.length - index - 1];

        // //update JSON interactions storage
        // const fileUri = FileSystem.documentDirectory + "interactions.json";
        // let interactionsRaw = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        // delete interactionsRaw[mie.practice.value][key];
        // await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsRaw));

    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>

                {/* Recent Interactions */}
                <ValidateSession data={loadedInteractions} header={"Recent Interactions"} clearData={clearData}>
                    <>
                        { loadedInteractions.length > 0 ? 
                            <View>
                                { loadedInteractions.map((interaction, index) => (
                                    <InteractionCell key={index} removeInteraction={() => removeInteraction(index)} data={JSON.stringify(interaction)}/>
                                ))}
                                { displayLoadMoreButton ? 
                                    <InputButton 
                                        text="Load More Interactions"
                                        style={styles.loadMoreInteractionsButton}
                                        textStyle={styles.interactionsButtonText}
                                        onPress={ () => loadMoreInteractions() }
                                    />: 
                                    <></>
                                }

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
    loadMoreInteractionsButton: {
        marginTop: '10%',
        backgroundColor: '#D65B27',
        width: 250,
        alignSelf: 'center',
        padding: 0,
    },
    interactionsButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        
    }

})

export default InteractionsPage;