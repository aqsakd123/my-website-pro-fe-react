import {Box, IconButton} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {useState} from "react";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import {DragOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusCircleTwoTone} from "@ant-design/icons";
import styled from "@emotion/styled";
import {Button} from "antd";
import {ACTION} from "../common/common-data";
import ToDoItemBox from "./item-to-do-box";
import HobbyToDoItemBox from "./hobby-item-to-do";

const StyledDropArea = styled.div`
    position: absolute;
    opacity: 0.5;
    right: 0;
    width: 8%;
    height: 100%;
    z-index: 100;
    cursor: grab;
    display: flex;
    flex-direction: column;
    justify-content: center;                    
    display: flex;
    flex-direction: column;
    align-items: center;

`


export default function ToDoItem({typeCode, drag, data, setShowModal, handleChangeStatus, handleInsertTask, index}) {

    const { isDarkMode, colors } = useLayout()
    const [dragAble, setDragAble] = useState(false)

    return (
        <Box
            sx={{ cursor: "pointer", position: 'relative' }}
            onMouseEnter={() => setDragAble(true)}
            onMouseLeave={() => setDragAble(false)}
            >
            {dragAble &&
                <>
                    <Box style={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: '-20px', right: 'calc(50% - 20px)' }} >
                        <IconButton onClick={() => handleInsertTask(index)}>
                            <PlusCircleTwoTone />
                        </IconButton>
                    </Box>
                </>
            }
            <StyledDropArea
                style={{
                    visibility: dragAble ? 'visible' : 'hidden',
                    backgroundColor: colors.primary[100],
                    color: colors.primary[400],
                }}
                {...drag}
            >
                <DragIndicatorOutlinedIcon />
                <DragOutlined style={{ fontSize: '20spx' }}/>
                <DragIndicatorOutlinedIcon />
            </StyledDropArea>
            {typeCode === 'HOBBY' ?
                <HobbyToDoItemBox
                    data={data}
                    setShowModal={setShowModal}
                    handleChangeStatus={handleChangeStatus}
                />
                :
                <ToDoItemBox
                    typeCode={typeCode}
                    setShowModal={setShowModal}
                    data={data}
                />
            }
        </Box>
    );
}