
let i = 0;
let percent = 0.15;

const update = () => {
    document.querySelector('#progress-bar').setAttribute('value', i);
    document.querySelector('#percent-text').innerHTML = `${percent.toFixed(1)}%`;
    i += 1;
    percent += 0.15;
    return requestAnimationFrame(update);
};

requestAnimationFrame(update);
