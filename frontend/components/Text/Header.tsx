import { TextProps, Text } from "@chakra-ui/react"

export default function HeaderText(props: TextProps) {

    return (
        <Text
            fontWeight={"semibold"}
            fontSize={{
                base: "30px",
                lg: "2vw"
            }}
            {...props}
        >
            {props.children}
        </Text>
    )
}