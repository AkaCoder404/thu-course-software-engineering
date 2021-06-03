from django.test import TestCase, Client
from . import models, auth, users
# Create your tests here.

class BackendTests(TestCase):

    def setUp(self):
        pass


    def test_get(self):
        self.client.get('/')
        self.client.get('/api/')
        self.client.get('/api/login/')
        self.client.get('/api/staff_info/')
        self.client.get('/api/user_manage/create_new_staff/')
        self.client.get('/api/user_manage/delete_staff/')
        self.client.get('/api/user_manage/change_staff_password/')
        self.client.get('/api/user_manage/locked_staff/')
        self.client.get('/api/user_manage/set_character/')
        self.client.get('/api/add_assets/')
        self.client.get('/api/staff_list/')
        self.client.get('/api/asset_list/')
        self.client.get('/api/asset_group_tree/')
        self.client.get('/api/get_all_asset_group/')
        self.client.get('/api/search_assets/')
        self.client.get('/api/asset_info/')
        self.client.get('/api/assets_apply/')
        self.client.get('/api/assets_apply/confirm/')
        self.client.get('/api/assets_delete/')
        self.client.get('/api/assets_transfer_to_apply/')
        self.client.get('/api/assets_transfer_to/confirm/')
        self.client.get('/api/assets_return_apply/')
        self.client.get('/api/assets_return/confirm/')
        self.client.get('/api/search_assets_history/')
        self.client.get('/api/single_asset_history/')
        self.client.get('/api/modify_asset')
        self.client.get('/api/department/create/')
        self.client.get('/api/department/modify/')
        self.client.get('/api/department/info/')
        self.client.get('/api/department/delete/')
        self.client.get('/api/department/all/')
        self.client.get('/api/assets_of_staff_list/')
        self.client.get('/api/asset_pending_list/')


    def test_post(self):
        self.client.post('/', data={})
        self.client.post('/api/', data={})
        self.client.post('/api/login/', data={})
        self.client.post('/api/staff_info/', data={})
        self.client.post('/api/user_manage/create_new_staff/', data={})
        self.client.post('/api/user_manage/delete_staff/', data={})
        self.client.post('/api/user_manage/change_staff_password/', data={})
        self.client.post('/api/user_manage/locked_staff/', data={})
        self.client.post('/api/user_manage/set_character/', data={})
        self.client.post('/api/add_assets/', data={})
        self.client.post('/api/staff_list/', data={})
        self.client.post('/api/asset_list/', data={})
        self.client.post('/api/asset_group_tree/', data={})
        self.client.post('/api/get_all_asset_group/', data={})
        self.client.post('/api/search_assets/', data={})
        self.client.post('/api/asset_info/', data={})
        self.client.post('/api/assets_apply/', data={})
        self.client.post('/api/assets_apply/confirm/', data={})
        self.client.post('/api/assets_delete/', data={})
        self.client.post('/api/assets_transfer_to_apply/', data={})
        self.client.post('/api/assets_transfer_to/confirm/', data={})
        self.client.post('/api/assets_return_apply/', data={})
        self.client.post('/api/assets_return/confirm/', data={})
        self.client.post('/api/search_assets_history/', data={})
        self.client.post('/api/single_asset_history/', data={})
        self.client.post('/api/modify_asset/', data={})
        self.client.post('/api/department/create/', data={})
        self.client.post('/api/department/modify/', data={})
        self.client.post('/api/department/info/', data={})
        self.client.post('/api/department/delete/', data={})
        self.client.post('/api/department/all/', data={})
        self.client.post('/api/assets_of_staff_list/', data={})
        self.client.post('/api/asset_pending_list/', data={})

        
    def test_post_json(self):
        self.client.post('/', data={}, content_type="application/json")
        self.client.post('/', data={}, content_type="application/json")
        self.client.post('/api/', data={}, content_type="application/json")
        self.client.post('/api/login/', data={}, content_type="application/json")
        self.client.post('/api/staff_info/', data={}, content_type="application/json")
        self.client.post('/api/user_manage/create_new_staff/', data={}, content_type="application/json")
        self.client.post('/api/user_manage/delete_staff/', data={}, content_type="application/json")
        self.client.post('/api/user_manage/change_staff_password/', data={}, content_type="application/json")
        self.client.post('/api/user_manage/locked_staff/', data={}, content_type="application/json")
        self.client.post('/api/user_manage/set_character/', data={}, content_type="application/json")
        self.client.post('/api/add_assets/', data={}, content_type="application/json")
        self.client.post('/api/staff_list/', data={}, content_type="application/json")
        self.client.post('/api/asset_list/', data={}, content_type="application/json")
        self.client.post('/api/asset_group_tree/', data={}, content_type="application/json")
        self.client.post('/api/get_all_asset_group/', data={}, content_type="application/json")
        self.client.post('/api/search_assets/', data={}, content_type="application/json")
        self.client.post('/api/asset_info/', data={}, content_type="application/json")
        self.client.post('/api/assets_apply/', data={}, content_type="application/json")
        self.client.post('/api/assets_apply/confirm/', data={}, content_type="application/json")
        self.client.post('/api/assets_delete/', data={}, content_type="application/json")
        self.client.post('/api/assets_transfer_to_apply/', data={}, content_type="application/json")
        self.client.post('/api/assets_transfer_to/confirm/', data={}, content_type="application/json")
        self.client.post('/api/assets_return_apply/', data={}, content_type="application/json")
        self.client.post('/api/assets_return/confirm/', data={}, content_type="application/json")
        self.client.post('/api/search_assets_history/', data={}, content_type="application/json")
        self.client.post('/api/single_asset_history/', data={}, content_type="application/json")
        self.client.post('/api/modify_asset/', data={}, content_type="application/json")
        self.client.post('/api/department/create/', data={}, content_type="application/json")
        self.client.post('/api/department/modify/', data={}, content_type="application/json")
        self.client.post('/api/department/info/', data={}, content_type="application/json")
        self.client.post('/api/department/delete/', data={}, content_type="application/json")
        self.client.post('/api/department/all/', data={}, content_type="application/json")
        self.client.post('/api/assets_of_staff_list/', data={}, content_type="application/json")
        self.client.post('/api/asset_pending_list/', data={}, content_type="application/json")
        
