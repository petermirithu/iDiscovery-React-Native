import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from "../components/Navbar";
import { navigationRef } from "../services/RootNavigation";
import Home from "../screens/Home";
import EventsForm from "../screens/EventsForm";
import ViewEvents from '../screens/ViewEvents';

const { Screen, Navigator } = createStackNavigator();

const screenOptions = {
    headerLeftShown: false,
    header: () => {
        return (  
            <>
                <Navbar></Navbar>            
            </>                      
        )
    }
}

export const AppNavigator = () => (
    <NavigationContainer ref={navigationRef}>
        <Navigator initialRouteName="Home" screenOptions={screenOptions}>                                   
            <Screen name="Home" component={Home}></Screen>            
            <Screen name="EventsForm" component={EventsForm}></Screen>            
            <Screen name="ViewEvents" component={ViewEvents}></Screen>            
        </Navigator>
    </NavigationContainer>
)