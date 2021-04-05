let url = 'https://llargozzbrd.tk/';

function link (doc) {
    if (doc.indexOf('#') === -1) {
        return  link = document.location.href;
    } else {
        return  link = doc.slice(0, doc.indexOf('#'));
    }
}

function loadStorage() {
    let body = {
        type: 3,
        page: link(document.location.href)
    }
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        header: {
            'Content-Type': 'application/text'
        }
    }).then(response => response.json())
        .then(data1 => {
            if ((data1 === "ERROR BD") || (data1 === "ERROR")) {
                alert(data1);
                localStorage.removeItem("data1");
            } else
                localStorage.setItem("data1", JSON.stringify(data1));
        }).catch(console.error);
}

function createHTML() {
    loadStorage();
    let object1 = JSON.parse(localStorage.getItem("data1"));
    let code = '';
    for (let i = 0; i < object1.commentator.length; i++) {
        code = code +
            "<div style='border-color: #a6a6a6; border-style: solid; border-width: 1px; padding: 5px; margin-bottom: 1px'>" +
            "<div class=\"mui--text-black-54\" style='font-size: 12px;'>От: " + object1.commentator[i] + "</div>" +
            "<br>" +
            "<div>" + object1.comment[i] + "</div>" +
            "</div>"
    }
    console.log(object1.page[0]);
    document.write(code);
}

setTimeout(function () {
    if(window.location.hash !== '#r') {
        window.location.hash = 'r';
        window.location.reload(1);
    }
}, 75);
