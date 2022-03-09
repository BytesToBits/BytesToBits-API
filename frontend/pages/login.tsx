import BaseLayout from "../components/BaseLayout";

import { getCsrfToken } from "next-auth/react";
import { Button, Divider, FormControl, FormHelperText, FormLabel, Input, Text } from "@chakra-ui/react";
import HeaderText from "../components/Text/Header";

export default function Login({ csrfToken }) {

    return (
        <BaseLayout title="Login">
            <HeaderText>Login</HeaderText>
            <Divider />

            <form method="post" action="api/auth/signin/email">
                <FormControl isRequired my={5}>
                    <input type="hidden" value={csrfToken} name="csrfToken" />
                    <FormLabel>Email</FormLabel>
                    <Input type="email" id="email" name="email" placeholder="example@email.com" variant="flushed" />
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
    return {
        props: { csrfToken },
    }
}