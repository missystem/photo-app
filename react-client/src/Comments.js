import React from 'react';
import Comment from './Comment';

class Comments extends React.Component {

    getLastComment() {
        const idx = this.props.comments.length - 1;
        const comment = this.props.comments[idx];
        return comment;
    }

    render() {
        const comment = this.getLastComment();
        return (
            <div className="comments">
                {
                    comment
                        ?
                        <Comment
                            text={ comment.text }
                            username={ comment.user.username }
                            display_time={ comment.display_time } />
                        :
                        ''
                }
            </div>
        );
    }
}

export default Comments;