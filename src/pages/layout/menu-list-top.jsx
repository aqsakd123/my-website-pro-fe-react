import {menu, pages} from "./common/common-data";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Collapse, Menu, Popover} from "antd";
import {useAuth} from "../auth/auth-context";
import {useLayout} from "../../components/layout-context";
import SubMenu from "antd/es/menu/SubMenu";
import {useEffect, useRef, useState} from "react";
import {changeStatus} from "../to-do-list/service/service";
import ToDoTopBar from "./component/to-do-top-bar";
import {useDispatch, useSelector} from "react-redux";
import {changeTimeLine} from "./store/action";
import {selectLayout} from "./store/layout-reducer";
import {selectTimeline} from "./store/timeline-reducer";

export default function MenuTopBar(){
    const { currentUser } = useAuth()

    const { colors, isDarkMode } = useLayout()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch();
    const taskToDo = useSelector(selectTimeline)

    const jsData = useRef("")
    const userMail = useRef("")

    const [token, setToken] = useState(false)

    useEffect(() => {
        const getToken = async () => {
            return await currentUser?.getIdToken()
        }
        getToken()
            .then(r => {
                setToken(r)
            })
    }, [])

    useEffect(() => {
        if(currentUser) {
            userMail.current = currentUser.email
        } else {
            userMail.current = ""
        }
    }, [currentUser])

    useEffect(() => {
        if (!(token && userMail.current)) return;
        let url = process.env.REACT_APP_BASE_URL + '/api/public/dashboard/get-time-line-stream?email=' + userMail.current;

        const sse = new EventSource(url);

        sse.addEventListener("user-list-event", (event) => {
            if(!userMail.current){
                sse.close();
            }
            if(!(event.data === jsData.current)) {
                changeValue(event.data)
            }
        });

        sse.onerror = () => {
            sse.close();
        };

        return () => {
            sse.close();
        };
    }, [token]);

    function changeValue(value){
        if(!(currentUser && value)) return;
        jsData.current = value
        const data = JSON.parse(value)
        dispatch(changeTimeLine(data))
    }

    async function handleChangeStatus(payload) {
        await changeStatus(payload)
            .catch(r => console.log(r))
    }

    return (
        <Menu mode={"horizontal"} style={{ width: '95%', paddingLeft: '10px' }} selectedKeys={[location.pathname]} onSelect={(item) => navigate(item.key)}>
            {menu.map(item => {
                // custom menu
                if(item.value === 'todo') {
                    return (<SubMenu key={item.value} theme={isDarkMode? 'dark' : 'light'} title={item.label} popupClassName={'popup-todo'}>
                                <Menu.Item disabled={item.disabled} key={item.key}>To Do List</Menu.Item>
                                {currentUser &&
                                <Collapse key={'todolist'} defaultActiveKey={['1']} bordered={false}>
                                    <Collapse.Panel
                                        className={`collapse-top-bar ${isDarkMode? 'dark' : 'light'}`}
                                        header={"List To Do Today"}
                                        key="1">
                                        <ToDoTopBar
                                            data={taskToDo}
                                            handleChangeStatus={handleChangeStatus}
                                        />
                                    </Collapse.Panel>
                                </Collapse>
                                }
                            </SubMenu>)
                }

                if (item.children?.length > 0) {
                    return (
                        <SubMenu disabled={item.disabled} theme={isDarkMode? 'dark' : 'light'} key={item.value} title={item.label}>
                            {item.children.map(child => {
                              return (<Menu.Item disabled={child.disabled} key={child.key} >{child.label}</Menu.Item>)
                            })}
                        </SubMenu>
                    )
                }
                  return (
                      <Menu.Item disabled={item.disabled} key={item.key}>
                          {item.label}
                      </Menu.Item>
                  )
            })}
        </Menu>
    );
}
