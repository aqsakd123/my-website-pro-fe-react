import {useLayout} from "../../../components/layout-context";
import {useEffect, useState} from "react";
import {Button, Checkbox, DatePicker, Form, Space, TimePicker} from "antd";
import TextArea from "antd/es/input/TextArea";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {CloseOutlined} from "@ant-design/icons";
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import {dayjsFormat} from "../common/common-function";
import {changeStatus, insertSubGroupTask, updateSubTask} from "../service/service";
import {errorInfo} from "../../../common/common";
import {ACTION} from "../common/common-data";

export const StyledCheckList = styled(Checkbox)`
     display: flex;
     padding-top: 6px;
     justify-content: flex-start;
     flex-direction: column;

     .ant-checkbox {
        .ant-checkbox-inner {
            border: 1px solid !important;
            border-radius: 30px !important;
            width: ${props => `${props.width || '20px'}`};
            height: ${props => `${props.width || '20px'}`};
        }
        
        .ant-checkbox-inner:after {
            width: 6px;
            height: 12px;
        }

     }
`

export const StyledTextArea = styled(TextArea)`
     border: 1px solid #e7e7e7;
     width: 100%;
     border-radius: 20px;
     border-top-left-radius: 20px !important;
     border-bottom-left-radius: 20px !important;
     border-top-right-radius: 0px !important;
     border-bottom-right-radius: 0px !important;
`

export const StyledDropArea = styled.div`
     display: flex;
     padding-top: 4px;
     justify-content: flex-start;
     flex-direction: column;
     width: '5%';
`

export default function ToDoItemCheckList(props) {
    const {form, childName = 'children', add, addObject, remove, index, drag, typeCode} = props
    const { isDarkMode, colors } = useLayout()
    const [render, setRender] = useState(false)
    const [dragAble, setDragAble] = useState(false)

    useEffect(() => {
        const fieldName = [childName, index, 'taskListOrder']
        form.setFieldValue(fieldName, index)
    }, [index])

    const fieldStatus = [childName, index, 'isCompleted']

    function modifyCheckList() {
        if(form.getFieldValue([childName, index])?.id) {
            updateSubTask(form.getFieldValue([childName, index])?.id, {...addObject, ...form.getFieldValue([childName, index])})
                .catch(r => {
                    errorInfo('ERROR_OCCURRED')
                })
        } else {
            insertSubGroupTask(form.getFieldValue('id'), {...addObject, ...form.getFieldValue([childName, index])})
                .then(r => {
                    form.setFieldValue([childName, index], r?.data)
                })
                .catch(r => {
                    errorInfo('ERROR_OCCURRED')
                    remove(index)
                })
        }
    }

    async function handleChangeStatus(payload) {
        await changeStatus(payload)
            .catch(r => console.log(r))
    }

    function handleRemoveSubTask(){
        const itemId = form.getFieldValue([childName, index, 'id'])
        if(itemId){
            handleChangeStatus({id: itemId, action: ACTION.DELETE})
                .then(r => remove(index))
                .then(r => setRender(!render))
                .catch(r => errorInfo('ERROR_OCCURRED'))
        } else {
            remove(index)
        }
    }

    return (
        <Space.Compact
            onMouseEnter={() => setDragAble(true)}
            onMouseLeave={() => setDragAble(false)}
            style={{ width: '100%', position: 'relative', marginBottom: '10px', display: form.getFieldValue([childName, index, 'isDeleted']) ? 'none' : 'flex'}}
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
            <Form.Item
                name={[index, 'isCompleted']}
                valuePropName={'checked'}
                style={{ width: '5%', marginBottom: '0px' }}
            >
                <StyledCheckList
                    disabled={form.getFieldValue('isCompleted')}
                    onChange={() => setRender(!render)}
                />
            </Form.Item>
            <Form.Item
                name={[index, 'name']}
                style={{ width: '70%', marginBottom: '0px' }}
            >
                <StyledTextArea
                    colors={colors}
                    autoFocus={!form.getFieldValue([childName, index, 'name'])}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    disabled={form.getFieldValue('isCompleted') || form.getFieldValue(fieldStatus)}
                    placeholder="Tên Task"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            if (e?.target?.value) {
                                add(addObject, index + 1)
                            }
                        }
                    }}
                    onBlur={(e) => {
                        if (!e?.target?.value) {
                            handleRemoveSubTask()
                        }
                        // else {
                        //     modifyCheckList()
                        // }
                    }}
                />
            </Form.Item>
            {(typeCode === 'DAILY') ?
                <Form.Item
                    name={[index, 'loopTime']}
                    style={{ width: '20%', marginBottom: '0px' }}
                    getValueProps={(value) => {
                        if (value) return {value: dayjsFormat(value, 'HH:mm:ss')}
                    }}
                >
                    <TimePicker
                        disabled={form.getFieldValue('isCompleted')|| form.getFieldValue(fieldStatus)}
                        format={'HH:mm'}
                        minuteStep={15}
                        placeholder="Time"
                        // onChange={modifyCheckList}
                        style={{ height: '32px', width: '100%' }}
                    />
                </Form.Item>
                :
                <Form.Item
                    name={[index, 'endDate']}
                    style={{ width: '20%', marginBottom: '0px' }}
                    getValueProps={(value) => {
                        if (value) return {value: dayjs(value)}
                    }}
                >
                    <DatePicker
                        disabled={form.getFieldValue('isCompleted') || form.getFieldValue(fieldStatus)}
                        style={{ height: '32px', width: '100%' }}
                        // onChange={modifyCheckList}
                    />
                </Form.Item>
            }
                <Button
                    onClick={() => {
                        handleRemoveSubTask()
                    }}
                    disabled={form.getFieldValue(fieldStatus)}
                >
                    <CloseOutlined/>
                </Button>
        </Space.Compact>
    );
}