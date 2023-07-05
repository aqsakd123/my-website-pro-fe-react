import {Button, message, notification} from "antd";
import {t} from "i18next";
import {Box} from "@mui/material";

message.config({
    maxCount: 3,
});

export function successInfo(value, callback) {
    if (value) {
        const content =
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t(`MESSAGE.${value}`)}</span>
                {callback &&
                <Button size={"small"} onClick={(...props) => {
                    callback(...props)
                    notification.destroy()
                }}>Undo</Button>
                }
            </Box>
        notification.success({
            description: content,
            message: t('NOTIFICATION'),
            duration: callback? 30 : 5,
            placement: 'bottomRight'
        })
    }
}

export function errorInfo(value) {
    if (value) {
        const content = t(`MESSAGE.${value}`)
        message.error({ className: 'message-top-bar', content: content })
    }
}
