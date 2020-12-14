import React from 'react';
import Header from "../../components/header";
import Footer from "../../components/footer";
import * as userActions from "../../actions/userActions";
import Avatar from 'react-avatar';
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { Form, Input, Button, Spin } from 'antd';
import "./profile.scss";

function Profile(props) {
    const { user, isLoading } = props;
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
        const password = {
            new_password: values.newPassword,
            old_password: values.oldPassword
        }
        props.userActions.changePassword(password);
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Spin spinning={isLoading} className="profile">
            <Header/>
            <div className="container-book">
           
                <div className="profile-inner">
                <h2 className="medium-roboto-text">Профиль</h2>
                    <div className="profile-main">
                        <div className="avatar">
                            <Avatar round={true} size="100" name={`${user?.first_name} ${user?.last_name}`} color="#E7411B"/> 
                        </div>
                        <div className="profile-info">
                            <h4 className="large-roboto-normal-text">{`${user?.first_name} ${user?.last_name}`}</h4>
                            <span className="medium-roboto-normal-text">{`${user?.email}`}</span>
                        </div>
                    </div>                  
                    <div className="profile-content">  
                        <Form
                            {...layout}
                            name="profile"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            >
                            <Form.Item 
                                label="Текущий пароль"
                                name="oldPassword"
                                rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, введите текущий пароль!',
                                },
                                ]}
                            >   
                                {/* <label className="label-text normal-roboto-text">Пароль</label> */}
                                <Input.Password  className="password-input"/>
                            </Form.Item>
                            <Form.Item 
                                label="Новый пароль"
                                name="newPassword"
                                rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, введите новый пароль!',
                                },
                                ]}
                            >   
                                {/* <label className="label-text normal-roboto-text">Пароль</label> */}
                                <Input.Password  className="password-input"/>
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="Подтвердите новый пароль"
                                dependencies={['newPassword']}
                                hasFeedback
                                rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста, подтвердите пароль!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Пароли не совпадают!');
                                    },
                                }),
                                ]}
                            >
                                <Input.Password className="password-input"/>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button className="medium-regular-text"  htmlType="submit">
                                Сохранить
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>  
                </div>
            </div>
            <Footer/>
        </Spin>
    );
}
Profile.propTypes = {
    isLoading: PropTypes.bool,    
    user: PropTypes.object
};
const mapStateToProps = state => ({
    error: state.user.error,
    isLoading: state.user.isLoading,
    user: state.user.user
});
const mapDispatchToProps = dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)  
});
export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Profile));