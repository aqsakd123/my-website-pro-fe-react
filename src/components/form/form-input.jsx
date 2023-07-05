import {Form} from "antd";
import Input from "antd/es/input/Input";
import {useLayout} from "../layout-context";
import styled from "@emotion/styled";


export default function FormInput({label, rules, name, style, ...restProps}) {
    const { colors, isDarkMode } = useLayout()

    const StyledInput = styled(Input)`
        ::placeholder{
            opacity: 0.9;
        }
    `

    return (
        <Form.Item
            label={label}
            name={name}
            rules={rules}
            style={{ width : "100%" }}
        >
            <StyledInput
                type={"email"}
                style={{ width : "100%", ...style }}
                {...restProps}/>
        </Form.Item>
    );
}