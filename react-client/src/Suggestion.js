import React from 'react';
import { getHeaders } from './utils';

class Suggestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = { following_id: null };
        this.toggleFollow = this.toggleFollow.bind(this);
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }

    toggleFollow() {
        if (this.state.following_id) {
            this.unfollow();
        } else {
            this.follow();
        }
    }

    follow() {
        fetch('/api/following', {
            headers: getHeaders(),
            method: 'POST',
            body: JSON.stringify({ user_id: this.props.user.id })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ following_id: data.id });
                // console.log(this.state);
            })
    }

    unfollow() {
        fetch(`/api/following/${this.state.following_id}`, {
            headers: getHeaders(),
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ following_id: null });
                // console.log(this.state);
            })
    }

    render() {
        if (!this.props.user) {
            return (
                <div></div>
            );
        }
        return (
            <section id={'suggestion-' + this.props.user.id}>
                <img className="pic"
                     src={this.props.user.thumb_url}
                     alt={'Profile pic for ' + this.props.user.username} />
                <div>
                    <p className='username'>{this.props.user.username}</p>
                    <p className='suggestion-text'>suggested for you</p>
                </div>
                <div>
                    <button role="switch"
                        className='link following'
                        // className={this.state.following_id ? 'link following active' : 'link following'}
                        aria-checked="false"
                        aria-label={'Follow ' + this.props.user.username}
                        onClick={this.toggleFollow}
                    >{this.state.following_id ? 'unfollow' : 'follow'}</button>
                </div>
            </section>
        );
    }
}

export default Suggestion;