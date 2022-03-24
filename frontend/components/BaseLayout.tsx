import { Box, Button, Flex, Icon, Link, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react"
import Head from "next/head"
import HeaderText from "./Text/Header"

import indexStyle from "../styles/modules/index.module.css"
import { useRouter } from "next/router"

import { FaList } from "react-icons/fa"

export const Navigation = () => {
    const router = useRouter()
    const isMobile = useBreakpointValue({
        base: true,
        md: false
    })

    const { isOpen, onToggle } = useDisclosure()

    return (
        <>
            {!isMobile && (
                <Flex gap={5}>
                    <Button colorScheme={"brand.blue"} onClick={() => router.push("/")}>Home</Button>
                    <Button colorScheme={"brand.blue"} onClick={() => router.push("/me")}>Account</Button>
                    <Button colorScheme={"brand.blue"} onClick={() => router.push("/documentation")}>Documentation</Button>
                </Flex>
            )}
            {isMobile && (
                <Flex justifyContent="center" position="relative" alignItems="center">
                    <Icon as={FaList} fontSize="25px" onClick={onToggle} />
                    <Flex zIndex={999} direction="column" gap={2} position="absolute" bottom="-150px" bg="blue" color="white" px={4} py={2} rounded="md" hidden={isOpen}>
                        <Button colorScheme={"blue"} onClick={() => router.push("/")}>Home</Button>
                        <Button colorScheme={"blue"} onClick={() => router.push("/me")}>Account</Button>
                        <Button colorScheme={"blue"} onClick={() => router.push("/documentation")}>Documentation</Button>
                    </Flex>
                </Flex>
            )}
        </>
    )
}

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
                        <Flex justifyContent={"space-between"}>
                            <HeaderText>
                                BytesToBits
                            </HeaderText>
                            <Navigation />
                        </Flex>
                        <Text
                            fontSize={{
                                base: "20px",
                                lg: "1.5vw"
                            }}
                            fontWeight={"light"}
                            cursor="default"
                        >
                            {"A Powerful, Free-to-use API!".split(" ").map((e, i) => <span key={i} className={indexStyle.powerHover}>{e} </span>)}
                        </Text>
                        <main>{children}</main>
                    </Box>
                </Flex>
            </Flex>

        </>
    )
}