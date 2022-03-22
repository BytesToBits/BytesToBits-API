import { Box, Button, Flex, Image, Text, useClipboard } from "@chakra-ui/react"
import { useState } from "react"
import Markdown from "./Markdown"
import Config from "../config.json"

export default function ApiConsole({ endpoint, method, token, ...rest }) {
    const [isLoading, setLoading] = useState(false)

    const [output, setOutput] = useState(null)
    const [isImage, setImage] = useState(false)
    const { hasCopied, onCopy } = useClipboard(output)

    const apiCall = async() => {
        setLoading(true)

        const res = await fetch(`${Config.apiUrl}/${endpoint}`, {
            method: method,
            headers: {
                Authorization: token
            }
        })

        setLoading(false)

        if(!res.ok) {
            return setOutput("{'message': 'Could not fetch from the API'}")
        }

        const contentType = await res.headers.get("Content-Type")

        if(contentType == "image/png") {
            setImage(true)
            const blob = await res.blob()
            const imageUrl = URL.createObjectURL(blob)
            return setOutput(imageUrl)
        } else {
            setImage(false)
            const data = await res.json()
            return setOutput(data)
        }
    }

    const clearConsole = () => {
        setLoading(false)
        setOutput(null)
        setImage(false)
    }

    return (
        <Box
            bg={"#2d2d2d"}
            p={5}
            rounded="md"
        >
            <Flex alignItems="center" gap={2}>
                <Button colorScheme="green" fontWeight="12px" height={"20px"} borderRadius="2px" onClick={apiCall} isLoading={isLoading}>Run</Button>
                <Button colorScheme="blue" fontWeight="12px" height={"20px"} borderRadius="2px" onClick={() => onCopy()} isLoading={isLoading}>{hasCopied ? "Copied" : "Copy"}</Button>
                <Button colorScheme="red" fontWeight="12px" height={"20px"} borderRadius="2px" onClick={clearConsole} isLoading={isLoading}>Clear</Button>
            </Flex>

            {!isImage && (
                <Markdown>
                    {`\`\`\`json
${output}`}
                </Markdown>
            )}
            {isImage && (
                <Image mt={5} alt="generated-image" src={output} />
            )}
        </Box>
    )
}