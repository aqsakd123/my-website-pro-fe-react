import axiosInstance from "../../../axios-instance";
import {FILTER_TASK, FIND_TASK_BY_ID} from "./graphql-api";

export async function insertTask(payload) {
    return await axiosInstance.post('/api/task/save', {...payload})
}

export async function insertSubGroupTask(parentId, payload) {
    return await axiosInstance.post(`/api/task/insert-sub-task/${parentId}`, {...payload})
}

export async function detailProject(id) {
    return await axiosInstance.get(`/api/task/project-detail/${id}`)
}

export async function updateTask(payload) {
    return await axiosInstance.post(`/api/task/edit/${payload?.id}`, {...payload})
}

export async function changeStatus(payload) {
    return await axiosInstance.post(`/api/task/change-status`, {...payload})
}

export async function filterTaskGraphQL(payload) {
    return await axiosInstance.post(`/graphql`, {
        query: FILTER_TASK,
        variables: payload
    })
}

export async function detailTaskGraphQL(id, typeCode) {
    return await axiosInstance.post(`/graphql`, {
        query: FIND_TASK_BY_ID,
        variables: {
            id: id,
            skipRoutine: typeCode === "DAILY" ? false : true,
            skipChildren: typeCode === "HOBBY" ? true : false
        }
    })
}
