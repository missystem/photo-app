// ================================ STORIES ================================

const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
            
        </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    // fetch('https://photo-app-s22.herokuapp.com/api/stories')
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            console.log(stories)
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};


// ================================= CARDS =================================

// Likes
const toggleLike = ev => {
    const elem = ev.currentTarget;
    console.log("Handle Like Functionality");

    if (elem.getAttribute('aria-checked') === 'false') {
        likePost(elem.dataset.postId, elem);
    } else {
        unlikePost(elem.dataset.likeId, elem);
    }
};


const likePost = (postId, elem) => {
    // issue a post request 
    const postData = {
        "post_id": postId
    };
    console.log(postData)
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
            elem.innerHTML = `<button class="like"><i class="fas fa-heart"></i></button>`;
            elem.classList.add('fas');
            elem.classList.remove('far');
            elem.setAttribute('data-like-id', data.id);
            elem.setAttribute('aria-checked', 'true');
        });
};


// const countLikes = () = {
//     const content =
// };

const unlikePost = (likeId, elem) => {
    const deleteURL = `/api/posts/likes/${likeId}`;
    fetch(deleteURL, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = `<button class="like"><i class="far fa-heart"></i></button>`;
            elem.removeAttribute('data-like-id');
            // like == false
            elem.setAttribute('aria-checked', 'false');

            elem.classList.add('far');
            elem.classList.remove('fas');
        })
};
// --------------------------------------------------------------------

// ----------------------------- Bookmark -----------------------------
const toggleBookmark = ev => {
    const elem = ev.currentTarget;
    console.log("Handle Bookmark Functionality");

    if (elem.getAttribute('aria-checked') === 'false') {
        console.log("bookmark");
        bookmarkPost(elem.dataset.postId, elem);
    } else {
        console.log('unbookmark');
        unbookmarkPost(elem.dataset.bookmarkId, elem);
    }
};

const bookmarkPost = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    console.log(postData)
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
            elem.innerHTML = `<button class="bookmark"><i class="fas fa-bookmark"></i></button>`;
            // elem.innerHTML = 'unbookmark';
            // elem.classList.add('unbookmark');
            // elem.classList.remove('bookmark');
            elem.setAttribute('data-bookmark-id', data.id);
            elem.setAttribute('aria-checked', 'true');
        });
};

const unbookmarkPost = (bookmarkId, elem) => {
    const deleteURL = `/api/bookmarks/${bookmarkId}`;
    fetch(deleteURL, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = `<button class="bookmark"><i class="far fa-bookmark"></i></button>`;
            // elem.innerHTML = 'bookmark';
            // elem.classList.add('bookmark');
            // elem.classList.remove('unbookmark');
            elem.removeAttribute('data-bookmark-id');
            elem.setAttribute('aria-checked', 'false');
        });
}

//-----------


const post2Html = post => {
    return `
        <section class="card">
            <div class="header">
                <h3>${ post.user.username }</h3>
                <i class="fas fa-ellipsis-h"></i>
            </div>
            <img src="${ post.image_url }" alt="Image posted by ${ post.user.username }" width="300" height="300">
            <div class="info">
                <div class="buttons">
                    <div>
                        <button role="switch"
                            class="like"
                            aria-label="Like Button" 
                            aria-checked="false" 
                            data-post-id="${post.id}"
                            data-like-id="${post.current_user_like_id}" 
                            data-num-likes="${post.likes.length}"
                            onclick="toggleLike(event);">
                            <i class="far fa-heart"></i>
                        </button>    
                        <i class="far fa-comment"></i>
                        <i class="far fa-paper-plane"></i>
                    </div>
                    <div>
                        <button role="switch"
                            class="bookmark"  
                            aria-label="Bookmark Button" 
                            aria-checked="false" 
                            data-post-id="${post.id}" 
                            data-bookmark-id="${post.current_user_bookmark_id}" 
                            onclick="toggleBookmark(event);">
                            <i class="far fa-bookmark"></i>
                        </button>
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
                
                <div class="comments">
                    
                    ${comment2HTML(post)}
                </div>
                
            </div>
            <form class="add-comment">
                <div class="input-holder">
                    <input class="comment-textbox" aria-label="Add a comment" placeholder="Add a comment..." value="">
                </div>
                <button class="link" onclick="handlePost(event);">Post</button>
            </form>
        </section>
    `
}


const displayPosts = () => {
    // fetch('https://photo-app-s22.herokuapp.com/api/posts')
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            console.log(posts)
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};


// ----------------------------------- Comments ---------------------------
const comment2HTML = (post) => {
    let comments = ``;
    if (post.comments.length > 0) {
        if (post.comments.length > 1) {
            comments += `
                <div class="comments">
                    <div class="modal-bg hidden" aria-hidden="true" role="dialog">
                        <section class="modal">
                            <button class="close" aria-label="Close Button" onclick="closeModal(event);"><i class="fas fa-times"></i></button>

                            <p>Hi there</p>
                        </section>
                    </div>
                    
                    <button 
                        class="link open comments"  
                        aria-label="Comment Button" 
                        onclick="openModal(event);">
                        View all ${ post.comments.length } comments
                    </button>
                </div>
            `
        }
        comments += `
            <div class="comment-cards">
                <p><strong>${post.comments[0].user.username}</strong> ${post.comments[0].text}</p>
                <p class="timestamp">${post.comments[0].display_time}</p>
            </div>
        `
    }
    return comments;
};

// const modal2HTML = (post) => {
//     return `
//         <div class="modal-bg hidden" aria-hidden="true" role="dialog">
//             <section class="modal">
//                 <button class="close" aria-label="Close Button" onclick="closeModal(event);"><i class="fas fa-times"></i></button>

//                 <p>${displayComment(post)}</p>
//             </section>
//         </div>
//     `
// }


// --------------------------------- Post Modal ------------------------------


// - CLick "view all ___ comments" to pop up the modal


const requeryPost = ev => {
    console.log("Handle post modal");

}


const modalElement = document.querySelector('.modal-bg');

const openModal = ev => {
    console.log('open!');
    modalElement.classList.remove('hidden');
    modalElement.setAttribute('aria-hidden', 'false');
    document.querySelector('.close').focus();
}

const closeModal = ev => {
    console.log('close!');
    modalElement.classList.add('hidden');
    modalElement.setAttribute('aria-hidden', 'false');
    document.querySelector('.open').focus();
};


// function ensures that if the tabbing gets to the end of the 
// modal, it will loop back up to the beginning of the modal:
document.addEventListener('focus', function(event) {
    console.log('focus');
    if (modalElement.getAttribute('aria-hidden') === 'false' && !modalElement.contains(event.target)) {
        console.log('back to top!');
        event.stopPropagation();
        document.querySelector('.close').focus();
    }
}, true);




const displayComment = (post) => {
    let comments = post.comments.map(comment => `
        <p><strong>${comment.user.username}</strong> ${comment.text}</p>
        <p class="timestamp">${comment.display_time}</p>
        `).join('\n');
    return comments;
};


// const showModal = () => {
//     console.log("updata modal state");
// };




// -------------------------------------------------------------------------




// =============================== SUGGESTION ===============================

const profile2Html = profile => {
    return `
        <img src="${profile.thumb_url}" class="pic" alt="Profile pic for ${profile.username}">
        <h2>${profile.username}</h2>
    `;
};

const displayUserProfile = () => {
    fetch('/api/profile/')
        .then(response => response.json())
        .then(profile => {
            console.log(profile);
            const html = profile2Html(profile);
            document.querySelector('aside header').innerHTML = html;
        });
}

const toggleFollow = ev => {
    // A reference to the object whose event listeners triggered the event
    const elem = ev.currentTarget;
    console.log('Handle Follow Functionality')

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
    console.log(postData)
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

const displaySuggestions = () => {
    fetch('/api/suggestions/')
        .then(response => response.json())
        .then(suggestions => {
            console.log(suggestions);
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