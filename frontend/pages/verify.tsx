import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Center } from "@chakra-ui/layout";
import BaseLayout from "../components/BaseLayout";
import { Text, Flex } from "@chakra-ui/react";

export default function Verify() {

    return (
        <BaseLayout title="Email Verification">

            <Center py={3}>
                <Flex direction="column">
                    <Alert status="success" variant="subtle" flexDir="column" justifyContent="center" textAlign="center" maxW="max-content" p="5" rounded="md" mx={2}>
                        <AlertIcon boxSize="40px" />
                        <AlertTitle mt={2} fontSize="xl">Check your Email Inbox!</AlertTitle>
                        <AlertDescription>We have delivered an email to you with a link to access our website! If the email does not arrive within 5-10 minutes, check your Spam folder.</AlertDescription>
                    </Alert>
                    <Text mx={5} mt={2}><span style={{color:"red"}}>*</span> If the email does not arrive within that time, please reach out to us in the <a target="_blank" href="https://discord.gg/g3n2YaPM77" rel="noreferrer">Discord Server</a>.</Text>
                </Flex>
            </Center>

        </BaseLayout>
    )

}