import React, {Component, Fragment} from "react";
import { message, Input, Button, Divider, Tree} from "antd";
import { getToken } from "../../utils/cookies";
import { AssetsGroupTree } from "../../api/assets";
import AssetGroupAddModal from "./components/AssetGroupAddModal";
import AssetGroupManipulateModal from "./components/AssetGroupManipulateModal";
const { Search } = Input;

const DataList = [];

class AssetGroup extends Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            addAssetGroupModalVisible: false,
            manipulateAssetGroupModalVisible: false,
            assetId: "",
        }
    }
    componentDidMount = () => { this.loadData(); }
    loadData = () => {
        const data = { "token": getToken() };
        AssetsGroupTree(data).then(request => {
            if (request.data.code === 0) {
                const temp = this.loopAddKey(request.data.data);          
                this.setState({data: temp})
            }
            else message.error(request.data.message);            
        }).catch(error=>{message.error(error.toString());});
    };

    loopAddKey = (datas) => {
        return datas.map(item => {
            if ( item.children ) { return { "title":item.title, "key": item.value,"value": item.value, children: this.loopAddKey(item.children) }; }
            return { "title":item.title, "key": item.value, "value": item.value, };
        })
    }
    
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    // when key is selected
    onSelect = (selectedKeys, info) => {
        this.setState({assetId : selectedKeys});
        this.showManipulateAssetGroupModal();     
    };

    addAssetGroup = () => { this.showAddAssetGroupModal();}

    showAddAssetGroupModal = () => {
        if (this.state.addAssetGroupModalVisible === true) this.loadData();
        this.setState({ addAssetGroupModalVisible: !this.state.addAssetGroupModalVisible});
    }
    closeAddAssetGroupModal = () => {
        this.setState({ addAssetGroupModalVisible: !this.state.addAssetGroupModalVisible});
    }

    showManipulateAssetGroupModal = () =>{
        if (this.state.manipulateAssetGroupModalVisible === true ) this.loadData();
        this.setState({ manipulateAssetGroupModalVisible: !this.state.manipulateAssetGroupModalVisible});
    }
    closeManipulateAssetGroupModal = () => {
        this.setState({ manipulateAssetGroupModalVisible: !this.state.manipulateAssetGroupModalVisible});
    }


    render() {
        const { searchValue, expandedKeys, autoExpandParent, data, assetId} = this.state;
        const { addAssetGroupModalVisible, manipulateAssetGroupModalVisible } = this.state;
        const loop = datas =>
            datas.map(item => {
                const index = item.title.indexOf(searchValue);
                const beforeStr = item.title.substr(0, index);
                const afterStr = item.title.substr(index + searchValue.length);
                const title =
                index > -1 ? (
                    <span>
                    {beforeStr}
                        <span className="site-tree-search-value">{searchValue}</span>
                    {afterStr}
                    </span>
                ) : ( <span>{item.title}</span> );
                if (item.children) { return { title, key: item.key, children: loop(item.children) }; }
                return { title,key: item.key, };
        });
        const generateList = datas => {
            for (let i = 0; i < datas.length; i++) {
                const node = datas[i];
                const { title, key } = node;
                DataList.push({ key, title: title });
                if (node.children) {generateList(node.children);}
            }
        };
        const onChange = (e) => { 
            generateList(data);
            const { value } = e.target;
            const expandedKeys = DataList
                .map(item => {
                    if (item.title.indexOf(value) > -1) {
                        return getParentKey(item.key, data);
                    }
                    return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            
            this.setState({
                expandedKeys: expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
        };
        const getParentKey = (key, tree) => {
            let parentKey;
            for (let i = 0; i < tree.length; i++) {
              const node = tree[i];
              if (node.children) {
                if (node.children.some(item => item.key === key)) {
                  parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                  parentKey = getParentKey(key, node.children);
                }
              }
            }
            return parentKey;
        };
        return (
            <Fragment>
                <Search className="tree-search"  placeholder="Search" onChange={onChange} />
                <Button className="button-add" type="primary" onClick={this.addAssetGroup}>添加分类</Button>
                <Divider></Divider>
                <Tree defaultExpandAll
                    onSelect={this.onSelect} onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    showLine={true}
                    treeData={loop(data)}/>
                <AssetGroupAddModal onClose={this.showAddAssetGroupModal}
                    onCancel={this.closeAddAssetGroupModal}
                    visibility={addAssetGroupModalVisible}
                    value={data}                           
                ></AssetGroupAddModal>
                <AssetGroupManipulateModal onClose={this.showManipulateAssetGroupModal}
                    onCancel={this.closeManipulateAssetGroupModal}
                    visibility={manipulateAssetGroupModalVisible}
                    value={data} 
                    assetId={assetId}           
                ></AssetGroupManipulateModal>
            </Fragment>
        )
    }
}

export default AssetGroup;