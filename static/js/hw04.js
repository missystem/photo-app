// Templates
const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
            
        </div>
    `;
};

const string2Html = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
};

const profile2Html = profile => {
    return `
        <img src="${profile.thumb_url}" class="pic" alt="Profile pic for ${profile.username}">
        <h2>${profile.username}</h2>
    `;
};

const suggestion2Html = suggestion => {
    return `
        <section id="${suggestion.id}">
            <img src="${suggestion.thumb_url}" class="pic" alt="Profile pic for ${suggestion.username}"/>
            <div>
                <p class="username">${suggestion.username}</p>
                <p class="suggestion-text">suggested for you</p>
            </div>
            <div>
                <button 
                class="link following" 
                aria-label="Follow ${suggestion.username}" 
                aria-checked="false" 
                data-suggestion-id="${suggestion.id}" 
                onclick="toggleFollow(event);">follow</button>
            </div>
        </section>
    `;
};

const renderLikeButton = post => {
    if (post.current_user_like_id) {
        return `
        <button
            class="like"
            aria-label="Like / Unlike" 
            data-post-id="${post.id}"
            data-like-id="${post.current_user_like_id}" 
            aria-checked="true" 
            onclick="handleLike(event);">
            <i class="fas fa-heart"></i>
        </button>
        `
    } else {
        return `
        <button
            class="like"
            aria-label="Like / Unlike" 
            data-post-id="${post.id}"
            aria-checked="false" 
            onclick="handleLike(event);">
            <i class="far fa-heart"></i>
        </button>
        `
    }
};

const renderBookmarkButton = post => {
    if (post.current_user_bookmark_id) {
        return `
        <button
            class="bookmark"
            aria-label="Bookmark / Unbookmark" 
            data-post-id="${post.id}"
            data-bookmark-id="${post.current_user_bookmark_id}" 
            aria-checked="true" 
            onclick="handleBookmark(event);">
            <i class="fas fa-bookmark"></i>
        </button>
        `
    } else {
        return `
        <button
            class="bookmark"
            aria-label="Bookmark / Unbookmark" 
            data-post-id="${post.id}"
            aria-checked="false" 
            onclick="handleBookmark(event);">
            <i class="far fa-bookmark"></i>
        </button>
        `
    }
};

const displayComments = post => {
    let comments = ``;
    if (post.comments.length > 0) {
        if (post.comments.length > 1) {
            // display button
            comments += `              
                <button 
                    class="link open comments"  
                    aria-label="Comment Button" 
                    data-post-id=${post.id} 
                    onclick="showModal(event)">
                    View all ${ post.comments.length } comments
                </button>
            `
        }
        // display single comment
        comments += `
            <div class="comments">
                <p><strong>${post.comments[post.comments.length-1].user.username}</strong> ${post.comments[post.comments.length-1].text}</p>
                <p class="timestamp">${post.comments[post.comments.length-1].display_time}</p>
            </div>
        `
    }
    return comments;
};

// TODO: will be used in modal
const allComment = (post) => {
    let comments = post.comments.map(comment => `
        <p><strong>${comment.user.username}</strong> ${comment.text}</p>
        <p class="timestamp">${comment.display_time}</p>
        `).join('\n');
    return comments;
};

const post2Modal = post => {
    return `
        <div id="modal">
            <div class="modal-bg" aria-hidden="false" role="dialog">
            <button class="close" 
                aria-label="Close the modal window" 
                onclick="closeModal(event);">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal">
                <div class="featured-image" style="background-image: url('${post.image_url}');"></div>
                <div class="container">
                    <h3>
                        <img class="pic" alt="${post.alt_text}" src="${post.user.thumb_url}" /> 
                        ${post.user.username}
                    </h3>
                    <div class="body">
                        <div>
                            ${allComment(post)}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    `
};

const post2Html = post => {
    return `
        <section id="post_${post.id}" class="card">
            <div class="header">
                <h3>${ post.user.username }</h3>
                <i class="fas fa-ellipsis-h"></i>
            </div>
            <img src="${ post.image_url }" alt="Image posted by ${ post.user.username }" width="300" height="300">
            <div class="info">
                <div class="buttons">
                    <div>
                        ${ renderLikeButton(post) }
                        <i class="far fa-comment"></i>
                        <i class="far fa-paper-plane"></i>
                    </div>
                    <div>
                        ${ renderBookmarkButton(post) }
                    </div>
                </div>
                <p class="likes">
                    <strong>${ post.likes.length } likes</strong>
                </p>
                <div class="caption">
                    <p>
                        <strong>${ post.user.username }</strong>
                        ${ post.caption }..
                        <button class="link">more</button>
                    </p>
                    <p class="timestamp">${post.display_time}</p>
                </div>

                ${displayComments(post)}
            </div>
            <form id="text-form" class="add-comment">
                <div class="input-holder">
                    <input id="comment-${post.id}-textbox" class="comment-textbox" type="text" aria-label="Add a comment" placeholder="Add a comment..." value="">
                </div>
                <button class="link" type="button" data-post-id="${post.id}" onclick="addComment(event);">Post</button>
            </form>
        </section>
    `
};



// ================================ STORIES ================================

// fetch data from your API endpoint:
const displayStories = () => {
    // fetch('https://photo-app-s22.herokuapp.com/api/stories')
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            // console.log(stories);
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

// =============================== CARDS =================================

// -------------------------------- Like --------------------------------

const handleLike = ev => {
    const elem = ev.currentTarget;
    // console.log("Handle like functionality");
    // if aira-checked === 'true' -> Delete the Like Object (unlike)
    // else -> Issue a POST to creat a Like Object

    if (elem.getAttribute('aria-checked') === 'true') {
        unlikePost(elem);
    } else {
        likePost(elem);
    }
    // after everything is done, you want to redraw the post to reflect
    // its new status
};

const likePost = (elem) => {
    // issue a post request 
    const postId = Number(elem.dataset.postId);
    // console.log('like post', elem);
    const postData = {
        "post_id": postId
    };
    // console.log(postData)
    fetch(`/api/posts/likes/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log("redraw the post");
            redrawPost(postId);
        });
};

const unlikePost = (elem) => {
    const postId = Number(elem.dataset.postId);
    // console.log('unlike post', elem);
    // const deleteURL = `/api/posts/likes/${elem.dataset.likeId}`;
    fetch(`/api/posts/likes/${elem.dataset.likeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log("redraw the post");
            redrawPost(postId);
        });
};

// ----------------------------- Bookmark -----------------------------

const handleBookmark = ev => {
    // console.log("Handle bookmark functionality");
    const elem = ev.currentTarget;
    // if aira-checked === 'true' -> Delete the Bookmark Object (unbookmark)
    // else -> Issue a POST to creat a Bookmark Object

    if (elem.getAttribute('aria-checked') === 'true') {
        unbookmarkPost(elem);
    } else {
        bookmarkPost(elem);
    }
};

const bookmarkPost = (elem) => {
    const postId = Number(elem.dataset.postId);
    // console.log('bookmark post', elem);
    const postData = {
        "post_id": postId
    };
    // console.log(postData)
    fetch(`/api/bookmarks/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log("redraw the post");
            redrawPost(postId);
        });
};

const unbookmarkPost = (elem) => {
    const bookmarkId = Number(elem.dataset.bookmarkId);
    const postId = Number(elem.dataset.postId);
    // console.log('unbookmark post', elem);
    fetch(`/api/bookmarks/${bookmarkId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log("redraw the post");
            redrawPost(postId);
        });
}



// --------------------------------------------------------------------


const redrawPost = (postId, callback) => {
    // first, requery the API for the post that has just changed.
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost => {
            if (!callback) {
                redrawCard(updatedPost);
            } else {
                callback(updatedPost);
            }
        });
};

const redrawCard = post => {
    // console.log(post);
    const html = post2Html(post);
    const newElement = string2Html(html);
    const postElement = document.querySelector(`#post_${post.id}`);
    postElement.innerHTML = newElement.innerHTML;
    // then, after you get the response, redraw the post
};

// ---------------------------------- Modal -------------------------------
// - CLick "view all ___ comments" to pop up the modal
const showModal = ev => {
    // console.log("updata modal state");
    const postId = Number(ev.currentTarget.dataset.postId);
    document.body.style.overflowY = "hidden";
    redrawPost(postId, post => {
        const html = post2Modal(post);
        document.querySelector(`#post_${post.id}`).insertAdjacentHTML('beforeend', html);
    });
};

const closeModal = ev => {
    document.querySelector('.modal-bg').remove();
    document.body.style.overflowY = "auto";
};

// ----------------------------- Add a Comment -----------------------------
// TODO
// const likePost = (elem) => {
//     // issue a post request 
//     const postId = Number(elem.dataset.postId);
//     console.log('like post', elem);
//     const postData = {
//         "post_id": postId
//     };
//     // console.log(postData)
//     fetch(`/api/posts/likes/`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(postData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             console.log("redraw the post");
//             redrawPost(postId);
//         });
// };

const addComment = ev => {
    // Add Comment
    // issue a POST request
    // Note that each button click is issuing a request to your API and 
    // redrawing the screen
    const elem = ev.currentTarget;
    const postId = elem.dataset.postId;
    // console.log("Add Comment...", elem);
    const postData = {
        "post_id": postId,
        "text": document.querySelector(`#comment-${postId}-textbox`).value
    };
    console.log(postData);
    fetch(`/api/comments`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // console.log("redraw the post");
            redrawPost(postId);
        });
};

// -------------------------------------------------------------------------

const displayPosts = () => {
    // fetch('https://photo-app-s22.herokuapp.com/api/posts')
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            // console.log(posts)
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};

// ==========================================================================

// =============================== SUGGESTION ===============================

const displayUserProfile = () => {
    fetch('/api/profile/')
        .then(response => response.json())
        .then(profile => {
            // console.log(profile);
            const html = profile2Html(profile);
            document.querySelector('aside header').innerHTML = html;
        });
}

const toggleFollow = ev => {
    // A reference to the object whose event listeners triggered the event
    const elem = ev.currentTarget;
    // console.log('Handle Follow Functionality')

    // if (elem.getAttribute('aria-checked') === 'false') {
    if (elem.innerHTML === 'follow') {
        // issue post request:
        followUser(elem.dataset.suggestionId, elem);
    } else {
        // issue delete request:
        unfollowUser(elem.dataset.followingId, elem);
    }
};

const followUser = (suggestionId, elem) => {
    const postData = {
        "user_id": suggestionId
    };
    // console.log(postData)
    fetch("/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            // exchange data to/from a web server
            // When sending data to a web server, the data has to be a string.
            // Convert a JS object into a string with JSON.stringify().
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow';
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            elem.setAttribute('aria-checked', 'true');
            elem.setAttribute('data-following-id', data.id);
        });
};

const unfollowUser = (followingId, elem) => {
    // issue a delete request 
    const deleteURL = `/api/following/${followingId}`;
    fetch(deleteURL, {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'follow';
            elem.classList.add('follow');
            elem.classList.remove('unfollow');
            elem.removeAttribute('data-following-id');
            elem.setAttribute('aria-checked', 'false');
        });

};



const displaySuggestions = () => {
    fetch('/api/suggestions/')
        .then(response => response.json())
        .then(suggestions => {
            // console.log(suggestions);
            const html = suggestions.map(suggestion2Html).join('\n');
            document.querySelector('.suggestions>div').innerHTML = html;
        });
}

// ==========================================================================

const initPage = () => {
    displayStories();
    displayPosts();
    displayUserProfile();
    displaySuggestions();
};

// invoke init page to display stories:
initPage();