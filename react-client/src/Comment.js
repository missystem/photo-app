import React from 'react';

class Comment extends React.Component {

    render() {
        return (
            <div>
                <p><strong>{ this.props.username }</strong>{ this.props.text }</p>
                <p className="timestamp">{ this.props.display_time }</p>
            </div>
        );
    }
}

export default Comment;