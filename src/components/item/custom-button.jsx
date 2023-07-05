import {Button} from "antd";
import {useLayout} from "../layout-context";

export default function CustomButton({style, type, children, ...restProps}) {
    const { colors, isDarkMode } = useLayout()

    return (
        <Button
            style={{ backgroundColor: !type ? colors.blueAccent[800] : '', color: colors.blueAccent[100], margin: '5px', ...style }}
            type={type}
            {...restProps}
        >
            {children}
        </Button>
    );
}