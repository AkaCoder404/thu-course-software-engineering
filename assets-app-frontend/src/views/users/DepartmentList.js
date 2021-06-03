import React, { Fragment, Component } from "react";
import { Tree, Input, Divider, Button, message} from 'antd';
import AddDepartmentModal from "./components/addDepartmentModal";
import ManipulateDepartmentModal from "./components/manipulateDepModal";
import {  loadTreeDatas, traverseTree } from "../../utils/departments"
import "./index.scss";

const { Search } = Input;

const DataList = [];

class DepartmentList extends Component {
    constructor(props){
        super();
        this.state = {
            data: [],
            department_id: null,
            department_location: null, 
            department_name: null,
            department_parent_id: null,
            departments: [],
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            addDepartmentModalVisible: false,
            manipulateDepartmentModalVisible: false,
        };
    }
    // when key is selected
    onSelect = (selectedKeys, info) => {
        const temp = traverseTree(this.state.departments, selectedKeys, 0);
        if (temp !== undefined ) {
            this.setState ({ 
                department_id : temp["unique_id"],
                department_location: temp["location"],
                department_name: temp["title"],
                department_parent_id: temp["parent_id"]
            })
            this.showManipulateDepartmentModal();
        }        
    };
    // expand selected keys
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    // when component is realized
    componentDidMount = () => { 
       this.loadData();
    };    
    loadData = () => {
        loadTreeDatas().then(result => {
            this.setState({ data: result["departmentAndUser"], departments: result["departmentOnly"] });
            message.success("查询部门成功")
        })
        
    }
  
    // control add department modal
    showAddDepartmentModal = () => {
        if (this.state.addDepartmentModalVisible === true) this.loadData();
        this.setState({ addDepartmentModalVisible: !this.state.addDepartmentModalVisible });
    };
    closeAddDepartmentModal = () => {
        this.setState({ addDepartmentModalVisible: !this.state.addDepartmentModalVisible });
    };
    // control manipulate department modal 
    showManipulateDepartmentModal = () =>{
        if (this.state.manipulateDepartmentModalVisible === true) this.loadData();
        this.setState({ manipulateDepartmentModalVisible: !this.state.manipulateDepartmentModalVisible});
    }
    closeManipulateDepartmentModal = () => {
        this.setState({ manipulateDepartmentModalVisible: !this.state.manipulateDepartmentModalVisible});
    }
    render(){
        const { searchValue, expandedKeys, autoExpandParent, data, department_id} = this.state;
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
        const { addDepartmentModalVisible, manipulateDepartmentModalVisible, 
            departments, department_location, department_name, department_parent_id} = this.state;

        return (
            <Fragment>
                <Search className="tree-search"  placeholder="Search" onChange={onChange} />
                <Button className="button-add" type="primary" onClick={this.showAddDepartmentModal}> 加部门 </Button>
                <Divider></Divider>
                <Tree
                    defaultExpandAll={true}
                    onSelect={this.onSelect}
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    showLine={true}
                    treeData={loop(data)}        
                />
                <ManipulateDepartmentModal onClose={this.showManipulateDepartmentModal}
                    onCancel={this.closeManipulateDepartmentModal}
                    visibility={manipulateDepartmentModalVisible}
                    value={departments}
                    departmentId={department_id}
                    departmentLoc={department_location}
                    departmentName={department_name}
                    departmentParentId={department_parent_id}>
                    </ManipulateDepartmentModal>
                <AddDepartmentModal onClose={this.showAddDepartmentModal} 
                    onCancel={this.closeAddDepartmentModal} 
                    visibility={addDepartmentModalVisible} 
                    value={departments}> 
                    </AddDepartmentModal>
           </Fragment>
        );
    }
}
export default DepartmentList;