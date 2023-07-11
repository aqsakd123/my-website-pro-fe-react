import {Box} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {useEffect, useState} from "react";
import {Button, Form, Input, Rate} from "antd";
import {ACTION} from "../common/common-data";
import TextArea from "antd/es/input/TextArea";
import {CheckSquareOutlined, DeleteOutlined} from "@ant-design/icons";
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import {changeStatus, detailTaskGraphQL, updateTask} from "../service/service";
import {successInfo} from "../../../common/common";
import Loading from "../../layout/loading";
import {Focus, StyledModal} from "./daily-modal";

export default function HobbyModal({id, showModal, setShowModal, undoDelete}) {

    const { isDarkMode, colors, isMobile } = useLayout()

    const [form] = Form.useForm()
    const [stateForm, setStateForm] = useState()
    const [loading, setLoading] = useState(false)
    const [render, setRender] = useState(false)

    useEffect(() => {
        handleFetchDetail(id)
    }, [])

    async function handleCancel() {
        const saveValue = {...form.getFieldsValue(true)}
        const res = await handleUpdateTask(saveValue)
    }

    function handleFetchDetail(id) {
        setLoading(true)
        detailTaskGraphQL(id, "HOBBY")
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
            <Button type="primary"
                    onClick={() => {
                        handleChangeStatus({id: stateForm.id, action: ACTION.COMPLETE})
                            .then((r) => successInfo('COMPLETE_SUCCESS'))
                    }}
                    icon={<CheckSquareOutlined />}
            >
                Finish
            </Button>
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
            {(loading) &&
            <Box sx={{ height: '500px' }}>
                <Loading />
            </Box>
            }
            {stateForm &&
            <Form
                layout={"horizontal"}
                form={form}
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
                                message: 'name is required'
                            },
                            {
                                max: 255,
                                message: 'name max length is 255 characters'
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
                                <Rate count={10} />
                            </Form.Item>
                        </Box>
                        <Box
                            order={ isMobile ? '1' : '2'}
                            gridColumn={isMobile? "span 12" : "span 4"}
                            className={'right-container'}>
                            <Form.Item
                                name={'totalCredit'}
                                label={'Total Credit'}
                                style={{ width: '100%' }}
                            >
                                <Input
                                    readOnly={true}
                                />
                            </Form.Item>
                        {/* TODO: Update history, data statistic, streaks, etc of HOBBY in future */}
                        </Box>
                    </Box>
                </Box>
            </Form>
            }
        </StyledModal>
    );
}