import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Center } from "@chakra-ui/layout";
import BaseLayout from "../components/BaseLayout";
import { Text, Flex, PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Verify({ email, error }) {
    const [isSubmitting, setSubmitting] = useState(false)
    const router = useRouter()

    return (
        <BaseLayout title="Verify Your Email">
            {error && (
                <Alert status="error">
                    <AlertIcon boxSize="20px" />
                    <AlertTitle>Verification Failed.</AlertTitle>
                    <AlertDescription>{"Make sure you've entered the correct verification code."}</AlertDescription>
                </Alert>
            )}

            <Center py={3}>
                <Flex direction="column">
                    <Alert status="success" variant="subtle" flexDir="column" justifyContent="center" textAlign="center" maxW="max-content" p="5" rounded="md" mx={2}>
                        <AlertIcon boxSize="40px" />
                        <AlertTitle mt={2} fontSize="xl">Check your Email Inbox!</AlertTitle>
                        <AlertDescription>We have delivered an email to you with a verification code. If the email does not arrive within 5-10 minutes, check your Spam folder.</AlertDescription>
                    </Alert>

                    <HStack mx="auto" my={5}>
                        <PinInput isDisabled={isSubmitting} type='alphanumeric' onComplete={async (e) => {
                            setSubmitting(true)
                            const res = await fetch("/api/verify", {
                                method: "POST",
                                body: JSON.stringify({
                                    email: email,
                                    code: e
                                })
                            })

                            if (!res.ok) {
                                window.location = `${window.location.href + "&error=true"}`
                                return null
                            }
                            const data = await res.json()
                            console.log(data)

                            if (!data.pass) {
                                window.location = `${window.location.href + "&error=true"}`
                                return null
                            }

                            router.push("/login?success=true")
                        }}>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>

                    <Text mx={5}><span style={{ color: "red" }}>*</span> If the email does not arrive within that time, please reach out to us in the <a target="_blank" href="https://discord.gg/g3n2YaPM77" rel="noreferrer">Discord Server</a>.</Text>
                </Flex>
            </Center>

        </BaseLayout>
    )

}

export const getServerSideProps = async (ctx) => {
    const { email, error } = ctx.query

    if (!email) return {
        redirect: {
            permanent: false,
            destination: "/"
        }
    }

    return {
        props: {
            email: email || null,
            error: error || null
        }
    }
}