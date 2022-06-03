import React from 'react';
import Suggestion from './Suggestion';
import { getHeaders } from './utils';

class Suggestions extends React.Component {

    // Component 1
    constructor(props) {
        super(props);
        this.state = { suggestions: [] };
        this.fetchSuggestions = this.fetchSuggestions.bind(this);
        // initialization code here
        // console.log('Suggestions component created');
    }

    // Component 2
    componentDidMount() {
        // fetch posts and then set the state...
        // console.log('Suggestions component mounted');
        this.fetchSuggestions();
    }

    fetchSuggestions() {
        fetch('/api/suggestions/', {
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ suggestions: data });
        })
    }

    // Component 3
    render() {
        if (!this.state.suggestions) {
            return (
                <div></div>
            );
        }
        return (
            <div className="suggestions">
                <p className="suggestion-text">Suggestions for you</p>
                <div>
                {
                    this.state.suggestions.map(suggestion => {
                        return (
                            < Suggestion user={suggestion} key={'suggestion-' + suggestion.id} />
                        )
                    })
                }
                </div>
            </div>
        );
    }
}

export default Suggestions;