import { Box, Flex } from "@chakra-ui/react"
import Head from "next/head"

export default function BaseLayout({ title, children }) {

    return (
        <>
            <Head>
                <title>{title} - BytesToBits API</title>
            </Head>

            <Flex alignItems="center" direction={"column"} minH="100vh">
                <Flex w={{
                    base: "100vw",
                    xs: "80vw",
                    lg: "60vw"
                }} p={10} bg="white" rounded="md">
                    <Box w="100%">
                        <main>{children}</main>
                    </Box>
                </Flex>
            </Flex>

        </>
    )
}