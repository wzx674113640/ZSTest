window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
        
    class tdAppSdk {
        constructor() {
        }

        static event(eventData) {
            if (!this.initialized) {
                this.initialized = true;
                this.instance = typeof GameGlobal !== "undefined" ? GameGlobal.tdAppSdk : null;
            }
            if (this.instance) {
                this.instance.event(eventData);
                if (eventData.id == this.event_level_complete_id) {
                    var extEvt = new levelCompletedExEvt(eventData.params.userId, eventData.params.levelId);
                    this.instance.event(extEvt);
                }
            }
            else {
                // console.log("--------tdapp:" + JSON.stringify(eventData));
            }
        }
    }
    tdAppSdk.instance = null;
    tdAppSdk.initialized = false;
    tdAppSdk.event_startup_id = "startup";
    tdAppSdk.event_startup_label = "微信加载完成游戏启动";
    tdAppSdk.event_login_id = "login";
    tdAppSdk.event_login_label = "登陆成功";    
    tdAppSdk.event_game_start_id = "gameStart";
    tdAppSdk.event_game_start_label = "游戏开始";    
    tdAppSdk.event_game_over_id = "gameOver";
    tdAppSdk.event_game_over_label = "游戏结束";    
    tdAppSdk.event_level_complete_id = "levelComplete";
    tdAppSdk.event_level_complete_label = "通关关卡";
    Laya.ClassUtils.regClass("zs.laya.tdapp.tdAppSdk", tdAppSdk);
    
    class tdAppEvent {
        constructor() {
            this.id = "";
            this.label = "";
            this.params = null;
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.tdAppEvent", tdAppEvent);    

    class startupEvt extends tdAppEvent {
        constructor() {
            super();
            this.id = tdAppSdk.event_startup_id;
            this.label = tdAppSdk.event_startup_label;
            this.params = {timestamp: Date.now()};
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.startupEvt", startupEvt);

    class loginEvt extends tdAppEvent {
        constructor(userId) {
            super();
            this.id = tdAppSdk.event_login_id;
            this.label = tdAppSdk.event_login_label;
            this.params = {timestamp: Date.now(), userId: userId};
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.loginEvt", loginEvt);

    class gameStartEvt extends tdAppEvent {
        constructor(userId, gameId) {
            super();
            this.id = tdAppSdk.event_game_start_id;
            this.label = tdAppSdk.event_game_start_label;
            this.params = {timestamp: Date.now(), userId: userId, gameId: gameId};
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.gameStartEvt", gameStartEvt);
    
    class gameOverEvt extends tdAppEvent {
        constructor(userId, gameId, result) {
            super();
            this.id = tdAppSdk.event_game_over_id;
            this.label = tdAppSdk.event_game_over_label;
            this.params = {timestamp: Date.now(), userId: userId, gameId: gameId, result: result};
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.gameOverEvt", gameOverEvt);

    class levelCompletedEvt extends tdAppEvent {
        constructor(userId, levelId) {
            super();
            this.id = tdAppSdk.event_level_complete_id;
            this.label = tdAppSdk.event_level_complete_label;
            this.params = {timestamp: Date.now(), userId: userId, levelId: levelId};
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.levelCompletedEvt", levelCompletedEvt);

    class levelCompletedExEvt extends tdAppEvent {
        constructor(userId, levelId) {
            super();
            this.id = tdAppSdk.event_level_complete_id + "_" + levelId;
            this.label = tdAppSdk.event_level_complete_label + "_" + levelId;
            this.params = {timestamp: Date.now(), userId: userId, levelId: levelId};
        }
    }
    Laya.ClassUtils.regClass("zs.laya.tdapp.levelCompletedExEvt", levelCompletedExEvt);

    exports.tdAppSdk = tdAppSdk;
    exports.tdAppEvent = tdAppEvent;
    exports.startupEvt = startupEvt;
    exports.loginEvt = loginEvt;
    exports.gameStartEvt = gameStartEvt;
    exports.gameOverEvt = gameOverEvt;
    exports.levelCompletedEvt = levelCompletedEvt;
    exports.levelCompletedExEvt = levelCompletedExEvt;
}(window.zs.laya.tdapp = window.zs.laya.tdapp || {}, Laya));