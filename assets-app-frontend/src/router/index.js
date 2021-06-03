import React from "react";
import { DashboardOutlined, UserOutlined, TableOutlined, CalendarOutlined, AppstoreAddOutlined, UsergroupAddOutlined} from '@ant-design/icons';


const router = [
  {
    title: '控制台',
    subtitle: "",
    icon: <DashboardOutlined />,
    key: '/main/dashboard/index',
    route: [{ breadcrumbName: '首页'},
            { breadcrumbName: '控制台' },],
    child: [],
  },
  {
    title: '资产管理',
    subtitle: "",
    icon: <AppstoreAddOutlined/>,
    key: '/main/assets',
    route: [{ breadcrumbName: '首页'},
            { breadcrumbName: '资产' },],
    child: [
      { key: '/main/assets/list', title: '资产列表', icon: <TableOutlined/>, 
        route: [{ breadcrumbName: '首页'  },
                { breadcrumbName: '资产'  },
                { breadcrumbName: '资产列表' },],
      },
      { key: '/main/assets/group', title: '资产分类', icon: <TableOutlined/>, 
        route: [{ breadcrumbName: '首页'  },
                { breadcrumbName: '资产'  },
                { breadcrumbName: '资产分类' },],
      },
      { key: '/main/assets/history', title: '操作日志', icon: <CalendarOutlined/>,
        route: [{ breadcrumbName: '首页'  },
                { breadcrumbName: '资产'  },
                { breadcrumbName: '操作日志' },],
      },
    ]
  },
  {
    title: '人力资源',
    subtitle: "",
    icon:<UsergroupAddOutlined />,
    key: '/main/users',
    route: [{ breadcrumbName: '首页'  },
            { breadcrumbName: '人员'  },],
    child: [
      {key: '/main/users/DepartmentList', title: '部门列表', icon: <TableOutlined/>,
      route: [{ breadcrumbName: '首页'  },
              { breadcrumbName: '人员'  },
              { breadcrumbName: '部门列表' }]},
      {key: '/main/users/UserList', title: '用户列表', icon: <TableOutlined/>,
      route: [{ breadcrumbName: '首页'  },
              { breadcrumbName: '人员'  },
              { breadcrumbName: '用户列表' }]},
    ]
  }, 
  {
    title: '个人信息',
    subtitle: "",
    icon:<UserOutlined />,
    key: '/main/about/index',
    route: [{ breadcrumbName: '首页'  },
              { breadcrumbName: '个人信息'  }],
    child: [],
  }
]
export default router;