import {Box, IconButton} from "@mui/material";
import {useLayout} from "../../../components/layout-context";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {ACTION} from "../common/common-data";
import {PinOutLinedIcon} from "../dialog/daily-modal";

export default function HobbyToDoItemBox({data, setShowModal, handleChangeStatus}) {
    const { isDarkMode, colors, transparentColor } = useLayout()

    return (
        <Box sx={{ border: `1px solid ${isDarkMode ? 'blue' : 'wheat'}`, backgroundColor: transparentColor(colors.primary[400], 9)}}
             className={'item-hobby-box'}
        >
            <Box className={'change-score-box'}>
                <IconButton sx={{ fontSize: '20px'}} onClick={() => handleChangeStatus({ id: data?.id, action: ACTION.ADD_SCORE })}>
                    <PlusCircleOutlined style={{ color: 'white' }} />
                </IconButton>
                <Box>
                    {data?.totalCredit}
                </Box>
                <IconButton sx={{ fontSize: '20px'}} onClick={() => handleChangeStatus({ id: data?.id, action: ACTION.SUBTRACT_SCORE })}>
                    <MinusCircleOutlined style={{ color: 'white' }} />
                </IconButton>
            </Box>
            <Box
                className={'hobby-item'}
                onClick={() => setShowModal({typeCode: "HOBBY", id: data?.id})}
                sx={{ width: '80%' }}
            >
                <Box sx={{ display: 'flex' }}>
                    {data?.pinned &&
                    <Box className={'focus'} style={{ width: '50px', scale: '0.7' }}>
                        <PinOutLinedIcon />
                    </Box>
                    }
                    <span className={'item-header'}>
                    {data?.name}
                </span>
                </Box>
                <Box className={'item-description'}>
                    {data?.description}
                </Box>
            </Box>
        </Box>
    );
}