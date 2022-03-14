import { Box, Button, Divider, Flex, Text, TextProps } from "@chakra-ui/react";
import BaseLayout from "../components/BaseLayout";
import indexStyle from "../styles/modules/index.module.css"
import ReactMarkdown from "react-markdown"

import { getSession } from "next-auth/react"
import HeaderText from "../components/Text/Header";
import Markdown from "../components/Markdown";
import getText from "../lib/getText";
import { useRouter } from "next/router";

export default function Index({ session, texts }) {
  const router = useRouter()

  const headerSize = {
    base: "30px",
    lg: "2vw"
  }

  const StyledHeader = (props: TextProps) => (
    <Text mt={5} textAlign="center" letterSpacing={20} fontSize={headerSize} fontWeight="thin" textShadow={"0px 3px 5px #000"} {...props} >{props.children}</Text>
  )

  return (
    <BaseLayout title={"Home"}>
      <Flex justifyContent={"space-between"}>
        <HeaderText>
          BytesToBits
        </HeaderText>

        <Button colorScheme={"brand.blue"} onClick={() => router.push("/me")}>Account</Button>
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

      <StyledHeader>INFORMATION</StyledHeader>
      <Divider bg="black" h={".7px"} />

      <Box mt={3} mb={10} id="information">
        <Markdown>{texts.information}</Markdown>
      </Box>

      <StyledHeader>HOW TO USE</StyledHeader>
      <Divider bg="black" h={".7px"} />
      <Box mt={3} mb={10} id="how-to-use">
        <Markdown>{texts.howToUse}</Markdown>
      </Box>

      <StyledHeader>RATELIMITS</StyledHeader>
      <Divider bg="black" h={".7px"} />
      <Box mt={3} mb={10} id="rate-limits">
        <Markdown>{texts.rateLimits}</Markdown>
      </Box>

      <StyledHeader>CONTRIBUTING</StyledHeader>
      <Divider bg="black" h={".7px"} />
      <Box mt={3} mb={10} id="contributing">
        <Markdown>{texts.contributing}</Markdown>
      </Box>
    </BaseLayout>
  )
}

export const getServerSideProps = async (ctx) => {

  const session = await getSession(ctx)

  const texts = {
    information: await getText("information"),
    howToUse: await getText("howToUse"),
    rateLimits: await getText("rateLimits"),
    contributing: await getText("contributing")
  }

  return {
    props: {
      session,
      texts
    }
  }
}