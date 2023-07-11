import {Box} from "@mui/material";
import {listType} from "./common/common-data";
import {useLayout} from "../../components/layout-context";
import '../../style/to-do-style.css'
import ToDoColumn from "./component/to-do-column";

export default function ToDoList() {

    const { isDarkMode } = useLayout()

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box
                display="grid"
                columnGap="10px"
                rowGap="10px"
                gridTemplateColumns={"repeat(4, 1fr)"}
                className={'to-do-container'}
            >
                {listType.map(item => (
                    <ToDoColumn
                        key={item}
                        typeCode={item}
                    />
                ))}
            </Box>
        </Box>
    );
}