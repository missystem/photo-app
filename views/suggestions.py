from flask import Response, request
from flask_restful import Resource
from models import User, Following
from views import get_authorized_user_ids
import json
import random

# Credits:
# Remove all the elements that occur in one list from another
# https://stackoverflow.com/questions/4211209/remove-all-the-elements-that-occur-in-one-list-from-another
#


class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    """
    def get(self):
        # suggestions should be any user with an ID that's not in this list:
        # List of suggested users to follow
        # use the User data model to get this information
        # just display 7 users that the current user isn't already following
        
        # ----------- code start here ------------
        following_ids = get_authorized_user_ids(self.current_user)
        print(f"following_ids: {following_ids}")
        all_users = User.query.all()
        all_users_ids = [usr.to_dict().get('id') for usr in all_users]
        
        print(self.current_user.id)
        print(all_users_ids)
        
        sug_list = [x for x in all_users_ids if x not in following_ids]
        print(sug_list)
        
        # display any 7 users that the current user isn't already following
        random7users = random.choices(sug_list, k=7)
        print(f"random 7 users: {random7users}")
        
        suggestions = []
        for i in random7users:
            suggestions.append(User.query.get(i).to_dict())
        print(f"suggestions: {suggestions}")
        # ----------------------------------------
        return Response(json.dumps(suggestions), mimetype="application/json", status=200)
    """

    def get(self):
        # TODO: suggestions should be any user with an ID that's not in this list:
        ## OPTIMIZED VERSION
        ## List of suggested users to follow
        ## use the User data model to get this information
        ## just display 7 users that the current user isn't already following
        # ---------------------- code start here -----------------------
        ## all users that current user is following
        user_ids = get_authorized_user_ids(self.current_user)
        ## query 7 users from all users but exclude user_ids (followings)
        suggestions = User.query.filter(~User.id.in_(user_ids)).limit(7).all()
        suggestions_json = [t.to_dict() for t in suggestions]
        # --------------------------------------------------------------
        return Response(json.dumps(suggestions_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint,
        '/api/suggestions',
        '/api/suggestions/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
