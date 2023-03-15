export interface ISortRoom {
  sortOptionSelected?: string;
  groupOptionSelected?: IGroupRoomOption;
}

export interface IGroupRoomOption {
  isUnreadOnTop?: boolean;
  isGroupByType?: boolean;
  isGroupByFavorites?: boolean;
}
