// reusable code for department tree
import {DepartmentInfoApi, DepartmentAllApi} from "../api/department";
import {message} from "antd"
import {getToken} from "./cookies";

export async function loadTreeDatas() {
    const token = {"token" : getToken()}; 
    const ParentTree = [];
    await DepartmentAllApi(token).then(response => {
        if (response.data.code === 0) {
            for (var i = 0; i < response.data.departments.length; i = i + 1) {
                ParentTree.push(response.data.departments[i]);
            } 
        }
        else {
            if ( response.data.message === "令牌失效，请重新登录") {
                message.error(response.data.message);
                this.props.history.push('');
            }
            else message.error(response.data.message) 
        }
    }).catch(error=>{ message.error(error.toString());});

    // construct tree of all departments that exist
    const BuildTree = [];
    for(let i = 0; i < ParentTree.length; i = i+ 1) {
        token["department_id"] = ParentTree[i].unique_id;
        await DepartmentInfoApi(token).then(response => { 
            const data = response.data.data;
            data["unique_id"] = ParentTree[i].unique_id;
            BuildTree.push(data);
        }).catch(error => { message.error(error.toString());});
    }
  
    // build tree without users 
    const DataTree = [];
    for (let i = 0; i < BuildTree.length; i = i + 1) {
        if (BuildTree[i].parent_id !== null) continue;
        const node = {
            "title": BuildTree[i].display_name,
            "unique_id" : BuildTree[i].unique_id,
            "parent_id" : BuildTree[i].parent_id,
            "location" : BuildTree[i].location,
            "key": "0-"+i,
            "value": "0-"+i,
            // "value":  BuildTree[i].unique_id,
            "staff": BuildTree[i].staff,
            "children" : buildTree(BuildTree, BuildTree[i], BuildTree[i].unique_id, i, 0, "0-"+i+"-")
        }   
        DataTree.push(node);    
    }
    // add users to tree
    const DataTreeFinal = JSON.parse(JSON.stringify(DataTree));
    for (let i = 0; i < DataTreeFinal.length; i = i + 1) { 
        DataTreeFinal[i].children = addUsersToTree(JSON.parse(JSON.stringify(DataTreeFinal[i])), DataTreeFinal[i].key, 0);
    }
    // set final built tree

    const Trees = {
        "departmentOnly" : DataTree,
        "departmentAndUser" : DataTreeFinal
    };
    return Trees;
   
};

function buildTree (tree, data, parent_id, loc, depth, keys) {
    const temp = [];
    if (data.sub_deparments.length === 0) return [];
    else {
        for (let i = 0; i < data.sub_deparments.length; i = i + 1) {
            const node = {
                "title": data.sub_deparments[i].display_name,
                "unique_id" : data.sub_deparments[i].unique_id,
                "key": keys + i,
                "value" :keys + i,
                "parent_id": parent_id
            }
            for (let j = 0; j < tree.length; j = j + 1) {
                if(tree[j].unique_id === data.sub_deparments[i].unique_id) {
                    node["staff"] = tree[j].staff;
                    node["location"] = tree[j].location;
                    node["children"] = buildTree(tree, tree[j], tree[j].unique_id, j, depth + 1, keys + i +"-");
                }
            }
            temp.push(node)
        }
        return temp;
    }
};

function addUsersToTree (data, keys, depth) {
    const temp = [];
    if (data.children.length === 0) {
        for (let j = 0; j < data.staff.length; j = j + 1) {
            const node = {
                "title" : data.staff[j].display_name,
                "unique_id" : data.staff[j].unique_id,
                "key" : keys +  "-" + j,
            }
            temp.push(node);  
        }            
        return temp;
    }
    else {
        for (let i = 0; i < data.children.length; i = i + 1) {
            if (!("staff" in data.children[i])) continue;
            temp.length = 0;
            for (let j = 0; j < data.staff.length; j = j + 1) {
                const node = {
                    "title" : data.staff[j].display_name,
                    "unique_id" : data.staff[j].unique_id,
                    "key" : keys +  "-" + (data.children.length + j)
                }
                temp.push(node);  
            }            
            data.children[i].children = (addUsersToTree(JSON.parse(JSON.stringify(data.children[i])), keys +  "-" + i, depth+1));
        }
        return (temp.concat(data.children));
    }
};

export function traverseTree(data, value, depth) {
    for (let i = 0; i < data.length; i = i + 1) {
        if(String(data[i].key) === String(value)) {
            // (data[i]);
            const info = {
                "unique_id": data[i].unique_id,
                "location" : data[i].location,
                "title" : data[i].title,
                "parent_id": data[i].parent_id,
                "key": data[i].key
            }
            return info;
        }
        else if (data[i].children.length !== 0) {
            const temp = traverseTree(JSON.parse(JSON.stringify(data[i].children)), value)
            if (temp !== undefined) return temp;
        }
    }
}