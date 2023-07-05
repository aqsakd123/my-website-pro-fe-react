import {Box} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {useEffect, useState} from "react";
import {
    Button,
    Checkbox, Collapse,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Rate,
    Select,
    Space,
    TimePicker, Tooltip
} from "antd";
import dayjs from "dayjs";
import {ACTION, dateOptions, listRoutineType} from "../common/common-data";
import TextArea from "antd/es/input/TextArea";
import {
    CarryOutOutlined,
    CheckSquareOutlined,
    CloseOutlined,
    DeleteOutlined, DownOutlined,
    PlusOutlined,
    QuestionCircleOutlined, StarOutlined
} from "@ant-design/icons";
import ToDoItemCheckList from "../component/to-do-check-list";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import {DragDropContext, Draggable} from "react-beautiful-dnd";
import {StrictModeDroppable} from "../../../components/StrictModeDroppable";
import {changeStatus, detailProject, detailTask, updateTask} from "../service/service";
import {dayjsFormat, mergeChildren} from "../common/common-function";
import {errorInfo, successInfo} from "../../../common/common";
import Loading from "../../layout/loading";
import {Focus, StyledModal} from "./daily-modal";
import ToDoItemGroupList from "../component/to-do-group-list";
import ChildTaskCheckList from "../component/child-task-check";
import Tree from "antd/es/tree/Tree";
import Treeize from "treeize";

export default function ProjectModal({id, showModal, setShowModal, undoDelete}) {

    const { isDarkMode, colors, isMobile } = useLayout()

    const [form] = Form.useForm()

    const [searchId, setSearchId] = useState(id)
    const [projectParentId, setProjectParentId] = useState()
    const [projectParent, setProjectParent] = useState()

    const [loading, setLoading] = useState(false)
    const [loadingParentTask, setLoadingParentTask] = useState(false)
    const [render, setRender] = useState(false)

    function handleModifyTreeTitle(item){
        let pinned, completed
        if(item.pinned) {
            pinned = true
        }
        if (item.isCompleted){
            completed = true
        }
        return <Tooltip placement="top" title={item.description}>
            {pinned &&
                <>🌟&nbsp;&nbsp;</>
            }
            {completed &&
                <>✅&nbsp;&nbsp;</>
            }
            <span>{item.name}</span>
        </Tooltip>
    }

    const createTreeArray = (items, parentId = null) => {
        return items
            .filter(item => item.parentId === parentId)
            .map(item => ({
                ...item,
                title: handleModifyTreeTitle(item) ,
                key: item.id,
                children: createTreeArray(items, item.id),
            }));
    };

    const items = [
        {
            key: '1',
            label: "Project's Task",
            children:
                <Tree
                    showLine
                    switcherIcon={<DownOutlined />}
                    onSelect={(key) => {
                        if(key[0] !== form.getFieldValue('id')){
                            handleUpdateTask(form.getFieldsValue(true))
                                .then(r => setSearchId(key[0]))
                        }
                    }}
                    defaultExpandedKeys={['0-0-0']}
                    treeData={projectParent}
                />
            ,
        }
        ];

    useEffect(() => {
        setLoading(true)
        handleFetchDetail(searchId)
            .then(r => {
                form.setFieldsValue(handleDivideChidlren(r?.data))
                if(r?.data?.projectParentId && !projectParentId){
                    setProjectParentId(r?.data?.projectParentId)
                }
                setRender(!render)
            })
            .finally(() => setLoading(false))

    }, [searchId])

    useEffect(() => {
        if(projectParentId){
            detailProject(projectParentId)
                .then(r => {
                    setProjectParent(createTreeArray(r?.data))
                })
        }
    }, [projectParentId, loadingParentTask])

    const handleOnDragEnd = (result, taskListName) => {
        if (!result?.destination) return;

        let tasks = [...form.getFieldValue(taskListName)]
        const [reorderedItem] = tasks.splice(result.source.index, 1)
        tasks.splice(result.destination.index, 0, reorderedItem)
        tasks = tasks.map((item, index) => { return {...item, taskListOrder: index} })
        form.setFieldValue(taskListName, tasks)
    }

    async function handleCancel() {
        const res = await handleUpdateTask(form.getFieldsValue(true))
    }

    async function handleFetchDetail(id) {
        return await detailTask(id)
            .catch(r => console.log(r))
    }

    async function handleUpdateTask(payload) {
        const saveValue = {...mergeChildren(payload)}
        await updateTask(saveValue)
            .catch(r => console.log(r))
    }

    async function handleChangeStatus(payload) {
        await handleUpdateTask(form.getFieldsValue(true))
            .catch(r => console.log(r))
        await changeStatus(payload)
            .catch(r => console.log(r))
    }

    function handleDivideChidlren(form){
        const childTaskCheck = form?.children?.filter(item => item?.typeGroup === 1)
        const childTaskGroup = form?.children?.filter(item => item?.typeGroup === 2)
        const res = { ...form, children: [], childTaskCheck: childTaskCheck, childTaskGroup: childTaskGroup }
        return res
    }

    const FooterModal = (
        <>
            <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={() => {
                    handleChangeStatus({ id: form.getFieldValue('id'), action: ACTION.DELETE })
                        .then(r => {
                            setShowModal(prevState => ({...prevState, id: null}))
                        })
                        .then((r) => successInfo('DELETE_SUCCESS', () => undoDelete(id)))
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
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                >
                    Delete Project
                </Button>
            </Popconfirm>
            <Popconfirm
                title="Complete the task"
                description="Are you sure to complete this task?"
                onConfirm={() => {
                    handleChangeStatus({ id: form.getFieldValue('id'), action: ACTION.COMPLETE })
                        .then(r => {
                            setShowModal(prevState => ({...prevState, id: null}))
                        })
                        .then(r => successInfo('COMPLETE_SUCCESS'))
                }}
                icon={
                    <QuestionCircleOutlined
                        style={{
                            color: 'red',
                        }}
                    />
                }
            >
                <Button type="primary"
                        icon={<CheckSquareOutlined />}
                >
                    Finish Project
                </Button>
            </Popconfirm>

        </>
    )

    return (
        <StyledModal
            colors={colors}
            isDarkMode={isDarkMode}
            footer={form.getFieldValue('projectParentId') ? null : FooterModal}
            width={1000}
            open={true}
            onCancel={() => {
                handleCancel()
                    .then(r => setShowModal(prevState => ({...prevState, id: null})))
            }}
        >
            {loading &&
                <Loading />
            }
            <Form
                layout={"vertical"}
                form={form}
                preserve={true}
                disabled={form.getFieldValue('isCompleted') || form.getFieldValue('isDeleted') }
            >
                <Box className={'ant-modal-title'}>
                    <Button
                        style={{ marginTop: '2px', border: 'none' }}
                        onClick={() => {
                            const newValue = !form.getFieldValue('pinned')
                            form.setFieldValue('pinned', newValue)
                            setRender(!render)
                        }}
                        disabled={false}
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
                        className={'container'}>
                        <Box
                            order={ isMobile ? '2' : '1' }
                            gridColumn={isMobile? "span 12" : "span 7"}
                            style={{ width: '100%' }}
                            className={'left-container'}>
                            <Form.Item
                                name={'description'}
                                style={{ width: '100%' }}
                            >
                                <TextArea
                                    className={`textarea-custom-resume`}
                                    placeholder={'DESCRIPTION'}
                                    rows={14}
                                />
                            </Form.Item>
                            <Form.Item
                                name={'priority'}
                                style={{ width: '100%' }}
                                initialValue={1}
                            >
                                <Rate count={10} />
                            </Form.Item>
                        </Box>
                        <Box
                            order={ isMobile ? '1' : '2'}
                            gridColumn={isMobile? "span 12" : "span 5"}
                            className={'right-project-container'}
                        >
                            <Box className={'project-box'}>
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
                                {form.getFieldValue('projectParentId') &&
                                <>
                                    <Popconfirm
                                        title="Delete the task"
                                        description="Are you sure to delete this task?"
                                        onConfirm={() => {
                                            form.setFieldValue('isDeleted', true)
                                            setRender(!render)
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
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                            style={{ width: '48%', marginRight: '2%' }}
                                        >
                                            Delete This Task
                                        </Button>
                                    </Popconfirm>
                                    {form.getFieldValue('isCompleted') ?
                                        <Button type="primary"
                                                style={{ width: '48%' }}
                                                disabled={false}
                                                onClick={()=> {
                                                    form.setFieldValue('isCompleted', false)
                                                    setRender(!render)
                                                }}
                                                icon={<CheckSquareOutlined />}
                                        >
                                            Undo
                                        </Button>
                                        :
                                        <Popconfirm
                                            title="Complete the task"
                                            description="Are you sure to complete this task?"
                                            onConfirm={() => {
                                                form.setFieldValue('isCompleted', true)
                                                setRender(!render)
                                            }}
                                            icon={
                                                <QuestionCircleOutlined
                                                    style={{
                                                        color: 'red',
                                                    }}
                                                />
                                            }
                                        >
                                            <Button type="primary"
                                                    style={{ width: '48%' }}
                                                    icon={<CheckSquareOutlined />}
                                            >
                                                Finish This Task
                                            </Button>
                                        </Popconfirm>
                                    }
                                </>
                                }
                            </Box>
                            {(form.getFieldValue('projectParentId') && projectParent) &&
                                <Box className={'project-box parent-project-accordion'}>
                                    <Collapse defaultActiveKey={['1']} items={items} />
                                </Box>
                            }
                        </Box>
                    </Box>
                    <Box className={'to-do-box'}>
                        <Form.Item style={{ width: '100%' }}>
                            <Form.List name="childTaskCheck">
                                {(fields, { add, remove, move }) => (
                                    <ChildTaskCheckList
                                        remove={remove}
                                        addObject={{ typeCode: showModal }}
                                        add={add}
                                        form={form}
                                        fields={fields}
                                        showModal={showModal}
                                        handleOnDragEnd={handleOnDragEnd}
                                    />
                                )}
                            </Form.List>
                        </Form.Item>
                        <Form.Item style={{ width: '100%' }}>
                            <Form.List name="childTaskGroup">
                                {(fields, { add, remove, move }) => (
                                    <ChildTaskCheckList
                                        isGroup={true}
                                        childrenName={'childTaskGroup'}
                                        setSearchId={setSearchId}
                                        remove={remove}
                                        addObject={{ typeCode: showModal, typeGroup: 2, projectParentId: form.getFieldValue('projectParentId') || form.getFieldValue('id') }}
                                        add={add}
                                        form={form}
                                        fields={fields}
                                        showModal={showModal}
                                        setLoadingParentTask={setLoadingParentTask}
                                        handleOnDragEnd={handleOnDragEnd}
                                    />
                                )}
                            </Form.List>
                        </Form.Item>
                    </Box>
                </Box>
            </Form>
        </StyledModal>
    );
}