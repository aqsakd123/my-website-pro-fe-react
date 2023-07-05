import {useAuth} from "../../auth/auth-context";
import {arrayToTimeLineArray, isDue, StyledTag} from "../../dashboard/common/common-function";
import {ACTION} from "../../to-do-list/common/common-data";
import {StyledCheckList} from "../../to-do-list/component/to-do-check-list";
import {Box} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {Divider, Tag} from "antd";
import dayjs from "dayjs";
import {dayjsFormat} from "../../to-do-list/common/common-function";

export default function ToDoTopBar({data, handleChangeStatus}){
    const { currentUser, userInfo, logout } = useAuth()
    const { colors, isDarkMode } = useLayout()

    // when on loopTime, allow update once

    return (
        <Box sx={{ padding: '0px'}}>
            {data?.length > 0 && arrayToTimeLineArray(data).map(item => {
                const action = item.isCompleted ? ACTION.UNDO_COMPLETE : ACTION.COMPLETE
                const label = item.loopTime ? dayjs(new Date(dayjsFormat(item.loopTime))).format('hh:mm A') : ''
                const isDeadLine = isDue(item.loopTime)

                return (<Box key={item.id} style={{ marginBottom: '-20px' }}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <StyledCheckList
                            checked={item.isCompleted}
                            onClick={() => handleChangeStatus({ id: item.id, action: action })}
                            width={'18px'}
                            style={{ paddingTop: '18px', marginRight: '10px', width: '10%' }}
                        />
                        <span className={item.isCompleted ? 'checked-span text-name' : 'text-name'} style={{ width: '65%' }}>
                            {item.name}
                        </span>
                        {label &&
                        <>
                            {isDeadLine ?
                                <Tag color={'#ff0000'} style={{ width: '22%', fontWeight: 500 }}>{label}</Tag>
                                :
                                <Tag style={{ width: '22%' }}>{label}</Tag>
                            }
                        </>
                        }
                    </Box>
                    {item.children?.length > 0 && item.children?.map(child => {
                        const action = child.isCompleted ? ACTION.UNDO_COMPLETE : ACTION.COMPLETE
                        return (
                            <Box key={child.id}>
                                <Box style={{ marginLeft: '30px', marginTop: '-20px', display: 'flex', alignItems: 'center' }}>
                                    <StyledCheckList
                                        disabled={item.isCompleted}
                                        checked={child.isCompleted}
                                        onClick={() => handleChangeStatus({ id: child.id, action: action })}
                                        width={'18px'}
                                        style={{ paddingTop: '18px', marginRight: '10px' }}
                                    />
                                    <span className={(item.isCompleted || child.isCompleted) ? 'checked-span text-name' : 'text-name'}>{child.name}</span>
                                </Box>
                            </Box>
                    )})}
                </Box>)
            })}
        </Box>
    );
}
