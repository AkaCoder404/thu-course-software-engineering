import React, { Component } from "react";
import { Card, Popover, message} from 'antd';
import { getToken } from "../../../utils/cookies";
import { GetUserListApi} from "../../../api/users";
import { InfoCircleOutlined} from '@ant-design/icons';
import Chart from "chart.js";

const labels = ['系统', '资产', '普通', 'IT' ];
const label = '# of Users';

class CardUserDistribution extends Component {
    constructor(){
        super();
        this.state = { loading: false };
    }
    componentDidMount() { this.loadData(); }

    loadData = () => {
        this.setState({loading: true})
        var ctx = 'UserDistributionChart';
        const temp = [0, 0, 0, 0];
        const token = {"token" : getToken()};       
        GetUserListApi(token).then(response =>{
            // success at getting user list
            if (response.data.message === "成功获取用户列表") {
                for(var i = 0; i < response.data.data.length; i = i + 1) {
                    switch(response.data.data[i].group_name) {
                        case "企业系统管理员": { temp[0]=temp[0] + 1; break; }
                        case "企业资产管理员": { temp[1]=temp[1] + 1; break; }
                        case "企业普通员工"  : { temp[2]=temp[2] + 1; break; }
                        default : {temp[3]=temp[3] + 1; }
                    }
                }    
                new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: labels,
                        datasets: [{
                            label: label,
                            data: temp,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)', 
                                'rgba(54, 162, 235, 0.2)', 
                                'rgba(255, 206, 86, 0.2)', 
                                'rgba(75, 192, 192, 0.2)', 
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1
                        }]
                    }
                });
            }
            else { message.error(response.data.message)}
            this.setState({ loading: false });
        }).catch( error => {message.error(error.toString()); });
        this.setState({loading: false})
    }
    render() {
        const { loading} = this.state
        return (
            <Card className="align-card" title={this.props.title}
                extra={<Popover content={this.props.popContent}> <InfoCircleOutlined/> </Popover>} 
                loading={loading}>
                <canvas className="myChart" id="UserDistributionChart" width="250px" height="200px"></canvas>      
            </Card>
        );
    }
}
export default CardUserDistribution;