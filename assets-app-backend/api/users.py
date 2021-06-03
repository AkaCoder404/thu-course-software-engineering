from . import models

def get_all_user():
    user_list=[]
    for user in models.Staff.objects.all():
        user_list.append({"display_name":user.display_name, 
                          "department":user.department.display_name, 
                          "locked":user.locked,
                          "group":user.group.display_name,
                          "username":user.username})
    return user_list

def get_asset_belong_to_user(user):
    asset_list=[]
    for asset in models.Asset.objects.filter(belongs_to=user):
        asset_list.append({
            "display_name":asset.display_name,
            "unique_id":asset.unique_id
        })
    return asset_list