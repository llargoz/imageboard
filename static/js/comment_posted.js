let url = new URL(window.location.href);
const realUrl = url.protocol + "//" + url.host;
const comment = document.getElementById("comment");
const commentator =document.getElementById("commentator");
const comment_btn = document.getElementById("comment_btn");

function foo() {
    commentator.value = '';
    comment.value = '';
    comment_btn.disabled = true;
}

comment_btn.addEventListener('click',post_a_comment);

async function newFetch(url, data) {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let resData
    if (res.ok) {
        resData = await res.json();
    } else {
        alert("Ошибка HTTP: " + res.status);
    }
    return resData
}


async function post_a_comment(){
    const data = {
        type: 2,
        page: JSON.parse(localStorage.getItem("data1")).page[0],
        name: commentator.value,
        comment: comment.value
    }
    let resData = await newFetch(realUrl, data)
    if (resData > -1) {
        localStorage.setItem("curLogin", resData)
    } else
        alert(resData)
    document.location.href = '/posts/' + JSON.parse(localStorage.getItem("data1")).page[0];
}

function isValid(inp) {
    return inp.length >= 4;
}

commentator.oninput = () => {
    if(commentator.value.charAt(0) === ' ') {
        commentator.value = '';
    }
}

comment.oninput = () => {
    if(comment.value.charAt(0).match(/\s/)) {
        comment.value = '';
    }
}

commentator.addEventListener('input', () => {
    comment_btn.disabled = !((isValid(comment.value)) && (isValid(commentator.value)))
});

comment.addEventListener('input', () => {
    comment_btn.disabled = !((isValid(comment.value)) && (isValid(commentator.value)))
});