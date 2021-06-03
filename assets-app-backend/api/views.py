import datetime
import sys

import django
from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json

from django.db.models import Q

import api
from . import models, auth, users


def index(request):
    return HttpResponse("Welcome to MAR-Team Backend API Platform")


def method_not_allow():
    return HttpResponse(
        content="<html><body><h1>405 METHOD NOT ALLOWED</h1><hr><p>Only POST request is accepted.</p><p>Please contact MAR-Team for more information.</p></body></html>",
        status=405);


@csrf_exempt
def login(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        username = client_json["username"]
        password = client_json["password"]
        if models.Staff.objects.filter(username=username, password=password).exists():
            return JsonResponse({"code": 0, "message": "Login successful",
                                 "token": auth.login(username, password)})
        else:
            return JsonResponse({"code": -4, "message": "Login failed"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "Parameters not correct"})
    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def staff_info(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            return JsonResponse({"code": 0, "message": "Get user info success",
                                 "user": {
                                     "unique_id": user.unique_id,
                                     "display_name": user.display_name,
                                     "department": user.department.display_name,
                                     "locked": user.locked,
                                     "group": user.group.display_name,
                                     "username": user.username,
                                     "asset": users.get_asset_belong_to_user(user)
                                 }})
        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "Parameters not correct"})
    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def create_new_staff(request):
    # check if the request is by POST
    if request.method != 'POST':
        return HttpResponse(
            content="<html><body><h1>405 METHOD NOT ALLOWED</h1><hr><p>Only POST request is accepted.</p><p>Please contact MAR-Team for more information.</p></body></html>",
            status=405);

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to create a new staff
            if auth.is_system_admin(user):
                try:
                    random_id = auth.random_str()
                    group = client_json["group"]
                    department = client_json["department"]
                    display_name = client_json["display_name"]
                    username = client_json["username"]
                    password = client_json["password"]
                    new_staff = models.Staff(unique_id=random_id, group=models.StaffGroup.objects.get(unique_id=group),
                                             department=models.Department.objects.get(unique_id=department),
                                             display_name=display_name, username=username, password=password)
                    new_staff.save()
                except:
                    return JsonResponse({"code": -2, "message": "创建用户失败,JSON参数错误"})
                return JsonResponse({"code": "0", "message": "创建用户成功!"})
            else:
                return JsonResponse({"code": -5, "message": "沒有添加新用戶的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def delete_staff(request):
    # check if the request is by POST
    if request.method != 'POST':
        return HttpResponse(
            content="<html><body><h1>405 METHOD NOT ALLOWED</h1><hr><p>Only POST request is accepted.</p><p>Please contact MAR-Team for more information.</p></body></html>",
            status=405);

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to set character for staff
            if auth.is_system_admin(user):
                try:
                    unique_id = client_json["unique_id"]
                    models.Staff.objects.filter(unique_id=unique_id).first().delete()
                except:
                    return JsonResponse({"code": -2, "message": "删除用户失败,JSON参数错误"})

                return JsonResponse({"code": "0", "message": "成功删除"})
            else:
                return JsonResponse({"code": -5, "message": "沒有删除用户的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def change_staff_password(request):
    # check if the request is by POST
    if request.method != 'POST':
        return HttpResponse(
            content="<html><body><h1>405 METHOD NOT ALLOWED</h1><hr><p>Only POST request is accepted.</p><p>Please contact MAR-Team for more information.</p></body></html>",
            status=405);

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to change password for staff
            if auth.is_system_admin(user):
                try:
                    unique_id = client_json["unique_id"]
                    new_password = client_json["new_password"]
                    the_staff = models.Staff.objects.get(unique_id=unique_id)
                    the_staff.password = new_password
                    the_staff.save()
                except:
                    return JsonResponse({"code": -2, "message": "更改用户密码失败,JSON参数错误"})
                return JsonResponse({"code": "0", "message": "重置密码成功"})
            else:
                return JsonResponse({"code": -5, "message": "沒有更改用戶密码的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def locked_staff(request):
    # check if the request is by POST
    if request.method != 'POST':
        return HttpResponse(
            content="<html><body><h1>405 METHOD NOT ALLOWED</h1><hr><p>Only POST request is accepted.</p><p>Please contact MAR-Team for more information.</p></body></html>",
            status=405);

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if auth.is_system_admin(user):
                try:
                    unique_id = client_json["unique_id"]
                    lock_status = client_json["locked"]
                    if lock_status == "lock":
                        locked = True
                    elif lock_status == "unlock":
                        locked = False
                    the_staff = models.Staff.objects.get(unique_id=unique_id)
                    the_staff.locked = locked
                    the_staff.save()
                except:
                    return JsonResponse({"code": -2, "message": "锁定/解锁失敗,JSON参数错误!"})
                if locked:
                    return JsonResponse({"code": "0", "message": "成功锁定"})
                else:
                    return JsonResponse({"code": "0", "message": "成功解锁"})
            else:
                return JsonResponse({"code": -5, "message": "沒有锁定或解锁用戶的权限!"})

        user = auth.get_user_from_token(token)
        if not user is None:
            return JsonResponse({"code": 0, "message": "Get user list success",
                                 "user_list": users.get_all_user()})
        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def set_character(request):
    # check if the request is by POST
    if request.method != 'POST':
        return HttpResponse(
            content="<html><body><h1>405 METHOD NOT ALLOWED</h1><hr><p>Only POST request is accepted.</p><p>Please contact MAR-Team for more information.</p></body></html>",
            status=405);

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to set character for staff
            if auth.is_system_admin(user):
                try:
                    unique_id = client_json["unique_id"]
                    new_group = client_json["group"]
                    the_staff = models.Staff.objects.get(unique_id=unique_id)
                    the_staff.group = models.StaffGroup.objects.get(unique_id=new_group)
                    the_staff.save()
                except:
                    return JsonResponse({"code": -2, "message": "设置用户角色失敗,JSON参数错误!"})

                return JsonResponse({"code": "0", "message": "设置成功"})
            else:
                return JsonResponse({"code": -5, "message": "沒有设置用户角色的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors

    except KeyError:
        return JsonResponse({"code": -2, "message": "Parameters not correct"})
    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def staff_list(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if not user is None:
                return JsonResponse({
                    "code": 0,
                    "message": "成功获取用户列表",
                    "data": [
                        {
                            'unique_id': staff.unique_id,
                            'group_id': staff.group.unique_id,
                            'group_name': staff.group.display_name,
                            'department_id': staff.department.unique_id,
                            'department_name': staff.department.display_name,
                            'display_name': staff.display_name,
                            'username': staff.username,
                            'locked': staff.locked,
                        }
                        for staff in models.Staff.objects.all()
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有获取用户列表权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def asset_info(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            asset_id = client_json["unique_id"]
            asset = models.Asset.objects.filter(unique_id=asset_id).first()
            if not asset is None:
                return JsonResponse({
                    "code": 0,
                    "message": "成功获取资产信息",
                    "data":
                        {
                            'group_id': asset.group.unique_id if not asset.group is None else None,
                            'group_name': asset.group.display_name if not asset.group is None else None,
                            'under_id': asset.under.unique_id if not asset.under is None else None,
                            'under_name': asset.under.display_name if not asset.under is None else None,
                            'display_name': asset.display_name,
                            'belongs_to_id': asset.belongs_to.unique_id if asset.belongs_to != None else None,
                            'belongs_to_name': asset.belongs_to.display_name if asset.belongs_to != None else None,
                            'location': asset.belongs_to.department.location if asset.belongs_to != None else None,
                            'date': asset.date,
                            'status_id': asset.status.unique_id if not asset.status is None else None,
                            'status_name': asset.status.display_name if not asset.status is None else None,
                            'remarks': asset.remarks,
                            "belongs_department_id": asset.belongs_department.unique_id if not asset.belongs_department is None else None,
                            "belongs_department_name": asset.belongs_department.display_name if not asset.belongs_department is None else None,
                            "applicant_id": asset.applicant.unique_id if not asset.applicant is None else None,
                            "applicant_name": asset.applicant.display_name if not asset.applicant is None else None,
                            "use_year": asset.use_year,
                            "value_origin": asset.value_origin,
                            "value_worth": asset.value_now(),
                            "brand": asset.brand,
                            "model": asset.model,
                            "serial_number": asset.serial_number
                        }
                })
            else:
                return JsonResponse({"code": -5, "message": "该资产不存在！"})
        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "Parameters not correct"})
    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def asset_list(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        model_reverse = models.Asset.objects.all()

        model_reverse = reversed(model_reverse)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if not user is None:
                return JsonResponse({
                    "code": 0,
                    "message": "成功获取资产列表",
                    "data": [
                        {
                            'unique_id': asset.unique_id,
                            'group_id': asset.group.unique_id if asset.group != None else None,
                            'group_name': asset.group.display_name if asset.group != None else None,
                            'under_id': asset.under.unique_id if asset.under != None else None,
                            'under_name': asset.under.display_name if asset.under != None else None,
                            'display_name': asset.display_name,
                            'belongs_to_id': asset.belongs_to.unique_id if asset.belongs_to != None else None,
                            'belongs_to_name': asset.belongs_to.display_name if asset.belongs_to != None else None,
                            'date': asset.date,
                            'model': asset.model,
                            'value_origin': asset.value_origin,
                            'status_id': asset.status.unique_id if asset.status != None else None,
                            'status_name': asset.status.display_name if asset.status != None else None,
                            'remarks': asset.remarks,
                        }
                        for asset in model_reverse
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有获取资产列表权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


def add_asset(json_object, user):
    random_id = auth.random_str()
    group = models.AssetGroup.objects.filter(unique_id=json_object["group"]).first()
    under = models.Asset.objects.filter(unique_id=json_object["under"]).first()
    status = models.AssetStatus.objects.filter(unique_id=json_object["status"]).first()
    display_name = json_object["display_name"]
    belongs_to = user
    use_year = json_object["use_year"]
    brand = json_object["brand"]
    remarks = json_object["remarks"]
    serial_number = json_object["serial_number"]
    value_origin = json_object["value_origin"]
    model = json_object["model"]
    date = datetime.datetime.now()
    new_asset = models.Asset(unique_id=random_id, group=group, under=under, display_name=display_name, status=status,
                             belongs_to=belongs_to, use_year=use_year, brand=brand, remarks=remarks,
                             serial_number=serial_number, value_origin=value_origin, value_worth=value_origin,
                             model=model, date=date)
    return new_asset


@csrf_exempt
def add_assets(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if auth.is_asset_admin(user):
                json_array = client_json['data']
                asset_list = []
                for json_object in json_array:
                    asset_list.append(add_asset(json_object, user))
                for asset in asset_list:
                    asset.save()

                return JsonResponse({
                    "code": 0,
                    "message": "成功录入资产",
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有录入资产权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "录入资产失敗,JSON参数错误!"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "录入资产失敗，Unknown Error"})


@csrf_exempt
def asset_group_tree(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:

            # all users have the permission to view the group tree
            unique_id = client_json["unique_id"]
            group = models.AssetGroup.objects.filter(unique_id=unique_id).first()
            if group is None:
                return JsonResponse({"code": -2, "message": "沒有这个资产分类!"})
            if client_json["option"] == "query":
                return JsonResponse({
                    "code": 0,
                    "message": "成功获取资产分类子类",
                    "display_name": group.display_name,
                    "data": [
                        {
                            "unique_id": subgroup.unique_id,
                            "display_name": subgroup.display_name
                        }
                        for subgroup in models.AssetGroup.objects.filter(parent=group).all()
                    ]
                })
            else:
                # check if the user has permission to modify group tree
                if auth.is_asset_admin(user):
                    if client_json["option"] == "add":
                        new_name = client_json["new_group_name"]
                        new_id = client_json["new_group_id"]
                        new_group = models.AssetGroup(unique_id=new_id, display_name=new_name, parent=group)
                        try:
                            new_group.save()
                        except:
                            return JsonResponse({"code": -2, "message": "添加失败，该分组已存在!"})
                        return JsonResponse({"code": 0, "message": "添加分组成功"})
                    elif client_json["option"] == "delete":
                        if group.unique_id != "0":
                            group.delete()
                            return JsonResponse({"code": 0, "message": "删除分组成功"})
                        else:
                            return JsonResponse({"code": -2, "message": "禁止删除\"所有类别\"！"})
                    elif client_json["option"] == "change_parent":
                        new_parent_id = client_json["new_parent_id"]
                        new_parent = models.AssetGroup.objects.filter(unique_id=new_parent_id).first()
                        if new_parent is None:
                            return JsonResponse({"code": -2, "message": "修改失败，父分组不存在!"})
                        pp = new_parent
                        while not pp is None:
                            if pp==group:
                                return JsonResponse({"code": -2, "message": "修改失败，父分组不可为自己的子类"})
                            pp=pp.parent
                        group.parent = new_parent
                        group.save()
                        return JsonResponse({"code": 0, "message": "修改分组成功"})
                    elif client_json["option"] == "change_name":
                        new_name = client_json["new_group_name"]
                        group.display_name = new_name
                        try:
                            group.save()
                        except:
                            return JsonResponse({"code": -2, "message": "修改失败，该分组名已存在!"})
                        return JsonResponse({"code": 0, "message": "修改分组名成功"})
                    else:
                        return JsonResponse({"code": -2, "message": "JSON参数错误!"})
                else:
                    return JsonResponse({"code": -5, "message": "沒有修改资产分类树权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})

def generate_asset_group_tree(roots):
    result=[]
    
    for group in roots:
        result.append({
            "title": group.display_name, 
            "value": group.unique_id,
            "children": generate_asset_group_tree(models.AssetGroup.objects.filter(parent=group))
        })
    
    return result

@csrf_exempt
def get_all_asset_group(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:

            # all users have the permission to view the group tree
            root_groups=models.AssetGroup.objects.filter(parent=None)
            return JsonResponse({
                "code": 0,
                "message": "成功获取所有资产分类",
                "data": generate_asset_group_tree(root_groups)
            })

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def search_assets(request):
    if request.method != 'POST':
        return method_not_allow()

    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": 1, "message": "请提供有效的JSON请求"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:

            if auth.is_asset_admin(user):
                return JsonResponse({
                    "code": 0,
                    "message": "搜索成功",
                    "data": [
                        {
                            'unique_id': asset.unique_id,
                            'group_id': asset.group.unique_id if asset.group != None else None,
                            'group_name': asset.group.display_name if asset.group != None else None,
                            'under_id': asset.under.unique_id if asset.under != None else None,
                            'under_name': asset.under.display_name if asset.under != None else None,
                            'display_name': asset.display_name,
                            'belongs_to_id': asset.belongs_to.unique_id if asset.belongs_to != None else None,
                            'belongs_to_name': asset.belongs_to.display_name if asset.belongs_to != None else None,
                            'date': asset.date,
                            'value_origin': asset.value_origin,
                            'status_id': asset.status.unique_id if asset.status != None else None,
                            'status_name': asset.status.display_name if asset.status != None else None,
                            'remarks': asset.remarks,
                        }
                        for asset in models.Asset.objects.filter(
                            Q(display_name__icontains=client_json["search_string"]) | Q(
                                remarks__icontains=client_json["search_string"]))
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有搜索资产列表权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


def asset_apply(json_object, user):
    asset_id = json_object["asset_id"]
    try:
        the_asset = models.Asset.objects.get(unique_id=asset_id)
    except:
        return JsonResponse({"code": -6, "message": "asset_id不存在!"})
    if the_asset.status == models.AssetStatus.objects.get(unique_id="unused"):
        the_asset.status = models.AssetStatus.objects.get(unique_id="get_confirming")
        the_asset.applicant = user
        return the_asset
    else:
        return JsonResponse({"code": -7, "message": "资产状态应为未使用才能申请领用!"})


@csrf_exempt
def assets_apply(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if user is not None:
                json_array = client_json['data']
                asset_apply_list = []
                for json_object in json_array:
                    return_obj = asset_apply(json_object, user)
                    if isinstance(return_obj, django.http.response.JsonResponse):
                        return return_obj
                    else:
                        asset_apply_list.append(return_obj)
                for asset in asset_apply_list:
                    asset.save()

                return JsonResponse({
                    "code": 0,
                    "message": "成功申请领用资产",
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有领用资产的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "申请领用资产失敗,JSON参数错误!"})

    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "申请领用资产失敗，Unknown Error"})


@csrf_exempt
def apply_confirm(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if auth.is_asset_admin(user):
                the_asset = models.Asset.objects.get(unique_id=client_json['asset_id'])
                result = client_json['result']
                if the_asset.status == models.AssetStatus.objects.get(unique_id="get_confirming"):
                    if result == "yes":
                        related_user = the_asset.applicant
                        description = str(datetime.datetime.today())+", 员工" + related_user.unique_id + "(" + related_user.display_name + ")领用了资产" + the_asset.unique_id + "(" + the_asset.display_name+")"
                        new_log = models.Log(asset=the_asset,
                                             related_user=related_user,
                                             type="apply",
                                             description=description,
                                             datetime=datetime.datetime.now())
                        new_log.save()

                        the_asset.belongs_to = the_asset.applicant
                        the_asset.belongs_department = the_asset.applicant.department
                        the_asset.status = models.AssetStatus.objects.get(unique_id="inuse")
                        the_asset.applicant = None
                        the_asset.save()
                    elif result == "no":
                        the_asset.status = models.AssetStatus.objects.get(unique_id="unused")
                        the_asset.applicant = None
                        the_asset.save()
                    else:
                        return JsonResponse({"code": -2, "message": "审批领用资产失敗,JSON参数错误!"})
                    return JsonResponse({
                        "code": 0,
                        "message": "操作成功",
                    })
                else:
                    return JsonResponse({
                        "code": -6,
                        "message": "审批资产状态应为领用待确认",
                    })

            else:
                return JsonResponse({"code": -5, "message": "沒有审批领用资产的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "审批领用资产失敗,JSON参数错误!"})
    except api.models.Asset.DoesNotExist:
        return JsonResponse({"code": -7, "message": "asset_id不存在"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "审批领用资产失敗，Unknown Error"})


def asset_delete(json_object, user):
    asset_id = json_object["asset_id"]
    try:
        the_asset = models.Asset.objects.get(unique_id=asset_id)
    except:
        return JsonResponse({"code": -6, "message": "asset_id不存在!"})
    if the_asset.status != models.AssetStatus.objects.get(unique_id="deleted"):
        related_user = user
        description = str(datetime.datetime.now()) + ", 资产管理员" + related_user.unique_id + "(" + related_user.display_name + ")清退了资产" + the_asset.unique_id + "(" + the_asset.display_name + ")"
        new_log = models.Log(asset=the_asset,
                             related_user=related_user,
                             type="delete",
                             description=description,
                             datetime=datetime.datetime.now())
        the_asset.status = models.AssetStatus.objects.get(unique_id="deleted")
        the_asset.applicant = None
        the_asset.belongs_department = None
        the_asset.belongs_to = None
        the_asset.value_origin = 0
        the_asset.value_worth = 0
        the_asset.applicant = None
        the_asset.belongs_to_pending = None
        return the_asset,new_log
    else:
        return JsonResponse({"code": -7, "message": "存在资产状态已为清退状态!"})


@csrf_exempt
def assets_delete(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if auth.is_asset_admin(user):
                json_array = client_json['data']
                assets_delete_list = []
                log_delete_list = []
                for json_object in json_array:
                    return_obj = asset_delete(json_object, user)
                    if isinstance(return_obj, django.http.response.JsonResponse):
                        return return_obj
                    else:
                        log_delete_list.append(return_obj[1])
                        return_obj = return_obj[0]
                        assets_delete_list.append(return_obj)
                for asset in assets_delete_list:
                    asset.save()
                for log in log_delete_list:
                    log.save()

                return JsonResponse({
                    "code": 0,
                    "message": "成功清退资产",
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有清退资产的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "清退资产失敗,JSON参数错误!"})

    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "清退资产失敗，Unknown Error"})


def asset_transfer_to(json_object, user, transfer_to):
    asset_id = json_object["asset_id"]
    try:
        the_asset = models.Asset.objects.get(unique_id=asset_id)
    except:
        return JsonResponse({"code": -6, "message": "asset_id不存在!"})

    if the_asset.belongs_to == user:
        if the_asset.status == models.AssetStatus.objects.get(unique_id="inuse"):
            the_asset.status = models.AssetStatus.objects.get(unique_id="transfer_confirming")
            the_asset.belongs_to_pending = transfer_to
            return the_asset
        return JsonResponse({"code": -7, "message": "资产状态应为使用中才能申请转移!"})
    else:
        return JsonResponse({"code": -5, "message": "沒有转移资产的权限!"})

@csrf_exempt
def assets_transfer_to_apply(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if user is not None:
                transfer_to = models.Staff.objects.get(unique_id=client_json["transfer_to_id"])
                json_array = client_json['data']
                asset_transfer_list = []
                for json_object in json_array:
                    return_obj = asset_transfer_to(json_object, user, transfer_to)
                    if isinstance(return_obj, django.http.response.JsonResponse):
                        return return_obj
                    else:
                        asset_transfer_list.append(return_obj)
                for asset in asset_transfer_list:
                    asset.save()

                return JsonResponse({
                    "code": 0,
                    "message": "成功申请转移资产",
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有转移资产的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "申请转移资产失敗,JSON参数错误!"})
    except api.models.Staff.DoesNotExist:
        return JsonResponse({"code": -6, "message": "转移员工ID不存在!"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "申请领用资产失敗，Unknown Error"})



@csrf_exempt
def transfer_to_confirm(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if auth.is_asset_admin(user):
                the_asset = models.Asset.objects.get(unique_id=client_json['asset_id'])
                result = client_json['result']
                if the_asset.status == models.AssetStatus.objects.get(unique_id="transfer_confirming"):
                    if result == "yes":
                        related_user = the_asset.belongs_to
                        description = str(datetime.datetime.now()) + ", 员工" + related_user.unique_id + "(" + related_user.display_name + ")转移了资产" + the_asset.unique_id + "(" + the_asset.display_name + ")给员工"+the_asset.belongs_to_pending.unique_id+"("+the_asset.belongs_to_pending.display_name+")"
                        new_log = models.Log(asset=the_asset,
                                             related_user=related_user,
                                             type="transfer",
                                             description=description,
                                             datetime=datetime.datetime.now())
                        new_log.save()
                        the_asset.belongs_to = the_asset.belongs_to_pending
                        the_asset.belongs_department = the_asset.belongs_to_pending.department
                        the_asset.status = models.AssetStatus.objects.get(unique_id="inuse")
                        the_asset.belongs_to_pending = None
                        the_asset.save()
                    elif result == "no":
                        the_asset.status = models.AssetStatus.objects.get(unique_id="inuse")
                        the_asset.belongs_to_pending = None
                        the_asset.save()
                    else:
                        return JsonResponse({"code": -2, "message": "审批转移资产失敗,JSON参数错误!"})
                    return JsonResponse({
                        "code": 0,
                        "message": "操作成功",
                    })
                else:
                    return JsonResponse({
                        "code": -6,
                        "message": "审批资产状态应为转移待确认",
                    })

            else:
                return JsonResponse({"code": -5, "message": "沒有审批转移资产的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "审批转移资产失敗,JSON参数错误!"})
    except api.models.Asset.DoesNotExist:
        return JsonResponse({"code": -7, "message": "asset_id不存在"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "审批转移资产失敗，Unknown Error"})


def asset_return_apply(json_object, user):
    asset_id = json_object["asset_id"]
    try:
        the_asset = models.Asset.objects.get(unique_id=asset_id)
    except:
        return JsonResponse({"code": -6, "message": "asset_id不存在!"})

    if the_asset.belongs_to == user:
        if the_asset.status == models.AssetStatus.objects.get(unique_id="inuse"):
            the_asset.status = models.AssetStatus.objects.get(unique_id="return_confirming")
            return the_asset
        return JsonResponse({"code": -7, "message": "资产状态应为使用中才能申请退库!"})
    else:
        return JsonResponse({"code": -5, "message": "沒有申请资产退库的权限!"})


@csrf_exempt
def assets_return_apply(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if user is not None:
                json_array = client_json['data']
                asset_transfer_list = []
                for json_object in json_array:
                    return_obj = asset_return_apply(json_object, user)
                    if isinstance(return_obj, django.http.response.JsonResponse):
                        return return_obj
                    else:
                        asset_transfer_list.append(return_obj)
                for asset in asset_transfer_list:
                    asset.save()

                return JsonResponse({
                    "code": 0,
                    "message": "成功申请资产退库",
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有申请资产退库的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "申请资产退库失敗,JSON参数错误!"})

    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "申请资产退库失敗，Unknown Error"})



@csrf_exempt
def return_confirm(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if auth.is_asset_admin(user):
                the_asset = models.Asset.objects.get(unique_id=client_json['asset_id'])
                result = client_json['result']
                if the_asset.status == models.AssetStatus.objects.get(unique_id="return_confirming"):
                    if result == "yes":
                        related_user = the_asset.belongs_to
                        description = str(datetime.datetime.now()) + ", 员工" + related_user.unique_id + "(" + related_user.display_name + ")退库了资产" + the_asset.unique_id + "(" + the_asset.display_name + ")"
                        new_log = models.Log(asset=the_asset,
                                             related_user=related_user,
                                             type="return",
                                             description=description,
                                             datetime=datetime.datetime.now())
                        new_log.save()
                        the_asset.belongs_to = user
                        the_asset.belongs_department = user.department
                        the_asset.status = models.AssetStatus.objects.get(unique_id="unused")
                        the_asset.save()
                    elif result == "no":
                        the_asset.status = models.AssetStatus.objects.get(unique_id="inuse")
                        the_asset.save()
                    else:
                        return JsonResponse({"code": -2, "message": "审批资产退失敗,JSON参数错误!"})
                    return JsonResponse({
                        "code": 0,
                        "message": "操作成功",
                    })
                else:
                    return JsonResponse({
                        "code": -6,
                        "message": "审批资产状态应为退库待确认",
                    })

            else:
                return JsonResponse({"code": -5, "message": "沒有审批资产退的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "审批资产退失敗,JSON参数错误!"})
    except api.models.Asset.DoesNotExist:
        return JsonResponse({"code": -7, "message": "asset_id不存在"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "审批资产退失敗，Unknown Error"})



@csrf_exempt
def search_assets_history(request):
    if request.method != 'POST':
        return method_not_allow()

    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": 1, "message": "请提供有效的JSON请求"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:

            if auth.is_asset_admin(user):
                return JsonResponse({
                    "code": 0,
                    "message": "搜索成功",
                    "data": [
                        {
                            'asset_id': log.asset.unique_id,
                            'asset_name': log.asset.display_name,
                            'related_user_id': log.related_user.unique_id,
                            'related_user_name': log.related_user.display_name,
                            'type': log.type,
                            'description': log.description,
                            'datetime': log.datetime,
                        }
                        for log in models.Log.objects.filter(
                            Q(type__icontains=client_json["search_string"]) |
                            Q(description__icontains=client_json["search_string"]) |
                            Q(asset__unique_id__icontains=client_json["search_string"]) |
                            Q(asset__display_name__icontains=client_json["search_string"]) |
                            Q(related_user__unique_id__icontains=client_json["search_string"]) |
                            Q(related_user__display_name__icontains=client_json["search_string"])
                        )
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有搜索资产历史记录权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def single_asset_history(request):
    if request.method != 'POST':
        return method_not_allow()

    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": 1, "message": "请提供有效的JSON请求"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:

            if auth.is_asset_admin(user):
                return JsonResponse({
                    "code": 0,
                    "message": "搜索成功",
                    "data": [
                        {
                            'asset_id': log.asset.unique_id,
                            'asset_name': log.asset.display_name,
                            'related_user_id': log.related_user.unique_id,
                            'related_user_name': log.related_user.display_name,
                            'type': log.type,
                            'description': log.description,
                            'datetime': log.datetime,
                        }
                        for log in models.Log.objects.filter(
                            Q(asset__unique_id__icontains=client_json["unique_id"])
                        )
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有查看单个资产历史记录权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})



@csrf_exempt
def modify_asset(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic
        
        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if auth.is_asset_admin(user):
                asset=models.Asset.objects.get(unique_id=client_json["asset_id"])
                if not asset is None:
                    data_object=client_json["data"]
                    if "group" in data_object:
                        group=models.AssetGroup.objects.filter(unique_id=data_object["group"]).first()
                        if not group is None:
                            asset.group=group
                        else:
                            return JsonResponse({"code": -2, "message": "修改资产失敗，资产必须属于一个存在的分组!"})
                    if "under" in data_object:
                        if data_object["under"] is None:
                            asset.under=None
                        else:
                            under=models.Asset.objects.filter(unique_id=data_object["under"]).first() if not data_object["under"] is None else None
                            if not under is None:
                                asset.under=under
                            else:
                                return JsonResponse({"code": -2, "message": "修改资产失敗，父资产不存在!"})
                    if "display_name" in data_object:
                        asset.display_name=data_object["display_name"]
                    if "use_year" in data_object:
                        asset.use_year=data_object["use_year"]
                    if "brand" in data_object:
                        asset.brand=data_object["brand"]
                    if "remarks" in data_object:
                        asset.remarks=data_object["remarks"]
                    if "serial_number" in data_object:
                        asset.serial_number=data_object["serial_number"]
                    if "value_origin" in data_object:
                        asset.value_origin=data_object["value_origin"]
                    if "model" in data_object:
                        asset.model=data_object["model"]
                    asset.save()
                    return JsonResponse({"code": 0, "message": "修改资产成功!"})
                else:
                    return JsonResponse({"code": -2, "message": "该资产不存在!"})

            else:
                return JsonResponse({"code": -5, "message": "沒有修改资产权限!"})

        else:
            return JsonResponse({"code": -4, "message": "令牌失效，请重新登录"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "修改资产失敗,JSON参数错误!"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "修改资产失敗，Unknown Error"})

@csrf_exempt
def department_create(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if auth.is_asset_admin(user):
                parent_id = client_json["parent_id"]
                if parent_id is None:
                    parent = None
                else:
                    parent = models.Department.objects.filter(unique_id=parent_id).first() 
                    if parent is None:
                        return JsonResponse({"code": -2, "message": "上级部门不存在!"})
                new_department=models.Department(
                    unique_id=client_json["new_id"], 
                    display_name=client_json["new_name"], 
                    location=client_json["location"],
                    parent=parent)
                try:
                    new_department.save()
                    return JsonResponse({"code": 0, "message": "添加部门成功!"})
                except:
                    return JsonResponse({"code": -2, "message": "id与已有部门冲突!"})
            else:
                return JsonResponse({"code": -5, "message": "沒有添加部门权限!"})

        else:
            return JsonResponse({"code": -4, "message": "令牌失效，请重新登录"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})

@csrf_exempt
def department_delete(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if auth.is_asset_admin(user):
                department_id = client_json["department_id"]
                department = models.Department.objects.filter(unique_id=department_id).first() if department_id is not None else None
                if department is None:
                    return JsonResponse({"code": -2, "message": "删除的部门不存在!"})
                if not models.Department.objects.filter(parent=department).first() is None:
                    return JsonResponse({"code": -2, "message": "删除的部门有子部门!"})
                if not models.Staff.objects.filter(department=department).first() is None:
                    return JsonResponse({"code": -2, "message": "删除的部门非空!"})
                department.delete()
                return JsonResponse({"code": 0, "message": "删除部门成功!"})
            else:
                return JsonResponse({"code": -5, "message": "沒有删除部门权限!"})

        else:
            return JsonResponse({"code": -4, "message": "令牌失效，请重新登录"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})

@csrf_exempt
def department_modify(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if auth.is_asset_admin(user):
                department_id = client_json["department_id"]
                department = models.Department.objects.filter(unique_id=department_id).first() if department_id is not None else None
                if department is None:
                    return JsonResponse({"code": -2, "message": "修改的部门不存在!"})
                if "new_name" in client_json.keys():
                    department.display_name=client_json["new_name"]
                if "new_location" in client_json.keys():
                    department.location=client_json["new_location"]
                if "new_parent_id" in client_json.keys():
                    parent_id = client_json["new_parent_id"]
                    if parent_id is None:
                        parent = None
                    else:
                        parent = models.Department.objects.filter(unique_id=parent_id).first() 
                        pp = parent
                        while not pp is None:
                            if pp==department:
                                return JsonResponse({"code": -2, "message": "修改失败，上级部门不可为自己的子部门"})
                            pp=pp.parent
                        if parent is None:
                            return JsonResponse({"code": -2, "message": "上级部门不存在!"})
                    department.parent=parent
                department.save()
                return JsonResponse({"code": 0, "message": "修改部门成功!"})
            else:
                return JsonResponse({"code": -5, "message": "沒有删除修改部门权限!"})

        else:
            return JsonResponse({"code": -4, "message": "令牌失效，请重新登录"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})

@csrf_exempt
def department_info(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            department_id = client_json["department_id"]
            department = models.Department.objects.filter(unique_id=department_id).first() if department_id is not None else None
            if department is None:
                return JsonResponse({"code": -2, "message": "查询的部门不存在!"})
            
            return JsonResponse({
                "code": 0, 
                "message": "查询部门成功!",
                "data": {
                    "display_name":department.display_name,
                    "location":department.location,
                    "parent_id":department.parent.unique_id if not department.parent is None else None,
                    "parent_name": department.parent.display_name if not department.parent is None else None,
                    "sub_deparments":[
                        {
                            "unique_id":sd.unique_id,
                            "display_name":sd.display_name
                        }
                        for sd in models.Department.objects.filter(parent=department)
                        ],
                    "staff":[
                        {
                            "unique_id":st.unique_id,
                            "display_name":st.display_name
                        }
                        for st in models.Staff.objects.filter(department=department)
                    ]
                }
            })

        else:
            return JsonResponse({"code": -4, "message": "令牌失效，请重新登录"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})

@csrf_exempt
def department_all(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            return JsonResponse({
                "code": 0, 
                "message": "查询部门成功!",
                "departments": [
                    {
                        "unique_id":dp.unique_id,
                        "display_name":dp.display_name,
                        "parent_id":dp.parent.unique_id if not dp.parent is None else None,
                        "sub_deparments":[
                            {
                                "unique_id":sd.unique_id,
                                "display_name":sd.display_name
                            }
                            for sd in models.Department.objects.filter(parent=dp)
                        ]
                    }
                    for dp in models.Department.objects.all()
                ]
            })

        else:
            return JsonResponse({"code": -4, "message": "令牌失效，请重新登录"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})

@csrf_exempt
def assets_of_staff_list(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        the_staff = models.Staff.objects.get(unique_id=client_json["unique_id"])
        assets_list = models.Asset.objects.filter(belongs_to=the_staff)
        if not user is None and (auth.is_asset_admin(user) or the_staff == user):
            return JsonResponse({
                "code": 0,
                "message": "成功获取单个员工名下挂账资产",
                "data": [
                    {
                        "asset_id": asset.unique_id,
                        'group_id': asset.group.unique_id if not asset.group is None else None,
                        'group_name': asset.group.display_name if not asset.group is None else None,
                        'under_id': asset.under.unique_id if not asset.under is None else None,
                        'under_name': asset.under.display_name if not asset.under is None else None,
                        'display_name': asset.display_name,
                        'belongs_to_id': asset.belongs_to.unique_id if asset.belongs_to != None else None,
                        'belongs_to_name': asset.belongs_to.display_name if asset.belongs_to != None else None,
                        'location': asset.belongs_to.department.location if asset.belongs_to != None else None,
                        'date': asset.date,
                        'status_id': asset.status.unique_id if not asset.status is None else None,
                        'status_name': asset.status.display_name if not asset.status is None else None,
                        'remarks': asset.remarks,
                        "belongs_department_id": asset.belongs_department.unique_id if not asset.belongs_department is None else None,
                        "belongs_department_name": asset.belongs_department.display_name if not asset.belongs_department is None else None,
                        "applicant_id": asset.applicant.unique_id if not asset.applicant is None else None,
                        "applicant_name": asset.applicant.display_name if not asset.applicant is None else None,
                        "use_year": asset.use_year,
                        "value_origin": asset.value_origin,
                        "value_worth": asset.value_now(),
                        "brand": asset.brand,
                        "model": asset.model,
                        "serial_number": asset.serial_number
                    }
                    for asset in assets_list
                ]
            })

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})
    except api.models.Staff.DoesNotExist:
        return JsonResponse({"code": -5, "message": "员工unique_id不存在!"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "Unknown Error"})


@csrf_exempt
def asset_pending_list(request):
    if request.method != 'POST':
        return method_not_allow()

    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": 1, "message": "请提供有效的JSON请求"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:

            if auth.is_asset_admin(user):
                return JsonResponse({
                    "code": 0,
                    "message": "列出成功",
                    "data": [
                        {
                            'unique_id': asset.unique_id,
                            'display_name': asset.display_name,
                            'status_id': asset.status.unique_id,
                            'status_name': asset.status.display_name,
                            'applicant_id': asset.applicant.unique_id if not asset.applicant is None else None,
                            'applicant_name': asset.applicant.display_name if not asset.applicant is None else None,
                            'belongs_to_pending_id': asset.belongs_to_pending.unique_id if not asset.belongs_to_pending is None else None,
                            'belongs_to_pending_name': asset.belongs_to_pending.display_name if not asset.belongs_to_pending is None else None,
                        }
                        for asset in models.Asset.objects.filter(
                            Q(status__unique_id="transfer_confirming") |
                            Q(status__unique_id="return_confirming") |
                            Q(status__unique_id="get_confirming")
                        )
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有列出待审批列表权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})


def asset_repair_apply(json_object, user):
    asset_id = json_object["asset_id"]
    try:
        the_asset = models.Asset.objects.get(unique_id=asset_id)
    except:
        return JsonResponse({"code": -6, "message": "asset_id不存在!"})
    if the_asset.belongs_to == user:
        if the_asset.status == models.AssetStatus.objects.get(unique_id="inuse"):
            the_asset.status = models.AssetStatus.objects.get(unique_id="repair_apply")
            return the_asset
        return JsonResponse({"code": -7, "message": "资产状态应为使用中才能申请维保!"})
    else:
        return JsonResponse({"code": -5, "message": "沒有申请资产维保的权限!"})


@csrf_exempt
def assets_repair_apply(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if user is not None:
                json_array = client_json['data']
                asset_repair_list = []
                for json_object in json_array:
                    return_obj = asset_repair_apply(json_object, user)
                    if isinstance(return_obj, django.http.response.JsonResponse):
                        return return_obj
                    else:
                        asset_repair_list.append(return_obj)
                for asset in asset_repair_list:
                    asset.save()

                return JsonResponse({
                    "code": 0,
                    "message": "成功申请资产维保",
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有领用资产的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "申请领用资产失敗,JSON参数错误!"})

    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "申请领用资产失敗，Unknown Error"})


@csrf_exempt
def asset_repair_finish(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "请求体不是合法的json"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            if auth.is_asset_admin(user):
                the_asset = models.Asset.objects.get(unique_id=client_json['asset_id'])
                if the_asset.status == models.AssetStatus.objects.get(unique_id="repair_apply"):
                    related_user = the_asset.belongs_to
                    description = str(datetime.datetime.now()) + ", 员工" + related_user.unique_id + "(" + related_user.display_name + ")的资产" + the_asset.unique_id + "(" + the_asset.display_name + ")维保完成"
                    new_log = models.Log(asset=the_asset,
                                         related_user=related_user,
                                         type="repair",
                                         description=description,
                                         datetime=datetime.datetime.now())
                    new_log.save()
                    the_asset.status = models.AssetStatus.objects.get(unique_id="inuse")
                    the_asset.save()
                    return JsonResponse({
                        "code": 0,
                        "message": "操作成功",
                    })
                else:
                    return JsonResponse({
                        "code": -6,
                        "message": "审批资产状态应为维保申请",
                    })

            else:
                return JsonResponse({"code": -5, "message": "沒有通过资产维保的权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "资产维保失敗,JSON参数错误!"})
    except api.models.Asset.DoesNotExist:
        return JsonResponse({"code": -7, "message": "asset_id不存在"})
    except:
        print(sys.exc_info())
        return JsonResponse({"code": -3, "message": "资产维保失敗，Unknown Error"})


@csrf_exempt
def staff_list_title_value(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if not user is None:
                return JsonResponse({
                    "code": 0,
                    "message": "成功获取用户列表",
                    "data": [
                        {
                            'title': staff.display_name,
                            'value': staff.unique_id
                        }
                        for staff in models.Staff.objects.all()
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有获取用户列表权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})



@csrf_exempt
def asset_list_title_value(request):
    # check if the request is by POST
    if request.method != 'POST':
        return method_not_allow()

    # check if the request body is in valid json format
    try:
        client_json = json.loads(request.body)
    except:
        return JsonResponse({"code": -1, "message": "Requested body is not in valid JSON format"})

    try:
        # main function logic

        token = client_json["token"]
        user = auth.get_user_from_token(token)
        if not user is None:
            # check if the user has right to lock/unlock new staff
            if not user is None:
                return JsonResponse({
                    "code": 0,
                    "message": "成功获取资产列表",
                    "data": [
                        {
                            'title': asset.display_name,
                            'value': asset.unique_id
                        }
                        for asset in models.Asset.objects.all()
                    ]
                })

            else:
                return JsonResponse({"code": -5, "message": "沒有获取资产列表权限!"})

        else:
            return JsonResponse({"code": -4, "message": "Invalid token"})

    # deal with errors
    except KeyError:
        return JsonResponse({"code": -2, "message": "JSON参数错误!"})

    except:
        return JsonResponse({"code": -3, "message": "Unknown Error"})