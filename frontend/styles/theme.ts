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
        pink: "#ff6de2",
        blueGray: "#3d4f65"
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