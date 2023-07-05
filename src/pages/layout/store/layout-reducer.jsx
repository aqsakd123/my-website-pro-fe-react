import {LAYOUT_CHANGE_LANGUAGE, LAYOUT_TOGGLE_THEME} from "./action-name";

const initialValue = {
    theme: "dark",
    language: ""
}

export const layoutReducer = (state = initialValue, action) => {
    switch (action.type) {
        case LAYOUT_TOGGLE_THEME:
            return {
                ...state,
                theme: state.theme === 'light'? 'dark' : "light"
            }
        case LAYOUT_CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.payload
            }
        default:
            return state
    }
}

export const selectLayout = (state) => state.layout
