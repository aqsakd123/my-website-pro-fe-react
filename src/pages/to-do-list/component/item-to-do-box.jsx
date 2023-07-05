import {Box, IconButton} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {useState} from "react";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import {DragOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusCircleTwoTone} from "@ant-design/icons";
import styled from "@emotion/styled";
import {Button, Tag} from "antd";
import {ACTION} from "../common/common-data";
import {Focus, PinOutLinedIcon} from "../dialog/daily-modal";
import dayjs from "dayjs";
import moment from "moment";

export default function ToDoItemBox({typeCode, data, setShowModal}) {
    const { isDarkMode, colors, transparentColor } = useLayout()

    function getDate(data){
        let res = ''
        if(data.startDate) {
            res += 'S: ' + dayjs(new Date(data.startDate)).format('DD-MM-YYYY')
        }
        if (data.startDate && data.endDate) {
            res += ' - '
        }
        if (data.endDate) {
            res += 'E: ' +  dayjs(new Date(data.endDate)).format('DD-MM-YYYY')
        }
        return res
    }

    return (
        <Box sx={{ border: `1px solid ${isDarkMode ? 'blue' : 'wheat'}`, backgroundColor: transparentColor(colors.primary[400], 9)}}
             onClick={() => setShowModal({typeCode: typeCode, id: data?.id})}
             className={'item-box'}>
            <Box sx={{ display: 'flex' }}>
                {data?.pinned &&
                    <Box className={'focus'} style={{ width: '50px' }}>
                        <PinOutLinedIcon />
                    </Box>
                }
                <span className={'item-header'}>
                    {data?.name}
                </span>
            </Box>
            <Box className={'item-description'}>
                {data?.description}
            </Box>
            {(data.startDate || data.endDate) &&
                <Box sx={{ display: 'flex' }}>
                    <Tag color={'red'}>{getDate(data)}</Tag>
                </Box>
            }
        </Box>
    );
}