import {Box} from "@mui/material";
import {ACTION, listType} from "./common/common-data";
import {useLayout} from "../../components/layout-context";
import '../../style/to-do-style.css'
import {useState} from "react";
import DailyModal from "./dialog/daily-modal";
import ToDoColumn from "./component/to-do-column";
import HobbyModal from "./dialog/hobby-modal";
import {changeStatus} from "./service/service";

export default function ToDoList() {

    const { isDarkMode } = useLayout()

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box
                display="grid"
                columnGap="10px"
                rowGap="10px"
                gridTemplateColumns={"repeat(4, 1fr)"}
                className={'to-do-container'}
            >
                {listType.map(item => (
                    <ToDoColumn
                        key={item}
                        typeCode={item}
                    />
                ))}
            </Box>
        </Box>
    );
}