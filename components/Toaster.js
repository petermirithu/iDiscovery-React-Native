import {
    VStack,
    HStack,
    Alert,
    Text,
    IconButton,
    CloseIcon,
} from "native-base";

export default function Toaster({ id, status, title, description, closeToast }) {

    return (
        <Alert nativeID={id} alignSelf="center" flexDirection="row" status={status} variant={"left-accent"} zIndex={999}>
            <VStack space={1} flexShrink={1}>
                <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                    <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon />
                        <Text fontSize="md" fontWeight="medium" flexShrink={1}>
                            {title}
                        </Text>
                    </HStack>
                    <IconButton variant="ghost" size="sm" padding={0} margin={0} icon={
                        <CloseIcon size="4" />
                    } onPress={closeToast} />
                </HStack>
                {(description?.length > 0) ?
                    <Text px="6" fontSize="sm" fontWeight="200">
                        {description}
                    </Text>
                    :
                    <></>
                }
            </VStack>
        </Alert>
    )
}   