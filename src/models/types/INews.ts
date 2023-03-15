export interface INews {
	objLike: string;
	lstArticlesComment: LstArticlesComment[];
	lstImageArticles: LstImageArticle[];
	lstVideoArticles: LstVideoArticle[];
	lstArticlesCommentByLevelResult: null;
	id: number;
	pupilNo: string;
	userID: null;
	postID: string;
	title: string;
	rmks: string;
	groupUserID: string;
	postTypeID: string;
	starTypeID: string;
	isDelete: boolean;
};

export interface LstArticlesComment {
	createDate: Date;
	id: number;
	postID: string;
	comment: string;
	pupilNo: string;
	likeComment: string;
	parentCommentID: number;
	levelTP: number;
};

export interface LstImageArticle {
	imgID: number;
	imgUrl: string;
	postID: string;
	imgType: number;
	uid: null;
};

export interface LstVideoArticle {
	videoID: number;
	videoUrl: string;
	postID: string;
	videoType: number;
};
