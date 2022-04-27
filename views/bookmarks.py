from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, Post, User
from views import can_view_post
import json

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # get all bookmarks owned by the current user
        # Should display all of the current user's bookmarks (saved posts)
        # Use the Bookmark data model to get this information
        # ----------- code start here ------------
        bm_query = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        # print(bm_query)
        bm_json = [bm.to_dict() for bm in bm_query]
        # ----------------------------------------
        return Response(json.dumps(bm_json), mimetype="application/json", status=200)

    def post(self):
        ## TODO: create a new "bookmark" based on the data posted in the body 
        body = request.get_json()
        # print(body)
        
        if len(body) < 1:
            return Response(json.dumps({}), mimetype="application/json", status=400)

        ## Check if post_id is int
        try:
            post_id = int(body.get('post_id'))
        except:
            return Response(json.dumps([]), mimetype="application/json", status=400)
        
        ## Check if post exists in all posts
        if Post.query.get(post_id) is None:
            return Response(json.dumps([]), mimetype="application/json", status=404)
        
        ## Check if the user is authorized (followed by the current user)
        ## Use can_view_post()
        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps([]), mimetype="application/json", status=404)

        ## Check if post_id exists
        bm_query = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        bm_post_ids = [bm.post_id for bm in bm_query]
        # print(bm_post_ids)
        if post_id in bm_post_ids:
            return Response(json.dumps([]), mimetype="application/json", status=400)
        
        user_id = self.current_user.id
        ## Create a new bookmark
        new_bm = Bookmark (
            user_id,
            post_id
        )
        
        db.session.add(new_bm)
        db.session.commit()
        # print(f"new_bm: {new_bm}")
        return Response(json.dumps(new_bm.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "bookmark" record where "id"=id
        # print(id)
        bm_query = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        bm_ids = [bm.id for bm in bm_query]
        # print(bm_ids)
        if id in bm_ids:
            Bookmark.query.filter_by(id=id).delete()
            db.session.commit()
            return Response(json.dumps({}), mimetype="application/json", status=200)
        return Response(json.dumps({}), mimetype="application/json", status=404)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
