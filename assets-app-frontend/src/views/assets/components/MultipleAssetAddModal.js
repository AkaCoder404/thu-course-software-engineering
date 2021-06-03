import React, { Component } from 'react';
import {Modal, Form, message, Space, Button} from 'antd';
import { CSVReader } from 'react-papaparse';
import { getToken } from '../../../utils/cookies';
import { AssetsAdd } from "../../../api/assets";
import { DownloadOutlined } from '@ant-design/icons';

class MultipleAssetAddModal extends Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
        };
    }
    componentDidMount = () => { this.loadData(); };
    loadData = () => { };
    onFinish = () => {
        const data = []
            if (this.state.data.length === 0) {
                message.error("CSV不能为空");
                return;
            }
            else if (this.state.data.length === 2) {
                message.error("CSV表为空");
            }
        for (let i = 1; i < this.state.data.length - 1; i = i + 1) {
            data.push({
                "group": "0",
                "under": "",
                "display_name": this.state.data[i].data[0],
                "status": "unused",
                "value_origin": this.state.data[i].data[5],
                "use_year": this.state.data[i].data[4],
                "brand": this.state.data[i].data[2],
                "model": this.state.data[i].data[3],
                "remarks": this.state.data[i].data[6],
                "serial_number": this.state.data[i].data[1]       
        })
        }
        const requestData = {
            "token": getToken(),
            "data": data
        }   
        AssetsAdd(requestData).then(response=>{
            if (response.data.code === 0) {
                message.success(response.data.message);
                this.props.onClose();
            }
            else message.error(response.data.message);
        }).catch(error=>{message.error(error.toString());});
        
    }

    handleOnDrop = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
        this.setState({ data: data})
    };

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    };

    handleOnRemoveFile = (data) => {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
    };

    downloadCSVTemplate = () => { }

    render() {
        return (
            <Modal
                title="一次导入多个资产用CSV"
                centered
                closable
                footer={false}
                visible={this.props.visible}
                onOk={this.onFinish}
                okText="确认"
                cancelText="取消"
                onCancel={this.props.onCancel}
                // footer={false}
                >
                    <Form ref="form" onFinish={this.onFinish}
                        preserve={false}>
                        <Form.Item>
                        <CSVReader
                            onDrop={this.handleOnDrop}
                            onError={this.handleOnError}
                            noDrag
                            addRemoveButton
                            onRemoveFile={this.handleOnRemoveFile}
                            >
                            <span>点击上传</span>
                        </CSVReader>
                        </Form.Item>
                        <div className="model-footer">
                        <Form.Item>
                        <Space>
                            <Button className="button-download" 
                                icon={<DownloadOutlined />}
                                href="https://cloud.tsinghua.edu.cn/f/7e0a15374afc4433bbff/?dl=1"
                                type="link" /*onClick={this.downloadCSVTemplate}*/> 下载模板 </Button>
                            <Button className="button-cancel-add" 
                                danger onClick={this.props.onCancel}> 取消 </Button>
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
export default MultipleAssetAddModal;