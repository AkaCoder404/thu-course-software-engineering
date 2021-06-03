import React, { Component } from "react";
import { Modal, Form, Input, Select, Space, Button, TreeSelect, message} from "antd";
import { getToken} from "../../../utils/cookies";
import { ManipulateAssetGroupApi} from "../../../api/assets";
const {Option} = Select;

class ManipulateAssetGroupModal extends Component {
    constructor(props) {
        super();
        this.state = {
            parent_id: null,
        };
    }
    hideModalAfterChange = (value) => {
        const data = {
            "token" : getToken(),
            "unique_id" : this.props.assetId[0]
        }
        if( value.asset_operation === "change_name") {
            data["option"] = "change_name";
            data["new_group_name"] = value.asset_group_name
        }
        if (value.asset_operation === "change_parent") {
            data["option"] = "change_parent";
            data["new_parent_id"] = value.asset_parent_id
        }
        if (value.asset_operation === "delete") {
            data["option"] = "delete";
        }
        ManipulateAssetGroupApi(data).then(request => {
            if (request.data.code === 0) {
                message.success(request.data.message);
                this.props.onClose();
            }
            else message.error(request.data.message);
        }).catch(error => {message.error(error.toString());});
    } 
    cancelChange = () => { this.props.onCancel(); this.clearForm();}
    clearForm = () => {this.refs.form.resetFields(); }

    render() {
        const {parent_id} = this.state;
        return (
            <Modal className="modal-manipulate-asset-group"
            title="修改资产分类"
            centered
            visible={this.props.visibility}
            footer={false}
            onCancel={this.cancelChange}>
                <Form ref="form" onFinish={this.hideModalAfterChange}
                preserve={false}>
                    <Form.Item label="选择操作" name="asset_operation"
                        rules={[{ required: true, message: '选择操作!'}]}>
                        <Select
                            showSearch
                            placeholder="选一个操作"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {/* <Option value="query">query</Option> */}
                            <Option value="delete"> 删除 </Option>
                            <Option value="change_name"> 改名  </Option>
                            <Option value="change_parent"> 改父类 </Option> 
                        </Select>
                    </Form.Item>
                    <Form.Item label="分类名称" name= "asset_group_name" style={{paddingLeft:11}}>
                        <Input placeholder="分类名称"/>
                    </Form.Item>
                    <Form.Item label="父分类称" name="asset_parent_id"  style={{paddingLeft:11}}>                   
                        <TreeSelect
                            style={{ width: '100%' }}
                            value={parent_id}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.props.value}
                            placeholder="父部门的编号"
                            treeDefaultExpandAll>
                        </TreeSelect>
                    </Form.Item>
                    <div className="model-footer">
                    <Form.Item>
                        <Space>
                            <Button className="button-clear-department-form" 
                                danger  onClick={this.clearForm}> 重置 </Button>
                            <Button className="button-cancel-add" 
                                danger onClick={this.cancelChange}> 取消 </Button>
                            <Button className="button-add-department"  
                                type="primary" htmlType="submit" > 确定 </Button>
                        </Space>
                    </Form.Item>
                    </div>
                </Form>
            </Modal>
        )
    }
}   
export default ManipulateAssetGroupModal;