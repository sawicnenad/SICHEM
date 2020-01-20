import React, { useState } from 'react';
import Logo from '../media/logo_light.png'
import { Form, Input, Icon, Button, Drawer } from 'antd';
import { useTranslation } from 'react-i18next';



const styling = {
    wrapper: {
        height: "100vh",
        minHeight: 700
    },
    formWrapper: {
        width: 350,
        margin: "auto",
        paddingTop: 150
    },
    logo: {
        height: 75,
        textAlign: "center"
    },
    form: {
        marginTop: 15,
        border: "1px solid #40a9ff",
        borderRadius: 5,
        padding: 15
    },
    button: {
        width: "48%",
        margin: "1%"
    },
    footer: {
        position: "fixed",
        bottom: 0,
        padding: 25,
        width: "100%",
        textAlign: "right",
        background: "#f5f5f5"
    },
    lngBtn: {
        fontSize: 20
    },
    drawerButton: {
        width: "100%"
    }
}




function Login(props) {

    const { t } = useTranslation();
    const { getFieldDecorator } = props.form;
    const [ state, setState ] = useState({});


    const handleLogin = () => {
        props.form.validateFields(['login_username', 'login_password'],(err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        })
    }


    const handleSignUp = () => {
        props.form.validateFields(
                [
                    'first_name',
                    'last_name',
                    'email',
                    'username',
                    'password',
                    'password2'
                ], (err, values) => {
            if (!err) {
              
            }
        })
    }
    
    return (
        <div style={styling.wrapper}>

            <div style={styling.formWrapper}>
                <div style={styling.logo}>
                    <img src={Logo} alt="" style={styling.logo}/>
                </div>
                
                {/* login */}
                <Form style={styling.form}>
                    <h2>{t('login.login')}</h2>
                    <br/>
                    <Form.Item>
                        { getFieldDecorator('login_username', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }
                            ]
                        })(
                            <Input 
                                placeholder={t('login.username')}
                                prefix={<Icon type="user" />}
                                size="large"
                            />
                        ) }
                    </Form.Item>
                    <Form.Item>
                        { getFieldDecorator('login_password', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }
                            ]
                        })(
                            <Input
                                placeholder={t('login.password')}
                                type="password"
                                prefix={<Icon type="lock" /> }
                                size="large"
                            />
                        ) }
                    </Form.Item>

                    <Button
                        type="primary"
                        style={styling.button}
                        onClick={handleLogin}
                    >
                        { t('login.login') }
                    </Button>

                    <Button
                        type="danger" 
                        ghost
                        style={styling.button}
                        onClick={() => setState({ visible: true })}
                    >
                        { t('login.new-user') }
                    </Button>
                </Form>
            </div>

            {/* new user */}
            <Drawer
                placement="right"
                visible={state.visible}
                title={t('login.new-user')}
                width={400}
                onClose={() => setState({ visible: false })}
            >
                <Form>
                    <Form.Item label={t('login.first_name')}>
                        { getFieldDecorator('first_name', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }
                            ]
                        })(
                            <Input size="large" />
                        ) }
                    </Form.Item>

                    <Form.Item label={t('login.last_name')}>
                        { getFieldDecorator('last_name', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }
                            ]
                        })(
                            <Input size="large" />
                        ) }
                    </Form.Item>

                    <Form.Item label={t('login.email')}>
                        { getFieldDecorator('email', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                },
                                {
                                    type: "email",
                                    message: t('messages.not-email-format')
                                }
                            ]
                        })(
                            <Input size="large" placeholder={t('login.email-placeholder')} />
                        ) }
                    </Form.Item>

                    <Form.Item label={t('login.username')}>
                        { getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }
                            ]
                        })(
                            <Input size="large" placeholder={t('login.username-placeholder')} />
                        ) }
                    </Form.Item>

                    <Form.Item label={t('login.password')}>
                        { getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }, {
                                    min: 8,
                                    message: t('messages.too-short')
                                }
                            ]
                        })(
                            <Input size="large" />
                        ) }
                    </Form.Item>

                    <Form.Item label={t('login.password-confirm')}>
                        { getFieldDecorator('password2', {
                            rules: [
                                {
                                    required: true,
                                    message: t('messages.field-required')
                                }
                            ]
                        })(
                            <Input size="large" />
                        ) }
                    </Form.Item>

                    <Button
                        type="danger"
                        style={styling.drawerButton}
                        onClick={handleSignUp}
                    >
                        { t('login.register') }
                    </Button>
                </Form>
            </Drawer>

            <footer style={styling.footer}>
                {[
                    'de', 'fr', 'it', 'en'
                ].map( item => (
                    <Button
                        key={item}
                        type="link"
                        style={styling.lngBtn}
                    >{item}</Button>
                ))}
            </footer>
        </div>
    )
}
export default Form.create()( Login );