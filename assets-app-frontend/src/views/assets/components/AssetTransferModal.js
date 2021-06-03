import React, {Component} from "react";
import { Modal, Form, Select, Space, Button, message} from "antd";
import { TransferAssetApi } from "../../../api/assets";
import { getToken } from "../../../utils/cookies";
const { Option } = Select;

class TransferAssetModal extends Component {
    constructor(props) {
        super();
        this.state = {};
    }
    componentDidMount = () => { this.loadData(); };
    loadData = () => {};

    hideModalAfterChange = (value) => {
        const data = { 
            "token": getToken(), 
            "transfer_to_id" : value.recieve_asset_user,
            "data" : [{"asset_id" : this.props.value.key}]
        };
        TransferAssetApi(data).then(response => {
            if(response.data.code === 0) {
                message.success(response.data.message)
                this.props.onClose();
            } else message.error(response.data.message)
        }).catch(error=>{message.error(error.toString());});

    }
    cancelChange = () => {this.props.onCancel(); this.clearForm(); }
    clearForm = () => this.refs.form.resetFields();
    
    render() {
        return (
           <Modal
            title={"转移资产"}
            centered
            visible={this.props.visibility}
            footer={false}
            onCancel={this.cancelChange}>
                <Form ref="form" preserve={false} onFinish={this.hideModalAfterChange}>
                    <Form.Item label="收资产人" name ="recieve_asset_user">  
                        <Select>
                            {this.props.userList.map(user=> (
                                <Option key={user.key}> {user.display_name} </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="model-footer">
                        <Form.Item>
                            <Space>
                                <Button className="button-cancel-add" danger 
                                    onClick={this.cancelChange}> 取消 </Button>
                                <Button className="button-add-department" 
                                    type="primary" htmlType="submit" > 确定 </Button>
                            </Space>
                        </Form.Item>
                    </div>
                </Form>
           </Modal>
        );
    }
}

export default TransferAssetModal;