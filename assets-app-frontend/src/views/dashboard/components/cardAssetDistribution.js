import React, { Component } from "react";
import { Card, Popover, message} from 'antd';
import { InfoCircleOutlined} from '@ant-design/icons';
import { getToken } from "../../../utils/cookies";
import { ListAssets } from "../../../api/assets";

class CardAssetDistribution extends Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
        };
    }
    componentDidMount = () => {
        this.loadData();
    }
    loadData = () => {
        const token = {"token" : getToken()}; 
        this.setState({ loading: true});
        ListAssets(token).then(response => { 
            if ( response.data.code === 0) {
                this.setState({ loading: false });
            } else { message.error(response.data.message)}
        }).catch(error=> {message.error(error.toString());})
    }
    
    render() {
        const { loading } = this.state;
        return (
            <Card className="align-card" title={this.props.title}
                extra={<Popover content={this.props.popContent}> <InfoCircleOutlined/> </Popover> } 
                loading={loading} > 
            </Card>
        );
    }
}

export default CardAssetDistribution; 