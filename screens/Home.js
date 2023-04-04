import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Button,
    Center,
    Heading,
    Input,
    Avatar,
    SearchIcon,
    IconButton,
    ScrollView,
    HStack,
    InfoIcon,
    Circle,
    Image,
    useToast,
    Pressable
} from "native-base";
import { global } from '../styles/styles';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useAssets } from "expo-asset";
import Loader from "../components/Loader";
import { navigate } from "../services/RootNavigation";
import { db_getAllEvents } from "../services/Database";
import EventModal from "../components/EventModal";
import Toaster from "../components/Toaster";

export default function Home({ route, navigation }) {

    const toast = useToast();

    const [assets] = useAssets(
        [
            require('../assets/discover-icon.png'),
            require('../assets/user.png'),
            require('../assets/event_categories/culture.png'),
            require('../assets/event_categories/business.png'),
            require('../assets/event_categories/education.png'),
            require('../assets/event_categories/music.png'),
            require('../assets/event_categories/art.png'),
            require('../assets/event_categories/food.png'),
            require('../assets/empty.gif')
        ]);

    const [isLoading, setIsLoading] = useState(false);
    const [dbEvents, setDbEvents] = useState(null);
    const [latestEvents, setLatestEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [searchWord, setSearchWord] = useState(null);

    const loadEvents = async () => {
        await db_getAllEvents().then(data => {
            if (data?.length > 0) {
                for (let item of data) {
                    item.date = new Date(item.date);
                    item.startTime = new Date(item.startTime);
                    item.stopTime = new Date(item.stopTime);
                    item.timestamp = new Date(item.timestamp);
                }
            }

            data.sort(function (a, b) {
                return b.timestamp - a.timestamp;
            });

            const top3 = data.slice(0, 6);

            setLatestEvents(top3);
            setDbEvents(data);
            setIsLoading(false);
        }).catch(error => {
            setDbEvents([]);
            setIsLoading(false);
            const toastId = "error";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Oops! Something went wrong :(" description={"An error occured while loading events."} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        })
    }

    const showEventAbout = (datum) => {
        setSelectedEvent(datum);
        setShowEventModal(true);
    }

    const renderCard = (datum, index) => {
        return (
            <Pressable
                key={"card--" + index}
                onPress={() => showEventAbout(datum)}>
                {({
                    isPressed
                }) => {
                    return (
                        <View
                            style={
                                [
                                    styles.card,
                                    {
                                        transform: [{
                                            scale: isPressed ? 0.96 : 1
                                        }],
                                    }
                                ]}
                        >
                            <ImageBackground
                                style={{ width: "100%", height: "100%" }}
                                imageStyle={{ borderRadius: 10 }}
                                source={
                                    (datum.category == "Culture") ? assets[2] :
                                        (datum.category == "Business") ? assets[3] :
                                            (datum.category == "Education") ? assets[4] :
                                                (datum.category == "Music") ? assets[5] :
                                                    (datum.category == "Art") ? assets[6] : assets[7]
                                }
                                resizeMode="cover">
                                <View padding={3} position={"relative"}>
                                    <View width={"100%"} position="relative">

                                        <View style={{ position: "absolute", top: 0, right: 3, zIndex: 99 }}>
                                            <Circle width={39} height={39} variant="solid" bg="white">
                                                <InfoIcon size={5} color="black" />
                                            </Circle>
                                        </View>

                                        <Button colorScheme={
                                            (datum.category == "Culture") ? "indigo" :
                                                (datum.category == "Business") ? "primary" :
                                                    (datum.category == "Education") ? "emerald" :
                                                        (datum.category == "Music") ? "amber" :
                                                            (datum.category == "Art") ? "violet" : "gray"
                                        }
                                            width={100}>{datum.category}</Button>
                                    </View>
                                    <View position={"absolute"} top={40} left={3}>
                                        <View position={"relative"}
                                            backgroundColor={
                                                (datum.category == "Culture") ? "indigo.200" :
                                                    (datum.category == "Business") ? "primary.200" :
                                                        (datum.category == "Education") ? "emerald.200" :
                                                            (datum.category == "Music") ? "amber.200" :
                                                                (datum.category == "Art") ? "violet.200" : "gray.200"
                                            }
                                            width={275} padding={2} borderRadius={10}>
                                            <Text position={"absolute"} top={3} right={3} fontSize={10}>{datum.date.toDateString()}</Text>
                                            <Text fontWeight={"bold"} fontSize={16}>{datum.name}</Text>
                                            <HStack space={3} marginTop={1}>
                                                <Avatar source={assets[1]} size={"xs"}></Avatar>
                                                <Text fontStyle={"italic"}>{datum.reporterName}</Text>
                                            </HStack>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    )
                }}
            </Pressable >
        )
    }


    useEffect(() => {
        if (isLoading == false && dbEvents == null) {
            setIsLoading(true);
            loadEvents();
        }
    }, [isLoading, dbEvents, latestEvents, selectedEvent, showEventModal, searchWord]);

    if (!assets || isLoading == true) {
        return (
            <Loader></Loader>
        )
    }

    return (
        <View style={global.container}>
            <View style={global.content}>
                <Avatar style={styles.avatar} bg="primary.500" size="md" source={assets[0]}></Avatar>
                <Heading marginTop={3} color={"secondary.500"}>Welcome back!</Heading>
                <Heading size="xs" color="gray.500">Your one stop event recorder</Heading>
                <Input
                    marginTop={10}
                    marginBottom={10}
                    variant="rounded"
                    placeholder="Search for event that contains ..."
                    w="100%"
                    InputLeftElement={
                        <IconButton variant="ghost" size="sm" paddingLeft={5} margin={0} icon={
                            <SearchIcon size={4} color="black" />
                        }
                        />
                    }
                    onChangeText={val => setSearchWord(val)}
                    onEndEditing={() => navigate("ViewEvents", { search: true, value: searchWord })}
                />

                <View>
                    <Button position={"absolute"} top={-10} zIndex={999} right={0} width={"33%"} colorScheme={"primary"} onPress={() => navigate("ViewEvents", "viewAll")}>View All</Button>
                    <Heading size={"sm"}>Event Categories</Heading>
                </View>
                <View marginTop={6} marginBottom={10} width={"100%"}>
                    <ScrollView
                        horizontal={true}
                        pagingEnabled={false}
                        width={"100%"}
                    >
                        <HStack space={3}>
                            <Button variant={"outline"} colorScheme="indigo" width={100} onPress={() => navigate("ViewEvents", "Culture")}>Culture</Button>
                            <Button variant={"outline"} colorScheme="primary" width={100} onPress={() => navigate("ViewEvents", "Business")}>Business</Button>
                            <Button variant={"outline"} colorScheme="emerald" width={100} onPress={() => navigate("ViewEvents", "Education")}>Education</Button>
                            <Button variant={"outline"} colorScheme="amber" width={100} onPress={() => navigate("ViewEvents", "Music")}>Music</Button>
                            <Button variant={"outline"} colorScheme="violet" width={100} onPress={() => navigate("ViewEvents", "Art")}>Art</Button>
                            <Button variant={"outline"} colorScheme="gray" width={100} onPress={() => navigate("ViewEvents", "Food")}>Food</Button>
                        </HStack>
                    </ScrollView>


                </View>

                <View position={"relative"}>
                    <Button position={"absolute"} top={-10} zIndex={999} right={0} width={"33%"} colorScheme={"secondary"} onPress={() => navigate("EventsForm")}>Create event</Button>
                    <Heading size={"sm"}>Recently Added</Heading>
                </View>

                <View marginTop={6}>
                    {
                        (latestEvents?.length > 0) ?
                            <ScrollView
                                horizontal={true}
                                pagingEnabled={false}
                                width={"100%"}
                                height={"100%"}
                            >
                                <HStack space={3}>
                                    {
                                        latestEvents.map((datum, index) => {
                                            return renderCard(datum, index);
                                        })
                                    }
                                </HStack>
                            </ScrollView>
                            :
                            <View justifyContent={"center"} alignItems="center">
                                <Image source={assets[8]} width={150} height={150} alt="Empty icon" />
                                <Text>No events available.</Text>
                            </View>
                    }
                </View>
            </View>

            {
                (showEventModal == true) ?
                    <EventModal
                        showEventModal={showEventModal}
                        setShowEventModal={setShowEventModal}
                        eventDetails={selectedEvent}
                        operation={"about"}
                    >
                    </EventModal>
                    :
                    <></>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        position: "absolute",
        top: 30,
        right: 20
    },
    card: {
        width: 300,
        height: 200,
        borderRadius: 10,
    }
});