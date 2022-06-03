import React from 'react';
import Story from './Story';
import { getHeaders } from './utils';

class Stories extends React.Component {

    // Component 1
    constructor(props) {
        super(props);
        this.state = { stories: [] };
        this.fetchStories = this.fetchStories.bind(this);
        // initialization code here
        // console.log('Stories component created');
    }

    // Component 2
    componentDidMount() {
        // fetch posts and then set the state...
        // console.log('Stories component mounted');
        this.fetchStories();
    }

    fetchStories() {
        fetch('/api/stories', {
            // authentication headers added using 
            // getHeaders() function from src/utils.js
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ stories: data });
        })
    }

    // Component 3
    render() {
        if (!this.state.stories) {
            return (
                <div></div>
            );
        }
        return (
            <header className="stories">
                {
                    this.state.stories.map(story => {
                        return (
                            <Story model={story} key={'story-' + story.id } />
                        )
                    })
                }
            </header>
        );
    }
}

export default Stories;