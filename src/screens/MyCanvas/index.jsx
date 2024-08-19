import React, { useCallback, useContext, useEffect, useState, Screen } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Cntxt from "../../context/Cntxt";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Main from "../../components/Main";
import CanvasModels from "../../components/Modals/CanvasModels";
import { CARPENTRY_API_LINK } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
const CanvasScreen = () => {
    const route = useRoute();
    const { client } = route.params;

    const [showCanvaModels, setShowCanvaModels] = useState(false);

    return (
        <View style={styles.container}>
            <Navbar client = {client.name}/>
            <Main />
            <CanvasModels
                isVisible={showCanvaModels}
                onCancel={() => setShowCanvaModels(false)}
            />
            <Footer toggleCanvaModel={() => setShowCanvaModels(true)} />
        </View>



    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});



const DefaultScreen = () => {
    const route = useRoute();
    const [viewShapeIndex, setViewShapeIndex] = useState(() => {
        if (viewShapeIndex) return viewShapeIndex;
        return 0;
    });
    const [clientShapes, setClientShapes] = useState([]);
    const {client}= route.params

    const getShapes = async () => {
        const user = await AsyncStorage.getItem('user');

        fetch(CARPENTRY_API_LINK + '/shapes?id='+client.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(user).api_token
            }
        })
            .then((response) => response.json())
            .then((json) => {
                setClientShapes(json.data)
                console.log('//////////')
                console.log(json)
            })
       
    }

    const addShape = async (shape) => {
        const user = await AsyncStorage.getItem('user');
        fetch(CARPENTRY_API_LINK + '/shape/store', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(user).api_token
            },
            body: JSON.stringify({
                shape: shape,
                id:client.id
            })
        })
            .then((response) => response.json())
            .then((json) => {
                getShapes();
            })
    }



    useEffect(() => {
        getShapes();
    }, []);


    const updateShape = async (newFrame, index) => {
        if (clientShapes) {
            console.log(clientShapes[index], newFrame)
            const user = await AsyncStorage.getItem('user');
            fetch(CARPENTRY_API_LINK + '/shape/update', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(user).api_token
                },
                body: JSON.stringify({
                    shape: newFrame,
                    id : clientShapes[index].id
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    getShapes();
                })
        }

    };

    const deleteShape = async (id) => {
        const user = await AsyncStorage.getItem('user');
        fetch(CARPENTRY_API_LINK + '/shape/delete', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(user).api_token
            },
            body: JSON.stringify({
                id: id
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                getShapes();
            })
    };

    return (
        <Cntxt.Provider
            value={{
                addShape,
                updateShape,
                deleteShape,
                viewShapeIndex,
                setViewShapeIndex,
                client,
                clientShapes,
                setClientShapes,
            }}
        >
            <CanvasScreen />
        </Cntxt.Provider>


    );
};
export default DefaultScreen;
