import React from 'react';
import { TreeSelect, Row, Col, Modal, Form, Input, message } from "antd";
import {AssetsAdd, AssetsGroupTree, AssetsLittleList } from "../../../api/assets";
import { getToken } from "../../../utils/cookies";

class ModalAssetsAdd extends React.Component 
{
    formRef = React.createRef();
    constructor( )
    {
        super( );
        this.state = {
            GroupTreeData:[],
            AssetsListData:[],
            under:"",
            remarks:""
        };
    }
    getAssetsTree = () =>
    {
        const requestData = {
            token : getToken(),
        }
        AssetsGroupTree(requestData).then(response => {
            if(response.data.code === 0) {
                this.setState({ GroupTreeData:response.data.data});
            }
            else message.error(response.data.message);
        }).catch(error => {
                // message.erorr(error.toString());
                // TODO:网络错误处理
        });
        AssetsLittleList(requestData).then(response => {
            if(response.data.code === 0){
                this.setState({
                    AssetsListData:response.data.data
                })
            }
            else message.error(response.data.message);
        }).catch(error => {
            // message.error(error.toString());
            // TODO:网络错误处理
        });
    }

    onFinish = () => {
        // alert(this.formRef.current.getFieldValue('brand'))
        this.formRef.current.validateFields().then(values => 
        {
            this.onSubmit(values);
        }).catch(errorInfo => {
            message.error(errorInfo.toString()); });
    };
    onSubmit = (value) => {
        if (value.under_name != null)
            this.setState({under:value.under_name})
        if (value.remarks != null)
            this.setState({remarks:value.remarks})
        const requestData =
        {
            token : getToken(),
            data :
            [{
                group: value.group_name,
                under: this.state.under,
                display_name: value.displayName,
                status:"unused",
                value_origin: value.value_origin,
                use_year: value.use_year,
                brand: value.brand,
                model: value.model,
                remarks: this.state.remarks,
                serial_number: value.serial_number
            }]
        }
        AssetsAdd(requestData).then(response =>  {
            if( response.data.code === 0 ) {
                message.success(response.data.message);
            }
            else message.error(response.data.message);
        }).catch(error => {
            message.error(error.toString());
            // TODO:网络错误处理
        })
        this.props.closeModal();
    }
    componentDidMount() {
        this.getAssetsTree();
    }
    render()
    {
        return( 
            <Modal
                title={this.props.name}
                centered
                destroyOnClose={true}
                visible={this.props.visible}
                closable={false}
                onOk={this.onFinish}
                okText="确认"
                onCancel={this.props.closeModal}
                cancelText="取消"
                width={800}
            >
                <Form 
                    ref={this.formRef}
                    name="AssetsEditForm"
                    onFinish={this.onSubmit}
                >
                    <Row justify="space-around" align="middle">
                    <Col span={10}>
                        <Form.Item
                            name="displayName"
                            label="名称"
                            rules={[{ 
                                required: true, 
                                message: "请输入正确的资产名称！" ,
                                initialValue:this.props.displayName
                            }]}
                        >
                            <Input placeholder="标准资产名称"/>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                        name="group_name"
                        label="分类"
                        rules={[{ required: true, message: "请输入正确的资产类别！" }]}
                        >
                            <TreeSelect
                                showSearch
                                treeNodeFilterProp='title'
                                style={{ width: '100%' }}
                                dropdownStyle={{ 
                                    maxHeight: 400, 
                                    overflow: 'auto' 
                                }}
                                treeData={this.state.GroupTreeData}
                                // treeData={treeData}
                                placeholder="标准资产类别"
                                treeDefaultExpandAll
                                onChange={this.onChange}
                            >
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row justify="space-around" align="middle">
                    <Col span={8}>
                        <Form.Item
                        name="serial_number"
                        label="序列号"
                        rules={[{ required: true, message: "请输入正确的资产序列号！" }]}
                        >
                            <Input placeholder="序列号常为SN开头"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                        name="brand"
                        label="品牌"
                        rules={[{ required: true, message: "请输入正确的品牌！" }]}
                        >
                            <Input placeholder="品牌名称"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        name="model"
                        label="型号"
                        rules={[{ required: true, message: "请输入正确的资产型号！"}]}
                        >
                            <Input placeholder="具体型号"/>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row justify="space-around" align="middle">
                    <Col span={8}>
                        <Form.Item
                        name="under_name"
                        label="父属资产"
                        >
                            <TreeSelect
                                showSearch
                                treeNodeFilterProp='title'
                                style={{ width: '100%' }}
                                dropdownStyle={{ 
                                    maxHeight: 400, 
                                    overflow: 'auto' 
                                }}
                                treeData={this.state.AssetsListData}
                                placeholder="主从关系资产"
                                treeDefaultExpandAll
                                onChange={this.onChange}
                            >
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                        name="use_year"
                        label="使用年限"
                        rules={[{ 
                            required: true, 
                            message: "请输入资产使用年限！" 
                        }]}
                        >
                            <Input placeholder="单位 (年)"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                        name="value_origin"
                        label="价值"
                        rules={[{ 
                            required: true, 
                            message: "请输入正确的资产价值！" 
                        }]}
                        >
                            <Input placeholder="统一换算为人民币"/>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row justify="space-around" align="middle">
                    <Col span={18}>
                        <Form.Item
                        name="remarks" 
                        label="备注"
                        >
                            <Input placeholder="资产备注信息" />
                        </Form.Item>
                    </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default ModalAssetsAdd;