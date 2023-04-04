import React, { useEffect, useState } from "react";
import {
    Text,
    StatusBar,
    Box,
    HStack,    
} from "native-base";

export default function Navbar({ route }) {    

    useEffect(() => {
    }, []);

    return (
        <>
            <StatusBar bg="primary.100" barStyle="dark-content" />
            <Box safeAreaTop bg="primary.200" />
            <HStack bg="primary.600" px="5" py="3" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <Text color="white" fontSize="20" fontWeight="bold">
                        iDiscovery
                    </Text>
                </HStack>
                <HStack>                   
                    
                </HStack>
            </HStack>
        </>
    )
}
