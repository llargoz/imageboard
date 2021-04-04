const name = document.getElementById("name");
const thread_name = document.getElementById("thread_name");
const msg = document.getElementById("msg");
const msg_btn = document.getElementById("msg_btn");

function foo() {
    name.value = '';
    thread_name.value = '';
    msg.value = '';
    msg_btn.disabled = true;
}

msg_btn.addEventListener('click', click);

let url = new URL(window.location.href)
const realUrl = url.protocol + "//" + url.host

async function newFetch(url, data) {
    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    //response from server "resData"
    let resData
    if (res.ok) {
        resData = await res.json();
    } else {
        alert("Ошибка HTTP: " + res.status);
    }

    return resData
}

async function click (){
    const data = {
        type: 0,
        user_name: name.value,
        post_name: thread_name.value,
        msg: msg.value
    }
    let resData = await newFetch(realUrl, data)
    if (resData > -1) {
        localStorage.setItem("curLogin", resData)
    } else
        alert(resData)
}

name.oninput = () => {
    if(name.value.charAt(0) === ' ') {
        name.value = '';
    }
}

thread_name.oninput = () => {
    if(thread_name.value.charAt(0) === ' ') {
        thread_name.value = '';
    }
}

msg.oninput = () => {
    if(msg.value.charAt(0).match(/\s/)) {
        msg.value = '';
    }
}

function isValid(inp) {
    return inp.length >= 4;
}

function msgValid(inp) {
    return inp.length >= 10;
}

name.addEventListener('input', () => {
    msg_btn.disabled = !((isValid(name.value)) && (isValid(thread_name.value)) && (msgValid(msg.value)))
});

thread_name.addEventListener('input', () => {
    msg_btn.disabled = !((isValid(name.value)) && (isValid(thread_name.value)) && (msgValid(msg.value)))
});

msg.addEventListener('input', () => {
    msg_btn.disabled = !((isValid(name.value)) && (isValid(thread_name.value)) && (msgValid(msg.value)))
});