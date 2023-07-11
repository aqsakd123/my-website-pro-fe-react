import {useLayout} from "../../../components/layout-context";
import {Button, Form} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ToDoItemCheckList from "./to-do-check-list";
import {Box} from "@mui/material";
import {DragDropContext, Draggable} from "react-beautiful-dnd";
import {StrictModeDroppable} from "../../../components/StrictModeDroppable";
import ToDoItemGroupList from "./to-do-group-list";

export default function ChildTaskCheckList({showModal, childrenName = 'childTaskCheck', addObject, setSearchId, isGroup, handleOnDragEnd, fields, add, remove, form, setLoadingParentTask }) {
    const { isDarkMode, colors } = useLayout()

    return (
        <Box>
            <Form.Item>
                <Button style={{ width: '150px', marginBottom: '5px' }}
                        type="text"
                        disabled={isGroup ? false : (form.getFieldValue('isCompleted') || form.getFieldValue('isDeleted'))}
                        onClick={() => add(addObject)} block icon={<PlusOutlined />}
                >
                    { isGroup ? 'Add more group task' : 'Add more task' }
                </Button>
            </Form.Item>
            <DragDropContext onDragEnd={(res) => handleOnDragEnd(res, childrenName)}>
                <StrictModeDroppable droppableId="todos">
                    {(provided) => (
                        <section {...provided.droppableProps} ref={provided.innerRef}>
                            {fields.map((field, key, num) => {
                                return (
                                    <Draggable key={field.key} draggableId={key.toString()} index={key}>
                                        {(provided) => (
                                            <article {...provided.draggableProps} ref={provided.innerRef}>
                                                {isGroup ?
                                                    <ToDoItemGroupList
                                                        childName={'childTaskGroup'}
                                                        setLoadingParentTask={setLoadingParentTask}
                                                        setSearchId={setSearchId}
                                                        add={add}
                                                        addObject={addObject}
                                                        drag={{...provided.dragHandleProps}}
                                                        remove={remove}
                                                        form={form}
                                                        index={key}
                                                        typeCode={showModal}
                                                    />
                                                    :
                                                    <ToDoItemCheckList
                                                        childName={childrenName}
                                                        add={add}
                                                        addObject={addObject}
                                                        drag={{...provided.dragHandleProps}}
                                                        remove={remove}
                                                        form={form}
                                                        index={key}
                                                        typeCode={showModal}
                                                    />
                                                }
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
    );
}