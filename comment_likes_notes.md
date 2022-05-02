```
example:
posts = (
    db.session
        .query(Post.id, User.username, func.count(Comment.id))
        .join(User, User.id == Post.user_id)
        .outerjoin(Comment, Post.id == Comment.post_id)
        .group_by(Post.id, User.username)
        .all()
)
the post id, username and # of comments associated with the post

data = (
    db.session
        .query(Post.id, Comment.id, LikeComment.id)
        .join(Comment, Comment.post_id==Post.id)
        .join(LikeComment, LikeComment.comment_id==Comment.id)
        .filter(Comment.id==5)
        .all()
)

>>> data
[(2, 5, 8), (2, 5, 9), (2, 5, 10)]
post id, comment id, likecomment id
there are 3 likes for comment #5
check if the user has the access to that post


--> repeated functions --> decorator/ new helper_function file
```