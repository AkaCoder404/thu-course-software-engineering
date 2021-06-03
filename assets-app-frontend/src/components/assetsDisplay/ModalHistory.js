import React from 'react';
// Style
import "./ModalAssets.scss";
// Antd
import { Row, Col, Divider, Modal, Typography } from "antd";

const { Text } = Typography;

class ModalHistory extends React.Component
{
    constructor( )
    {
        super( );
        this.state = {
            
        };
    }
    render()
    {
        return(
            <Modal
                // TODO:题目不完整，缺少资产编号的显示
                //title={this.props.name}
                centered
                destroyOnClose="true"
                visible={this.props.visible}
                closable={false}
                onOk={this.props.closeModal}
                okText="确认"
                onCancel={this.props.closeModal}
                cancelText="关闭"
                width={1000}
            >

            <div id="modalText">
                
                <Divider orientation="left"><Text strong>记录详情</Text></Divider>
                <Row justify="space-around" align="top">
                    <Col span={20}>{this.props.description}</Col>
                </Row>
            </div>

            </Modal>
        );
    }
}

export default ModalHistory;