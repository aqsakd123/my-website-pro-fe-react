import {useAuth} from "./auth-context";
import React, {useContext, useEffect, useState} from "react";
import axiosInstance from "../../axios-instance";
import {errorInfo} from "../../common/common";
import Loading from "../layout/loading";

const AxiosContext = React.createContext({})

export function useAxios() {
    return useContext(AxiosContext)
}

const AxiosProvider = ({ children }) => {
    const { currentUser, reloadUser } = useAuth();
    const [jwt, setJwt] = useState();
    const [release, setRelease] = useState(false)

    useEffect(() => {
        if(release) {
            setRelease(false)
        }
        const timeOut = setTimeout(() => {
            setRelease(true)
        }, 2000)
        if(!currentUser) return;

        const requestIntercept = axiosInstance.interceptors.request.use(
            async (config) => {
                const token = await currentUser?.getIdToken()
                if (!config.headers['Authorization'] && token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            async (response) => {
                //graphql errors covered
                if(response?.config?.url?.endsWith("graphql") && response?.data?.errors){
                    errorInfo('ERROR_OCCURRED')
                }
                return response
            },
            async (error) => {
                const prevRequest = error?.config;
                const errMsg = error?.response?.data?.message
                if (errMsg) {
                    errorInfo(errMsg)
                } else {
                    let msg
                    switch (error?.response?.status) {
                        case 403:
                            msg = 'NO_PERMISSION'
                            break;
                        case 413:
                            msg = 'TOO_LARGE_CALL'
                            break;
                        default:
                            msg = 'ERROR_OCCURRED'
                    }
                    errorInfo(msg)
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        }
    }, [reloadUser])

    const value = {
        axiosInstance,
    }

    return (
        <AxiosContext.Provider value={value}>
            {release &&
               <>{children}</>
            }
            {!release &&
                <Loading />
            }
        </AxiosContext.Provider>
    )
}

export default AxiosProvider;
