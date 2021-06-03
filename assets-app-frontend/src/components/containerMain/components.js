// 建立上下文件关系
const files = require.context("../../views/", true, /\.js$/); 
// 声明组件
const components = [];
files.keys().map(key => {
    if (key.includes("./main/") || key.includes("./login/")) { return false; } 
    const splitFilesNames = key.split(".");
    const path = `/main${splitFilesNames[1].toLowerCase()}`;
    const component = files(key).default;
    const jsonObj = {};
    // path and correlation to component
    jsonObj.path = path;
    jsonObj.component = component;
    components.push(jsonObj);
    return true;
});

export default components;