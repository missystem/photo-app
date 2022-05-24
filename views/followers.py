from flask import Response, request
from flask_restful import Resource
from models import Following
import json
import flask_jwt_extended

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''
        # followers = Following.query.all()
        # followers_json = []
        # for follower in followers:
        #     if follower.following_id == self.current_user.id:
        #         followers_json.append(follower.to_dict_follower())
        followers = Following.query.filter_by(following_id=self.current_user.id).all()
        followers_json = [f.to_dict_follower() for f in followers]
        return Response(json.dumps(followers_json), mimetype="application/json", status=200)
        

def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
