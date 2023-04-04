import React, { useEffect } from "react";
import {
    Text,
    HStack,
    Spinner,
    View,
    Image
} from "native-base";
import { useAssets } from "expo-asset";
import { global } from '../styles/styles';

export default function Loader() {

    const [assets] = useAssets([require('../assets/loader.gif')]);

    useEffect(() => {

    }, [])

    if (!assets) {
        return (
            <View style={global.container} justifyContent="center" alignItems={"center"}>
                <HStack space={2}>
                    <Spinner color="primary.500" size={20} />
                    <Text>Loading...</Text>
                </HStack>
            </View>
        )
    }

    return (
        <>
            <View style={global.container} justifyContent="center" alignItems={"center"}>
                <Image source={assets[0]} width={200} height={200} alt="Loading..." />
            </View>
        </>
    )
}
