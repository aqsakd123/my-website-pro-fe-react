import dayjs from "dayjs";
import moment from "moment";
import momentTimezone from "moment-timezone"

export function dayjsFormat(value) {
    if(Array.isArray(value)){
        const localTimeZone = momentTimezone.tz.guess()
        if(value.length > 6) {
            const ar = value.slice(0, 6);
            return dayjs(moment.utc(ar).utcOffset(localTimeZone))
        } else {
            return dayjs(moment.utc(value).utcOffset(localTimeZone))
        }
    } else {
        return dayjs(value)
    }
}

export function mergeChildren(form){
    const newChildren = (form.childTaskCheck)?.concat(form.childTaskGroup)
    const res = { ...form, children: newChildren, childTaskCheck: [], childTaskGroup: [] }
    return res
}

