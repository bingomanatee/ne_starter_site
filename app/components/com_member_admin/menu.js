module.exports = [
    {label:'Members',
        link:'/admin/members/list', weight:100, id: 'admin_members_list', type:'admin_menu', icon: 'members'
    },
    {label:'Add Member',
        link:'/admin/members/add', weight:101, id: 'admin_members_add', type:'admin_menu', icon: 'member'
    },
    {label:'Privileges',
        link:"/admin/member_tasks/list", weight:102, id: 'admin_member_tasks', type:'admin_menu', icon: 'priv'
    }
]