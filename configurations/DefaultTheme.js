import { extendTheme } from "native-base";

export const DefaultTheme = extendTheme({
    colors: {
        primary: {
            50: '#e2f2ff',
            100: '#b5d5fd',
            200: '#87b9f8',
            300: '#589df5',
            400: '#3081f3',
            500: '#0c3a79',
            600: '#021C3C',
            700: '#0c3a79',
            800: '#000c1d',
            900: '#000c1d',
        },
        secondary: {
            50: '#ffefdb',
            100: '#ffd4ae',
            200: '#ffb87e',
            300: '#ff9d4c',
            400: '#ff811a',
            500: '#e66800',
            600: '#b45100',
            700: '#813900',
            800: '#4f2200',
            900: '#200900',
        },
        danger: {
            50: '#ffe3ec',
            100: '#feb6c6',
            200: '#f7889f',
            300: '#f25979',
            400: '#ed2b53',
            500: '#d41239',
            600: '#a60b2d',
            700: '#77051f',
            800: '#4a0112',
            900: '#1f0004',
        },
        charcoal: "#465362",
        mintCream: "#F4FFFD",
        jasmine: "#FBE689",
        hotBlue:"#0077B3ff"        
    },
    components: {
        Button: {
            defaultProps: {
                textAlign: "center",
                borderRadius: 30,
                padding: 2,
                _text: {
                    fontWeight: "bold",
                    textAlign: "center",
                }
            },
        },
        Input: {
            defaultProps: {
                _focus: {
                    borderColor: "secondary.500"
                }
            }
        },
        Select: {
            defaultProps: {
                _focus: {
                    borderColor: "secondary.500"
                }
            }
        }
    },
    config: {
        useSystemColorMode: false,
        initialColorMode: 'light',
    },
})