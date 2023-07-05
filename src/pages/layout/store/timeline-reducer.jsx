import {REMOVE_TIMELINE, TIMELINE_CHANGE} from "./action-name";

const initialValue = []

export const timelineReducer = (state = initialValue, action) => {
    switch (action.type) {
        case TIMELINE_CHANGE:
            return [...action.payload]
        case REMOVE_TIMELINE:
            return []
        default:
            return state
    }
}

export const selectTimeline = (state) => state.timeline
