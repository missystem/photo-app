import React from "react";

class Story extends React.Component {
    render () {
        if (!this.props.model) {
            return (
                <div></div>  
            );
        }
        return (
            <div>
                <img src={ this.props.model.user.thumb_url } 
                    className="pic" 
                    alt={ 'profile pic for ' + this.props.model.user.username } 
                    />
                <p>{ this.props.model.user.username }</p>
            </div>
        ); 
    }
}

export default Story;