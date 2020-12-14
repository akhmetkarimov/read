import React from "react";
import './signin.scss';
import * as authActions from '../../actions/authActions';
import Footer from "../../components/footer";
import Header from "../../components/header";
import { Input, Form, Button, Checkbox } from 'antd';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

function Signin(props) {
    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      };
      const tailLayout = {
        wrapperCol: {
          offset: 8,
          span: 16,
        },
      };
    const onFinish = values => {
        props.authActions.signIn(values, props.history);
      };
    
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

    return(
        <div className="signin">
            <Header/>
            <div className="container">
                <div className="signin-inner">
                    <div className="signin-form--inner">
                        <div className="logo">
                            <img alt="logo" src={'/assets/logo-signin.png'}/>
                        </div>
                        <h4 className="login-title large-roboto-text">Войти</h4>
                        <Form
                            {...layout}
                            name="basic"
                            initialValues={{
                                student: false,
                                teacher: false,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            >
                            <Form.Item
                                label="Логин"
                                name="username"
                                rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, введите свой логин!',
                                },
                                ]}
                            >
                                {/* <label className="label-text normal-roboto-text">Логин</label> */}
                                <Input className="username-input"/>
                            </Form.Item>
                            <Form.Item 
                                label="Пароль"
                                name="password"
                                rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, введите пароль!',
                                },
                                ]}
                            >   
                                 {/* <label className="label-text normal-roboto-text">Пароль</label> */}
                                <Input.Password  className="password-input"/>
                            </Form.Item>
                            <Form.Item style={{marginBottom: '0px'}} name="student" valuePropName="checked">
                                <Checkbox>Студент КазНУ</Checkbox>
                            </Form.Item>
                            <Form.Item style={{marginBottom: '12px'}} name="teacher" valuePropName="checked">
                                <Checkbox>Преподаватель КазНУ</Checkbox>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button className="medium-regular-text" type="primary" htmlType="submit">
                                Войти
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

Signin.propTypes = {
    isLoading: PropTypes.bool,    
};
const mapStateToProps = state => ({
    error: state.auth.error,
    isLoading: state.auth.isLoading,
});
const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Signin));