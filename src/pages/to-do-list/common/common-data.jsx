export const listType = ['HOBBY', 'DAILY','TODO','PROJECT']

export const listRoutineType = [
    {
        value: 'DAILY',
        label: 'Daily',
    },
    {
        value: 'CUSTOM',
        label: 'Custom',
    },
]

export const dateOptions = [
    {value: 'monday', label: 'M'},
    {value: 'tuesday', label: 'T'},
    {value: 'wednesday', label: 'W'},
    {value: 'thursday', label: 'T'},
    {value: 'friday', label: 'F'},
    {value: 'saturday', label: 'S'},
    {value: 'sunday', label: 'S'},

];

export const orderItemOptions = [
    { value: 'taskListOrder', label: 'Position', icon: 'FaListOl' },
    { value: 'createdDate', label: 'Created Date', icon: 'FaCalendar' },
    { value: 'modifyDate', label: 'Update Date', icon: 'FaCalendar' },
    { value: 'priority', label: 'Priority', icon: 'FaRegStar' },

]

export const ACTION = {
    DELETE : "DELETE",
    UNDO_DELETE : "UNDO_DELETE",
    ACTIVE : "ACTIVE",
    DEACTIVATE : "DEACTIVATE",
    COMPLETE : "COMPLETE",
    UNDO_COMPLETE : "UNDO_COMPLETE",
    CHANGE_POSITION : "CHANGE_POSITION",
    ADD_SCORE: "ADD_SCORE",
    SUBTRACT_SCORE: "SUBTRACT_SCORE"
}
