import {StyledCheckList} from "../../to-do-list/component/to-do-check-list";
import {StyledTimeLineItem} from "../index";
import {Box} from "@mui/material";
import {dayjsFormat} from "../../to-do-list/common/common-function";
import dayjs from "dayjs";
import {Tag, Tooltip} from "antd";
import styled from "@emotion/styled";
import {ACTION} from "../../to-do-list/common/common-data";

export const StyledTag = styled(Tag)`
    width: fit-content;
    max-width: 120px;
    color: red;
    background-color: whitesmoke;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 5px;
`

export function generateTimeLine(array, handleChangeStatus){
    const timeLineArray = arrayToTimeLineArray(array)
    let res = timeLineArray.map(item => {
        let label = ''
        const action = item.isCompleted ? ACTION.UNDO_COMPLETE : ACTION.COMPLETE
        if (item.loopTime) {
            label = dayjs(new Date(dayjsFormat(item.loopTime))).format('hh:mm A')
        }
        const isDeadLine = isDue(item.loopTime)
        return {
            dot: <StyledCheckList checked={item.isCompleted} onClick={() => handleChangeStatus({ id: item.id, action: action })} width={'18px'} style={{ paddingTop: '20px'}}/>,
            label: <>{item.loopTime ?
                <>
                    {isDeadLine ?
                        <Tag color={'#ff0000'} style={{ fontWeight: 500 }}>{label}</Tag>
                        :
                        <StyledTag >
                            {label}
                        </StyledTag>
                    }
                </>
                : ''}</> ,
            children: (
                <StyledTimeLineItem>
                    <Box style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
                        <Box display={"flex"} alignItems={'center'}>
                            {item.pinned &&
                            <Box className={'focus'}>
                                <span style={{ fontWeight: 700, color: 'white' }}>&nbsp;FOCUS&nbsp;</span>
                            </Box>
                            }
                            <Tooltip placement="left" title={item.description} style={{ flexDirection: 'row' }}>
                                <span className={item.isCompleted ? 'checked-span' : ''} style={{ width: 'fit-content', fontWeight: 500 }}>{item.name}</span>
                            </Tooltip>
                        </Box>
                        {item.parentName && <StyledTag style={{ backgroundColor: 'blueViolet', color: 'white' }}>{item.parentName}</StyledTag>}
                    </Box>
                    {item.children?.length > 0 && item.children.map(child => {
                        const actionChild = child.isCompleted ? ACTION.UNDO_COMPLETE : ACTION.COMPLETE
                        return (
                            <Box key={child.id} style={{ display: 'flex' }}>
                                <StyledCheckList
                                    disabled={item.isCompleted}
                                    checked={child.isCompleted}
                                    onChange={() => handleChangeStatus({ id: child.id, action: actionChild })}
                                    style={{ paddingTop: '1px' }}
                                    width={'18px'}/>
                                &nbsp;&nbsp;
                                <span className={(item.isCompleted || child.isCompleted) ? 'checked-span' : ''}>{child.name}</span>
                            </Box>
                        )})}
                </StyledTimeLineItem>
            ),
        }
    })
    return res
}

export const isDue = (time) => {
    if (!time) return
    const now = new Date();
    const loopTime = new Date(dayjsFormat(time));
    return new Date(now.toDateString() + " " + loopTime.toLocaleTimeString()) < now
}

export function arrayToTimeLineArray(array){
    let res = []
    let resTime = []
    res = res.concat(array.filter(item => item.typeCode !== 'DAILY'))
    array.filter(item => item.typeCode === 'DAILY').forEach(item => {
        if(item.children){
            resTime = resTime.concat((item.children).filter(child => child.loopTime).map(child =>({...child, parentName: item.name})))
            res = res.concat({ ...item, children: item.children.filter(child => !child.loopTime) })
        }else{
            res = res.concat(item)
        }
    })
    resTime.sort((a, b) => {
        const loopTimeA = dayjsFormat(a.loopTime)
        const currentTimeA = new Date()
        currentTimeA.setHours(new Date(loopTimeA).getHours())
        currentTimeA.setMinutes(new Date(loopTimeA).getMinutes())

        const loopTimeB = dayjsFormat(b.loopTime)
        const currentTimeB = new Date()
        currentTimeB.setHours(new Date(loopTimeB).getHours())
        currentTimeB.setMinutes(new Date(loopTimeB).getMinutes())

        if (currentTimeA === null) return -1;
        if (currentTimeB === null) return 1;
        return currentTimeA - currentTimeB;
    })
    res = res.concat(resTime)
    return res;
}