import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    ChevronLeftIcon,
    Circle,
    DeleteIcon,
    Heading,
    HStack,
    IconButton,
    Image,
    InfoIcon,
    Pressable,
    ScrollView,
    Text,
    useToast,
    View,
} from "native-base";
import { global } from '../styles/styles';
import Loader from "../components/Loader";
import { db_deleteAllEvents, db_getAllEvents, db_getCategoryEvents, db_searchEventsByName } from "../services/Database";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import { useAssets } from "expo-asset";
import { navigate, navigateReset } from "../services/RootNavigation";
import EventModal from "../components/EventModal";
import Toaster from "../components/Toaster";

const Height = Dimensions.get("screen").height;

export default function ViewEvents({ route, navigation }) {

    const toast = useToast();

    const [assets] = useAssets([
        require('../assets/empty.gif'),
        require('../assets/user.png'),
        require('../assets/event_categories/culture.png'),
        require('../assets/event_categories/business.png'),
        require('../assets/event_categories/education.png'),
        require('../assets/event_categories/music.png'),
        require('../assets/event_categories/art.png'),
        require('../assets/event_categories/food.png'),
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [dbEvents, setDbEvents] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);

    const loadAllEvents = async () => {
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
        });
    }

    const loadCategoryEvents = async (category) => {
        await db_getCategoryEvents(category).then(data => {
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
        });
    }

    const searchByEventName = async (text) => {
        await db_searchEventsByName(text).then(data => {
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
        });
    }

    const deleteAllevents = () => {
        Alert.alert('Delete all Events?', 'Are you sure you want to delete all events?', [
            {
                text: 'No',
                onPress: () => null,
            },
            {
                text: 'Yes', onPress: async () => {
                    setIsLoading(true);   
                    await db_deleteAllEvents().then(data => {                        
                        const toastId = "success";
                        if (!toast.isActive(toastId)) {
                            toast.show({
                                placement: "top",
                                id: toastId,
                                render: () => <Toaster title="Successfully deleted all events :)" status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                            })
                        }
                        setDbEvents([]);
                        setTimeout(() => {
                            setIsLoading(false);                            
                            navigateReset("Home");
                            setShowEventModal(false);
                        }, 100);                        
                    }).catch(error => {                                                
                        setDbEvents([]);
                        setIsLoading(false);
                        const toastId = "error";
                        if (!toast.isActive(toastId)) {
                            toast.show({
                                placement: "top",
                                id: toastId,
                                render: () => <Toaster title="Oops! Something went wrong :(" description={"An error occured while deleting all events."} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                            })
                        }
                    });
                }
            },
        ]);
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
                            position="relative"
                            borderRadius={10} padding={2}
                            marginBottom={5}
                            style={[
                                global.shadowStyle,
                                {
                                    transform: [{
                                        scale: isPressed ? 0.96 : 1
                                    }],
                                }
                            ]}
                            backgroundColor="white"
                        >
                            <HStack width={"100%"} space={3}>
                                <View width={"15%"}>
                                    <Image source={
                                        (datum.category == "Culture") ? assets[2] :
                                            (datum.category == "Business") ? assets[3] :
                                                (datum.category == "Education") ? assets[4] :
                                                    (datum.category == "Music") ? assets[5] :
                                                        (datum.category == "Art") ? assets[6] : assets[7]
                                    } width={"100%"} height={50} alt="Category Image" borderRadius={10} />
                                </View>
                                <View position={"relative"} width={"82%"}>
                                    <View style={{ position: "absolute", top: 3, right: 3, zIndex: 99 }}>
                                        <InfoIcon size={5} color="black" />
                                    </View>
                                    <Text fontWeight={"bold"}
                                        width={"90%"}
                                        isTruncated={true}
                                        color={
                                            (datum.category == "Culture") ? "indigo.600" :
                                                (datum.category == "Business") ? "primary.600" :
                                                    (datum.category == "Education") ? "emerald.600" :
                                                        (datum.category == "Music") ? "amber.600" :
                                                            (datum.category == "Art") ? "violet.600" : "gray.600"
                                        }
                                    >{datum.name} - <Text fontWeight={"normal"} fontStyle="italic">{datum.location}</Text></Text>
                                    <Text position={"absolute"} bottom={1} right={1} fontSize={10}>{datum.date.toDateString()}</Text>
                                    <HStack space={3} marginTop={1}>
                                        <Avatar source={assets[1]} size={"xs"}></Avatar>
                                        <Text fontStyle={"italic"}>{datum.reporterName}</Text>
                                    </HStack>
                                </View>
                            </HStack>
                        </View>
                    )
                }}
            </Pressable >
        )
    }


    useEffect(() => {
        if (isLoading == false && dbEvents == null && route.params) {
            setIsLoading(true);
            if (route?.params == "viewAll") {
                loadAllEvents();
            }
            else if (route.params?.search == true) {
                searchByEventName(route.params?.value);
            }
            else {
                loadCategoryEvents(route.params);
            }
        }
    }, [isLoading, dbEvents, selectedEvent, showEventModal])

    if (!assets || isLoading == true) {
        return (
            <Loader></Loader>
        )
    }

    return (
        <>
            <View style={global.container}>
                <ScrollView height={Height}>
                    <View style={global.content}>
                        <Button
                            position={"absolute"} top={7} left={2}
                            size={"md"} variant={"ghost"} zIndex={99}
                            colorScheme="blue"
                            onPress={() => navigate("Home")}
                            leftIcon={
                                <ChevronLeftIcon size={3} marginTop={0.5} />
                            }
                        >Back</Button>

                        {
                            (route?.params == "viewAll") ?
                                <>
                                    <Button
                                        position={"absolute"} top={7} right={2}
                                        size={"md"} variant={"ghost"} zIndex={99}
                                        colorScheme="error"
                                        onPress={() => deleteAllevents()}
                                        leftIcon={
                                            <DeleteIcon size={3} marginTop={0.5} />
                                        }
                                    >Delete All</Button>
                                    <Heading color={"secondary.500"} textAlign="center" marginTop={3} marginBottom={5}>All Events</Heading>
                                </>
                                :
                                (route.params?.search == true) ?
                                    <>
                                        <Heading color={"secondary.500"} textAlign="center" marginTop={3}>Events with "{route.params?.value}"</Heading>
                                        <Text fontStyle={"italic"} fontSize={10} textAlign="center" marginBottom={5}>Queried column name, location and reporter Name</Text>
                                    </>
                                    :
                                    <Heading color={"secondary.500"} textAlign="center" marginTop={3} marginBottom={5}>Events - "{route.params}"</Heading>

                        }

                        {
                            (dbEvents?.length > 0) ?
                                <>
                                    {
                                        dbEvents.map((datum, index) => {
                                            return renderCard(datum, index);
                                        })
                                    }
                                </>
                                :
                                <>
                                    <View justifyContent={"center"} alignItems="center" marginTop={150}>
                                        <Image source={assets[0]} width={150} height={150} alt="Empty icon" />
                                        <Text>No events available.</Text>
                                    </View>
                                </>
                        }
                    </View>
                </ScrollView>
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
        </>
    )
}