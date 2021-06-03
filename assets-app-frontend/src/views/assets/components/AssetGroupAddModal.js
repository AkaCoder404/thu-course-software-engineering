import React, {Component} from "react";
import {message, Form, Modal, Input, Button, Space, TreeSelect} from "antd";
import { getToken } from "../../../utils/cookies";
import { ManipulateAssetGroupApi } from "../../../api/assets";

class AssetGroupAddModal extends Component {
    constructor(props) {
        super();
        this.state = { 
            parent_id: null, group_id: null
        };
    }
    componentDidMount = () => {this.loadData(); }
    loadData = () => {}

    hideModalAfterChange = (value) => {
        const data = {
            "token" : getToken(),
            "option" : "add",
            "unique_id": value.asset_parent_id, 
            "new_group_name" : value.asset_group_name,
            "new_group_id" : value.asset_unique_id,
            "new_parent_id" : value.asset_parent_id
        }
        ManipulateAssetGroupApi(data).then(request=> {
            if ( request.data.code === 0) {
                this.props.onClose();
            } else { message.error(request.data.message); }
        }).catch(error=>{message.error(error.toString());});
    }

    onChange = (value) => {
        this.setState({ parent_id: value });
    }
    
    cancelChange = () => { this.props.onCancel(); this.clearForm();}
    clearForm = () => { this.refs.form.resetFields(); }

    render() {
        const {parent_id} = this.state
        return(
            <Modal className="modal-add-asset-group"
            title="添加资产分类"
            centered
            visible={this.props.visibility}
            footer={false}
            onCancel={this.cancelChange}>
                <Form ref="form"
                    onFinish={this.hideModalAfterChange}
                    preserve={false}>
                        <Form.Item label="分类编号" name= "asset_unique_id"
                            rules={[{ required: true, message: '请输分类独特号!'}]}>
                            <Input placeholder="分类独特号"/>
                        </Form.Item>
                         <Form.Item label="分类名称" name= "asset_group_name"
                            rules={[{ required: true, message: '请输入分类名称!'}]}>
                            <Input placeholder="分类名称"/>
                        </Form.Item>
                        <Form.Item label="父分类称" name="asset_parent_id"  style={{paddingLeft:11}}>                   
                            <TreeSelect
                            style={{ width: '100%' }}
                            value={parent_id}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.props.value}
                            placeholder="父部门的编号"
                            treeDefaultExpandAll
                            onChange={this.onChange}>
                            </TreeSelect>
                    </Form.Item>
                    <div className="model-footer">
                    <Form.Item>
                        <Space>
                            <Button className="button-clear-department-form" danger onClick={this.clearForm}> 重置 </Button>
                            <Button className="button-cancel-add" danger onClick={this.cancelChange}> 取消 </Button>
                            <Button className="button-add-department"  type="primary" htmlType="submit" > 确定 </Button>
                        </Space>
                    </Form.Item>
                </div>
                    </Form>
            </Modal>
                
        )
    }
    
    
}

export default AssetGroupAddModal;