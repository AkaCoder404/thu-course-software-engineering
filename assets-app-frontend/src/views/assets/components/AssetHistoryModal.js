import React, {Component} from "react";
import {Modal, Table} from "antd";

class AssetHistoryModal extends Component {
    constructor(props) {
        super();
        this.state = {
            columns: [
                { title: "操作分类", dataIndex: "type", key: "type"},
                { title: "操作描述", dataIndex: "description", key: "description"},
            ],
            data: [],
        };
    }
    cancelChange = () => { this.props.onClose(); }
    
    render() {
        const { columns } = this.state;
        return (
            <Modal title={"资产操作历史"}
                footer={false}
                centered
                visible={this.props.visibility}
                onCancel={this.cancelChange}> 
                <Table columns={columns} dataSource={this.props.value}></Table>         
            </Modal>
        )
    }
}

export default AssetHistoryModal;