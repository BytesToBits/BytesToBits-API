import { createTheme } from "@mui/material";

import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark'
    },
};

const muiTheme = createTheme(themeOptions)

export default muiTheme