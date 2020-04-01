declare module zs.laya.opendata {

    class MainScopeMsg {
        public event: string;
        public data: any;
        public url: string;

        constructor(event: string, data?:any);
    }

    class EventDefine {
        public static readonly OnRecieveMainScopeMsg: string;

        public static readonly OpenRank: string;
        public static readonly CloseRank: string;
        public static readonly ShowRank: string;
    }

    class CloudKeyDefine {
        public static readonly Rank;
    }

    class RankType {
        public static readonly FriendRank;
        public static readonly WorldRank;
    }

    class RankData {
        public index: number;
        public avatarUrl: string;
        public nickname: string;
        public score: number;
        public update_time: number;
        public isSelf: boolean;

        constructor(index: number, avatarUrl: string, nickname: string, score: number, isSelf: boolean)

        public static selfData: RankData;
        public static friendData: RankData[];
        public static worldData: RankData[];
    }

    class UserData {
        public userId: number;
        public static data: UserData;
    }
}