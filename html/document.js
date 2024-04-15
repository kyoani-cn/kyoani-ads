

const D = document;
// const $ = D.querySelector.bind(D);

const $ = (selector, el = D) => el.querySelector(selector);
const $$ = D.querySelectorAll.bind(D);
const appEl = $('.app');


const articlesEl = $('.articles-box');

const defaultWidth = 420;
const itemBorder = 2;
let articleEls = $$('.article');
const align = 'top';
const resize = ()=>{

	const allWidth = articlesEl.clientWidth;
	const colsNumber = Math.ceil(allWidth / defaultWidth);
	const colWidth = (allWidth - itemBorder) / colsNumber - itemBorder;
	console.log('colsNumber', colsNumber);
	console.log('colWidth', colWidth);

	if(align === 'top') {
		// 上对齐
		const colTops = Array.from({length: colsNumber}, () => 0);

		articleEls.forEach(articleEl => {
			const dataset = articleEl.dataset;
			const articleW = +dataset.w;
			const articleH = +dataset.h;
			const articleT = +dataset.t || 0;
			const scale = articleW / ( articleH + articleT );
			const width = colWidth;
			const height = Math.round(width / scale);
			const top = Math.min(...colTops) + 1;
			const col = colTops.indexOf(Math.min(...colTops));
			const left = col * (colWidth + itemBorder) + 1;
			
			articleEl.style.cssText += `width:${width}px;height:${height}px;top:${top}px;left:${left}px`;
			$( 'img', articleEl ).style.cssText += `margin-top:${articleT/articleW*width}px`;
			colTops[col] = top - 1 + height + itemBorder;
		});
		const allHeight = Math.max(...colTops) + itemBorder;
		articlesEl.style.height = allHeight + 'px';
	}else if(align === 'bottom') {
		// 下对齐
		const colBottoms = Array.from({length: colsNumber}, () => 0);
		
		for(let i = articleEls.length - 1; i >= 0; i--) {
			const articleEl = articleEls[i];
			const dataset = articleEl.dataset;
			const articleW = +dataset.w;
			const articleH = +dataset.h;
			const articleT = +dataset.t || 0;
			const scale = articleW / ( articleH + articleT );
			const width = colWidth;
			const height = Math.round(width / scale);
			const bottom = Math.min(...colBottoms) + 1;
			const col = colBottoms.indexOf(Math.min(...colBottoms));
			const left = col * (colWidth + itemBorder) + 1;

			articleEl.style.cssText += `width:${width}px;height:${height}px;bottom:${bottom}px;left:${left}px`;
			$( 'img', articleEl ).style.cssText += `margin-top:${articleT/articleW*width}px`;
			colBottoms[col] = bottom - 1 + height + itemBorder;
			

		}
		const allHeight = Math.max(...colBottoms) + itemBorder;
		articlesEl.style.height = allHeight + 'px';
		
	}
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

// build shift
const imageLoaded = el=>{
	el.setAttribute('data-loaded', true);
}
const imageOnload = e=>{
	const imgEl = e.target;
	if(imgEl.complete) return imageLoaded(imgEl);
	imgEl.addEventListener('load', imageLoaded(imgEl));
}
const bindAll = ()=>{
	$$('.article img').forEach(imgEl => {
		imgEl.addEventListener('load', imageOnload);
	});
	resize();
	window.addEventListener('resize', debounce(resize,100));
}

if(articlesEl.innerHTML){
	bindAll();
}else{
	fetch('../articles.json').then(response => response.json()).then(articles => {
		articlesEl.innerHTML = articles.map(article => `<a class="article" ` +
			(article.url ? `href="${article.url}" `: '') +
			`data-w="${article.w}" data-h="${article.h}"` +
			(article.t ? `data-t="${article.t}"` : `` ) +
			`style="--color: ${article.color};">` +
			`<img src="../articles/${article.cover}" alt="${article.title}">` +
				`<div class="content">` +
					`<h2>${article.title}</h2>` +
					`<p>${article.text}</p>` +
				`</div>` +
			`</a>`).join('');
		articleEls = $$('.article');
		bindAll();
	});
}