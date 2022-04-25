from ast import arg
from collections import UserDict
from flask import Response, request
from flask_restful import Resource
from models import Post, db, Following
from views import get_authorized_user_ids, can_view_post

import json

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):  # HTTP GET
        # TODO: GET posts created by one of these users:
        # print(get_authorized_user_ids(self.current_user))
        # get limit number of posts
        args = request.args
        # Goal: limit to only user#12 (current_user)'s network
        #   - oneself
        #   - ppl #12 are following
        #1. Query the following table to get the user_ids that #12 is following
        user_ids = get_authorized_user_ids(self.current_user)
        limit = args.get('limit') or 10     # 10 is the default
        posts = Post.query.filter(Post.user_id.in_(user_ids)).limit(limit).all()
        
        posts_json = [post.to_dict() for post in posts]
        return Response(json.dumps(posts_json), mimetype="application/json", status=200)

        
    def post(self): # HTTP POST
        # TODO: CREATE a new post based on the data posted in the body 
        body = request.get_json()        
        new_post = Post (
            image_url=body.get('image_url'),
            user_id=self.current_user.id,
            caption=body.get('caption'),
            alt_text=body.get('alt_text')
        )
        # add to database
        db.session.add(new_post)
        db.session.commit()
        return Response(json.dumps(new_post.to_dict()), mimetype="application/json", status=201)
        
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        

    def patch(self, id):
        # TODO: UPDATE post based on the data posted in the body
        body = request.get_json()
        
        # user_ids = get_authorized_user_ids(self.current_user)
        # posts = Post.query.filter(Post.user_id.in_(user_ids)).all()
        # for post in posts:
        #     if post.id == id:
        #         post.image_url = body.get('image_url')
        #         post.user_id = self.current_user.id
        #         post.caption = body.get('caption')
        #         post.alt_text = body.get('alt_text')
        #         db.session.commit()
        #         return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)
        # return Response(json.dumps({}), mimetype="application/json", status=404)

        if can_view_post(id, self.current_user):
            post = Post.query.get(id)
            post.image_url = body.get('image_url')
            post.user_id = self.current_user.id
            post.caption = body.get('caption')
            post.alt_text = body.get('alt_text')
            db.session.commit()
            return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)
        return Response(json.dumps({}), mimetype="application/json", status=404)


    def delete(self, id):
        # TODO: DELETE post where "id"=id        
        if can_view_post(id, self.current_user):
            Post.query.filter_by(id=id).delete()
            db.session.commit()
            return Response(json.dumps({}), mimetype="application/json", status=200)
        return Response(json.dumps({}), mimetype="application/json", status=404)
    
    
    def get(self, id):
        # TODO: GET the post based on the id
        # the user ids that current user is following (authorized)
        # user_ids = get_authorized_user_ids(self.current_user)
        # posts = Post.query.filter(Post.user_id.in_(user_ids)).all()
        # for post in posts:
        #     if post.id == id:
        #         return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)
        # return Response(json.dumps({}), mimetype="application/json", status=404)
        
        if can_view_post(id, self.current_user):
            post = Post.query.get(id)
            return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)
        return Response(json.dumps({}), mimetype="application/json", status=404)


def initialize_routes(api):
    api.add_resource(
        PostListEndpoint, 
        '/api/posts', '/api/posts/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        PostDetailEndpoint, 
        '/api/posts/<int:id>', '/api/posts/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )