import BaseLayout from "../components/BaseLayout";

import { getCsrfToken } from "next-auth/react";
import { Button, Divider, FormControl, FormHelperText, FormLabel, Input, Text } from "@chakra-ui/react";
import HeaderText from "../components/Text/Header";
import { signIn } from "next-auth/react"
import { useState } from "react";

import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/alert"

export default function Login({ csrfToken, success, error }) {
    const [credentials, setCredentials] = useState({
        email: null,
        password: null
    })


    return (
        <BaseLayout title="Login">
            <HeaderText>Login</HeaderText>
            <Divider />

            {success && (
                <Alert status="success">
                    <AlertIcon />
                    <AlertTitle>Verification Successful</AlertTitle>
                    <AlertDescription>Login to use your account!</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Wrong Credentials</AlertTitle>
                    <AlertDescription>Wrong email and password combination.</AlertDescription>
                </Alert>
            )}

            <form method="POST" action="/api/auth/callback/credentials">
                <FormControl isRequired my={5}>
                    <input type="hidden" value={csrfToken} name="csrfToken" />
                    <FormLabel>Email</FormLabel>
                    <Input type="email" id="email" name="email" placeholder="example@email.com" variant="flushed" />
                    <FormLabel mt={3}>Password</FormLabel>
                    <Input type="password" id="password" name="password" placeholder="*********" variant="flushed" />
                    <FormHelperText>
                        * By using an account, you agree to our Terms of Service.
                    </FormHelperText>
                </FormControl>

                <Button colorScheme={"green"} type="submit">Login</Button>
            </form>

        </BaseLayout>
    )
}

export async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context)

    const { success, error } = context.query

    return {
        props: {
            csrfToken,
            success: success || null,
            error: error || null
        },
    }
}