import {LAYOUT_CHANGE_LANGUAGE, LAYOUT_TOGGLE_THEME, REMOVE_TIMELINE, TIMELINE_CHANGE} from "./action-name";

export const toggleTheme = () => ({
    type: LAYOUT_TOGGLE_THEME
})

export const changeLanguageState = (payload) => ({
    type: LAYOUT_CHANGE_LANGUAGE,
    payload: payload
})

export const changeTimeLine = (payload) => ({
    type: TIMELINE_CHANGE,
    payload: payload

})

export const removeTimeline = () => ({
    type: REMOVE_TIMELINE
})
