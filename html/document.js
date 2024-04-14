




const appEl = document.querySelector('.app');


const sponsorsEl = document.querySelector('.sponsors-box');

const defaultWidth = 420;
const itemBorder = 2;
const resize = ()=>{

    const allWidth = sponsorsEl.clientWidth;
    const colsNumber = Math.ceil(allWidth / defaultWidth);
    const colWidth = (allWidth - itemBorder) / colsNumber - itemBorder;
    console.log('colsNumber', colsNumber);
    console.log('colWidth', colWidth);

    const sponsorEls = sponsorsEl.querySelectorAll('.sponsor');
    const colTops = Array.from({length: colsNumber}, () => 0);

    sponsorEls.forEach(sponsorEl => {
        const sponsor = {
            w: +sponsorEl.dataset.w,
            h: +sponsorEl.dataset.h,
            t: +sponsorEl.dataset.t || 0
        };
        const sponsorT = sponsor.t;
        const scale = sponsor.w / ( sponsor.h + sponsorT );
        const width = colWidth;
        const height = Math.round(width / scale);
        const top = Math.min(...colTops) + 1;
        const col = colTops.indexOf(Math.min(...colTops));
        const left = col * (colWidth + itemBorder) + 1;
        
        sponsorEl.style.cssText += `width: ${width}px; height: ${height}px; top: ${top}px; left: ${left}px;`;
        sponsorEl.querySelector('img').style.cssText += `margin-top: ${sponsorT/sponsor.w*width}px`;
        colTops[col] = top - 1 + height + itemBorder;
    });
    const allHeight = Math.max(...colTops) + itemBorder;

    sponsorsEl.style.height = allHeight + 'px';
};

function debounce(fn, wait) {
    var timeout = null;
    return function() {
        if(timeout !== null) 
                clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}
const throttle = function(func, delay) {
    let prev = Date.now();
    return function() {
        const context = this;
        const args = arguments;
        const now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
    }
}

if(sponsorsEl.innerHTML){
    resize();
    window.addEventListener('resize', debounce(resize,100));
}else{
    fetch('../sponsors.json').then(response => response.json()).then(sponsors => {
        sponsorsEl.innerHTML = sponsors.map(sponsor => `<a class="sponsor" 
            href="${sponsor.url}" target="_blank" 
            data-w="${sponsor.w}" data-h="${sponsor.h}"
            data-t="${sponsor.t||0}"
            style="background-color: ${sponsor.color};">
                <img src="../sponsors/${sponsor.cover}" alt="${sponsor.title}">
                <div class="content">
                    <h2>${sponsor.title}</h2>
                    <p>${sponsor.text}</p>
                </div>
            </a>`).join('');
        resize();
        window.addEventListener('resize', debounce(resize,100));
    });
}