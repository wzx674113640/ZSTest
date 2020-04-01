window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';

    class EventDefine {
        constructor() {
        }
    }
    EventDefine.OnRecieveMainScopeMsg = "OnRecieveMainScopeMsg";
    EventDefine.OpenRank = "OpenRank";
    EventDefine.CloseRank = "CloseRank";
    EventDefine.ShowRank = "ShowRank";
	Laya.ILaya.regClass(EventDefine);
	Laya.ClassUtils.regClass("zs.laya.opendata.EventId", EventDefine);
    
    class CloudKeyDefine {
        constructor() {
        }
    }
    CloudKeyDefine.Rank = "Rank";
	Laya.ILaya.regClass(CloudKeyDefine);
	Laya.ClassUtils.regClass("zs.laya.opendata.CloudKey", CloudKeyDefine);
    Laya.ClassUtils.regClass("Zhise.OpenViewCloudKey", CloudKeyDefine);

    class UserData {

        constructor() {
            this.userId = null;
        }

    }
    UserData.data = new UserData();
	Laya.ILaya.regClass(UserData);
	Laya.ClassUtils.regClass("zs.laya.opendata.UserData", UserData);
    Laya.ClassUtils.regClass("Zhise.UserData", UserData);

    
    class RankType {

        constructor() {

        }
    }
    RankType.FriendRank = "FriendRank";
    RankType.WorldRank = "WorldRank";
	Laya.ILaya.regClass(RankType);
	Laya.ClassUtils.regClass("zs.laya.opendata.RankType", RankType);
    Laya.ClassUtils.regClass("Zhise.RankType", RankType);

        
    class RankData {

        constructor(index, avatarUrl, nickname, score, isSelf) {
            this.index = index;
            this.avatarUrl = avatarUrl;
            this.nickname = nickname;
            this.score = score;
            this.isSelf = isSelf;
        }

    }
    RankData.selfData = null;
    RankData.friendData = null;
    RankData.worldData = null;
	Laya.ILaya.regClass(RankData);
	Laya.ClassUtils.regClass("zs.laya.opendata.RankData", RankData);
    Laya.ClassUtils.regClass("Zhise.RankData", RankData);
    
    class MainScopeMsg {
        
        constructor(event, data) {
            this.event = event;
            this.data = data;
            this.url = null;
        }
    }
	Laya.ILaya.regClass(MainScopeMsg);
	Laya.ClassUtils.regClass("zs.laya.opendata.MainScopeMsg", MainScopeMsg);
    Laya.ClassUtils.regClass("Zhise.MainScopeMsg", MainScopeMsg);

    exports.EventDefine = EventDefine;
    exports.CloudKeyDefine = CloudKeyDefine;
    exports.UserData = UserData;
    exports.RankType = RankType;
    exports.RankData = RankData;
}(window.zs.laya.opendata = window.zs.laya.opendata || {}, Laya));