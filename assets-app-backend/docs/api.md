# 企业资产管理平台接口文档

[TOC]



## 用户登录

#### URL

​	/api/login/

#### Request method

​	POST

#### Request body

```json
{
    "username": “myusername”,
    "password": “mypassword”
}
```

| 字段     | 含义     |
| -------- | -------- |
| username | 用户名   |
| password | 登录密码 |

#### Response data

```json
{
    "code": 0,
    "message": "Login successful",
    "token": "1601986589NzZFhLIA"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-4~0，0: 登录成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: 因帐号密码错误造成的登录失败 |
| message | 返回信息                                                     |
| token   | 仅在返回值为0时有该字段，后续操作用token进行身份验证         |

## 用户信息

#### URL

​	/api/staff_info/

#### Request method

​	POST

#### Request params

```json
{
    "token": "1601986589NzZFhLIA"
}
```

| 字段  | 含义 |
| ----- | ---- |
| token | 同上 |

#### Response data

```json
{
    "code": 0,
    "message": "Get user info success",
    "user": {
        "display_name": "测试员工",
        "department": "测试部门",
        "locked": false,
        "group": "企业普通员工",
        "username": "myusername"
    }
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-4~0，0: 获取成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: 无效token |
| message | 返回信息                                                     |
| token   | 用户的姓名，部门，分组，登录名，锁定状态                     |

## 创建用户

#### URL

 /api/user_manage/create_new_staff/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1601986589NzZFhLIA",
    "group" : "generalstaff",
    "department" : "sampledepartment",
    "display_name" : "测试员工",
    "username" : "测试员工",
    "password" : "1234"
}
```

| 字段       | 含义                                                         |
| ---------- | ------------------------------------------------------------ |
| token      | 口令,会检查此口令是否拥有系统管理员权限                      |
| group      | 用户角色,只能是generalstaff,assetadmin,systemadmin和itadmin中的一个 |
| department | 部门的unique_id                                              |
| username   | 用户名                                                       |
| password   | 登录密码                                                     |



#### Response data

```json
{
 "code": "0",
 "message": "创建用户成功!"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 创建用户成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有创建用户的权限； |
| message | 返回信息                                                     |



## 删除用户

#### URL

 /api/user_manage/delete_staff/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1601986589NzZFhLIA",
    "unique_id" : "1602554050TBuCGtE"
}
```

| 字段      | 含义                                    |
| --------- | --------------------------------------- |
| token     | 口令,会检查此口令是否拥有系统管理员权限 |
| unique_id | 要删除员工的unque_id                    |

#### Response data

```json
{
 "code": "0",
 "message": "成功删除"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 删除用户成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有删除用户的权限； |
| message | 返回信息                                                     |



## 重置密码

#### URL

 /api/user_manage/change_staff_password/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1601986589NzZFhLIA",
    "unique_id" : "1602514534djDKboCE",
    "new_password" : "5678"
}
```

| 字段         | 含义                                    |
| ------------ | --------------------------------------- |
| token        | 口令,会检查此口令是否拥有系统管理员权限 |
| unique_id    | 要更改密码员工的unque_id                |
| new_password | 新密码                                  |

#### Response data

```json
{
 "code": "0",
 "message": "重置密码成功"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 重置用户密码成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有重置用户密码的权限； |
| message | 返回信息                                                     |



## 解锁/锁定用户

#### URL

 /api/user_manage/locked_staff/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1601986589NzZFhLIA",
    "unique_id" : "1602514534djDKboCE",
    "locked" : "lock"
}
```

| 字段      | 含义                                        |
| --------- | ------------------------------------------- |
| token     | 口令,会检查此口令是否拥有系统管理员权限     |
| unique_id | 要锁定/解锁员工的unque_id                   |
| locked    | lock表示要锁定此员工;unlock表示要解锁此员工 |

#### Response data

```json
{
 "code": "0",
 "message": "成功锁定/解锁"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 重置用户密码成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有锁定/解锁用户的权限； |
| message | 返回信息                                                     |



## 设置用户角色

#### URL

 /api/user_manage/set_character/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1601986589NzZFhLIA",
    "unique_id" : "1602554682pJpNnlfJ",
    "group" : "generalstaff"
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否拥有系统管理员权限                      |
| unique_id | 要锁定/解锁员工的unque_id                                    |
| group     | 用户角色,只能是generalstaff,assetadmin,systemadmin和itadmin中的一个 |

#### Response data

```json
{
 "code": "0",
 "message": "设置成功"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 设置用户角色成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token设置用户角色的权限； |
| message | 返回信息                                                     |



## 获取所有用户列表

#### URL

 /api/staff_list/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1602699261ImUeOsdY"
}
```

| 字段  | 含义                              |
| ----- | --------------------------------- |
| token | 口令,会检查此口令是否属于某个员工 |

#### Response data

```json
{
 "code": "0",
 "message": "成功",
 "data": [
        {
            "unique_id": "lwk4j5lk234",
            "group_id": "assetadmin",
            "group_name": "企业资产管理员",
            "department_id": "sampledepartment",
            "department_name": "测试部门",
            "display_name": "测试员工 资产",
            "username": "asdf",
            "locked": false
        },
        {
            "unique_id": "29384uieweretr",
            "group_id": "systemadmin",
            "group_name": "企业系统管理员",
            "department_id": "sampledepartment",
            "department_name": "测试部门",
            "display_name": "测试员工 系统",
            "username": "sdfg",
            "locked": false
        }
 ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: 沒有获取用户列表权限； |
| message | 返回信息                                                     |
| data | 数组                                                     |
| --unique_id |     员工unique_id                                                 |
| --group_id |     员工类别unique_id                                                 |
| --group_name |     员工类别名                                                |
| --department_id |      员工部门unique_id                                                |
| --department_name |    员工部门名称                                                  |
| --display_name |   员工名                                                   |
| --username |   员工登录账号名                                                   |
| --locked |  员工是否被锁定                                                    |



## 获取所有用户列表(只返回unique_id和员工名)

#### URL

 /api/staff_list_title_value/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1602699261ImUeOsdY"
}
```

| 字段  | 含义                              |
| ----- | --------------------------------- |
| token | 口令,会检查此口令是否属于某个员工 |

#### Response data

```json
{
    "code": 0,
    "message": "成功获取用户列表",
    "data": [
        {
            "title": "测试员工",
            "value": "samplestaff"
        },
        {
            "title": "测试员工 资产",
            "value": "lwk4j5lk234"
        },
        {
            "title": "测试员工 系统",
            "value": "29384uieweretr"
        },
        {
            "title": "测试员工3",
            "value": "1603162639kQsLBBHw"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: 沒有获取用户列表权限； |
| message | 返回信息                                                     |
| data    | 数组                                                         |
| --value | 员工unique_id                                                |
| --title | 员工名                                                       |

## 获取所有资产列表

#### URL

 /api/asset_list/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1602698551yFtMcbuA",
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否拥有"资产管理员"权限                      |

#### Response data

```json
{
    "code": 0,
    "message": "成功获取资产列表",
    "data": [
        {
            "unique_id": "34k5jfkwertfwer",
            "group_id": "sampleassetgroup1",
            "group_name": "test_asset_group",
            "under_id": null,
            "under_name": null,
            "display_name": "test_asset",
            "belongs_to_id": null,
            "belongs_to_name": null,
            "date": "2020-10-20",
            "value_origin": 1,
            "status_id": null,
            "status_name": null,
            "remarks": "无"
        },
        {
            "unique_id": "1603191152ZrfbUKEi",
            "group_id": "sampleassetgroup1",
            "group_name": "test_asset_group",
            "under_id": "34k5jfkwertfwer",
            "under_name": "test_asset",
            "display_name": "test_asset1",
            "belongs_to_id": "lwk4j5lk234",
            "belongs_to_name": "测试员工 资产",
            "date": "2020-10-20",
            "value_origin": 100,
            "status_id": "unused",
            "status_name": "未使用",
            "remarks": "Write something"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: 沒有获取资产列表权限； |
| message | 返回信息                                                     |
| data |     数组                                                 |
| --unique_id |     资产unique_id                                                 |
| --group_id |     资产类别unique_id                                                 |
| --group_name |     资产类别名称                                                 |
| --under_id |      父资产unique_id                                                |
| --under_name |    父资产名称                                                  |
| --display_name |   资产名称                                                   |
| --belongs_to_id |   属于的员工的unique_id                                                   |
| --belongs_to_name |  属于的员工的姓名                                                    |
| --date | 入库日期                                                     |
| --value_origin | 资产初始价值                                                    |
| --status_id |   资产状态（unique_id）                                                   |
| --status_name |  资产状态（中文名显示）                                                    |
| --remarks |   资产备注                                                   |



## 获取所有资产列表(只返回unique_id和资产名)

#### URL

 /api/asset_list_title_value/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1602698551yFtMcbuA",
}
```

| 字段  | 含义                              |
| ----- | --------------------------------- |
| token | 口令,会检查此口令是否属于某个员工 |

#### Response data

```json
{
    "code": 0,
    "message": "成功获取资产列表",
    "data": [
        {
            "title": "test_asset",
            "value": "34k5jfkwertfwer"
        },
        {
            "title": "test_asset1",
            "value": "1603786083cjxyxHTB"
        },
        {
            "title": "test_asset2",
            "value": "1603786083EzlAqBbc"
        },
        {
            "title": "test_asset3",
            "value": "1603786083MWxAHSEX"
        },
        {
            "title": "测试资产 转移中",
            "value": "test_asset_transfering"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: 沒有获取资产列表权限； |
| message | 返回信息                                                     |
| data    | 数组                                                         |
| --value | 资产unique_id                                                |
| --title | 资产名                                                       |

## 一次录入多个资产

#### URL

 /api/add_assets/

#### Request method

 POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "data":[
        {
        "group":"sampleassetgroup1",
        "under":"34k5jfkwertfwer",
        "display_name":"test_asset1",
        "status":"unused",
        "value_origin":"100",
        "use_year":"3",
        "brand":"苹果",
        "model":"Macbook air",
        "remarks":"Write something",
        "serial_number":"123456"
        },
        {
        "group":"sampleassetgroup1",
        "under":"34k5jfkwertfwer",
        "display_name":"test_asset2",
        "status":"unused",
        "value_origin":"100",
        "use_year":"3",
        "brand":"Unknown",
        "model":"Unknown",
        "remarks":"Write something",
        "serial_number":"Unknown"
        },
        {
        "group":"sampleassetgroup1",
        "under":"34k5jfkwertfwer",
        "display_name":"test_asset3",
        "status":"unused",
        "value_origin":"100",
        "use_year":"3",
        "brand":"Unknown",
        "model":"Unknown",
        "remarks":"Unknown",
        "serial_number":"Unknown"
        }
    ]
}

```

| 字段          | 含义                                                      |
| ------------- | --------------------------------------------------------- |
| token         | 口令,会检查此口令是否拥有"资产管理员"权限                 |
| data          | jsonarray                                                 |
| group         | 应为AssetGroup中的unique_id,新录入资产的类别              |
| under         | 新录入资产所从属的资产                                    |
| display_name  | 资产名                                                    |
| status        | 资产狀态,要求是unused,inuse,tobeconfirmed,deleted中的一个 |
| value_origin  | 资产原值                                                  |
| value_worth   | 资产凈值                                                  |
| belongs_to    | 会把新录入的资产挂账录入它的资产管理员名下                |
| use_year      | 使用年限                                                  |
| brand         | 品牌                                                      |
| model         | 型号                                                      |
| remarks       | 备注                                                      |
| serial_number | 序列号                                                    |

#### Response data

```json
{
 "code": "0",
 "message": "成功",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: 沒有录入资产列表权限； |
| message | 返回信息                                                     |



## 操作资产分类树

#### URL

 /api/asset_group_tree/

#### Request method

 POST

#### Request body

```json
{
	"token":"1602698551yFtMcbuA",
	"option":"query",
	"unique_id":"sampleassetgroup1",
    "new_group_name" : "sampleassetgroup2",
    "new_group_id" : "测试资产类别2",
    "new_parent_id" : "0"
}
```

| 字段           | 含义                                                         |
| -------------- | ------------------------------------------------------------ |
| token          | 口令，用于验证身份，所有用户都可以query，其他操作只允许资产管理员执行 |
| option         | 进行的操作,只能是query,add,delete和change_parent,change_name中的一个 |
| unique_id      | 进行操作的分组的unique_id                                    |
| new_group_name | 仅在option为add或change_name时需要，要添加/修改的分组的新组名 |
| new_group_id   | 仅在option为add时需要，要添加的分组的id                      |
| new_parent_id  | 仅在option为change_parent时需要，新父组的id                  |

#### Response data

```json
//query response
{
    "code": 0,
    "message": "成功获取资产分类子类",
    "display_name": "所有类别",
    "data": [
        {
            "unique_id": "sampleassetgroup1",
            "display_name": "测试资产类别1"
        },
        {
            "unique_id": "others",
            "display_name": "其他"
        }
    ]
}
//add/delete/change_parent/change_name response
{
    "code": 0,
    "message": "创建/删除/修改分组成功"
}
```

| 字段         | 含义                                                         |
| ------------ | ------------------------------------------------------------ |
| code         | 返回码，取值为-5~0，0: 操作成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有操作的权限； |
| message      | 返回信息                                                     |
| data         | 仅在query成功时返回查询分组的直接子类                        |
| display_name | 仅在query成功时返回查询分组的名字                            |



## 获取所有资产分组

#### URL

 /api/get_all_asset_group/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1602699261ImUeOsdY",
}
```

| 字段  | 含义 |
| ----- | ---- |
| token | 口令 |

#### Response data

```json
{
    "code": 0,
    "message": "成功获取所有资产分类",
    "data": [
        {
            "title": "test_asset_group",
            "value": "sampleassetgroup1",
            "children": [
                {
                    "title": "test1",
                    "value": "test1"
                }
            ]
        },
        {
            "title": "test1",
            "value": "test1",
            "children": []
        }
    ]
}
```

| 字段       | 含义                                                         |
| ---------- | ------------------------------------------------------------ |
| code       | 返回码，取值为-4~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; |
| message    | 返回信息                                                     |
| data       | 数组                                                         |
| --value    | 资产分类unique_id                                            |
| --title    | 资产分类名                                                   |
| --children | 子分类                                                       |



## 搜索资产

#### URL

 /api/search_asset/

#### Request method

 POST

#### Request body

```json
{
    "token" : "1601892344YNhycPaA",
    "search_string": "3"
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否拥有"资产管理员"权限                      |
| search_string     | 搜索字串                      |

#### Response data

```json
{
    "code": 0,
    "message": "搜索成功",
    "data": [
        {
            "unique_id": "1603191152IdSfJKmr",
            "group_id": "sampleassetgroup1",
            "group_name": "test_asset_group",
            "under_id": "34k5jfkwertfwer",
            "under_name": "test_asset",
            "display_name": "test_asset3",
            "belongs_to_id": "lwk4j5lk234",
            "belongs_to_name": "测试员工 资产",
            "date": "2020-10-20",
            "value_origin": 100,
            "status_id": "unused",
            "status_name": "未使用",
            "remarks": "Unknown"
        },
        {
            "unique_id": "1603191717PqTxpBFu",
            "group_id": "sampleassetgroup1",
            "group_name": "test_asset_group",
            "under_id": "34k5jfkwertfwer",
            "under_name": "test_asset",
            "display_name": "test_asset3",
            "belongs_to_id": "lwk4j5lk234",
            "belongs_to_name": "测试员工 资产",
            "date": "2020-10-20",
            "value_origin": 100,
            "status_id": "unused",
            "status_name": "未使用",
            "remarks": "Unknown"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: 沒有获取资产列表权限； |
| message | 返回信息                                                     |
| data |     数组                                                 |
| --unique_id |     资产unique_id                                                 |
| --group_id |     资产类别unique_id                                                 |
| --group_name |     资产类别名称                                                 |
| --under_id |      父资产unique_id                                                |
| --under_name |    父资产名称                                                  |
| --display_name |   资产名称                                                   |
| --belongs_to_id |   属于的员工的unique_id                                                   |
| --belongs_to_name |  属于的员工的姓名                                                    |
| --date | 入库日期                                                     |
| --value_origin | 资产初始价值                                                    |
| --status_id |   资产状态（unique_id）                                                   |
| --status_name |  资产状态（中文名显示）                                                    |
| --remarks |   资产备注                                                   |



## 资产领用申请

#### URL

	/api/assets_apply/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "data":[
        {
        "asset_id":"1603191152ZrfbUKEi"
        },
        {
        "asset_id":"1603191152cvwLfWvh"
        },
        {
        "asset_id":"1603191152IdSfJKmr"
        }
    ]
}
```

| 字段     | 含义                                         |
| -------- | -------------------------------------------- |
| token    | 口令,会检查此口令是否属于某个员工            |
| data     | 数组                                         |
| asset_id | 申请资产的unique_id,要求该资产的状态为未使用 |

#### Response data

```json
{
	"code": 0,
	"message": "成功申请领用资产",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 申请领用资产成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 没有领用资产的权限; -6: asset_id不存在; -7: 所申请领用的资产状态并非未使用 |
| message | 返回信息                                                     |



## 资产领用确认

#### URL

	/api/assets_apply/confirm/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "asset_id":"1603191152cvwLfWvh",
    "result":"yes"
}
```

| 字段     | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| token    | 口令,会检查此口令是否拥有资产管理员权限                      |
| asset_id | 等待审核资产的unique_id,要求该资产的状态为领用待确认         |
| result   | 只有两个取值,yes和no,分别表示审核通过与不通过，若审核通过，资产会挂账到申请领用的员工名下 |

#### Response data

```json
{
	"code": 0,
	"message": "操作成功",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 审核领用资产申请成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 不是资产管理员,没有审批领用资产的权限; -6: 所审核的资产状态并非领用待确认; -7: asset_id不存在; |
| message | 返回信息                                                     |



## 资产清退

#### URL

	/api/assets_delete/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "data":[
        {
        "asset_id":"1603191152ZrfbUKEi"
        },
        {
        "asset_id":"1603191152cvwLfWvh"
        },
        {
        "asset_id":"1603191152IdSfJKmr"
        }
    ]
}
```

| 字段     | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| token    | 口令,会检查此口令是否拥有资产管理员权限                      |
| data     | 数组                                                         |
| asset_id | 清退资产的unique_id,会检查资产是否为清退状态，若本身已是清退状态则会报错 |

#### Response data

```json
{
	"code": 0,
	"message": "成功清退资产",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 清退资产成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 没有清退资产的权限; -6: asset_id不存在; -7: 存在资产状态已为清退状态 |
| message | 返回信息                                                     |



## 资产转移申请

#### URL

	/api/assets_transfer_to_apply/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "transfer_to_id":"1603162639kQsLBBHw",
    "data":[
        {
        "asset_id":"1603191152ZrfbUKEi"
        },
        {
        "asset_id":"1603191152cvwLfWvh"
        },
        {
        "asset_id":"1603191152IdSfJKmr"
        }
    ]
}
```

| 字段           | 含义                                                         |
| -------------- | ------------------------------------------------------------ |
| token          | 口令,会检查此口令是否属于某个员工                            |
| data           | 数组                                                         |
| transfer_to_id | 转移对象员工的unique_id                                      |
| asset_id       | 申请所转移资产的unique_id,要求该资产的持有人为token所对应的员工,且资产的状态应为使用中 |

#### Response data

```json
{
	"code": 0,
	"message": "成功申请转移资产",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 申请转移资产成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 没有申请转移资产的权限,即申请人不是该资产的持有人;  -6: asset_id不存在; -7: 所申请转移的资产状态并非使用中 |
| message | 返回信息                                                     |



## 资产转移确认

#### URL

	/api/assets_transfer_to/confirm/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "asset_id":"1603191152cvwLfWvh",
    "result":"yes"
}
```

| 字段     | 含义                                                 |
| -------- | ---------------------------------------------------- |
| token    | 口令,会检查此口令是否拥有资产管理员权限              |
| asset_id | 等待审核资产的unique_id,要求该资产的状态为转移待确认 |
| result   | 只有两个取值,yes和no,分别表示审核通过与不通过        |

#### Response data

```json
{
	"code": 0,
	"message": "操作成功",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 审核转移资产申请成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 不是资产管理员,没有审批转移资产的权限; -6: 所审核的资产状态并非转移待确认; -7: asset_id不存在; |
| message | 返回信息                                                     |



## 资产退库申请

#### URL

	/api/assets_return_apply/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "data":[
        {
        "asset_id":"1603191152ZrfbUKEi"
        },
        {
        "asset_id":"1603191152cvwLfWvh"
        },
        {
        "asset_id":"1603191152IdSfJKmr"
        }
    ]
}
```

| 字段     | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| token    | 口令,会检查此口令是否属于某个员工                            |
| data     | 数组                                                         |
| asset_id | 申请要退库资产的unique_id,要求该资产的持有人为token所对应的员工,且资产的状态应为使用中 |

#### Response data

```json
{
	"code": 0,
	"message": "成功申请资产退库",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 申请资产退库成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 没有申请资产退库的权限,即申请人不是该资产的持有人; -6: asset_id不存在; -7: 所申请领用的资产状态并非使用中 |
| message | 返回信息                                                     |



## 资产退库确认

#### URL

	/api/assets_return/confirm/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "asset_id":"1603191152cvwLfWvh",
    "result":"yes"
}
```

| 字段     | 含义                                                 |
| -------- | ---------------------------------------------------- |
| token    | 口令,会检查此口令是否拥有资产管理员权限              |
| asset_id | 等待审核资产的unique_id,要求该资产的状态为退库待确认 |
| result   | 只有两个取值,yes和no,分别表示审核通过与不通过        |

#### Response data

```json
{
	"code": 0,
	"message": "操作成功",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 审核资产退库申请成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 不是资产管理员,没有审批领用资产的权限; -6: 所审核的资产状态并非退库待确认; -7: asset_id不存在; |
| message | 返回信息                                                     |

## 资产维保申请

#### URL

	/api/assets_repair_apply/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "data":[
        {
        "asset_id":"1603786083cjxyxHTB"
        },
        {
        "asset_id":"1603786083EzlAqBbc"
        }
    ]
}
```

| 字段     | 含义                                                         |
| -------- | ------------------------------------------------------------ |
| token    | 口令,会检查此口令是否属于某个员工                            |
| data     | 数组                                                         |
| asset_id | 申请要维保资产的unique_id,要求该资产的持有人为token所对应的员工,且资产的状态应为使用中 |

#### Response data

```json
{
	"code": 0,
	"message": "成功申请资产维保",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 申请资产维保成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 没有申请资产维保的权限,即申请人不是该资产的持有人; -6: asset_id不存在; -7: 所申请领用的资产状态并非使用中 |
| message | 返回信息                                                     |



## 资产维保完成确认

#### URL

	/api/asset_repair_finish/

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "asset_id":"1603786083EzlAqBbc"
}
```

| 字段     | 含义                                               |
| -------- | -------------------------------------------------- |
| token    | 口令,会检查此口令是否拥有资产管理员权限            |
| asset_id | 等待审核资产的unique_id,要求该资产的状态为维保申請 |

#### Response data

```json
{
	"code": 0,
	"message": "操作成功",
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-7~0，0: 维保完成确认成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 不是资产管理员,没有审批维保完成确认的权限; -6: 所审核的资产状态并非维保申請; -7: asset_id不存在; |
| message | 返回信息                                                     |

## 单个资产信息

#### URL

	/api/asset_info

#### Request method

	POST

#### Request body

```json
{
    "token":"1601892344YNhycPaA",
    "asset_id":"1603191152cvwLfWvh"
}
```

| 字段     | 含义                                    |
| -------- | --------------------------------------- |
| token    | 口令,会检查此口令是否拥有资产管理员权限 |
| asset_id | 要查询的资产的信息                      |

#### Response data

```json
{
    "code": 0,
    "message": "成功获取资产信息",
    "data": {
        "group_id": "sampleassetgroup1",
        "group_name": "test_asset_group",
        "under_id": null,
        "under_name": null,
        "display_name": "test_asset3",
        "belongs_to_id": "lwk4j5lk234",
        "belongs_to_name": "测试员工 资产",
        "date": "2020-10-27",
        "status_id": "unused",
        "status_name": "未使用",
        "remarks": "Unknown",
        "belongs_department_id": "sampledepartment",
        "belongs_department_name": "测试部门",
        "applicant_id": null,
        "applicant_name": null,
        "use_year": 3,
        "value_origin": 100,
        "value_worth": 100,
        "brand": "Unknown",
        "model": "Unknown",
        "serial_number": "Unknown"
    }
}
```

| 字段 | 含义                                                         |
| ---- | ------------------------------------------------------------ |
| code | 返回码，取值为-5~0，0: 审核资产退库申请成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法；-5：资产不存在 |
| message | 返回信息  |
| data | 资产信息 |

## 修改资产信息

#### URL

	/api/modify_asset

#### Request method

	POST

#### Request body

```json
{
	"token":"1601892344YNhycPaA",
	"unique_id":"1603786083MWxAHSEX",
	"data":{
        //optional
		"group": "sampleassetgroup1",
        "under": null,
        "display_name": "test_asset3",
        "remarks": "Unknown",
        "use_year": 3,
        "value_origin": 100,
        "brand": "Unknown",
        "model": "Unknown",
        "serial_number": "Unknown"
	}
}
```

| 字段     | 含义                                                   |
| -------- | ------------------------------------------------------ |
| token    | 口令,会检查此口令是否拥有资产管理员权限                |
| asset_id | 等待审核资产的unique_id,要求该资产的状态为退库待确认   |
| data     | 要修改的属性及新的属性值（可选，只需填写要修改的项目） |

#### Response data

```json
{
	"code": 0,
	"message": "操作成功",
}
```

| 字段 | 含义                                                         |
| ---- | ------------------------------------------------------------ |
| code | 返回码，取值为-5~0，0: 审核资产退库申请成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法; -5: 不是资产管理员,没有修改资产的权限; |
| message | 返回信息  |



## 添加部门

#### URL

 /api/department/create/

#### Request method

 POST

#### Request body

```json
{
	"token":"1601892344YNhycPaA",
	"parent_id":"sampledepartment",
	"new_id":"sampledepartment1",
	"new_name":"子部门1",
	"location":"Mars"
}
```

| 字段      | 含义                                      |
| --------- | ----------------------------------------- |
| token     | 口令,会检查此口令是否拥有"资产管理员"权限 |
| parent_id | 上级部门的unique_id，可以为null           |
| new_name  | 要添加的部门的display_name                |
| new_id    | 要添加的部门的unique_id                   |
| location  | 要添加的部门的location（string）          |

#### Response data

```json
{
    "code": 0,
    "message": "添加部门成功!"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 操作成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有操作的权限； |
| message | 返回信息                                                     |

## 删除部门

#### URL

 /api/department/delete/

#### Request method

 POST

#### Request body

```json
{
	"token":"1601892344YNhycPaA",
	"department_id":"sampledepartment1"
}
```

| 字段          | 含义                                                    |
| ------------- | ------------------------------------------------------- |
| token         | 口令,会检查此口令是否拥有"资产管理员"权限               |
| department_id | 要删除的部门的unique_id，当部门有子部门或员工时禁止删除 |

#### Response data

```json
{
    "code": 0,
    "message": "删除部门成功!"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 操作成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有操作的权限； |
| message | 返回信息                                                     |

## 查询部门

#### URL

 /api/department/info/

#### Request method

 POST

#### Request body

```json
{
	"token":"1601892344YNhycPaA",
	"department_id":"sampledepartment1"
}
```

| 字段          | 含义                    |
| ------------- | ----------------------- |
| token         | 口令                    |
| department_id | 要查询的部门的unique_id |

#### Response data

```json
{
    "code": 0,
    "message": "查询部门成功!",
    "data": {
        "display_name": "测试部门",
        "location": "default",
        "parent_id": null,
        "parent_name": null,
        //子部门列表
        "sub_deparments": [
            {
                "unique_id": "sampledepartment1",
                "display_name": "子部门1"
            },
            {
                "unique_id": "sampledepartment2",
                "display_name": "子部门2"
            }
        ],
        //部门员工列表，不包含子部门员工
        "staff": [
            {
                "unique_id": "samplestaff",
                "display_name": "测试员工"
            },
            {
                "unique_id": "lwk4j5lk234",
                "display_name": "测试员工 资产"
            }
        ]
    }
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 操作成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; |
| message | 返回信息                                                     |
| data    | 部门信息                                                     |



## 查询所有部门

#### URL

 /api/department/all/

#### Request method

 POST

#### Request body

```json
{
	"token":"1601892344YNhycPaA"
}
```

| 字段  | 含义 |
| ----- | ---- |
| token | 口令 |

#### Response data

```json
{
    "code": 0,
    "message": "查询部门成功!",
    "departments": [
        {
            "unique_id": "sampledepartment",
            "display_name": "测试部门",
            "parent_id": null,
            "sub_deparments": [
                {
                    "unique_id": "subdepartment1",
                    "display_name": "子部门"
                }
            ]
        },
        {
            "unique_id": "subdepartment1",
            "display_name": "子部门",
            "parent_id": "sampledepartment",
            "sub_deparments": []
        }
    ]
}
```

| 字段        | 含义                                                         |
| ----------- | ------------------------------------------------------------ |
| code        | 返回码，取值为-5~0，0: 操作成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; |
| message     | 返回信息                                                     |
| departments | 部门信息                                                     |



## 修改部门

#### URL

 /api/department/modify/

#### Request method

 POST

#### Request body

```json
{
	"token":"1601892344YNhycPaA",
	"department_id":"sampledepartment2",
    //optional
	"new_location":"Mars",
    //optional
	"new_parent_id":"sampledepartment",
    //optional
    "new_name":"Mars Migrations"
}
```

| 字段                  | 含义                                      |
| --------------------- | ----------------------------------------- |
| token                 | 口令,会检查此口令是否拥有"资产管理员"权限 |
| department_id         | 要修改的部门的unique_id                   |
| new_name（可选）      | 新display_name                            |
| new_parent_id（可选） | 新上级部门unique_id，可为null             |
| new_location（可选）  | 新location                                |

#### Response data

```json
{
    "code": 0,
    "message": "修改部门成功!"
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 操作成功；-1: 请求体不是合法的json；-2: json中参数错误；-3: 未知错误；-4: token不合法; -5: token没有操作的权限； |
| message | 返回信息                                                     |



## 单个员工名下挂账资产

#### URL

```
/api/assets_of_staff_list/
```

#### Request method

```
POST
```

#### Request body

```
{
    "token":"1601892344YNhycPaA",
    "unique_id":"samplestaff"
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否為所要查詢的員工本人,或者拥有资产管理员权限 |
| unique_id | 要查询的员工的unique_id                                      |

#### Response data

```
{
    "code": 0,
    "message": "成功获取单个员工名下挂账资产",
    "data": [
        {
            "asset_id": "1603786083cjxyxHTB",
            "group_id": "sampleassetgroup1",
            "group_name": "test_asset_group",
            "under_id": "34k5jfkwertfwer",
            "under_name": "test_asset",
            "display_name": "test_asset1",
            "belongs_to_id": "samplestaff",
            "belongs_to_name": "测试员工",
            "date": "2020-10-27",
            "status_id": "inuse",
            "status_name": "使用中",
            "remarks": "Write something",
            "belongs_department_id": "sampledepartment",
            "belongs_department_name": "测试部门",
            "applicant_id": null,
            "applicant_name": null,
            "use_year": 3,
            "value_origin": 100,
            "value_worth": 100,
            "brand": "苹果",
            "model": "Macbook air",
            "serial_number": "123456"
        },
        {
            "asset_id": "1603786083EzlAqBbc",
            "group_id": "sampleassetgroup1",
            "group_name": "test_asset_group",
            "under_id": "34k5jfkwertfwer",
            "under_name": "test_asset",
            "display_name": "test_asset2",
            "belongs_to_id": "samplestaff",
            "belongs_to_name": "测试员工",
            "date": "2020-10-27",
            "status_id": "inuse",
            "status_name": "使用中",
            "remarks": "Write something",
            "belongs_department_id": "sampledepartment",
            "belongs_department_name": "测试部门",
            "applicant_id": null,
            "applicant_name": null,
            "use_year": 3,
            "value_origin": 100,
            "value_worth": 100,
            "brand": "Unknown",
            "model": "Unknown",
            "serial_number": "Unknown"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功获取单个员工名下挂账资产；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法；-5：员工unique_id不存在 |
| message | 返回信息                                                     |
| data    | 资产信息                                                     |



## 单个资产所有历史

#### URL

```
/api/single_asset_history/
```

#### Request method

```
POST
```

#### Request body

```
{
    "token": "1604415314xrHMcVIn",
    "unique_id": "1603786083EzlAqBbc"
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否為资产管理员权限 |
| unique_id | 要查询的资产的unique_id                                      |

#### Response data

```
{
    "code": 0,
    "message": "搜索成功",
    "data": [
        {
            "asset_id": "1603786083EzlAqBbc",
            "asset_name": "test_asset2",
            "related_user_id": "samplestaff",
            "related_user_name": "测试员工",
            "type": "transfer",
            "description": "2020-11-03 11:42:19.538946, 员工samplestaff(测试员工)转移了资产1603786083EzlAqBbc(test_asset2)给员工1603162639kQsLBBHw(测试员工3)",
            "datetime": "2020-11-03T03:42:19.540Z"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法；-5：没有权限 |
| message | 返回信息                                                     |
| data    | 资产历史记录信息，一个记录一个{}                                                     |



## 查询资产历史资料

#### URL

```
/api/search_assets_history/
```

#### Request method

```
POST
```

#### Request body

```
{
    "token": "1604415314xrHMcVIn",
    "search_string": "asset2"
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否為资产管理员权限 |
| search_string | 万用搜索词，会搜索类型，描述，资产id，资产名，相关员工id，相关员工名                                      |

#### Response data

```
{
    "code": 0,
    "message": "搜索成功",
    "data": [
        {
            "asset_id": "1603786083EzlAqBbc",
            "asset_name": "test_asset2",
            "related_user_id": "samplestaff",
            "related_user_name": "测试员工",
            "type": "transfer",
            "description": "2020-11-03 11:42:19.538946, 员工samplestaff(测试员工)转移了资产1603786083EzlAqBbc(test_asset2)给员工1603162639kQsLBBHw(测试员工3)",
            "datetime": "2020-11-03T03:42:19.540Z"
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法；-5：没有权限 |
| message | 返回信息                                                     |
| data    | 资产历史记录信息，一个记录一个{}                                                     |


## 待审批资产操作列表清单

#### URL

```
/api/asset_pending_list/
```

#### Request method

```
POST
```

#### Request body

```
{
    "token": "1604415314xrHMcVIn"
}
```

| 字段      | 含义                                                         |
| --------- | ------------------------------------------------------------ |
| token     | 口令,会检查此口令是否為资产管理员权限 |

#### Response data

```
{
    "code": 0,
    "message": "列出成功",
    "data": [
        {
            "unique_id": "test_asset_transfering",
            "display_name": "测试资产 转移中",
            "status_id": "transfer_confirming",
            "status_name": "转移待确认",
            "applicant_id": null,
            "applicant_name": null
        }
    ]
}
```

| 字段    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| code    | 返回码，取值为-5~0，0: 成功；-1: 请求体不是合法的json；-2: json中缺少必要参数；-3: 未知错误；-4: token不合法；-5：没有权限 |
| message | 返回信息                                                     |
| data    | 待审批资产操作，一个操作一个{}                                                     |
