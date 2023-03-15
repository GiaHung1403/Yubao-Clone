export interface IPinMessage {
	_id: string;
	_updatedAt: Date;
	attachments: Attachment[];
	channels: any[];
	file: File;
	groupable: boolean;
	mentions: any[];
	msg: string;
	pinned: boolean;
	pinnedAt: Date;
	pinnedBy: PinnedBy;
	rid: string;
	ts: Date;
	u: U;
	urls: any[];
	md: any
}

export interface Attachment {
	title: string;
	title_link: string;
	title_link_download: boolean;
	ts: Date;
	type: string;
}

export interface File {
	_id: string;
	name: string;
	type: string;
}

export interface PinnedBy {
	_id: string;
	username: string;
}

interface U {
	_id: string;
	name: string;
	username: string;
}
