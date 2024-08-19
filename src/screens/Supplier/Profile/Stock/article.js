import React, { Component } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, View, Text, FlatList, Image } from "react-native";
import { Screen } from "../../../../components/Containers/Screen";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import styles from "./styles";
import { StockCard } from "../../../../components/Cards/Stock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPLIER_API_LINK } from "../../../../utils/constants";
import DefaultTabs from "../../../../components/Tabs/Default";
import { DefaultInput } from "../../../../components/Inputs/default";
import { json } from "react-router-dom";
import StockAvailble from "../../../../components/Cards/StockAvailble";
import i18n from "../../../../../i18n";
import { Article } from "../../../../components/Cards/Article";
import { EditArticle } from "../../../../components/Modals/editArticle";
class StockArticleScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id:0,
            stockLoading: true,
            stockData: null,
            editVisible: false,
            selectedPrixAchat: 0,
            selectedQty: 0,
            selectedPrice: 0
        }
    }

    componentDidMount() {
        this.getStockArticle();
    }
    async getStockArticle() {

        try {
            const user = await AsyncStorage.getItem('user');

            const response = await fetch(SUPPLIER_API_LINK + '/stockArticle?name=' + this.props.route.params.name, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + JSON.parse(user).api_token,
                },
            });


            const jsonData = await response.json();
            console.log(jsonData)
            this.setState({
                stockData: jsonData.data,
                stockLoading: false
            })

        } catch (error) {
            console.error('Error fetching stock:', error);
        }

    }

    async destroyStock(id) {
        const user = await AsyncStorage.getItem('user');

        fetch(SUPPLIER_API_LINK + '/stock/destroy', {
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
                if (json.success) {
                    this.getStockArticle();
                }
            })
    }

    onEdit(item) {
        this.setState({
            selectedQty: item.qty,
            selectedPrixAchat: item.prixAchat,
            selectedPrice: item.price,
            id: item.id,
            editVisible: true
        })
    }
    async updateStock() {
        const user = await AsyncStorage.getItem('user');

        fetch(SUPPLIER_API_LINK + '/stock/update', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(user).api_token
            },
            body: JSON.stringify({
                id: this.state.id,
                price: this.state.selectedPrice,
                qty: this.state.selectedQty,
                prixAchat: this.state.selectedPrixAchat
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (json.success) {
                    this.getStockArticle();
                    this.setState({
                        editVisible: false
                    });
                }
            })
    }

    render() {
        const s = this.state;

        return (
            <Screen>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            //onRefresh={() => this.getStock()}
                            refreshing={s.stockLoading}
                        />
                    }

                    keyboardShouldPersistTaps={'always'}
                >
                    <View style={styles.container}>

                        <View style={styles.stockContainer}>
                            {s.stockLoading ? (
                                <ActivityIndicator size={'large'} />
                            ) : (
                                <FlatList
                                    data={s.stockData}
                                    keyExtractor={(item) => item.profile_name}
                                    renderItem={({ item }) => (
                                        <Article
                                            icon={item.icon}
                                            item={item}
                                            onEdit={() => this.onEdit(item)}
                                            onDestroy={() => this.destroyStock(item.id)}
                                        />
                                    )}
                                />
                            )}
                        </View>

                    </View>
                </ScrollView>
                <EditArticle
                    isVisible={s.editVisible}
                    qty={s.selectedQty}
                    price={Number(s.selectedPrice)}
                    prixAchat={Number(s.selectedPrixAchat)}
                    onCancel={() => this.setState({ editVisible: false })}
                    onAdd={() => this.updateStock()}
                    onChageQty={(value) => this.setState({ selectedQty: value })}
                    onChagePrice={(value) => this.setState({ selectedPrice: value })}
                    onChagePrixAchat={(value) => this.setState({ selectedPrixAchat: value })}
                />
            </Screen>
        );
    }
}

export default StockArticleScreen