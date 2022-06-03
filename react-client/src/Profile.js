import React from 'react';
import { getHeaders } from './utils';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        // constructor logic
        this.state = { profile: null };
        this.fetchProfile = this.fetchProfile.bind(this);
        // console.log('Profile component created');
    }

    componentDidMount() {
        // fetch posts
        // console.log('Profile component mounted');
        this.fetchProfile();
    }

    fetchProfile() {
        fetch('/api/profile/', {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                // console.log(profile);
                this.setState({ profile: data });
            });
    }

    render() {
        if (!this.state.profile) {
            return (
                <div>empty profile.</div>
            );
        }
        return ( 
            <header className='profile'>
                <div>
                    <img className="pic" src={ this.state.profile.thumb_url } alt={ 'Profile pic for' + this.state.profile.username} />
                    <h2>{ this.state.profile.username }</h2>
                </div>
            </header>
        );
    }
}

export default Profile;