import { Alert, AlertDescription, AlertIcon, Box, Divider, Flex, FormControl, FormHelperText, FormLabel, Input, SimpleGrid, Text } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import ApiConsole from "../components/ApiConsole";
import BaseLayout from "../components/BaseLayout";
import Markdown from "../components/Markdown";
import Config from "../config.json"
import getText from "../lib/getText";

export default function Documentation({ session, endpoints, defaultArguments }) {
    console.log(endpoints)

    const EndpointConsole = ({ endpoint, eKey, method }) => {
        const [args, setArgs] = useState(defaultArguments)

        return (
            <SimpleGrid columns={2} gap={5} my={3}>
                <Box bg={"#2c2c2c"} color="white" p={2} rounded="md" fontWeight="light">
                    <Box my={2}>
                        <Markdown>
                            {endpoints[eKey]}
                        </Markdown>
                    </Box>
                    <Divider />
                    <FormControl>
                        <FormLabel>Endpoint Arguments</FormLabel>
                        <Input defaultValue={defaultArguments} placeholder="No Arguments" onChange={(e) => setArgs(e.target.value || "")} />
                        <FormHelperText>{Config.apiUrl}/{endpoint}?{args}</FormHelperText>
                    </FormControl>
                </Box>
                <ApiConsole endpoint={`${endpoint.trim("/")}?${args}`} token={session.token} method={method || "GET"} />
            </SimpleGrid>
        )
    }

    return (
        <BaseLayout title={"Documentation"}>
            {!session && (
                <>
                    <Alert status={"error"}>
                        <AlertIcon />
                        <AlertDescription>You must have an account to access the API documentation.</AlertDescription>
                    </Alert>
                </>
            )}
            {session && (
                <Flex direction="column">
                    <EndpointConsole endpoint={"word"} eKey={"word"} />
                    <EndpointConsole endpoint={"text"} eKey={"text"} />

                </Flex>
            )}
        </BaseLayout>
    )
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)

    return {
        props: {
            session,
            endpoints: {
                word: await getText("docs/word"),
                text: await getText("docs/text")
            }
        }
    }
}