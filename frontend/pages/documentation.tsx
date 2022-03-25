import { Alert, AlertDescription, AlertIcon, Box, Divider, Flex, FormControl, FormHelperText, FormLabel, Input, Link, List, ListIcon, ListItem, SimpleGrid, Text } from "@chakra-ui/react";
import _ from "lodash";
import { getSession } from "next-auth/react";
import { useState } from "react";
import ApiConsole from "../components/ApiConsole";
import BaseLayout from "../components/BaseLayout";
import Markdown from "../components/Markdown";
import Config from "../config.json"
import fs from "fs"
import HeaderText from "../components/Text/Header";
import { FaCodeBranch } from "react-icons/fa"
import getText from "../lib/getText";

export default function Documentation({ session, endpoints }) {

    const EndpointConsole = ({ endpoint, eKey, method, noArgs, defaultArguments }) => {
        const [args, setArgs] = useState(defaultArguments || "")

        const text = endpoints.find(e => e.name == eKey)

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
            <Flex direction={"column"} gap={2} id={`${eKey}`}>
                <Box p={2} fontWeight="light">
                    <Box my={2}>
                        <Text fontSize={{
                            base: "20px",
                            lg: "1.5vw"
                        }} fontWeight="medium">/{endpoint}/ Endpoint</Text>
                        <Markdown>
                            {text && (text.content)}
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
                    <Flex m={3} direction="column">
                        <HeaderText>Quick Access</HeaderText>
                        <List mx={5}>
                            {endpoints.reverse().map(endpoint => (
                                <ListItem key={`quickaccess-${endpoint}`} className="no-icon">
                                    <ListIcon as={FaCodeBranch} color="blue.400" />
                                    <Link href={"#" + endpoint.name}>{endpoint.name}</Link>
                                </ListItem>
                            ))}
                        </List>

                    </Flex>

                    <EndpointConsole endpoint={"word"} eKey={"word"} noArgs />

                    <EndpointConsole endpoint={"text"} eKey={"text"} noArgs />

                    <EndpointConsole endpoint={"translate"} eKey={"translate"} defaultArguments={"from=nl, to=en, text=Hoi!"} />

                    <EndpointConsole endpoint={"lyrics"} eKey={"lyrics"} defaultArguments={"song=Royalty, author=Conor Maynard"} />

                    <EndpointConsole endpoint={"image/discord-message-faker"} eKey={"DiscordMessageFaker"} defaultArguments={"message=Hey there!!, name=Bob, color=63f72c"} />

                    <EndpointConsole endpoint={"image/btbify"} eKey={"BTBify"} defaultArguments={"image=https://cdn.discordapp.com/attachments/718575580731408455/951088951798689812/2e8cde47c6d3d5c53847ad55a8a7d564.jpg"} />

                    <EndpointConsole endpoint={"image/convert"} eKey={"Convert"} defaultArguments={"image=https://cdn.discordapp.com/attachments/718575580731408455/951088951798689812/2e8cde47c6d3d5c53847ad55a8a7d564.jpg, to=L"} />

                    <EndpointConsole endpoint={"image/hue-shift"} eKey={"HueShift"} defaultArguments={"image=https://cdn.discordapp.com/attachments/718575580731408455/951088951798689812/2e8cde47c6d3d5c53847ad55a8a7d564.jpg, shift=50"} />

                    <EndpointConsole endpoint={"image/transparent"} eKey={"Transparent"} defaultArguments={"image=https://cdn.discordapp.com/attachments/718575580731408455/951088951798689812/2e8cde47c6d3d5c53847ad55a8a7d564.jpg, color=070b16, strength=40"} />

                </Flex>
            )}
        </BaseLayout>
    )
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx)

    const endpoints = []
    const docs = ["word", "text", "translate", "lyrics", "DiscordMessageFaker", "BTBify", "Convert", "HueShift", "Transparent"]

    for (let i in docs) {
        const ep = docs[i]
        endpoints.push({
            name: ep,
            content: await getText("docs/" + ep)
        })
    }

    return {
        props: {
            session,
            endpoints: endpoints
        }
    }
}