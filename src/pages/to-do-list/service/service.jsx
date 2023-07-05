import axiosInstance from "../../../axios-instance";
import {ACTION} from "../common/common-data";

export async function insertTask(payload) {
    return await axiosInstance.post('/api/task/save', {...payload})
}

export async function insertSubGroupTask(parentId, payload) {
    return await axiosInstance.post(`/api/task/insert-sub-task/${parentId}`, {...payload})
}

export async function updateSubTask(id, payload) {
    return await axiosInstance.post(`/api/task/update-sub-task/${id}`, {...payload})
}

export async function detailTask(id) {
    return await axiosInstance.get(`/api/task/detail/${id}`)
}

export async function detailProject(id) {
    return await axiosInstance.get(`/api/task/project-detail/${id}`)
}

export async function filterTask(payload) {
    return await axiosInstance.post('/api/task/filter', {...payload})
}

export async function updateTask(payload) {
    return await axiosInstance.post(`/api/task/edit/${payload?.id}`, {...payload})
}

export async function changeStatus(payload) {
    return await axiosInstance.post(`/api/task/change-status`, {...payload})
}

