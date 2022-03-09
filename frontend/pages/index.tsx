import { Box, Divider, Text, TextProps } from "@chakra-ui/react";
import BaseLayout from "../components/BaseLayout";
import indexStyle from "../styles/modules/index.module.css"
import ReactMarkdown from "react-markdown"

import { getSession } from "next-auth/react"
import HeaderText from "../components/Text/Header";
import Markdown from "../components/Markdown";
import getText from "../lib/getText";

export default function Index({ session, texts }) {
  const headerSize = {
    base: "30px",
    lg: "2vw"
  }

  const StyledHeader = (props: TextProps) => (
    <Text mt={5} textAlign="center" letterSpacing={20} fontSize={headerSize} fontWeight="thin" textShadow={"0px 3px 5px #000"} {...props} >{props.children}</Text>
  )

  return (
    <BaseLayout title={"Home"}>
      <HeaderText>
        BytesToBits
      </HeaderText>
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
    </BaseLayout>
  )
}

export const getServerSideProps = async (ctx) => {

  const session = await getSession(ctx)

  const texts = {
    information: await getText("information"),
    howToUse: await getText("howToUse")
  }

  return {
    props: {
      session,
      texts
    }
  }
}