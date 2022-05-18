// notes for how to loop through comments
const comments['sdfsfs', 'fdsfse']

const getCommentHTML = (comments) => {
    return comments.map(comment => `<p>${comment.text}</p>`).join('\n');
};

let postHTML = `<h1>My Post</h1> ${getCommentHTML(comments)}`

postHTML

    `
    <!--
    <section class="comments">
        ${getComment()} <!--  <<--- make another function to allow loops-->
        {% if ${post.comments.length} > 0 %}
        
            {% if ${post.comments.length} > 1 %}
                <a class="show-more-comments" href="#">View all ${ post.comments.length } comments</a>
            {% endif %}
            
            <div class="comment-cards">
                <div class="view-comment">${ post.comments[0].user.username }</div>
                <div class="comment">${post.comments[0].text}</div> 
            </div>
        
        {% endif %}

        
        
    </section>

    -->
    `