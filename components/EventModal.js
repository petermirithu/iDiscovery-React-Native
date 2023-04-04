import React, { useEffect, useState } from "react";
import {
    Button,
    Heading,
    HStack,
    Modal,
    Text,
    useToast,
    View,
} from "native-base";
import Toaster from "./Toaster";
import { navigate, navigateReset } from "../services/RootNavigation";
import { db_deleteEvent, db_insertEvent, db_updateEvent } from "../services/Database";
import { Alert } from "react-native";


export default function EventModal({ showEventModal, setShowEventModal, eventDetails, operation }) {

    const toast = useToast();

    const [isSaving, setIsSaving] = useState(false);


    const addReport = () => {
        navigate("EventsForm", { id: eventDetails.id, description:eventDetails?.description, option: "addReport" });
        setShowEventModal(false);
    }

    const deleteEvent = async () => {        
        Alert.alert('Delete this Events?', 'Are you sure you want to delete this event?', [
            {
                text: 'No',
                onPress: () => null,
            },
            {
                text: 'Yes', onPress: async () => {
                    setIsSaving(true); 
                    await db_deleteEvent(eventDetails.id).then(response => {
                        const toastId = "success";
                        if (!toast.isActive(toastId)) {
                            toast.show({
                                placement: "top",
                                id: toastId,
                                render: () => <Toaster title="Successfully deleted the event :)" status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                            })
                        }
                        setTimeout(() => {
                            setIsSaving(false);
                            navigateReset("Home");
                            setShowEventModal(false);
                        }, 100);
                    }).catch(error => {
                        const toastId = "error";
                        if (!toast.isActive(toastId)) {
                            toast.show({
                                placement: "top",
                                id: toastId,
                                render: () => <Toaster title="Oops! Something went wrong :(" description={"An error occured while deleting the event."} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                            })
                        }
                        setIsSaving(false);
                    })
                }
            }
        ]);
    }

    const saveReport = async () => {
        setIsSaving(true);
        const payload = {
            id: eventDetails.id,
            description: eventDetails.description,
        }        

        await db_updateEvent(payload).then(response => {
            const toastId = "success";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Successfully added your report :)" status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            setTimeout(() => {
                setIsSaving(false);
                navigateReset("Home");
                setShowEventModal(false);
            }, 100);
        }).catch(error => {
            const toastId = "error";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Oops! Something went wrong :(" description={"An error occured while adding your report."} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            setIsSaving(false);
        })

    }

    const saveEvent = async () => {
        setIsSaving(true);
        const payload = [
            eventDetails.name,
            eventDetails.location,
            eventDetails.date.toISOString(),
            eventDetails.startTime.toISOString(),
            eventDetails.stopTime.toISOString(),
            eventDetails.category,
            eventDetails.reporterName,
            eventDetails.description,
            new Date().toISOString()
        ]

        await db_insertEvent(payload).then(response => {
            const toastId = "success";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Successfully created your event :)" status="success" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            setTimeout(() => {
                setIsSaving(false);
                navigateReset("Home");
                setShowEventModal(false);
            }, 100);
        }).catch(error => {            
            const toastId = "error";
            if (!toast.isActive(toastId)) {
                toast.show({
                    placement: "top",
                    id: toastId,
                    render: () => <Toaster title="Oops! Something went wrong :(" description={"An error occured while saving your event."} status="error" id={toastId} closeToast={() => toast.close(toastId)}></Toaster>
                })
            }
            setIsSaving(false);
        })
    }

    useEffect(() => {

    }, [isSaving])

    return (
        <Modal isOpen={showEventModal} avoidKeyboard={true} closeOnOverlayClick={false} animationPreset="slide" size={"lg"} onClose={() => setShowEventModal(false)}>
            <Modal.Content>
                <Modal.CloseButton focusable="false" />
                <Modal.Header>
                    {
                        (operation == "save") ?
                            <Heading fontSize={20}>Event Details to be Saved:-</Heading>
                            :
                            <>
                                {
                                    (operation == "addReport") ?
                                        <Heading fontSize={20}>Event Report to be Saved:-</Heading>
                                        :
                                        <Heading fontSize={20}>Event Details:-</Heading>
                                }
                            </>

                    }
                </Modal.Header>
                <Modal.Body backgroundColor="white">
                    {
                        (operation == "save" || operation == "about") ?
                            <View>
                                <Text key={"eventnName"}><Text fontWeight={"bold"} color={"gray.500"}>Event name:- </Text>{eventDetails.name}</Text>
                                <Text key="location"><Text fontWeight={"bold"} color={"gray.500"}>Location:- </Text>{(eventDetails.location?.length > 0) ? eventDetails.location : "N/A"}</Text>
                                <Text key="date"><Text fontWeight={"bold"} color={"gray.500"}>Date:- </Text>{eventDetails.date.toDateString()}</Text>
                                <Text key="startTime"><Text fontWeight={"bold"} color={"gray.500"}>Start time:- </Text>{eventDetails.startTime.toLocaleTimeString()}</Text>
                                <Text key="stopTime"><Text fontWeight={"bold"} color={"gray.500"}>Stop time:- </Text>{eventDetails.stopTime.toLocaleTimeString()}</Text>
                                <Text key="category"><Text fontWeight={"bold"} color={"gray.500"}>Category:- </Text>{eventDetails.category}</Text>
                                <Text key="reporterName"><Text fontWeight={"bold"} color={"gray.500"}>Reporter name:- </Text>{eventDetails.reporterName}</Text>
                                {
                                    (operation == "about") ?
                                        <>
                                            <Text fontWeight={"bold"} color={"gray.500"}>Report details:- </Text>
                                            <Text>{eventDetails.description || "N/A"}</Text>
                                        </>
                                        :
                                        <></>
                                }
                            </View>
                            :
                            <View>
                                <Text fontWeight={"bold"} color={"gray.500"}>Report details:- </Text>
                                <Text>{eventDetails.description}</Text>
                            </View>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {
                        (operation == "save") ?
                            <HStack space={3}>
                                <Button width={79} isDisabled={isSaving} colorScheme="danger" variant={"outline"} onPress={() => setShowEventModal(false)}>Close</Button>
                                <Button minWidth={79} colorScheme="success" onPress={saveEvent} isLoading={isSaving} isLoadingText={"Saving event..."}>Save</Button>
                            </HStack>
                            :
                            (operation == "about") ?
                                <HStack space={3}>
                                    <Button minWidth={90} colorScheme="danger" variant={"outline"} onPress={deleteEvent}>Delete</Button>
                                    <Button minWidth={100} colorScheme="primary" onPress={addReport}>{eventDetails.description?.length>0?"Update report":"Add report"}</Button>
                                </HStack>
                                :
                                <HStack space={3}>
                                    <Button width={79} isDisabled={isSaving} colorScheme="danger" variant={"outline"} onPress={() => setShowEventModal(false)}>Close</Button>
                                    <Button minWidth={79} colorScheme="primary" onPress={saveReport}>Save</Button>
                                </HStack>
                    }
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    )
}
