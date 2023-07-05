import {useAuth} from "../auth/auth-context";
import {useAxios} from "../auth/axios-context";
import CustomButton from "../../components/item/custom-button";
import {Box} from "@mui/material";
import {useLayout} from "../../components/layout-context";
import {Timeline} from "antd";
import {SmileOutlined} from "@ant-design/icons";
import '../../style/dashboard.css'
import styled from "@emotion/styled";
import {StyledCheckList} from "../to-do-list/component/to-do-check-list";
import {useEffect, useState} from "react";
import {generateTimeLine} from "./common/common-function";
import {changeStatus, updateTask} from "../to-do-list/service/service";
import ToDoColumn from "../to-do-list/component/to-do-column";
import {fetchTimeLine} from "./service/service";
import {useSelector} from "react-redux";
import {selectTimeline} from "../layout/store/timeline-reducer";

export const StyledTimeLineItem = styled.div`
    display: flex;
    flex-direction: column;
`

export default function Dashboard() {

    const { userInfo, currentUser } = useAuth()
    const { colors, isMobile, transparentColor } = useLayout()
    const taskToDo = useSelector(selectTimeline)

    async function handleChangeStatus(payload) {
        await changeStatus(payload)
            .catch(r => console.log(r))
    }

    return (
        <Box
            display="grid"
            gridTemplateColumns={isMobile ? "fill": "repeat(12, 1fr)"}
            gridAutoRows="300px"
            gap="20px"
            rowGap="20px"
        >
            <Box
                className={'dashboard-item'}
                gridColumn="span 8"
                gridRow="span 2"
                backgroundColor={transparentColor(colors.blueAccent[400], 7)}
            >
                <Box className={'timeline-header'} style={{  backgroundColor: colors.blueAccent[400] }}>
                    TODAY TIMELINE
                </Box>
                <Timeline
                    items={generateTimeLine(taskToDo, handleChangeStatus)}
                />
            </Box>
            <Box
                className={'dashboard-item'}
                gridColumn="span 4"
                gridRow="span 2"
                backgroundColor={transparentColor(colors.primary[400], 9)}
            >
                <ToDoColumn
                    typeCode={"HOBBY"}
                />
            </Box>
        </Box>
    );
}