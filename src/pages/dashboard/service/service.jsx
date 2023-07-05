import axiosInstance from "../../../axios-instance";

export async function fetchTimeLine(payload) {
    return await axiosInstance.post(`/api/public/dashboard/task`, {...payload})
}

