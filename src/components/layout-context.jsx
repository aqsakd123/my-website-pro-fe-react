import React, {useContext} from "react"
import {useSelector} from "react-redux";
import {selectLayout} from "../pages/layout/store/layout-reducer";
import {useMediaQuery} from "@mui/material";
import {ConfigProvider} from "antd";
import '../index.css'

const LayoutContext = React.createContext({})

export function useLayout() {
    return useContext(LayoutContext)
}

export function LayoutProvider({ children }) {

    const isMobile = useMediaQuery('(max-width: 800px)')
    const layout = useSelector(selectLayout)

    const isDarkMode = layout?.theme === 'dark'
    const backgroundColor = isDarkMode ? 'rgb(30 42 63 / 90%)' : 'rgb(255 255 255 / 80%)'
    const colors = isDarkMode ? {
            grey: {
                100: "#e0e0e0",
                200: "#c2c2c2",
                300: "#a3a3a3",
                400: "#858585",
                500: "#666666",
                600: "#525252",
                700: "#3d3d3d",
                800: "#292929",
                900: "#141414",
            },
            primary: {
                100: "#ffffff",
                200: "#a1a4ab",
                300: "#727681",
                400: "#1F2A40",
                500: "#141b2d",
                600: "#101624",
                700: "#0c101b",
                800: "#080b12",
                900: "#040509",
            },
            greenAccent: {
                100: "#dbf5ee",
                200: "#b7ebde",
                300: "#94e2cd",
                400: "#70d8bd",
                500: "#4cceac",
                600: "#3da58a",
                700: "#2e7c67",
                800: "#1e5245",
                900: "#0f2922",
            },
            redAccent: {
                100: "#f8dcdb",
                200: "#f1b9b7",
                300: "#e99592",
                400: "#e2726e",
                500: "#db4f4a",
                600: "#af3f3b",
                700: "#832f2c",
                800: "#58201e",
                900: "#2c100f",
            },
            blueAccent: {
                100: "#f1f2f7",
                200: "#c3c6fd",
                300: "#a4a9fc",
                400: "#868dfb",
                500: "#6870fa",
                600: "#535ac8",
                700: "#3e4396",
                800: "#2a2d64",
                900: "#151632",
            },
        }
        : {
            grey: {
                100: "#141414",
                200: "#292929",
                300: "#3d3d3d",
                400: "#525252",
                500: "#666666",
                600: "#858585",
                700: "#a3a3a3",
                800: "#c2c2c2",
                900: "#e0e0e0",
            },
            primary: {
                100: "#040509",
                200: "#080b12",
                300: "#0c101b",
                400: "#f2f0f0",
                500: "#141b2d",
                600: "#1F2A40",
                700: "#727681",
                800: "#a1a4ab",
                900: "#ffffff",
            },
            greenAccent: {
                100: "#0f2922",
                200: "#1e5245",
                300: "#2e7c67",
                400: "#3da58a",
                500: "#4cceac",
                600: "#70d8bd",
                700: "#94e2cd",
                800: "#b7ebde",
                900: "#dbf5ee",
            },
            redAccent: {
                100: "#2c100f",
                200: "#58201e",
                300: "#832f2c",
                400: "#af3f3b",
                500: "#db4f4a",
                600: "#e2726e",
                700: "#e99592",
                800: "#f1b9b7",
                900: "#f8dcdb",
            },
            blueAccent: {
                100: "#151632",
                200: "#2a2d64",
                300: "#3e4396",
                400: "#535ac8",
                500: "#6870fa",
                600: "#868dfb",
                700: "#a4a9fc",
                800: "#c3c6fd",
                900: "#f1f2f7",
            },
        }

    function transparentColor(color, opacity){
        return color + `${opacity*10}`
    }

    const value = {
        colors,
        isDarkMode,
        isMobile,
        transparentColor
    }

    const theme = {
        colorPrimary: isDarkMode? colors.blueAccent[800] : colors.blueAccent[300],
        colorTextBase: colors.primary[100],
        colorTextTertiary	: colors.primary[100],
        colorBgElevated: colors.primary[400],
        colorBgContainer: isDarkMode ? colors.primary[400] : "white"
    }

    return (
        <LayoutContext.Provider value={value}>
            <div
                // className={'background-setup'}
                style={{ backgroundImage: `url('background/abstract-2.jpg')`, color: colors.primary[100], width: '100%', height: '100%', backgroundSize: '100% 100%' }}>
                <ConfigProvider
                    theme={{
                        token: theme
                    }}>
                    <div
                        // className={'inner-background'}
                        style={{backgroundColor: `${backgroundColor}`, width: '100%', height: '100%', overflow: 'auto', boxSizing: 'inherit'}}>
                        {children}
                    </div>
                </ConfigProvider>
            </div>
        </LayoutContext.Provider>
    )
}