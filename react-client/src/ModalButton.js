import React from 'react';
import ReactDOM from 'react-dom';
import PostModal from './PostModal';

class ModalButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isModalShowing: false };
        this.showModal = this.showModal.bind(this);
        this.updateModalState = this.updateModalState.bind(this);
    }

    updateModalState(isShowing) {
        // console.log('updateModalState:', isShowing);
        this.setState({
            isModalShowing: isShowing
        });
        this.numCommentsButton.focus();
    }

    showModal() {
        this.setState({
            isModalShowing: true
        });
    }

    

    componentDidUpdate() {
        // console.log('Post just updated', this.state);
        if (this.state.isModalShowing) {
            ReactDOM.render(
                <PostModal
                    post={this.props.post}
                    isShowing={this.state.isModalShowing}
                    updateModalState={this.updateModalState} />,
                document.getElementById('modal')
            );
            document.body.style.overflowY = 'hidden';
        } else {
            ReactDOM.render(
                '', document.getElementById('modal')
            );
            document.body.style.overflowY = 'auto';

        }
    }

    render() {
        const post = this.props.post;
        return (
            post.comments.length > 1
                ?
                <button
                    className="open link comments"
                    onClick={ this.showModal }
                    ref={ btn => { this.numCommentsButton = btn; }}>
                    View all { post.comments.length } comments
                </button>
                :
                ''
        );
    }
}

export default ModalButton;