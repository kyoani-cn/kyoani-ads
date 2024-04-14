




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
        const sponsor = sponsorEl.sponsor;
        const sponsorT = sponsor.t || 0;
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
}

fetch('sponsors.json').then(response => response.json()).then(sponsors => {

    sponsors.forEach(sponsor => {
        
        const sponsorEl = document.createElement('a');
        sponsorEl.classList.add('sponsor');
        sponsorEl.sponsor = sponsor;
        sponsorEl.style.cssText = `
            background-color: ${sponsor.color};
        `;
        if(sponsor.url) sponsorEl.href = sponsor.url;
        sponsorEl.target = '_blank';
        sponsorEl.innerHTML = `
            <img src="sponsors/${sponsor.cover}" alt="${sponsor.title}">
            <div class="content">
                <h2>${sponsor.title}</h2>
                <p>${sponsor.text}</p>
            </div>
        `;
        sponsorsEl.appendChild(sponsorEl);
    });
    resize();
    window.addEventListener('resize', resize);

});