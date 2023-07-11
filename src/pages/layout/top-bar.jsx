import {useLocation, useNavigate} from "react-router-dom";
import {Popover, Select} from "antd";
import {useAuth} from "../auth/auth-context";
import {useDispatch} from "react-redux";
import {useLayout} from "../../components/layout-context";
import styled from "@emotion/styled";
import {Box, MenuItem, MenuList, Switch,} from "@mui/material";
import {changeLanguageState, removeTimeline, toggleTheme} from "./store/action";
import {languageList} from "../../locale/language-list";
import i18n from "i18next";
import {successInfo} from "../../common/common";
import MenuTopBar from "./menu-list-top";
import '../../style/topbar.css'
import Avatar from "antd/es/avatar/avatar";

const MaterialUISwitch = styled(Switch)(( ) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('/night.png')`,
                backgroundSize: '25px 25px',
                backgroundColor: '#001e3c',
                borderRadius: '50%'
            },
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#001e3c',
    },

    '& .MuiSwitch-thumb': {
        backgroundColor: '#0661bc',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('/daylight.png')`,
            backgroundSize: '25px 25px',
            backgroundColor: '#eaeef3',
            borderRadius: '50%'
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        borderRadius: 20 / 2,
    },
}));

const TopBarContainer = styled.div`
    height: 42px;
    background-color: #3e79d1;
    margin-bottom: 20px;
    width: 100%;
    .menu-container {
        display: flex;
    }
    
    .ant-menu-horizontal {
        border-bottom: none;
    }
    
    .ant-menu-light{
        background: transparent;
        .ant-menu-horizontal> {
        }
    }
    

`

const AvatarImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 5px;
`

export default function TopBar(){

    const { currentUser, userInfo, logout } = useAuth()
    const { colors, isDarkMode } = useLayout()

    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch()

    async function handleLogOut() {
        await logout()
        navigate('/login')
        dispatch(removeTimeline())
    }

    const content = (<MenuList>
            {currentUser &&
            <MenuItem onClick={handleLogOut}>
                <span style={{fontSize: '14px'}}>Logout</span>
            </MenuItem>
            }
        </MenuList>);

    return (
        <TopBarContainer>
            <Box className={'menu-container'}>
                <AvatarImage
                    src={'/abstract-shape.png'}
                    className={'icon-image'}
                    onClick={() => navigate('/')}
                />
                <MenuTopBar />
                <Box style={{ display: 'flex', marginTop: '5px' }}>
                    <MaterialUISwitch
                        checked={isDarkMode}
                        onClick={() => {
                            dispatch(toggleTheme())
                        }}
                    />
                    <Select
                        options={languageList}
                        style={{ width: '150px', marginRight: '10px' }}
                        defaultValue={i18n.language.substr(0,2)}
                        onChange={(value) => {
                            dispatch(changeLanguageState(value))
                            i18n.changeLanguage(value).then(r => successInfo('CHANGE_LANGUAGE_SUCCESS'))
                        }}
                    />
                    <Popover placement="bottomRight" title={"Menu"} content={content} trigger="click">
                        {currentUser &&
                            <>
                                {(userInfo && userInfo?.photoURL) ?
                                    <AvatarImage src={userInfo?.photoURL} alt={"avatar"} />
                                    :
                                    <Avatar style={{ cursor: 'pointer', marginRight: '5px' }}>
                                        {userInfo?.email?.substr(0,1)?.toUpperCase() || ''}
                                    </Avatar>
                                }
                            </>
                        }
                    </Popover>
                </Box>
            </Box>
        </TopBarContainer>
    );
}
