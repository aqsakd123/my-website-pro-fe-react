import {useLayout} from "../../../components/layout-context";
import {useEffect, useState} from "react";
import {Button, Form, Popconfirm, Space, Tag} from "antd";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import {mergeChildren} from "../common/common-function";
import {CloseOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {StyledDropArea, StyledTextArea} from "./to-do-check-list";
import {Box} from "@mui/material";
import styled from "@emotion/styled";
import {changeStatus, insertSubGroupTask, updateTask} from "../service/service";
import {errorInfo} from "../../../common/common";
import {ACTION} from "../common/common-data";

const StyledLinkTask = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    width: 100%;
    margin-left: 40px;
    cursor: pointer;
    word-break: break-word;
    justify-content: space-between;
    text-decoration: ${props => `${props.isFinish ? 'line-through' : 'none'}`};
`

export default function ToDoItemGroupList(props) {
    const {form, childName = 'childTaskGroup', add, addObject, remove, index, drag, setSearchId, setLoadingParentTask} = props

    const { isDarkMode, colors } = useLayout()

    const [render, setRender] = useState(false)
    const [dragAble, setDragAble] = useState(false)
    const [isLink, setIsLink] = useState(!!form.getFieldValue([childName, index, 'name']))

    useEffect(() => {
        const fieldName = [childName, index, 'taskListOrder']
        form.setFieldValue(fieldName, index)
    }, [index])

    const fieldStatus = [childName, index, 'isCompleted']

    function addSubGroupTask(name) {
        insertSubGroupTask(form.getFieldValue('id'), {...addObject, ...form.getFieldValue([childName, index]), name: name})
            .then(r => {
                form.setFieldValue([childName, index], r?.data)
            })
            .then(r => setLoadingParentTask(prev => !prev))
            .catch(r => {
                errorInfo('ERROR_OCCURRED')
                remove(index)
            })
    }

    async function handleUpdateTask(payload) {
        const saveValue = {...mergeChildren(payload)}
        await updateTask(saveValue)
            .catch(r => console.log(r))
    }

    async function handleChangeStatus(payload) {
        await changeStatus(payload)
            .catch(r => console.log(r))
    }

    return (
        <Space.Compact
            onMouseEnter={() => setDragAble(true)}
            onMouseLeave={() => setDragAble(false)}
            style={{ width: '100%', position: 'relative'}}
            block
        >
            <StyledDropArea
                {...drag}
                style={{
                    visibility: dragAble ? 'visible' : 'hidden',
                }}
            >
                <DragIndicatorOutlinedIcon />
            </StyledDropArea>
            {isLink ?
                <StyledLinkTask
                    colors={colors}
                    isFinish={form.getFieldValue([childName, index, 'isCompleted'])}
                    onClick={() => handleUpdateTask(form.getFieldsValue(true))
                        .then(r => setSearchId(form.getFieldValue([childName, index, 'id'])))
                    }>
                    {form.getFieldValue([childName, index, 'name'])}
                    <Box>
                        {form.getFieldValue([childName, index, 'isCompleted']) &&
                            <Tag color="#87d068" style={{ height: '23px' }}>FINISHED</Tag>
                        }
                        {form.getFieldValue([childName, index, 'pinned']) &&
                            <Tag color="#ffaa00" style={{ height: '23px' }}>FOCUS</Tag>
                        }
                    </Box>
                </StyledLinkTask>
                :
                <Form.Item
                    name={[index, 'name']}
                    style={{ width: '100%', marginBottom: '0px' }}
                >
                    <StyledTextArea
                        colors={colors}
                        autoFocus={true}
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        disabled={false}
                        placeholder="Tên Task"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                if (e?.target?.value) {
                                    add(addObject)
                                }
                            }
                        }}
                        onBlur={(e) => {
                            if (!e?.target?.value) {
                                remove(index)
                            } else {
                                setIsLink(true)
                                addSubGroupTask(e?.target?.value)
                            }
                        }}
                    />
                </Form.Item>
            }
            <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                disabled={form.getFieldValue(fieldStatus)}
                onConfirm={() => {
                    const itemId = form.getFieldValue([childName, index, 'id'])
                    if(itemId) {
                        handleChangeStatus({id: itemId, action: ACTION.DELETE})
                            .then(r => remove(index))
                            .then(r => setRender(!render))
                            .catch(r => errorInfo('ERROR_OCCURRED'))
                    } else {
                        remove(index)
                    }
                }}
                icon={
                    <QuestionCircleOutlined
                        style={{
                            color: 'red',
                        }}
                    />
                }
            >
                <Button
                    danger={true}
                    type={'text'}
                    disabled={form.getFieldValue(fieldStatus)}
                >
                    <CloseOutlined/>
                </Button>
            </Popconfirm>

        </Space.Compact>
    );
}