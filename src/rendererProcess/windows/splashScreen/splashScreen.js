
let i = 0

setInterval(() => {
    document.querySelector('#progress-bar').setAttribute('value', i);
    i += 1;
}, 10000/100);
