import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Button,
    Heading,
    Input,
    HStack,
    Image,
    useToast,    
    Select,
    ScrollView,    
    ChevronLeftIcon,
    TextArea
} from "native-base";
import { global } from '../styles/styles';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useAssets } from 'expo-asset';
import Loader from "../components/Loader";
import DateTimePicker from '@react-native-community/datetimepicker';
import Toaster from "../components/Toaster";
import { navigateReset } from "../services/RootNavigation";
import EventModal from "../components/EventModal";


const Height = Dimensions.get("screen").height;

export default function EventsForm({ route, navigation }) {
    const toast = useToast();
    const [assets] = useAssets([require('../assets/calendar-icon.png'), require('../assets/clock_time.png')]);

    const [form, setForm] = useState({
        id: "",
        name: "",
        location: "",
        date: new Date(),
        startTime: new Date("2023-04-04T06:00:00.000Z"),
        stopTime: new Date("2023-04-04T15:30:00.000Z"),
        category: "",
        reporterName: "",
        description: "",
        action: "save"
    });

    const [operation, setOperation] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);

    const updateForm = (field, value) => {
        if (value == undefined) {
            return
        }

        setOperation(null);

        let tempForm = { ...form };
        tempForm[field] = value;

        setForm(tempForm);
    }

    const submitReport = () => {
        if (form.description?.length < 5) {
            const toastId = "invalidReport";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Invalid report" description={"Please enter a report that is not less that 5 words."} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else {
            setShowEventModal(true);
        }
    }

    const submitDetails = () => {
        if (form.name?.length < 3) {
            const toastId = "invalidName";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Invalid event name" description={"Please enter a valid event name."} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else if (form.date == null) {
            const toastId = "invalidDate";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Invalid date for the event" description={"Please enter a valid date for the event."} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else if (form.category?.length == 0) {
            const toastId = "invalidCategory";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Invalid category for the event" description={"Please select a valid category for the event."} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else if (form.reporterName?.length < 3) {
            const toastId = "invalidReporterName";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Invalid reporter name" description={"Please enter a valid reporter name."} status="warning" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
        }
        else {
            setShowEventModal(true);
        }
    }

    useEffect(() => {        
        if (route?.params?.option == "addReport") {            
            setForm({
                id: route.params?.id, description: route.params?.description,
                action: (route.params?.description?.length > 0) ? "updateReport" : "addReport"
            });
            route.params = null;
        }
    }, [operation, form, showEventModal])

    if (!assets) {
        return (
            <Loader></Loader>
        )
    }

    return (
        <View style={global.container}>
            <ScrollView height={Height}>
                <View style={global.content}>
                    <Button
                        position={"absolute"} top={7} left={2}
                        size={"md"} variant={"ghost"} zIndex={99}
                        colorScheme="blue"
                        onPress={() => navigateReset("Home")}
                        leftIcon={
                            <ChevronLeftIcon size={3} marginTop={0.5} />
                        }
                    >Back</Button>

                    {
                        (form.action == "addReport" || form.action == "updateReport") ?
                            <>
                                <Heading color={"secondary.500"} textAlign="center" marginTop={3} marginBottom={5}>{(form.action == "updateReport") ? "Update report" : "Add report"}</Heading>
                                <Text style={styles.label} color={"gray.500"}>Event description:-</Text>
                                <TextArea
                                    marginBottom={5}
                                    variant="underlined"
                                    placeholder="Enter the event's report here"
                                    w="100%"
                                    height={200}
                                    value={form.description}
                                    onChangeText={val => updateForm("description", val)}
                                >
                                </TextArea>
                                <Button width={"100%"} onPress={() => submitReport()}>Submit</Button>
                            </>
                            :
                            <>
                                <Heading color={"secondary.500"} textAlign="center" marginTop={3} marginBottom={5}>Create Event</Heading>
                                <Text style={styles.label} color={"gray.500"}>Event name:-</Text>
                                <Input
                                    marginBottom={5}
                                    variant="underlined"
                                    placeholder="Enter the name of the event"
                                    w="100%"
                                    value={form.name}
                                    onChangeText={val => updateForm("name", val)}
                                />
                                <Text style={styles.label} color={"gray.500"}>Location:-</Text>
                                <Input
                                    marginBottom={5}
                                    variant="underlined"
                                    placeholder="Enter the location of the event"
                                    w="100%"
                                    value={form.location}
                                    onChangeText={val => updateForm("location", val)}
                                />
                                <Text style={styles.label} color={"gray.500"}>Date:-</Text>
                                <TouchableOpacity onPress={() => setOperation("date")}>
                                    <Input
                                        InputRightElement={<Image source={assets[0]} width={30} height={33} alt="Calendar icon" />}
                                        marginBottom={5}
                                        variant="underlined"
                                        placeholder="Enter the date of the event"
                                        w="100%"
                                        isReadOnly={true}
                                        value={(form.date) ? form.date.toDateString() : null}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.label} color={"gray.500"}>Time:-</Text>
                                <HStack space={5} marginBottom={5}>
                                    <View width={"48%"}>
                                        <TouchableOpacity onPress={() => setOperation("startTime")}>
                                            <Input
                                                InputRightElement={<Image source={assets[1]} width={30} height={30} alt="Time icon" />}
                                                variant="underlined"
                                                placeholder="Start"
                                                w="100%"
                                                isReadOnly={true}
                                                value={(form.startTime) ? new Date(form.startTime.setSeconds(0)).toLocaleTimeString() : null}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View width={"48%"}>
                                        <TouchableOpacity onPress={() => setOperation("stopTime")}>
                                            <Input
                                                InputRightElement={<Image source={assets[1]} width={30} height={30} alt="Time icon" />}
                                                variant="underlined"
                                                placeholder="Stop"
                                                w="100%"
                                                isReadOnly={true}
                                                value={(form.stopTime) ? new Date(form.stopTime.setSeconds(0)).toLocaleTimeString() : null}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                </HStack>
                                <Text style={styles.label} color={"gray.500"}>Event category:-</Text>
                                <Select
                                    selectedValue={form.category}
                                    accessibilityLabel="Select the event category"
                                    placeholder="Select the event Category"
                                    borderBottomColor={"gray.300"}
                                    borderWidth={0}
                                    borderBottomWidth={1}
                                    marginBottom={3}
                                    onValueChange={itemValue => updateForm("category", itemValue)}
                                    _selectedItem={{
                                        bg: "hotBlue",
                                    }}
                                >
                                    <Select.Item label="Culture" value="Culture" />
                                    <Select.Item label="Business" value="Business" />
                                    <Select.Item label="Education" value="Education" />
                                    <Select.Item label="Music" value="Music" />
                                    <Select.Item label="Art" value="Art" />
                                    <Select.Item label="Food" value="Food" />
                                </Select>
                                <Text style={styles.label} color={"gray.500"}>Reporter name:-</Text>
                                <Input
                                    marginBottom={5}
                                    variant="underlined"
                                    placeholder="Enter the name of the reporter"
                                    w="100%"
                                    value={form.reporterName}
                                    onChangeText={val => updateForm("reporterName", val)}
                                />
                                <Button width={"100%"} onPress={() => submitDetails()}>Submit</Button>
                            </>
                    }

                </View>
                {operation != null && (
                    <DateTimePicker
                        style={{ width: 200 }}
                        mode={
                            (operation == "date") ? "date" : "time"
                        }
                        placeholder={
                            (operation == "date") ? "Select the date for the event" :
                                (operation == "startTime") ? "Select start time for the event" :
                                    "Select stop time for the event"
                        }
                        format="YYYY-MM-DD"
                        confirmBtnText="OK"
                        cancelBtnText="Cancel"
                        value={
                            (operation == "date") ? form.date :
                                (operation == "startTime") ? form.startTime : form.stopTime
                        }
                        onChange={(event, dateTime) => {
                            updateForm(operation, dateTime);
                        }}
                    />
                )}
            </ScrollView>

            {
                (showEventModal == true) ?
                    <EventModal
                        showEventModal={showEventModal}
                        setShowEventModal={setShowEventModal}
                        eventDetails={form}
                        operation={form.action}
                    >
                    </EventModal>
                    :
                    <></>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
    },
});