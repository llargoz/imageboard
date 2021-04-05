let url = 'https://llargozzbrd.tk/';

function loadStorage() {
    let body = {
        type: 1
    }
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        header: {
            'Content-Type': 'application/text'
        }
    }).then(response => response.json())
        .then(data => {
            if ((data === "ERROR BD") || (data === "ERROR")) {
                alert(data);
                localStorage.removeItem("data");
            } else
                localStorage.setItem("data", JSON.stringify(data));
        }).catch(console.error);
}

function createHTML() {
    loadStorage();
    let object = JSON.parse(localStorage.getItem("data"));
    let code = '';
        for (let i = 0; i < object.post_name.length; i++) {
            code = code +
                "<div class=\"mui--text-headline\">" + object.post_name[i] + "</div>" +
                "<div class=\"mui--text-black-54\">Автор: " + object.user_name[i] + "</div>" +
                "<br>" +
                "<div>" + msg_cut(object.msg[i]) + "..." + "</div>" +
                "<a class=\"go-to-post\" href=\"" + '/posts/' + object.id[i] + "\">Перейти к обсуждению...</a>" +
                "<div class=\"mui--text-black-54\"> </div>" +
                "<div class=\"mui-divider\"></div>" +
                "<br>"
        }
    document.write(code);
}

function msg_cut(message) {
    if (message.indexOf('<br />') === -1) {
        return message.slice(0, 300);
    }
    else if (message.indexOf('<br />') >= 300) {
        return message.slice(0, 300);
    }
    else {
        return message.slice(0, message.indexOf('<br />'));
    }
}

setTimeout(function () {
    if(window.location.hash !== '#r') {
        window.location.hash = 'r';
        window.location.reload(1);
    }
}, 75);
