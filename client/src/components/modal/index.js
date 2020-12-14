import React, {useState} from 'react';
import PropTypes from "prop-types";
import {Form, Input, Modal, Button} from 'antd';

function ModalRequest(props) {
    const { visible, formData, handleVisible, onChange, handleForm} = props;
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('horizontal');
    const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 5 },
          wrapperCol: { span: 14 },
        }
      : null;
    
    return(
        <Modal
          title="Оставить заявку"
          visible={visible}
          footer={[
            <Button onClick={handleForm} type="primary">Отправить</Button>,
            <Button onClick={() => handleVisible(false)}>Отмена</Button>,
          ]}
          onCancel={() => handleVisible(false)}
        >
          <Form
          
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        // onValuesChange={onFormLayoutChange}
      >
       
        <Form.Item label="ФИО">
          <Input onChange={onChange} name="full_name" value={formData.full_name}  placeholder="ФИО" />
        </Form.Item>
        <Form.Item label="Телефон">
          <Input onChange={onChange} name="phone_number" value={formData.phone_number} placeholder="Телефон" />
        </Form.Item>
        <Form.Item label="Email">
          <Input onChange={onChange} name="email" value={formData.email} placeholder="Email" />
        </Form.Item>
        <Form.Item label="Организация">
          <Input onChange={onChange} name="org_title" value={formData.org_title} placeholder="Организация" />
        </Form.Item>
      </Form>
        </Modal>
    )
}

ModalRequest.propTypes = {
    visible: PropTypes.bool,
    setVisible: PropTypes.func
}



export default ModalRequest;