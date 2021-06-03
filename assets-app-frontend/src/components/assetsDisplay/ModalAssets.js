import React from 'react';
import "./ModalAssets.scss";
import { Row, Col, Divider, Modal, Typography } from "antd";

const { Text } = Typography;

class ModalAssets extends React.Component
{
    constructor( )
    {
        super( );
        this.state = {};
    }
    // 全视图
    fullViewDisplay()
    {
        alert("功能暂未完善");
    }
    render()
    {
        return(
            <Modal
                // TODO:题目不完整，缺少资产编号的显示
                title={this.props.name}
                centered
                destroyOnClose="true"
                visible={this.props.visible}
                closable={false}
                onOk={this.fullViewDisplay}
                okText="全视图"
                onCancel={this.props.closeModal}
                cancelText="关闭"
                width={1000}
            >
            <div id="modalText">
                <Row justify="space-around" align="middle" gutter={[16, 16]}>
                    <Col span={8}><Text strong>品牌：</Text>{this.props.brand}</Col>
                    <Col span={8}><Text strong>型号：</Text>{this.props.model}</Col>
                    <Col span={8}><Text strong>序列号：</Text>{this.props.serial_number}</Col>

                    <Col span={6}><Text strong>分类：</Text>{this.props.group_name}</Col>
                    <Col span={6}><Text strong>状态：</Text>{this.props.status_name}</Col>
                    <Col span={6}><Text strong>位置：</Text>1号办公室</Col>
                    <Col span={6}><Text strong>业务：</Text>华为云服务</Col>

                    <Col span={8}><Text strong>挂账人：</Text>{this.props.belongs_to_name}</Col>
                    <Col span={8}><Text strong>挂账部门：</Text>{this.props.belongs_department_name}</Col>
                    <Col span={8}><Text strong>领用人：</Text>{this.props.applicant_name}</Col>

                    <Col span={8}><Text strong>原值：</Text>{this.props.value_origin}</Col>
                    <Col span={8}><Text strong>净值：</Text>{this.props.value_worth}</Col>
                    <Col span={8}><Text strong>使用期限：</Text>{this.props.use_year}</Col>
                </Row>
                <Divider orientation="left"><Text strong>资产备注</Text></Divider>
                <Row justify="space-around" align="top">
                    <Col span={20}>{this.props.remarks}</Col>
                </Row>
            </div>

            </Modal>
        );
    }
}
export default ModalAssets;