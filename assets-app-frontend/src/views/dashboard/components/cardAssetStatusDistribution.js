import React, { Component } from "react";
import { message, Card, Popover } from 'antd';
import { InfoCircleOutlined} from '@ant-design/icons';
import { loadAllAssets } from "./assetChart";
import Chart from "chart.js"
const labels = [ "未使用", "使用中", "领用待确认" , "已清退","退库待确认", "转移待确认", "维保申请","null"];

class CardAssetStatusDistribution extends Component {
    constructor(props) {
        super();
        this.state = { loading: false }
    }    

    componentDidMount = () => {  this.loadData(); }

    loadData = () => {
        this.setState({ loading : true })
        var ctx = 'AssetStatusChart';
        loadAllAssets().then(result => {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Asset Status Ratio',
                        data: result,
                        backgroundColor:  [
                            'rgba(255, 99, 132, 0.2)', 
                            'rgba(54, 162, 235, 0.2)', 
                            'rgba(255, 206, 86, 0.2)', 
                            'rgba(75, 192, 192, 0.2)', 
                            'rgba(153, 102, 255, 0.2)', 
                            'rgba(255, 159, 64, 0.2)', 
                            'rgba(0, 0, 0, 0.2)', 
                            'rbga(150, 75, 0, 0.2)' 
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rbga(150, 75, 0, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: { legend: { position: "top"} }
            });           
        }).catch(error=>{message.error(error.toString());});       
    }
    render() {      
        return (
            <Card className="align-card" title={this.props.title}
                extra={<Popover content={this.props.popContent}> <InfoCircleOutlined/> </Popover> }> 
                <canvas className="myChart" id="AssetStatusChart" width="250px" height="200px"></canvas>
            </Card>
        )
    }
}
export default CardAssetStatusDistribution;