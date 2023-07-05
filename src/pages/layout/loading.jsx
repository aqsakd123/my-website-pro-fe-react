import {Backdrop, Box, CircularProgress} from "@mui/material";
import React from "react";
import {useLayout} from "../../components/layout-context";

export default function Loading(){

    const { isDarkMode, colors } = useLayout()

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
