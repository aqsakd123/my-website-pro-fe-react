import {Box} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";
import styled from "@emotion/styled";
import {Button, Checkbox, DatePicker, Form, Input, InputNumber, Rate, Select, TimePicker} from "antd";
import dayjs from "dayjs";
import {ACTION, dateOptions, listRoutineType} from "../common/common-data";
import TextArea from "antd/es/input/TextArea";
import {CheckSquareOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import ToDoItemCheckList from "../component/to-do-check-list";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import {DragDropContext, Draggable} from "react-beautiful-dnd";
import {StrictModeDroppable} from "../../../components/StrictModeDroppable";
import {changeStatus, detailTaskGraphQL, updateTask} from "../service/service";
import {dayjsFormat} from "../common/common-function";
import {successInfo} from "../../../common/common";
import Loading from "../../layout/loading";

export const StyledModal = styled(Modal)`
    .ant-modal-content {
        border-radius: 0px;
        min-height: 500px;
        background-color: ${props => props.isDarkMode ? `${props.colors.primary[400]}` : `white`};
    }
    
    .ant-modal-title {
        background-color: black;
        display: flex;
        background-color: ${props => props.isDarkMode ? `${props.colors.primary[400]}` : `white`};
        font-size: 20px;
        margin-bottom: 20px;  
        font-family: "PlusJakartaSans-ExtraBold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    }
    
    .ant-btn {
        border-radius: 0px
    }
    
    .ant-modal-close-icon {
        color: ${props => `${props.colors.primary[100]}`};
    }
    
    .container-modal {
        width: 100%;
        display: flex;
    }
    
    .project-container {
        flex-direction: column;
    }
    
    .left-container {
        width: 100%;
    }
    
    .right-container {
        width: 90%;
        border: 5px solid blue;
        padding: 10px;
        background-color: ${props => `${props.colors.blueAccent[800]}`};
        height: fit-content;
    }
    
    .right-project-container {
        width: 100%;
        background-color: ${props => `${props.colors.blueAccent[800]}`};
        height: fit-content;
        
        .project-box {
            border: 5px solid blue;
            padding: 10px;
            margin-bottom: 10px;
        }
        
        .parent-project-accordion {
            margin-bottom: 0px;
            .ant-collapse-header{
                border: 1px solid black;
                border-radius: 8px 8px 0px 0px;
            }
            
            .ant-collapse-content, .ant-tree-list-holder {
                background-color: ${props => `${props.colors.blueAccent[800]}`};
            }
            
            .ant-collapse-content{
                border: 1px solid black;
                overflow: auto;
                max-height: 200px;
            }
            
            .ant-tree-node-selected {
                background-color: ${props => `${props.colors.blueAccent[200]}`};
                color: ${props => `${props.colors.primary[900]}`};
            }
        }
        
    }
    
    .modal-select {
        width: 100%;
    }

    .title-header {
        font-weight: 600;
        font-size: 20px;
    }

    .to-do-box {
        width : 95%;
    }

    .ant-select-lg .ant-select-selector, .ant-picker, .ant-input-number, .ant-input {
        border-radius: 0px;
        background-color: ${props => props.isDarkMode ? props.colors.primary[400] : "white"};
        
        .ant-picker-clear {
            color: ${props => `${props.colors.primary[100]}`};
            background-color: ${props => `${props.colors.blueAccent[900]}`};
        }
        
    }
    
    .ant-picker-disabled, .ant-input-number-disabled, .ant-checkbox-wrapper-disabled, .ant-input-disabled {
         opacity: 0.9;
    }

    .textarea-custom-resume {
          background-color: #ffffff00 !important;
          border: 1px dashed ${props => props.isDarkMode ? `white` : `black`};
          border-radius: 0px;
    }
    
    .input-custom-resume {
          background-color: #ffffff00 !important;
          border-radius: 0px;
          border: none;
    }
    
    .toggle-select-routine {
        border-radius: 10px;
        
        .ant-checkbox {
            display: none;
        }

        span {
            position: relative;
            display: inline-block;
            background: ${props => `${props.colors.blueAccent[900]}`};
            border: 2px solid ${props => `${props.colors.blueAccent[900]}`};
            padding: 8px;
            padding-top: 6px;
            padding-bottom: 10px;
            border-radius: 50%; 
            width: 15px;
            height: 15px;
            text-align: center;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .ant-checkbox-wrapper-checked {
            span {
                background: ${props => `${props.colors.blueAccent[200]}`};
                color: ${props => props.isDarkMode ? `blue` : `white`};
                border: 2px solid ${props => props.isDarkMode ? `red` : `yellow`};
            }
            span:before {
                content: '';
                position: absolute;
                top: ${props => props.isDarkMode ? `50%` : `-2px`};
                left: -1px;
                width: 110%;
                height: 50%;
                background: ${props => props.isDarkMode ? `rgba(0,0,0,.1)` : `rgba(255,255,255,.1)`};
                border-radius:  ${props => props.isDarkMode ? `0 0 20px 20px` : `20px 20px 0 0` };
            }
    }

    }
    .ant-rate-star-zero {
       .anticon-star {
            svg {
                opacity: 0.5;
            }
        }
    }
    
    .ant-picker .ant-picker-input input {
        ::placeholder {
           opacity: .9; /* Firefox */
        }
        ::-ms-input-placeholder {
           opacity: .9;
        }
    }
    
    .ant-input {
        ::placeholder {
           color: ${props => `${props.colors.primary[100]}`};
           opacity: .5;
        }
        ::-ms-input-placeholder {
           color: ${props => `${props.colors.primary[100]}`};
           opacity: .5;
        }
    }
    
`

export const PinOutLinedIcon = styled(PushPinOutlinedIcon)`
    transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);   
    color: white;
`

export const Focus = (
    <Box className={'focus'} style={{ width: '100px' }}>
        <PinOutLinedIcon />
        <span style={{ fontWeight: 700, color: 'white' }}>FOCUS</span>
    </Box>
)

export default function DailyModal({id, showModal, setShowModal, undoDelete}) {

    const { isDarkMode, isMobile, colors } = useLayout()
    const [form] = Form.useForm()
    const [stateForm, setStateForm] = useState()
    const [loading, setLoading] = useState(false)
    const [render, setRender] = useState(false)

    useEffect(() => {
        handleFetchDetail(id)
    }, [])

    const handleOnDragEnd = (result) => {
        if (!result?.destination) return;

        let tasks = [...form.getFieldValue('children')]
        const [reorderedItem] = tasks.splice(result.source.index, 1)
        tasks.splice(result.destination.index, 0, reorderedItem)
        tasks = tasks.map((item, index) => { return {...item, taskListOrder: index} })
        form.setFieldValue('children', tasks)
    }

    async function handleCancel() {
        const saveValue = {...form.getFieldsValue(true)}
        const res = await handleUpdateTask(saveValue)
    }

    function handleFetchDetail(id) {
        setLoading(true)
        detailTaskGraphQL(id, showModal)
            .then(r => {
                if (!(r?.data?.errors)){
                    form.setFieldsValue(r?.data?.data?.findTaskById)
                    setStateForm(r?.data?.data?.findTaskById)
                } else {
                    throw new Error(r?.data?.errors?.map(item => item?.message))
                }
            })
            .catch(r => console.log(r))
            .finally(() => setLoading(false))
    }

    async function handleUpdateTask(payload) {
        await updateTask(payload)
            .catch(r => console.log(r))
    }

    async function handleChangeStatus(payload) {
        await updateTask(form.getFieldsValue(true))
            .catch(r => console.log(r))
        await changeStatus(payload)
            .then(r => {
                setShowModal(prevState => ({...prevState, id: null}))
            })
            .catch(r => console.log(r))
    }

    const FooterModal = (
        <>
            <Button
                type="primary"
                danger
                onClick={() => {
                    handleChangeStatus({ id: stateForm.id, action: ACTION.DELETE })
                        .then((r) => successInfo('DELETE_SUCCESS', () => undoDelete(id)))
                }}
                icon={<DeleteOutlined />}
            >
                Delete
            </Button>
            {form.getFieldValue('isCompleted')?
                <Button type="primary"
                        onClick={() => {
                            handleChangeStatus({ id: stateForm.id, action: ACTION.UNDO_COMPLETE })
                            successInfo('COMPLETE_SUCCESS')
                        }}
                        icon={<CheckSquareOutlined />}
                >
                    UNDO
                </Button>
                :
                <Button type="primary"
                        onClick={() => {
                            handleChangeStatus({ id: stateForm.id, action: ACTION.COMPLETE })
                            successInfo('COMPLETE_SUCCESS')
                        }}
                        icon={<CheckSquareOutlined />}
                >
                    Finish
                </Button>
            }
        </>
    )

    return (
        <StyledModal
            colors={colors}
            isDarkMode={isDarkMode}
            footer={FooterModal}
            width={1000}
            open={true}
            onCancel={() => {
                handleCancel()
                    .then(r => setShowModal(prevState => ({...prevState, id: null})))
            }}
        >
            {loading &&
                <Box sx={{ height: '500px' }}>
                    <Loading />
                </Box>
            }
            {stateForm &&
                <Form
                    layout={"vertical"}
                    form={form}
                    onValuesChange={() => console.log("Changed")}
                    initialValues={stateForm}
                    preserve={true}
                    disabled={form.getFieldValue('isCompleted') || form.getFieldValue('isDeleted') }
                >
                    <Box className={'ant-modal-title'}>
                        <Button
                            style={{ marginTop: '2px', border: 'none' }}
                            onClick={() => {
                                const newValue = !form.getFieldValue('pinned')
                                setStateForm(prevState => ({ ...prevState, pinned: newValue }))
                                form.setFieldValue('pinned', newValue)
                            }}
                        >
                            {form.getFieldValue('pinned') ? Focus : <PushPinOutlinedIcon />}
                        </Button>
                        <Form.Item
                            name={'name'}
                            style={{ width: '80%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Task name is required'
                                },
                                {
                                    max: 255,
                                    message: 'Task name max length is 255 characters'
                                }
                            ]}
                        >
                            <Input
                                className={`input-custom-resume title-header`}
                                placeholder={'NAME'}
                            />
                        </Form.Item>
                    </Box>
                    <Box>
                        <Box
                            style={{ display: 'grid' }}
                            gridTemplateColumns="repeat(12, 1fr)"
                            gap={'20px'}
                            className={'container-modal'}>
                            <Box
                                order={ isMobile ? '2' : '1' }
                                gridColumn={isMobile? "span 12" : "span 8"}
                                className={'left-container'}>
                                <Form.Item
                                    name={'description'}
                                    style={{ width: '100%' }}
                                >
                                    <TextArea
                                        className={`textarea-custom-resume`}
                                        placeholder={'DESCRIPTION'}
                                        rows={10}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={'priority'}
                                    style={{ width: '100%' }}
                                    initialValue={1}
                                >
                                    <Rate count={10}/>
                                </Form.Item>
                            </Box>
                            <Box
                                order={ isMobile ? '1' : '2'}
                                gridColumn={isMobile? "span 12" : "span 4"}
                                className={'right-container'}>
                                <Form.Item
                                    name={'startDate'}
                                    getValueProps={(value) => {
                                        if (value) return {value: dayjs(value)}
                                    }}
                                >
                                    <DatePicker
                                        size={'large'}
                                        placeholder={'📅 START DATE'}
                                        className={'modal-select'}
                                    />
                                </Form.Item>
                                {showModal === "TODO" &&
                                    <Form.Item
                                        name={'endDate'}
                                        getValueProps={(value) => {
                                            if (value) return {value: dayjs(value)}
                                        }}
                                    >
                                        <DatePicker
                                            size={'large'}
                                            placeholder={'📅 DUE DATE'}
                                            className={'modal-select'}
                                        />
                                    </Form.Item>
                                }
                                {showModal === 'DAILY' &&
                                <Form.Item
                                    name={'loopTime'}
                                    getValueProps={(value) => {
                                        if (value) return {value: dayjsFormat(value, 'HH:mm:ss')}
                                    }}
                                >
                                    <TimePicker
                                        size={'large'}
                                        placeholder={'🕛 TIME START'}
                                        format={'HH:mm'}
                                        minuteStep={15}
                                        className={'modal-select'}
                                    />
                                </Form.Item>
                                }
                                {showModal === 'DAILY' &&
                                <Form.Item
                                    name={'routineType'}
                                >
                                    <Select
                                        size={'large'}
                                        className={'modal-select'}
                                        popupClassName={'pop-select-modal'}
                                        options={listRoutineType}
                                        onChange={() => setRender(!render)}
                                    />
                                </Form.Item>
                                }
                                {(showModal === 'DAILY' && form.getFieldValue('routineType') === 'DAILY') &&
                                <Box sx={{ display:"flex", }}>
                                    <span style={{ width: '40%' }}>
                                        Task will be looped every
                                    </span>
                                    <Form.Item
                                        name={'routineDate'}
                                        style={{ width: '30%' }}
                                    >
                                        <InputNumber min={0} max={7} style={{ width: '100%' }}/>
                                    </Form.Item>
                                    &nbsp;
                                    &nbsp;
                                    <span>
                                        day
                                    </span>
                                </Box>
                                }
                                <Form.Item
                                    name={'routine'}
                                    className={'toggle-select-routine'}
                                    hidden={!(showModal === 'DAILY' && form.getFieldValue('routineType') === 'CUSTOM')}
                                >
                                    <Checkbox.Group options={dateOptions} />
                                </Form.Item>
                            </Box>
                        </Box>
                        <Box className={'to-do-box'}>
                            <Form.Item style={{ width: '100%' }}>
                                <Form.List name="children">
                                    {(fields, { add, remove, move }) => (
                                        <Box>
                                            <Form.Item>
                                                <Button style={{ width: '150px', marginBottom: '5px' }}
                                                        type="text"
                                                        onClick={() => add({ typeCode: showModal })} block icon={<PlusOutlined />}>
                                                    Add more task
                                                </Button>
                                            </Form.Item>
                                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                                <StrictModeDroppable droppableId="todos">
                                                    {(provided) => (
                                                        <section {...provided.droppableProps} ref={provided.innerRef}>
                                                            {fields.map((field, key, num) => {
                                                                return (
                                                                    <Draggable key={field.key} draggableId={key.toString()} index={key}>
                                                                        {(provided) => (
                                                                            <article {...provided.draggableProps} ref={provided.innerRef}>
                                                                                <ToDoItemCheckList
                                                                                    add={add}
                                                                                    addObject={{ typeCode: showModal }}
                                                                                    drag={{...provided.dragHandleProps}}
                                                                                    remove={remove}
                                                                                    form={form}
                                                                                    index={key}
                                                                                    typeCode={showModal}
                                                                                />
                                                                            </article>
                                                                        )}
                                                                    </Draggable>
                                                                )
                                                            })}
                                                            {provided.placeholder}
                                                        </section>
                                                    )}
                                                </StrictModeDroppable>
                                            </DragDropContext>
                                        </Box>
                                    )}
                                </Form.List>
                            </Form.Item>
                        </Box>
                    </Box>
                </Form>
            }
        </StyledModal>
    );
}