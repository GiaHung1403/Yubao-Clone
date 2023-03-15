export interface IFileRC {
	_id: string;
	name: string;
	size: number;
	type: string;
	rid: string;
	userId: string;
	store: string;
	_updatedAt: Date;
	instanceId: string;
	identify: Identify;
	complete: boolean;
	etag: string;
	path: string;
	progress: number;
	token: string;
	uploadedAt: Date;
	uploading: boolean;
	url: string;
	description: string;
	user: User;
	typeGroup :string ;
}

export interface Identify {
  format: string;
  size: Size;
}

export interface Size {
  width: number;
  height: number;
}

export interface User {
  _id: string;
  username: string;
  name: string;
}
