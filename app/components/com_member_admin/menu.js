module.exports = [
    {
        "label":'Members', "link":'/admin/members/list',
        "weight":100, "id":'admin_members_list', "type":'admin_menu', "icon":'members'
    },
    {
        "label":'List Members', "link":'/admin/members/list',
        "weight":100, "id":'admin_members_list', "type":'member_admin_menu', "icon":'members'
    },
    {
        "label":'Add Member', "link":'/admin/member/0/new',
        "weight":101, "id":'admin_members_add', "type":'member_admin_menu', "icon":'member'
    },
    {
        "label":'Tasks', "link":"/admin/member_tasks/list",
        "weight":102, "id":'admin_members_tasks', "type":'member_admin_menu', "icon":'priv'
    },
    {
        "label":'Roles', "link":"/admin/member_roles/list",
        "weight":103, "id":"admin_members_roles", "type":"member_admin_menu", "icon":"members"
    }
]