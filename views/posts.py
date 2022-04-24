from flask import Response, request
from flask_restful import Resource
from models import Post, db
from views import get_authorized_user_ids

import json

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        # TODO: get posts created by one of these users:
        # print(get_authorized_user_ids(self.current_user))
        # create empty list for current user contents
        posts_json = []
        posts = Post.query.all()
        # Loop through posts
        for post in posts:
            # pre-process the data
            # --> the if statment has some problems
            if post.user.id == self.current_user.id:
                posts_json.append(post.to_dict())
        
        # return what you want
        return Response(json.dumps(posts_json), mimetype="application/json", status=200)

    def post(self):
        # TODO: create a new post based on the data posted in the body 
        body = request.get_json()
        # print(body)
        
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
        # TODO: update post based on the data posted in the body
        body = request.get_json()
        print(body)
        post = Post.query.get(id)
        post.image_url=body.get('image_url'),
        post.user_id = self.current_user.id,
        post.caption = body.get('caption'),
        post.alt_text = body.get('alt_text')
        
        db.session.commit()
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)


    def delete(self, id):
        # TODO: delete post where "id"=id
        Post.query.filter_by(id=id).delete()
        # db.session.commit()
        delete_post = Post.query.get(id)
        return Response(json.dumps(delete_post.to_dict()), mimetype="application/json", status=200)
        # return Response(json.dumps({}), mimetype="application/json", status=200)


    def get(self, id):
        # TODO: get the post based on the id
        post = Post.query.get(id)
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)

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