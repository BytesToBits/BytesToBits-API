import { Alert, AlertDescription, AlertIcon, Box, Divider, Flex, FormControl, FormHelperText, FormLabel, Input, SimpleGrid, Text } from "@chakra-ui/react";
import _ from "lodash";
import { getSession } from "next-auth/react";
import { useState } from "react";
import ApiConsole from "../components/ApiConsole";
import BaseLayout from "../components/BaseLayout";
import Markdown from "../components/Markdown";
import Config from "../config.json"
import getText from "../lib/getText";

export default function Documentation({ session, endpoints }) {
    console.log(endpoints)

    const EndpointConsole = ({ endpoint, eKey, method , noArgs, defaultArguments}) => {
        const [args, setArgs] = useState(defaultArguments || "")

        const requestUrl = () => {
            let urlArgs: String | Array<String> = args
            urlArgs = urlArgs.split(",").map(e => e.trim())
            urlArgs = urlArgs.map(e => {
                const parts = e.split("=")
                if (parts.length < 2) {
                    return null
                }

                return `${parts[0].trim()}=${parts[1].trim().replace(" ", "+")}`

            }).filter(e => e !== null)

            if (urlArgs.length > 0) {
                return `${_.trim(Config.apiUrl, "/")}/${endpoint}?${urlArgs.join("&")}`
            }

            return `${_.trim(Config.apiUrl, "/")}/${endpoint}`
        }

        return (
            <Flex direction={"column"} gap={2} id={`${endpoint}`}>
                <Box p={2} fontWeight="light">
                    <Box my={2}>
                        <Text fontSize={"1.5vw"} fontWeight="medium">/{endpoint}/ Endpoint</Text>
                        <Markdown>
                            {endpoints[eKey]}
                        </Markdown>
                    </Box>
                    <Divider />
                    <FormControl>
                        {!noArgs && (
                            <>
                                <FormLabel>Endpoint Arguments (Separated by comma)</FormLabel>
                                <Input defaultValue={defaultArguments} placeholder="No Arguments Specified" onChange={(e) => setArgs(e.target.value || "")} />
                            </>
                        )}
                        <FormHelperText>Request URL: {requestUrl()}</FormHelperText>
                    </FormControl>
                </Box>
                <ApiConsole endpoint={requestUrl()} token={session.token} method={method || "GET"} />
            </Flex>
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
                <Flex direction="column" gap={3}>
                    <EndpointConsole endpoint={"word"} eKey={"word"} noArgs />
                    <EndpointConsole endpoint={"text"} eKey={"text"} noArgs />

                    <EndpointConsole endpoint={"translate"} eKey={"translate"} defaultArguments={"from=nl, to=en, text=Hoi!"} />

                    <EndpointConsole endpoint={"lyrics"} eKey={"lyrics"} defaultArguments={"song=Royalty, author=Conor Maynard"} />

                    <EndpointConsole endpoint={"image/discord-message-faker"} eKey={"DiscordMessageFaker"} defaultArguments={"message=Hey there!!, name=Bob, color=63f72c"} />

                    <EndpointConsole endpoint={"image/btbify"} eKey={"BTBify"} defaultArguments={"image=https://i.imgur.com/fItNMCG.png"} />

                    <EndpointConsole endpoint={"image/convert"} eKey={"Convert"} defaultArguments={"image=https://i.imgur.com/fItNMCG.png, to=L"} />

                    <EndpointConsole endpoint={"image/hue-shift"} eKey={"HueShift"} defaultArguments={"image=https://i.imgur.com/fItNMCG.png, shift=50"} />

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