import { extendTheme } from "@chakra-ui/react"
import { createBreakpoints, mode } from "@chakra-ui/theme-tools"

const breakpoints = createBreakpoints({
    xs: "25em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
})

const components = {
}

const colors = {
    background: "#2236fd",
    brand: {
        blue: {
            50: '#e4e7ff',
            100: '#b1baff',
            200: '#7f8cff',
            300: '#4c5dff',
            400: '#1b2ffe',
            500: '#0116e4',
            600: '#0010b3',
            700: '#000b81',
            800: '#00064f',
            900: '#000120',
        }
    }
}

const styles = {
    global: (props) => ({
        "::-webkit-scrollbar": {
            width: "5px",
            height: "5px"
        },
        "::-webkit-scrollbar-thumb": {
            background: "gray",
            borderRadius: "30px"
        },
        "::-webkit-scrollbar-track": {
            background: "transparent"
        },
        body: {
            bg: "background",
        },
    })
}

const theme = extendTheme({
    components,
    breakpoints,
    styles,
    colors
})

export default theme