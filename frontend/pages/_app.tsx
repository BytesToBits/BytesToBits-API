import type { AppProps } from 'next/app'
import { ChakraProvider, Image } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/layout'
import theme from '../styles/theme'
import Router from "next/router"
import Head from "next/head"
import { useState } from 'react'
import { ThemeProvider } from '@mui/material'
import muiTheme from '../styles/mui'
import ColorManager from '../components/ColorManager'

import { SessionProvider } from "next-auth/react"

import "../styles/base.css"

function MyApp({ Component, pageProps }: AppProps) {

  const [isLoading, setLoading] = useState(false)

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true)
  })

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false)
  })

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={muiTheme}>
        <ChakraProvider resetCSS theme={theme}>
          <ColorManager />
          <Head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
          </Head>
          {isLoading && (
            <Image alt="loading" src="/loading.svg" boxSize="70px" position="fixed" bottom="15px" right="15px" draggable="false" />
          )}
          <Flex flexDirection="column" minH="100vh">
            <Component {...pageProps} />
          </Flex>
        </ChakraProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp