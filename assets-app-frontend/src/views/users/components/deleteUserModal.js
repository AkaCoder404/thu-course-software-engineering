import React, {Component} from "react";
import { Modal, Form,  Space, Button, message, Alert} from "antd";
import { DeleteUserApi } from "../../../api/users";
import { getToken } from "../../../utils/cookies";

class DeleteUserModal extends Component {
    constructor(props) {
        super();
        this.state = {
            visibility: true,
        };
    }
    hideModalAfterChange = () => {
        const data = {
            "token" : getToken(),
            "unique_id": this.props.id
        };
        DeleteUserApi(data).then(response => {
            if (response.data.code === "0") {
                message.success(response.data.message);
                this.props.onClose();
            }
            else message.error(response.data.message);
        }).catch(error => { message.error(error.toString()); });

    }
    cancelChange = () => { this.props.onCancel(); }

    render() {
        return (
            <Modal className="modal-add-user"
                title = "确认删账号"
                centered
                visible={this.props.visibility}
                footer={false}
                onCancel={this.cancelChange}>
                <Form ref="form" preserve={false} onFinish={this.hideModalAfterChange}>
                    <Form.Item>
                        <Alert message="this can not be undone" type="warning" showIcon />
                    </Form.Item>
                    <Form.Item> <p> 确定把 {this.props.username} 账号删掉?</p> </Form.Item>
                    <div className="model-footer">
                        <Form.Item>
                            <Space>
                                <Button className="button-cancel-add" type="primary" 
                                    onClick={this.cancelChange}> 取消 </Button>
                                <Button className="button-add-department" 
                                    type="danger" htmlType="submit" > 确定 </Button>
                            </Space>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        );
    }
}

export default DeleteUserModal;