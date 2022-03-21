import { Button, Code, Divider, Table, Tbody, Td, Text, Th, Thead, Tr, useClipboard } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import BaseLayout from "../components/BaseLayout";
import HeaderText from "../components/Text/Header";

export default function Me({ session }) {
    console.log(session)
    let endpoints = []

    if (session.tokenInfo.actions) {
        endpoints = [...new Set(session.tokenInfo.actions.map(ac => ac.endpoint))]
    }

    const { hasCopied, onCopy } = useClipboard(session.token)

    return (
        <BaseLayout title={"My Account"}>
            <HeaderText>My Account</HeaderText>
            <Divider bg="black" h={"1.5px"} mb={5} />
            <Text fontSize="1vw">Token: <Code>{session.token}</Code> <Button h={6} colorScheme="green" fontWeight={"normal"} onClick={onCopy}>{hasCopied ? "Copied" : "Copy"}</Button></Text>
            {session.tokenInfo.actions && (
                <>
                    <HeaderText
                        mt={5}
                        fontSize={{
                            base: "20px",
                            lg: "1.5vw"
                        }}
                    >
                        Token Info
                    </HeaderText>
                    <Divider bg="black" h={"1.5px"} mb={2} />
                    <Text>Session Uses: {session.tokenInfo.uses}</Text>
                    <Text>RateLimited: {session.tokenInfo.ratelimited == "false" ? "This token is not rate-limited" : Math.round(((new Date(session.tokenInfo.rateLimited)) - new Date()) / 1000) + " seconds remaining"}</Text>
                    <Text>Next RateLimit Timeout Duration: {session.tokenInfo["ratelimit-multi"].toFixed(2)} minutes</Text>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>EndPoint</Th>
                                <Th>Uses</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {endpoints.map(ep => (
                                <Tr key={ep}>
                                    <Td>{ep}</Td>
                                    <Td>{session.tokenInfo.actions.filter(e => e.endpoint == ep).length}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </>
            )}
        </BaseLayout>
    )
}

export const getServerSideProps = async (ctx) => {

    const session = await getSession(ctx)

    if (!session) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }

}