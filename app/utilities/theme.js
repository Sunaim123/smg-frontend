import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "small",
        variant: "contained",
      }
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      }
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      }
    },
    MuiTable: {
      defaultProps: {
        size: "small"
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        margin: "none",
        size: "small",
      }
    },
  },
  typography: {
    fontFamily: "Sofia Sans, Segoe UI",
  },
})

export default theme
