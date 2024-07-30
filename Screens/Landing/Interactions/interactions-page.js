import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View } from "react-native";

import Container from "../../../Components/Container";
import InteractionCell from "../../../Components/Cells/interactionCell";
import ValidateSession from "../../../Components/Verification/validateSession";
import InputButton from "../../../Components/Inputs/inputButton";

import detectAppState from "../../../Hooks/detectAppState";

const InteractionsPage = ({navigation}) => {

    const [interactions, setInteractions] = useState({});
    const [loadedInteractions, setLoadedInteractions] = useState([]);
    const [displayLoadMoreButton, setDisplayLoadMoreButton] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dataLocked, setDataLocked] = useState(false);
    const multiple = 10;

    useFocusEffect(
        React.useCallback(() => {
            ( async () => {
                setDisplayLoadMoreButton(false);
                setDataLocked(false);
                setLoadedInteractions([]);

                // Load Interactions Data
                const fileUri = FileSystem.documentDirectory + "interactions.json";
                let interactionsRaw = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                if (interactionsRaw[mie.practice.value] != null)
                    setInteractions(interactionsRaw[mie.practice.value]);

                const sessionURI = FileSystem.documentDirectory + "session.json";
                let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));

                // check if user is allowed to access session ID
                if (sessionData["canAccessSessionID"] == false)
                    setDataLocked(true);

            })();
        }, [mie.practice.value])
    );

    useEffect(() => {

        const interactionKeys = Object.keys(interactions);

        
        if (!isDeleting){

            //ran on first load
            if (Object.keys(interactions).length > multiple){
                updateLoadedInterations(interactionKeys, multiple);
                setDisplayLoadMoreButton(true);
            } else if (Object.keys(interactions).length <= multiple) {
                updateLoadedInterations(interactionKeys, Object.keys(interactions).length);
                setDisplayLoadMoreButton(false); 
            }
            
        } else {
            
            if (loadedInteractions.length % multiple == 0 && loadedInteractions.length < Object.keys(interactions).length){
                setDisplayLoadMoreButton(true);
                updateLoadInteractionsAfterDeletion(interactionKeys, loadedInteractions.length);
            } else if (loadedInteractions.length % multiple == 0 && loadedInteractions.length == Object.keys(interactions).length) {
                setDisplayLoadMoreButton(false);
                updateLoadInteractionsAfterDeletion(interactionKeys, loadedInteractions.length);
            } else if (loadedInteractions.length > Object.keys(interactions).length) {
                setDisplayLoadMoreButton(false);
                updateLoadInteractionsAfterDeletion(interactionKeys, loadedInteractions.length - 1);
            }
            setIsDeleting(false);
        }

    }, [interactions])

    useEffect(() => {}, [displayLoadMoreButton, loadedInteractions, isDeleting]);

    detectAppState(navigation);

    const updateLoadedInterations = (interactionKeys, amount) => {
        interactionKeys = interactionKeys.reverse();
        const nextKeySet = interactionKeys.slice(loadedInteractions.length, loadedInteractions.length + amount);
        const newInteractions = nextKeySet.map(key => interactions[key]);
        setLoadedInteractions(prevLoadedInteractions => [...prevLoadedInteractions, ...newInteractions]);
    }

    const updateLoadInteractionsAfterDeletion = (interactionKeys, amount) => {
        interactionKeys = interactionKeys.reverse();
        const nextKeySet = interactionKeys.slice(0, amount);
        const newInteractions = nextKeySet.map(key => interactions[key]);
        setLoadedInteractions([...newInteractions]);
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
        const interactionKeys = Object.keys(interactions)
        const key = interactionKeys[interactionKeys.length - index - 1];

        //update JSON interactions storage
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        let interactionsRaw = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsRaw[mie.practice.value][key];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsRaw));

        setIsDeleting(true);
        setInteractions(interactionsRaw[mie.practice.value]);
    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>
                <ValidateSession 
                    data={loadedInteractions} 
                    header={"Recent Interactions"} 
                    clearData={clearData}
                    navigation={navigation}
                    dataLocked={dataLocked}
                >
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