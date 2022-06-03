import React from 'react';
import Comment from './Comment';


class PostModal extends React.Component {

    constructor(props) {
        super(props);
        this.updateModalState = props.updateModalState;
        this.hideModal = this.hideModal.bind(this);
    }


    hideModal(ev) {
        if (ev.target.classList.contains('modal-bg') ||
            ev.target.classList.contains('close') ||
            ev.target.classList.contains('fa-times')) {
            this.updateModalState(false);
            ev.stopPropagation();
            document.body.style.overflowY = 'auto';
        }
    }

    render() {
        const isShowing = this.props.isShowing;
        const post = this.props.post;
        return (
            <div
                className={ isShowing ? 'modal-bg' : 'modal-bg hidden'}
                onClick={ this.hideModal }>
                <button autoFocus
                    className="close"
                    aria-label="Close Button"
                    onClick={ this.hideModal }>
                    <i className="fas fa-times"></i>
                </button>
                <div className="modal" role="dialog" aria-live="assertive">
                    <div className="featured-image" style={{
                        backgroundImage: 'url(' + post.image_url + ')'
                    }}></div>
                    <div className="container">
                        <h3>
                            <img className="pic" alt="Profile of the person who created the post" src={post.user.thumb_url} /> {post.user.username}</h3>
                        <div className="body">
                            {
                                post.comments.map(comment => {
                                    return (
                                        <Comment
                                            key={ 'modal-comment-' + comment.id}
                                            text={ comment.text }
                                            username={ comment.user.username }
                                            display_time={ comment.display_time } />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // componentDidUpdate() {}

    // componentDidMount() {
    //     document.addEventListener('focus', function (event) {
    //         console.log('focus');
    //         const modalElement = document.querySelector('.modal-bg');
    //         if (this.props.isShowing && !modalElement.contains(event.target)) {
    //             console.log('back to top!');
    //             event.stopPropagation();
    //             document.querySelector('.close').focus();
    //         }
    //     }, true);
    // }
}

export default PostModal;