/**
 *
 *
 * SWITCH UI FUNCTION:
 * handleSwitchUiButtonPress
 *
 */

export const handleSwitchUiButtonPress = function(event) {
    event.preventDefault();
    let current_ui = document.getElementById("ui").getAttribute("data-ui");
    if ( current_ui == "default" ) {
        document.getElementById("ui").setAttribute("href", "night-mode.css")
        document.getElementById("ui").setAttribute("data-ui", "night-mode")
        let sun_switch_ui_button = (`<button id="switch-ui-button" class="button is-rounded is-info is-outlined" type="button"><i class="fas fa-sun"></i></button>`);
        $(event.target).closest("#switch-ui-button").replaceWith(sun_switch_ui_button);

    } else {
        document.getElementById("ui").setAttribute("href", "style.css")
        document.getElementById("ui").setAttribute("data-ui", "default")
        let moon_switch_ui_button = (`<button id="switch-ui-button" class="button is-rounded is-info is-outlined" type="button"><i class="far fa-moon"></i></button>`);
        $(event.target).closest("#switch-ui-button").replaceWith(moon_switch_ui_button);
    }
};



/**
 *
 *
 * CREATE NEW TWEET FUNCTIONS:
 * handleNewTweetButtonPress
 * handleNewTweetFormSubmit
 *
 *
 */

export const handleNewTweetButtonPress = function(event) {
    event.preventDefault();
    let create_new_tweet_form = (
        `<div class="card">
            <form>
                <div class="field">
                    <div class="control">
                    <textarea class="textarea" id="new-tweet-body" placeholder="What's up?" name="new-tweet"></textarea>               
                    </div>
                </div>

                <button id="new-tweet-cancel" class="button is-rounded is-danger is-outlined is-pulled-left mx-1 mb-3" type="button"><i class="fas fa-times"></i></button>
                <button id="new-tweet-submit" class="button is-rounded is-info is-pulled-right mx-1 mb-3" type="submit">Post</button>
            </form>
    </div>`);
    $(event.target).closest("#new-tweet-button").replaceWith(create_new_tweet_form);
};


export async function handleNewTweetFormSubmit(event) {
    event.preventDefault();

    // grab new tweet body from form textarea
    let new_tweet_body = $("#new-tweet-body").val();

    // send post request with the new tweet textarea as body; note: type defaults to tweet
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          body: new_tweet_body
        },
      });

    //re-load feed back into DOM and restore the create button
    loadTweetsIntoFeed();
    handleNewTweetCancel(event);
};

export const handleNewTweetCancel = function(event) {
    event.preventDefault();
    $(event.target).closest(".card").replaceWith(`<button id="new-tweet-button" class="button is-info is-rounded" type="button"><i class="fas fa-pen"></i>  Create Tweet</button>`);
    
};



/**
 *
 *
 * EDIT TWEET FUNCTIONS:
 * handleEditButtonPress
 * handleEditFormSubmit
 *
 *
 */

export async function handleEditButtonPress(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');
    
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
    });

    let edit_form = (`<div data-id="${result.data.id}" class="card">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <i class="fas fa-user-circle fa-3x"></i>
                    </figure>
                </div>

                <div class="media-content">
                    <p class="title is-4">${result.data.author}</p>
                    <p id="tweet-id-handle" class="subtitle is-6">@tweet${result.data.id}</p>
                </div>
            </div>

            <form>
                <div class="field">
                    <div class="control">
                    <textarea class="textarea" id="editted-body" name="edit-tweet">${result.data.body}</textarea>               
                    </div>
                </div>

                <button id="edit-form-submit" class="button is-rounded is-info is-pulled-right mx-1 mb-3" type="submit">Save</button>
                <button id="edit-cancel" class="button is-rounded is-danger is-outlined is-pulled-left mx-1 mb-3" type="button"><i class="fas fa-times"></i></button>
            </form>
        </div>
    </div>`);

    $(event.target).closest(".card").replaceWith(edit_form);
};



export async function handleEditFormSubmit(event) {
    event.preventDefault();

    // grab new tweet body from form textarea
    let editted_body = $("#editted-body").val();

    const tweet_id = $(event.target).closest(".card").data('id');

    // send update request with the editted textarea as body.
    const result = await axios({
        method: 'put',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
        data: {
          body: editted_body
        },
    });

    //re-load feed back into DOM, should have editted tweet included.
    loadTweetsIntoFeed();

};



/**
 *
 *
 * RETWEET FUNCTIONS:
 * handleRetweetButtonPress
 * handleRetweetFormSubmit
 *
 *
 */

export async function handleRetweetButtonPress(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');
    
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
    });

    let retweet_form = (
    `<div data-id="${result.data.id}" class="card">  
        <div class="card-content">
        
            <form>
                <button id="retweet-cancel" class="button is-rounded is-danger is-outlined is-pulled-left mx-1 mb-3" type="button"><i class="fas fa-times"></i></button> 
                <button id="retweet-form-submit" class="button is-rounded is-info is-pulled-right mx-1 mb-3" type="submit">Retweet</button>

                <div class="field">
                    <div class="control">
                        <textarea class="textarea" id="retweet-body" placeholder="Add a comment to your retweet..." name="retweet-body"></textarea>               
                    </div>
                </div>
            </form>
            <br>
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <i class="fas fa-user-circle fa-3x"></i>
                    </figure>
                </div>
            
                <div class="media-content">
                    <p class="title is-4">${result.data.author}</p>
                    <p id="tweet-id-handle" class="subtitle is-6">@tweet${result.data.id}</p>
                </div>
            </div>
            <div class="content">${result.data.body}</div>
        </div>
    </div>`);
 
    $(event.target).closest(".card").replaceWith(retweet_form);  
};



export async function handleRetweetFormSubmit(event) {
    event.preventDefault();

    // grab new tweet body from form textarea
    let retweet_body = $("#retweet-body").val();

    //grab data id of parent tweet
    const tweet_id = $(event.target).closest(".card").data('id');

    // send post request with the retweet textarea as body and parent tweet's id
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "retweet",
          "parent": tweet_id,
          "body": retweet_body
        },
    });

    //re-load feed back into DOM, should have new tweet included.
    loadTweetsIntoFeed();
};



/**
 *
 *
 * REPLY FUNCTIONS:
 * handleReplyButtonPress
 * handleReplyFormSubmit
 * handleViewReplies
 *
 *
 */

export async function handleReplyButtonPress(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');
    
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
    });

    let reply_form = (
    `<div data-id="${result.data.id}" class="card">  
        <div class="card-content">
            
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <i class="fas fa-user-circle fa-3x"></i>
                    </figure>
                </div>
            
                <div class="media-content">
                    <p class="title is-4">${result.data.author}</p>
                    <p id="tweet-id-handle" class="subtitle is-6">@tweet${result.data.id}</p>
                </div>
            </div>
            
            <div class="content">${result.data.body}</div>

                    
            <form>
                <div class="field">
                    <div class="control">
                        <textarea class="textarea" id="reply-body" placeholder="Write a reply..." name="reply-body"></textarea>               
                    </div>
                </div>
                <button id="reply-cancel" class="button is-rounded is-danger is-outlined is-pulled-left mx-1 mb-3" type="button"><i class="fas fa-times"></i></button> 
                <button id="reply-form-submit" class="button is-rounded is-info is-pulled-right mx-1 mb-3" type="submit">Reply</button>
            </form>
        </div>
        
    </div>`);

    $(event.target).closest(".card").replaceWith(reply_form);
    
};


export async function handleReplyFormSubmit(event) {
    event.preventDefault();
    let reply_body = $("#reply-body").val();
    const tweet_id = $(event.target).closest(".card").data('id');

    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": tweet_id,
          "body": reply_body
        },
    });

    loadTweetsIntoFeed();
};


export async function handleViewReplies(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');
    
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
    });
    let replies_list = $(
        `<div data-id="${result.data.id}" class="card"> 
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <i class="fas fa-user-circle fa-3x"></i>
                        </figure>
                    </div>
                
                    <div class="media-content">
                        <p class="title is-4">${result.data.author}</p>
                        <p id="tweet-id-handle" class="subtitle is-6">@tweet${result.data.id}</p>
                    </div>
                </div>
                
                <div class="content">${result.data.body}</div>
                <button id="view-replies-cancel" class="button is-rounded is-danger is-outlined is-pulled-right mx-3" type="button">Close replies thread</button> 
                <br>
                <br>
            </div>
        </div>`);    
   
    let reply_card;

    if (result.data.replyCount > 0) {
        for (let i=0; i<result.data.replies.length; i++){
            reply_card=(`<article class="message">
            <div class="message-header"><p>${result.data.replies[i].author}</p></div>
            <div class="message-body">${result.data.replies[i].body}</div></article>`);
            $(replies_list).find(".card-content").append(reply_card);
        }
    } else {
        $(replies_list).append(`<p class="subtitle is-6">This tweet has no replies...</p>`);
    }

    $(event.target).closest(".card").replaceWith(replies_list);
    
};



/**
 *
 * CANCEL FUNCTION:
 * handleCancelButtonPress
 *
 */
export async function handleCancelButtonPress(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');

    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
    });

    //render the original tweet and put it back in place of the form
    $(event.target).closest(".card").replaceWith(renderTweetCard(result.data));
};



/**
 *
 * TOGGLE LIKE/UNLIKE FUNCTION:
 * toggleLikeButton
 *
 */
export async function toggleLikeButton(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');
    const tweet_isLiked = $(event.target).closest(".card").data('isliked');


    //if tweet is liked aka filled heart, in response to a toggle button press...
        // send unlike request
        //replace "unlike button" with an open heard "like" button
    if (tweet_isLiked) {
        const update = await axios({
            method: 'put',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id + '/unlike',
            withCredentials: true,
        });
    } else {
        //if tweet is not liked aka open heart, in response to a toggle button press...
        // send like request
        //replace open heart "like button" with an filled heart "unlike" button
        const update = await axios({
            method: 'put',
            url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id + '/like',
            withCredentials: true,
          });     
    }

    //note this is a little laggy
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
    });

    if (result.data.isLiked) {
        $(event.target).closest("#like-button").replaceWith(`<button class="icon-button" id="unlike-button"><i class="fas fa-heart"></i>  ${result.data.likeCount}</button>`);
        $(event.target).closest(".card").data('isliked',true);

    } else {
        $(event.target).closest("#unlike-button").replaceWith(`<button class="icon-button" id="like-button"><i class="far fa-heart"></i>  ${result.data.likeCount}</button>`);
        $(event.target).closest(".card").data('isliked',false);

    }
};



/**
 *
 * DELETE TWEET FUNCTION:
 * handleDeleteButtonPress
 *
 */

export async function handleDeleteButtonPress(event) {
    event.preventDefault();

    const tweet_id = $(event.target).closest(".card").data('id');

    // send update request with the editted textarea as body.
    const result = await axios({
        method: 'delete',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + tweet_id,
        withCredentials: true,
      });

    loadTweetsIntoFeed();

};



/**
 *
 *
 * WEB PAGE SET UP FUNCTIONS:
 * renderTweetCard
 * loadTweetsIntoFeed
 * loadMockTwitterintoDOM
 * main function
 *
 */

export const renderTweetCard = function(tweet_data) {

    let default_tweet = $(
    `<div data-id="${tweet_data.id}" data-isliked="${tweet_data.isLiked}" class="card">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <i class="fas fa-user-circle fa-3x"></i>
                    </figure>
                </div>

                <div class="media-content">
                    <p class="title is-4">${tweet_data.author}</p>
                    <p id="tweet-id-handle" class="subtitle is-6">@tweet${tweet_data.id}</p>
                </div>
            </div>
    
            <div class="content">${tweet_data.body}</div>
        </div>
    </div>`);

    let reply_button= (`<button class="icon-button ml-3" id="reply-button"><i class="far fa-comment"></i>  ${tweet_data.replyCount}</button>`);
    let retweet_button= (`<button class="icon-button ml-3" id="retweet-button"><i class="fas fa-retweet"></i>  ${tweet_data.retweetCount}</button>`);
    let like_button= (`<button class="icon-button ml-3" id="like-button"><i class="far fa-heart"></i>  ${tweet_data.likeCount}</button>`);
    let unlike_button= (`<button class="icon-button ml-3" id="unlike-button"><i class="fas fa-heart"></i>  ${tweet_data.likeCount}</button>`);
    let edit_button= (`<button class="icon-button ml-3" id="edit-button"><i class="fas fa-edit"></i></button>`);
    let delete_button= (`<button class="icon-button ml-3" id="delete-button"><i class="fa fa-trash"></i></button>`);
    let view_replies = (`<button id="view-replies" class="button is-rounded is-info is-outlined is-pulled-right mx-5 mb-3" type="button">View replies</button>`)
    let retweet_card;

    if (tweet_data.type == "retweet") {
        try {
            retweet_card=(`<article id= "retweet-card" class="message is-info">
            <div class="message-header"><p>Retweeted from ${tweet_data.parent.author}</p></div>
            <div class="message-body">${tweet_data.parent.body}</div></article>`);
            $(default_tweet).append(retweet_card)
          } catch(err) {}
    }

    if (tweet_data.isMine) {
            $(default_tweet).append(reply_button)
            $(default_tweet).append(retweet_button)
            $(default_tweet).append(edit_button)
            $(default_tweet).append(delete_button)
            if (tweet_data.replyCount > 0) {$(default_tweet).append(view_replies)}
    } else {
        if (tweet_data.isLiked) {

            $(default_tweet).append(reply_button)
            $(default_tweet).append(retweet_button)
            $(default_tweet).append(unlike_button)
            if (tweet_data.replyCount > 0) {$(default_tweet).append(view_replies)}

        } else {
            $(default_tweet).append(reply_button)
            $(default_tweet).append(retweet_button)
            $(default_tweet).append(like_button)
            if (tweet_data.replyCount > 0) {$(default_tweet).append(view_replies)}
        }
    }

    return default_tweet;
};


export async function loadTweetsIntoFeed() {
    //Grab jQuery reference to the feed div HTML element and empty out the feed
    let feed = $('#feed');
    feed.empty();

    //Grab data for all tweets from server, in the form of JSON array
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });

    // iterate through JSON array from request, appending tweet cards to feed div
    for (let i=0; i<50; i++) {
        let tweet_data = result.data[i];
        feed.append(renderTweetCard(tweet_data))
    }
};


export const loadMockTwitterintoDOM = function() {
    // Grab a jQuery reference to the root HTML element.
    const $root = $('#root');

    // Load the tweets into the feed.
    loadTweetsIntoFeed();
    
    // Set up button event handlers.
    $root.on('click', "#switch-ui-button", handleSwitchUiButtonPress);

    $root.on('click', "#new-tweet-button", handleNewTweetButtonPress);
    $root.on('click', "#new-tweet-submit", handleNewTweetFormSubmit);
    $root.on('click', "#new-tweet-cancel", handleNewTweetCancel);



    $root.on('click', "#edit-button", handleEditButtonPress);
    $root.on('click', "#edit-form-submit", handleEditFormSubmit);
    $root.on('click', "#edit-cancel", handleCancelButtonPress);



    $root.on('click', "#retweet-button", handleRetweetButtonPress);
    $root.on('click', "#retweet-form-submit", handleRetweetFormSubmit);
    $root.on('click', "#retweet-cancel", handleCancelButtonPress);


    $root.on('click', "#reply-button", handleReplyButtonPress);
    $root.on('click', "#reply-form-submit", handleReplyFormSubmit);
    $root.on('click', "#reply-cancel", handleCancelButtonPress);
    
    $root.on('click', "#view-replies", handleViewReplies);
    $root.on('click', "#view-replies-cancel", handleCancelButtonPress);


    $root.on('click', "#like-button", toggleLikeButton);
    $root.on('click', "#unlike-button", toggleLikeButton);


    $root.on('click', "#delete-button", handleDeleteButtonPress);


};


/**
 * Use jQuery to execute the loadMockTwitterintoDOM function after the page loads
 */
$(function() {
    loadMockTwitterintoDOM();
});
