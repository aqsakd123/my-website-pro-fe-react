import {Box, IconButton, MenuItem, MenuList} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import ToDoItem from "./item-to-do";
import {useEffect, useState} from "react";
import {changeStatus, filterTaskGraphQL, insertTask} from "../service/service";
import {useAxios} from "../../auth/axios-context";
import {Button, Popover, Select, Switch} from "antd";
import {ACTION, orderItemOptions} from "../common/common-data";
import {PlusCircleOutlined} from "@ant-design/icons";
import CustomIcon from "../../../components/item/custom-icon";
import {DragDropContext, Draggable} from "react-beautiful-dnd";
import {StrictModeDroppable} from "../../../components/StrictModeDroppable";
import {errorInfo} from "../../../common/common";
import Loading from "../../layout/loading";
import HobbyModal from "../dialog/hobby-modal";
import DailyModal from "../dialog/daily-modal";
import ProjectModal from "../dialog/project-modal";

export default function ToDoColumn({typeCode}) {

    const { isDarkMode, colors, isMobile } = useLayout()
    const { axiosInstance } = useAxios()

    const [showModal, setShowModal] = useState({})
    const [loading, setLoading] = useState(false)
    const [todoList, setToDoList] = useState([])
    const [filter, setFilter] = useState({ typeCode: typeCode, orderItem: 'taskListOrder', order: 'asc', completed: false })

    useEffect(() => {
        if ((!showModal?.id) && showModal.typeCode === typeCode) {
            handleFilterTask(filter)
        }
    }, [showModal])

    useEffect(() => {
        handleFilterTask(filter)
    }, [filter])

    function isShowModal(value) {
        return (showModal?.typeCode === value) && typeCode === value && showModal.id
    }

    function handleOnDragEnd(result){
        if (!result?.destination) return;
        if (result.destination.index === result.source.index) return;
        if (filter.orderItem !== 'taskListOrder') {
            errorInfo('DRAG_ORDER_ONLY')
            return;
        }
        let index
        if (result.destination.index >= (todoList.length - 1)) {
            index = -1
        } else {
            if (result.destination.index > result.source.index) {
                index = result.destination.index + 1
            } else {
                index = result.destination.index
            }
        }
        const position = (calculatePositionByIndex(index))
        handleChangeStatus({ id: todoList[result.source.index].id, action: ACTION.CHANGE_POSITION, position: position })
    }

    function calculatePositionByIndex(index) {
        let position
        if (filter.orderItem !== 'taskListOrder') {
            return 1
        }
        if (index === 0) {
            const nextItemPosition = todoList[0].taskListOrder
            position = Math.random() * (nextItemPosition)
        } else if (index > 0) {
            const prevItemPosition = todoList[index].taskListOrder
            const nextItemPosition = todoList[index - 1].taskListOrder
            position = prevItemPosition + Math.random() * (nextItemPosition - prevItemPosition)
        } else {
            if (todoList.length > 0) {
                const lastItemPosition = todoList[todoList.length - 1].taskListOrder
                position = lastItemPosition + Math.random() * (1 - lastItemPosition)
            } else {
                position = Math.random()
            }
        }

        return position
    }

    function handleInsertTask(index) {
        let position = calculatePositionByIndex(index)
        handleSaveTask({ name: 'NEW TASK', typeCode: typeCode, taskListOrder: position })
    }

    function handleFilterTask(payload) {
        // filterTask(payload)
        //     .then(r => setToDoList(r?.data))
        //     .catch(r => console.log(r))
        const variable = { filterRequest: payload }
        filterTaskGraphQL(variable)
            .then(r => {
                if (!(r?.data?.errors)){
                    setToDoList(r?.data?.data?.filter)
                } else {
                    throw new Error(r?.data?.errors?.map(item => item?.message))
                }
            })
            .catch(r => console.log(r))
    }
    function handleSaveTask(payload) {
        insertTask(payload)
            .then(r => handleFilterTask(filter))
            .catch(r => console.log(r))
    }

    function handleChangeStatus(payload) {
        setLoading(true)
        changeStatus(payload)
            .then(r => handleFilterTask(filter))
            .catch(r => console.log(r))
            .finally(() => setLoading(false))
    }

    async function undoDelete(id) {
        await changeStatus({id: id, action: ACTION.UNDO_DELETE})
            .then(r => handleFilterTask(filter))
            .catch(r => console.log(r))
    }

    const content = (
        <MenuList>
            <MenuItem onClick={() => {
                const newValue = filter?.order === 'asc' ? 'desc' : 'asc'
                setFilter(prevState => ({ ...prevState, order: newValue }))
            }}>
                <Switch checked={filter?.order === 'asc'} checkedChildren="ASC" unCheckedChildren="DESC" style={{ width: '100%' }} defaultChecked />
            </MenuItem>
            <MenuItem onClick={() => {
                setFilter(prevState => ({ ...prevState, completed: !prevState?.completed }))
            }}>
                <Switch checked={filter?.completed} checkedChildren="COMPLETED" unCheckedChildren="NOT COMPLETE" style={{ width: '100%' }} />
            </MenuItem>
            <MenuItem>
                <Select
                    options={orderItemOptions}
                    defaultValue={'taskListOrder'}
                    style={{ width: '150px', marginRight: '10px' }}
                    onChange={(value, option) => setFilter(prevState => ({ ...prevState, orderItem: value }))}
                />
            </MenuItem>
        </MenuList>
    )

    return (
        <Box
            gridColumn={`span ${isMobile ? '4' : '1'}`}
            sx={{ border: `1px solid ${isDarkMode ? 'blue' : 'wheat'}`}}
            className={'type-container'}>

            {isShowModal("HOBBY") &&
                <HobbyModal
                    id={showModal.id}
                    showModal={showModal?.typeCode}
                    setShowModal={setShowModal}
                    undoDelete={undoDelete}
                />
            }

            {(isShowModal("DAILY") || isShowModal("TODO")) &&
                <DailyModal
                    id={showModal.id}
                    showModal={showModal?.typeCode}
                    setShowModal={setShowModal}
                    undoDelete={undoDelete}
                />
            }

            {isShowModal("PROJECT") &&
                <ProjectModal
                    id={showModal.id}
                    showModal={showModal?.typeCode}
                    setShowModal={setShowModal}
                    undoDelete={undoDelete}
                />
            }

            {loading &&
                <Loading />
            }

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className={'type-header'}>{typeCode}</span>
                    <Popover placement="bottomRight" title={"Order"} content={content} trigger="click">
                        <Button
                            icon={<CustomIcon name={orderItemOptions.filter(item => item.value === filter.orderItem)[0].icon}/>}/>
                    </Popover>
                </Box>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <StrictModeDroppable droppableId={typeCode}>
                        {(provided) => (
                            <section {...provided.droppableProps} ref={provided.innerRef}>
                                {todoList?.length > 0 && todoList?.map((item, index) => {
                                    return (
                                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                            {(provided) => (
                                                <article {...provided.draggableProps} ref={provided.innerRef}>
                                                    <ToDoItem
                                                        data={item}
                                                        index={index}
                                                        handleInsertTask={handleInsertTask}
                                                        handleChangeStatus={handleChangeStatus}
                                                        drag={{...provided.dragHandleProps}}
                                                        setShowModal={setShowModal}
                                                        typeCode={typeCode}
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
                <Box style={{ display: 'flex', justifyContent: 'center' }} >
                    <IconButton onClick={() => handleInsertTask(-1)}>
                        <PlusCircleOutlined style={{ color: colors.primary[100] }} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}