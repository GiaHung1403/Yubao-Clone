function isURLImage(url: string) {
	return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function isImageHTTPS(url: string) {
	return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export default isURLImage;
