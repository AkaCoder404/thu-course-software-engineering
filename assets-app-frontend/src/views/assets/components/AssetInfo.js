import React, {Component} from "react";
import { Modal, Descriptions, Button, Typography, Divider} from "antd";
import * as QrCode from 'qrcode.react'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import "./AssetInfo.css";
const { Text,Title } = Typography;

class AssetInfoModal extends Component {
    constructor(props) {
        super();
        this.state = {
            visiblelabel:false,
            componentRef: "",
        };
    }
    componentDidMount = () => {this.loadData(); };
    loadData = () => {};    
    hideModalAfterChange = () => {
        this.props.onClose()
    }
    cancelChange = () => { this.props.onCancel(); }
    // changeCanvasToPic = () => {
    //     let canvasImg = document.getElementsByTagName('canvas')[0];
    //     let image = new Image();
    //     image.src = canvasImg.toDataURL("image/png");
    //     //将canvas格式图片转换成image
    //     let alink = document.createElement("img");
    //     alink.className = 'qrcode';
    //     alink.id ="qr-img";
    //     alink.src = image.src;
    //     alink.download = "ceshi.png";
    //     let qrImg = document.getElementById('qr-img');
    //     if(qrImg){
    //         canvasImg.parentNode.replaceChild(alink,qrCode);
    //     } else{
    //         canvasImg.parentNode.insertBefore(alink,canvasImg);
    //     }
    // }
    render() {
        return (
            <Modal
                title={"资产信息"}
                centered
                visible={this.props.visibility}
                footer={false}
                onCancel={this.cancelChange}
                width={1000}>
                    <Descriptions bordered >
                        <Descriptions.Item label="名称" span={1}>{this.props.value.display_name}</Descriptions.Item>
                        <Descriptions.Item label="分类" span={1}>{this.props.value.group_name}</Descriptions.Item>
                        <Descriptions.Item label="价值" span={1}>{this.props.value.value_worth} </Descriptions.Item>
                        {/*row*/}
                        <Descriptions.Item label="序列号" span={1}>{this.props.value.serial_name}</Descriptions.Item>
                        <Descriptions.Item label="型号" span={1}>{this.props.value.model}</Descriptions.Item>
                        <Descriptions.Item label="品牌" span={1}>{this.props.value.brand}</Descriptions.Item>
                        {/*row*/}
                        <Descriptions.Item label="父属资产" span={1}> {this.props.value.under_name} </Descriptions.Item>
                        <Descriptions.Item label="领用人" span={1}>{this.props.value.belongs_to_name}</Descriptions.Item>
                        <Descriptions.Item label="使用年限" span={1}> {this.props.value.use_year} </Descriptions.Item>
                        {/*row*/}
                        <Descriptions.Item label="备注" span={2}> {this.props.value.remarks} </Descriptions.Item>
                        <Descriptions.Item label="标签" span={1}>
                            <Button onClick={() =>{this.setState({visiblelabel:true})}}>查看</Button>
                        </Descriptions.Item>
                    </Descriptions>

                    <Modal
                        title={"资产标签"}
                        centered
                        visible={this.state.visiblelabel}
                        footer={false}
                        onCancel={()=>{this.setState({visiblelabel:false})}}
                        width={300}
                        >
                            <div  ref={el => (this.componentRef = el)}>
                            <div className="row">
                                <div className="column">   
                                    <QrCode value={this.props.id} size={80} id="qrCode"/> 
                                </div>
                                <div className="column">
                                    <Title level={5}>{this.props.value.display_name}</Title>
                                    <Text type="secondary">{this.props.value.model}</Text>
                                    <br/>
                                    {this.props.value.belongs_to_name}
                                </div>
                            </div> 
                            </div>
                            <Divider></Divider>
                            <ReactToPrint content={() => this.componentRef}
                                copyStyles pageStyle={{"margin": '100mm'}}>
                            <PrintContextConsumer>
                                {({ handlePrint }) => (
                                    <Button onClick={handlePrint} type="primary" 
                                    style={{"float": "right"}}
                                    > 打印 </Button>
                                )}
                            </PrintContextConsumer>
                            <br></br>
                        </ReactToPrint>
                    </Modal>

                
            </Modal>
        ) ;
    }
}

export default AssetInfoModal;

