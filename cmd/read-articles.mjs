import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import getColors from 'get-image-colors';

const directoryPath = 'articles/';
const articleFiles = [];

const files = fs.readdirSync(directoryPath);
files.forEach((file) => {
	if (path.extname(file).toLowerCase() != '.png') return;

	const filePath = `${directoryPath}${file}`;
	const dimensions = sizeOf(filePath);
	
	getColors(filePath).then(colors => {
		const mainColor = colors[0].hex();
		const filenameWithoutExt = path.basename(file, '.png');
		
		const article = {
			id: filenameWithoutExt,
			title: filenameWithoutExt,
			cover: file,
			w: dimensions.width,
			h: dimensions.height,
			color: mainColor,
			text: filenameWithoutExt
		};

		console.log(article);

		articleFiles.push(article);

		// 如果已经处理完数组中的所有文件，则打印出结果
		if (articleFiles.length === files.length) {
			console.log(JSON.stringify(articleFiles, null, 2));
			fs.writeFileSync('articles.json', JSON.stringify(articleFiles, null, 2));
		}
	}).catch(error => {
		console.error('Error getting colors for image:', filePath, error);
	});
});