import {Button, Col, Form, Row, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {firebase} from "../../firebase";
import {useEffect, useState} from "react";
import {useAuth} from "./auth-context";
import {FacebookFilled, GoogleOutlined} from "@ant-design/icons";
import {ROLES} from "./common-data";
import {addDocument} from "../../common/firebase-common";
import {useLayout} from "../../components/layout-context";
import FormInput from "../../components/form/form-input";
import CustomButton from "../../components/item/custom-button";

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Login() {
    const navigate = useNavigate();

    const { loginByPopup, loginByEmail, currentUser, setReloadUser } = useAuth()
    const { colors, isDarkMode } = useLayout()

    const [error, setError] = useState("")
    const [form] = Form.useForm()

    useEffect(() => {
        if(currentUser) {
            navigate('/')
        }
    },[])

    const handleLogin = async (provider) => {
        try {
            const { additionalUserInfo, user } = await loginByPopup(provider);

            if (additionalUserInfo?.isNewUser) {
                await addDocument('users', {
                    displayName: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    userRoles: [ROLES.USER]
                });
            }
            setReloadUser(prev => !prev)
            navigate('/')
        } catch (e) {
            console.log(e)
        }
    };

    const handleLoginUsingUP = async () => {
        try {
            setError("")
            await loginByEmail(form.getFieldsValue(true).email, form.getFieldsValue(true).password)
            setReloadUser(prev => !prev)
            navigate("/")
        } catch {
            setError("Failed to log in")
        }
    }

    return (
        <div>
            <Row justify='center' style={{ height: 800 }}>
                <Col span={8}>
                    <Typography.Title style={{ textAlign: 'center', color: isDarkMode ? 'white' : 'black' }} level={2}>
                        BEING-PRO
                    </Typography.Title>
                    {error && <p>{error}</p>}
                    <Form
                        layout={"horizontal"}
                        form={form}
                        preserve={true}
                        onFinish={handleLoginUsingUP}
                        style={{ width: '100%' }}
                    >
                        <FormInput
                            label={'Email'}
                            name={"email"}
                            rules={[
                                {
                                    required: true,
                                    message: 'email is required'
                                },
                                {
                                    max: 255,
                                    message: 'email max length is 255 characters'
                                }
                            ]}
                            type={"email"}
                            placeholder={"Email"}
                        />
                        <FormInput
                            label={"Password"}
                            name={"password"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Password is required'
                                },
                                {
                                    max: 255,
                                    message: 'Password max length is 255 characters'
                                }
                            ]}
                            type={"password"}
                            placeholder={"Password"}
                        />
                        <Form.Item style={{ paddingTop: '30px', display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 5 }}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <p>Not having an account? <CustomButton type="text" onClick={() => navigate("/register")}>Sign up</CustomButton></p>
                    <CustomButton
                        style={{ width: '100%', marginBottom: 5 }}
                        onClick={() => handleLogin(googleProvider)}
                        icon={<GoogleOutlined />}
                    >
                        Login using Google
                    </CustomButton>
                    <CustomButton
                        style={{ width: '100%' }}
                        disabled={true}
                        onClick={() => handleLogin(fbProvider)}
                        icon={<FacebookFilled />}
                    >
                        Login using Facebook
                    </CustomButton>
                </Col>
            </Row>
        </div>
    );
}