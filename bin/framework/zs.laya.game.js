window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
    class EventId {
        constructor() {
        }
    }
    EventId.NET_XHR_RESPONSE = zs.laya.XHRUtils.NET_XHR_RESPONSE;
    EventId.APP_SHOW = zs.laya.DeviceService.EVENT_ON_SHOW;
    EventId.APP_HIDE = zs.laya.DeviceService.EVENT_ON_HIDE;
    EventId.APP_JUMP_CANCEL = "NAVIGATE_FAILED"; //zs.laya.platform.AdList.EVENT_NAVIGATE_FAILED; 跳转失败
    EventId.APP_JUMP_SUCCESS = "NAVIGATE_SUCCESS";//zs.laya.platform.AdList.EVENT_NAVIGATE_SUCCESS; 跳转成功
    EventId.AD_CONFIIG_LOADED = "AD_CONFIIG_LOADED";
    EventId.UI_TOAST_MESSAGE = "UI_TOAST_MESSAGE";
    EventId.UI_PROGRESS_UPDATE = zs.laya.ui.LoadingBar.EVENT_UI_PROGRESS_UPDATE;
    EventId.UI_TICK_COUNT_COMPLETE = zs.laya.ui.TickCount.EVENT_UI_TICK_COUNT_COMPLETE;
    EventId.UI_VIEW_CLOSED = zs.laya.base.BaseView.EVENT_UI_VIEW_CLOSED;
    EventId.UI_VIEW_OPENED = zs.laya.base.BaseView.EVENT_UI_VIEW_OPENED;

    EventId.AD_VIDEO_PLAY = "EVENT_AD_VIDEO_PLAY";//SdkService.EVENT_AD_VIDEO_PLAY;
    EventId.AD_VIDEO_CLOSED = "EVENT_AD_VIDEO_CLOSED";//SdkService.EVENT_AD_VIDEO_CLOSED;

    EventId.UI_STORE_SWITCH_TAB = zs.laya.ui.StorePage.EVENT_SWITCH_TAB;
    EventId.UI_STORE_SWITCH_ITEM = zs.laya.ui.StorePage.EVENT_SWITCH_ITEM;
    EventId.UI_STORE_ITEM_EQUIPED = zs.laya.ui.StorePage.EVENT_ITEM_EQUIPED;
    EventId.UI_STORE_ITEM_UNLOCKED = zs.laya.ui.StorePage.EVENT_ITEM_UNLOCKED;
    EventId.LAUNCH_COMPLETED = "EVENT_LAUNCH_COMPLETED";
    EventId.DATA_SETTING_UPDATE = "DATA_SETTING_UPDATE";
    EventId.DATA_LOGIN_INFO_UPDATE = "DATA_LOGIN_INFO_UPDATE";
    EventId.GAME_SLEEP = "GAME_SLEEP";
    EventId.GAME_WAKEUP = "GAME_WAKEUP";
    EventId.GAME_HOME = "GAME_HOME";
    EventId.GAME_PREPARE = "GAME_PREPARE";
    EventId.GAME_START = "GAME_START";
    EventId.GAME_WIN = "GAME_WIN";
    EventId.GAME_FAILED = "GAME_FAILED";
    EventId.GAME_RELIVE = "GAME_RELIVE";
    EventId.GAME_AGAIN = "GAME_AGAIN";
    EventId.GAME_OVER = "GAME_OVER";
    EventId.EGG_GET_AWARD = "EGG_GET_AWARD";
    EventId.OPEN_WIN_VIEW = "OPEN_WIN_VIEW"; //PlatformMgr.OPEN_WIN_VIEW = "OPEN_WIN_VIEW"; 打开胜利界面
    EventId.OPEN_FAILED_VIEW = "OPEN_FAILED_VIEW";//PlatformMgr.OPEN_FAILED_VIEW = "OPEN_FAILED_VIEW";打开失败界面
    EventId.GAME_RESET_START = "GAME_RESET_START";//PlatformMgr.GAME_RESET_START = "GAME_RESET_START";重置游戏回到首页
    Laya.ILaya.regClass(EventId);
    Laya.ClassUtils.regClass("zs.laya.game.EventId", EventId);
    Laya.ClassUtils.regClass("Zhise.EventId", EventId);

    class GameState {
        constructor() {
        }
    }
    GameState.STATE_LOADING = 0;
    GameState.STATE_UNBEGIN = 1;
    GameState.STATE_PREPARE = 2;
    GameState.STATE_PLAYING = 3;
    GameState.STATE_PAUSE = 4;
    Laya.ILaya.regClass(GameState);
    Laya.ClassUtils.regClass("zs.laya.game.GameState", GameState);
    Laya.ClassUtils.regClass("Zhise.GameState", GameState);

    class WebRequestArgs {
        constructor() {
        }

        static reqLoginArgs() {
            if (this.Instance.reqLoginArgs) {
                return this.Instance.reqLoginArgs();
            }
            else {
                return {};
            }
        }

        static reqUserInfoArgs() {
            if (this.Instance.reqUserInfoArgs) {
                return this.Instance.reqUserInfoArgs();
            }
            else {
                return {};
            }
        }

        static reqBaseCfgArgs() {
            if (this.Instance.reqBaseCfgArgs) {
                return this.Instance.reqBaseCfgArgs();
            }
            else {
                return {};
            }
        }

        static reqStartGameArgs() {
            if (this.Instance.reqStartGameArgs) {
                return this.Instance.reqStartGameArgs();
            }
            else {
                return {};
            }
        }

        static reqEndGameArgs() {
            if (this.Instance.reqEndGameArgs) {
                return this.Instance.reqEndGameArgs();
            }
            else {
                return {};
            }
        }

        static reqTopRankArgs() {
            if (this.Instance.reqTopRankArgs) {
                return this.Instance.reqTopRankArgs();
            }
            else {
                return {};
            }
        }

        static uploadVideoArgs() {
            if (this.Instance.uploadVideoArgs) {
                return this.Instance.uploadVideoArgs();
            }
            else {
                return {};
            }
        }
    }
    WebRequestArgs.Instance = {
        reqLoginArgs: function () { return {}; },
        reqUserInfoArgs: function () { return {}; },
        reqBaseCfgArgs: function () { return {}; },
        reqStartGameArgs: function () { return {}; },
        reqEndGameArgs: function () { return {}; },
        reqTopRankArgs: function () { return {}; },
        uploadVideoArgs: function () { return {}; }
    };
    Laya.ILaya.regClass(WebRequestArgs);
    Laya.ClassUtils.regClass("zs.laya.game.WebRequestArgs", WebRequestArgs);
    Laya.ClassUtils.regClass("Zhise.WebRequestArgs", WebRequestArgs);

    class WebService {
        constructor() {
        }

        static requestLoginByCode(identityId, args) {
            var webArgs = args || {};
            webArgs.code = identityId;
            webArgs.timestamp = Date.now();
            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSign(this.WebApiMap.login, webArgs, this.RequestSign);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.login, webArgs);
                }
                console.log(this.WebApiMap.login);
            }
            else {
                var appMain = AppMain;
                console.log(this.WebApiMap.login);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.login,
                        webArgs,
                        { "data": appMain.appConfig.playerInfo }]);
                });
            }
        }

        static requestLoginByUserId(userId, args) {
            var webArgs = args || {};
            webArgs.user_id = userId;
            webArgs.timestamp = Date.now();
            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.login, webArgs, this.RequestSign, this.RequestHeader);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.login, webArgs);
                }
                console.log(this.WebApiMap.login);
            }
            else {
                var appMain = AppMain;
                console.log(this.WebApiMap.login);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.login,
                        webArgs,
                        { "data": appMain.appConfig.defaultCfg.playerInfo }]);
                });
            }
        }

        static requestAuthorize(nickname, avatar, gender) {
            var appMain = AppMain;
            var webArgs = { "user_id": appMain.playerInfo.user_id, "nickname": nickname, "avatar": avatar, "gender": gender, "timestamp": Date.now() };
            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.authorize, webArgs,
                        this.RequestSign, this.RequestHeader);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.authorize, webArgs);
                }
                console.log(this.WebApiMap.authorize);
            }
            else {
                console.log(this.WebApiMap.authorize);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.authorize,
                        webArgs,
                        { "data": appMain.appConfig.defaultCfg.playerInfo }]);
                });
            }
        }

        static requestBaseCfg(args) {
            var webArgs = args || {};
            var appMain = AppMain;
            var useSign = false;
            if(appMain.appConfig.configVersion){
                webArgs.v_type = appMain.appConfig.configVersion;
                useSign = true;
            }
            if (this.UseWebApi) {
                if(this.RequestSign && useSign){
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.gameCfg, webArgs,
                        this.RequestSign, this.RequestHeader);
                }else{
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.gameCfg, webArgs);
                }
                console.log(this.WebApiMap.gameCfg);
            }
            else {
                console.log(this.WebApiMap.gameCfg);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.gameCfg,
                        webArgs,
                        { "data": appMain.appConfig.defaultCfg.gameSetting }]);
                });
            }
        }

        /**主动同步用户信息给后台 */
        static updatePlayerInfo(args) {
            var appMain = AppMain;
            var webArgs = args || {};
            webArgs.user_id = appMain.playerInfo.user_id;
            webArgs.timestamp = Date.now();
            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.updateInfo, webArgs,
                        this.RequestSign, this.RequestHeader);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.updateInfo, webArgs);
                }
                console.log(this.WebApiMap.updateInfo);
            }
            else {
                console.log(this.WebApiMap.updateInfo);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.updateInfo,
                        webArgs,
                        { "data": "success" }]);
                });
            }
        }

        static startGame(args) {
            var appMain = AppMain;
            var webArgs = args || {};
            webArgs.user_id = appMain.playerInfo.user_id;
            webArgs.timestamp = Date.now();
            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.gameStart, webArgs,
                        this.RequestSign, this.RequestHeader);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.gameStart, webArgs);
                }
                console.log(this.WebApiMap.gameStart);
            }
            else {
                console.log(this.WebApiMap.gameStart);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.gameStart,
                        webArgs,
                        { "data": appMain.appConfig.defaultCfg.levelData }]);
                });
            }
        }

        static endGame(args) {
            var webArgs = args || {};
            webArgs.user_id = AppMain.playerInfo.user_id;
            webArgs.game_id = AppMain.levelData.game_id;
            if(!webArgs.level_id){
                webArgs.level_id = AppMain.playerInfo.level_id;
            }
            //如果外部没有赋值每局获取的金币，则去配置
            if(!webArgs.gold){
                webArgs.gold = AppMain.levelData.rewardGold ? AppMain.levelData.rewardGold : 0;
            }
            webArgs.is_win = AppMain.isWin ? 1:0;
            webArgs.timestamp = Date.now();

            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.gameEnd, webArgs,
                        this.RequestSign, this.RequestHeader);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.gameEnd, webArgs);
                }
                console.log(this.WebApiMap.gameEnd);
            }
            else {
                console.log(this.WebApiMap.gameEnd);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.gameEnd,
                        webArgs,
                        { "data": { "gold": 100 } }]);
                });
            }
        }

        static requestTopRank(args) {
            var webArgs = args || {};
            webArgs.timestamp = Date.now();
            if (this.UseWebApi) {
                zs.laya.XHRUtils.xhrPost(this.WebApiMap.worldRank, webArgs);
                console.log(this.WebApiMap.worldRank);
            }
            else {
                console.log(this.WebApiMap.worldRank);
            }
        }

        static updateVideoLog(args) {
            var webArgs = args || {};
            webArgs.user_id = AppMain.playerInfo.user_id;
            webArgs.timestamp = Date.now();
            if (this.UseWebApi) {
                if (this.RequestSign) {
                    zs.laya.XHRUtils.xhrPostWithSignAndHeader(this.WebApiMap.logVideo, webArgs,
                        this.RequestSign, this.RequestHeader);
                }
                else {
                    zs.laya.XHRUtils.xhrPost(this.WebApiMap.logVideo, webArgs);
                }
                // zs.laya.XHRUtils.xhrPost(this.WebApiMap.logVideo, webArgs);
                console.log(this.WebApiMap.logVideo);
            }
            else {
                console.log(this.WebApiMap.logVideo);
                Laya.stage.frameOnce(1, this, function () {
                    Laya.stage.event(EventId.NET_XHR_RESPONSE, [
                        1,
                        this.WebApiMap.logVideo,
                        webArgs,
                        null]);
                });
            }
        }

    }
    WebService.WebApiMap = null;
    WebService.RequestHeader = {};
    WebService.RequestSign = null;
    WebService.UseWebApi = false;
    Laya.ILaya.regClass(WebService);
    Laya.ClassUtils.regClass("zs.laya.game.WebService", WebService);
    Laya.ClassUtils.regClass("Zhise.WebService", WebService);

    class UIService extends Laya.Script {
        constructor() {
            super();
            this.toastMsg = null;
            this.toastCompleted = false;
            this.toastList = [];
        }

        static setOpenSound(soundUrl) {
            this.openSound = soundUrl;
        }

        static setUIResConfig(config) {
            this.viewConfig = config;
        }

        /**
         * showLoading
         */
        static showLoading(data) {
            if (this.viewConfig.loading == null) {
                console.error("showLoading error");
                return;
            }
            Laya.Scene.open(this.viewConfig.loading, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.loading, data);
            }));
        }

        static hideLoading() {
            if (this.viewConfig.loading == null) {
                return;
            }
            Laya.Scene.close(this.viewConfig.loading);
        }

        /**
         * showHome
         */
        static showHome(data) {
            if (this.viewConfig.home == null) {
                console.error("showHome error");
                return;
            }
            Laya.Scene.open(this.viewConfig.home, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.home, data);
            }));
        }

        static hideHome() {
            if (this.viewConfig.home == null) {
                return;
            }
            Laya.Scene.close(this.viewConfig.home);
        }
        
        /**
         * showPlaying
         */
        static showPlaying(data) {
            if (this.viewConfig.playing == null) {
                console.error("showPlaying error");
                return;
            }
            Laya.Scene.open(this.viewConfig.playing, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.playing, data);
            }));
        }

        /**
         * showPlaying
         */
        static hidePlaying() {
            if (this.viewConfig.playing == null) {
                return;
            }
            Laya.Scene.close(this.viewConfig.playing);
        }

        /**
         * showRelive
         */
        static showRelive(data) {
            if (this.viewConfig.relive == null) {
                console.error("showRelive error");
                return;
            }
            Laya.Scene.open(this.viewConfig.relive, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.relive, data);
            }));
            Laya.SoundManager.playSound(this.openSound);
        }

        /**
         * hideRelive
         */
        static hideRelive() {
            if (this.viewConfig.relive == null) {
                return;
            }
            Laya.Scene.close(this.viewConfig.relive)
        }

        /**
         * showScore
         */
        static showScore(data) {
            if (this.viewConfig.score == null) {
                console.error("showScore error");
                return;
            }
            Laya.Scene.open(this.viewConfig.score, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.score, data);
            }));
            Laya.SoundManager.playSound(this.openSound);
        }

        /**
         * hideScore
         */
        static hideScore() {
            if (this.viewConfig.score == null) {
                return;
            }
            Laya.Scene.close(this.viewConfig.score)
        }

        static showStore(data) {
            if (this.viewConfig.store == null) {
                console.error("showStore error");
                return;
            }
            Laya.Scene.open(this.viewConfig.store, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.store, data);
            }));
            Laya.SoundManager.playSound(this.openSound);
        }

        static hideStore() {
            if (this.viewConfig.store == null) {
                return;
            }
            Laya.Scene.close(this.viewConfig.store)
        }

        static showGuide(data) {
            if (this.viewConfig.guide == null) {
                console.error("showGuide error");
                return;
            }
            Laya.Scene.open(this.viewConfig.guide, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.viewScript.guide, data);
            }));
        }

        static hideGuide() {
            if (this.viewConfig.guide == null) {
                console.error("hideGuide error");
                return;
            }
            Laya.Scene.close(this.viewConfig.guide);
        } 

        static showMsgBox(data) {
            if (this.viewConfig.msgBox == null) {
                console.error("showMsgBox error");
                return;
            }
            Laya.Scene.open(this.viewConfig.msgBox, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, zs.laya.ui.MsgBoxView, data);
            }));
        }

        static initView(view, type, data) {
            view._gameData = data;
            if (type) {
                var script = view.getComponent(type);
                if (script == null) {
                    script = view.addComponent(type);
                }
                if (script.initView) {
                    script.initView(data)
                }
            }
        }

        static showToast(msg) {
            if (this.sInstance) {
                this.sInstance.popToastMsg(msg);
            }
        }

        popToastMsg(msg) {
            this.toastList.push(msg);
            if (this.toastMsg == null) {
                Laya.loader.create("prefab/toastMsg.json", Laya.Handler.create(this, this.onToastPrefabReady), null, Laya.Loader.PREFAB);
            }
            else if (this.toastList.length == 1 && this.toastCompleted) {
                this.popToast();
            }
        }

        onToastPrefabReady(prefab) {
            this.toastMsg = this.owner.addChild(prefab.create());
            this.popToast();
        }

        popToast() {
            if (this.toastList.length == 0) {
                this.toastMsg.visible = false;
                return;
            }

            this.toastCompleted = false;
            var msg = this.toastList.shift();
            this.toastMsg.visible = true;
            this.toastMsg.text = msg;
            this.toastMsg.centerY = 400;
            this.toastMsg.zOrder = 100;
            var self = this;
            Laya.Tween.to(this.toastMsg, { centerY: 0 }, 500, null, Laya.Handler.create(this, function () {
                self.toastCompleted = true;
                Laya.timer.once(500, self, self.popToast);
            }));
        }

        onAwake() {
            UIService.sInstance = this;
        }

        onDestroy() {
            UIService.sInstance = null;
        }

        onEnable() {
            Laya.stage.on(UIService.UI_TOAST_MESSAGE, this, this.popToastMsg);
        }

        onDisable() {
            Laya.stage.off(UIService.UI_TOAST_MESSAGE, this, this.popToastMsg);
        }
    }
    UIService.UI_TOAST_MESSAGE = EventId.UI_TOAST_MESSAGE;
    UIService.sInstance = null;
    UIService.openSound = "sound/viewOpen.wav";
    UIService.viewConfig = {};
    UIService.viewScript = {};
    Laya.ILaya.regClass(UIService);
    Laya.ClassUtils.regClass("zs.laya.game.UIService", UIService);
    Laya.ClassUtils.regClass("zs.laya.game.ViewService", UIService);
    Laya.ClassUtils.regClass("Zhise.ViewService", UIService);

    class PlatformInterface  {
        constructor() {
        }

        static enterGamePopup() {
            if (this.Instance.enterGamePopup) {
                return this.Instance.enterGamePopup();
            }
            else {
                return {};
            }
        }

        static onGameFaildPopUp() {
            if (this.Instance.onGameFaildPopUp) {
                return this.Instance.onGameFaildPopUp();
            }
            else {
                return {};
            }
        }

        static onGameWinPopUp() {
            if (this.Instance.onGameWinPopUp) {
                return this.Instance.onGameWinPopUp();
            }
            else {
                return {};
            }
        }

        static onGameOverPopUp() {
            if (this.Instance.onGameOverPopUp) {
                return this.Instance.onGameOverPopUp();
            }
            else {
                return {};
            }
        }

        static showInsertAd() {
            if (this.Instance.showInsertAd) {
                return this.Instance.showInsertAd();
            }
            else {
                return {};
            }
        }

        static onExportJumpCancel() {
            if (this.Instance.onExportJumpCancel) {
                return this.Instance.onExportJumpCancel();
            }
            else {
                return {};
            }
        }
    }

    PlatformInterface.Instance = {
        enterGamePopup: function () { return {}; },
        onGameFaildPopUp: function () { return {}; },
        onGameWinPopUp: function () { return {}; },
        onGameOverPopUp: function () { return {}; },
        showInsertAd: function () { return {}; },
        onExportJumpCancel: function () { return {}; }
    };
    Laya.ILaya.regClass(PlatformInterface);
    Laya.ClassUtils.regClass("zs.laya.game.PlatformInterface", PlatformInterface);
    Laya.ClassUtils.regClass("Zhise.PlatformInterface", PlatformInterface);

    class AppMain extends Laya.Script {

        constructor() {
            super();
            this.configFirstReady = false;
            this.loginFirstReady = false;
            this.isSettingReady = false;
            this.isLoginSuccess = false;
            this.loginData = null;
            this.isBaseSpriteReady = false;
            this.default3DScene = null;
            this.launchResReady = false;
            this.progressHandler = null;
        }

        static get GameState() {
            return this.gameState;
        }

        static set GameState(val) {
            this.gameState = val;
        }

        static get ReliveChance() {
            return this.reliveChance;
        }

        static set ReliveChance(val) {
            this.reliveChance = val;
        }

        static get LevId() {
            var strLevId = Laya.LocalStorage.getItem("levId");
            if (strLevId == null || strLevId.length == 0) {
                return 0;
            }
            else {
                return Number(strLevId);
            }
        }

        static set LevId(val) {
            Laya.LocalStorage.setItem("levId", val.toString());
        }

        onAwake() {
            zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.startupEvt());
            zs.laya.sdk.SdkService.initSDK();
            Laya.stage.addComponent(zs.laya.Resource);
            Laya.stage.addComponent(zs.laya.ObjectPool);
            Laya.stage.addComponent(zs.laya.DeviceService);
            // Laya.stage.addComponent(zs.laya.EffectFactory);
            Laya.stage.addComponent(UIService);
            Laya.stage.on(EventId.GAME_HOME, this, this.onGameHome);
            Laya.stage.on(EventId.GAME_PREPARE, this, this.onGamePrepare);
            Laya.stage.on(EventId.GAME_START, this, this.onGameStart);
            Laya.stage.on(EventId.GAME_OVER, this, this.onGameOver);
            Laya.stage.on(EventId.GAME_RELIVE, this, this.onGameRelive);
            Laya.stage.on(EventId.GAME_FAILED, this, this.onGameFailed);
            Laya.stage.on(EventId.GAME_WIN, this, this.onGameWin);
            Laya.stage.on(EventId.OPEN_WIN_VIEW,this,this.onOpenWinView);
            Laya.stage.on(EventId.OPEN_FAILED_VIEW,this,this.onOpenFailedView);
            Laya.stage.on(EventId.GAME_RESET_START,this,this.onGameOverToStart);
            Laya.stage.on(EventId.APP_SHOW, this, this.onGameShow);
            Laya.stage.on(EventId.APP_HIDE, this, this.onGameHide);
            Laya.stage.on(EventId.APP_JUMP_CANCEL, this, this.onJumpCancel);
            Laya.stage.on(EventId.NET_XHR_RESPONSE, this, this.onNetXHRResponse);
            Laya.loader.load(["config/gameCfg.json", "config/publishVer.json"], Laya.Handler.create(this, this.onGameCfgReady));
            UIService.viewScript = {
                loading: zs.laya.ui.LoadingView,
                home: zs.laya.ui.HomeView,
                playing: zs.laya.base.ZhiSeView,
                relive: zs.laya.ui.ReliveView,
                score: zs.laya.ui.WinView,
                rank: zs.laya.ui.RankView,
                msgBox: zs.laya.ui.MsgBoxView,
                guide: zs.laya.base.ZhiSeView,
                store: zs.laya.ui.StorePage
            }
        }

        onDestroy() {
            Laya.stage.off(EventId.GAME_HOME, this, this.onGameHome);
            Laya.stage.off(EventId.GAME_PREPARE, this, this.onGamePrepare);
            Laya.stage.off(EventId.GAME_START, this, this.onGameStart);
            Laya.stage.off(EventId.GAME_OVER, this, this.onGameOver);
            Laya.stage.off(EventId.GAME_RELIVE, this, this.onGameRelive);
            Laya.stage.off(EventId.GAME_FAILED, this, this.onGameFailed);
            Laya.stage.off(EventId.GAME_WIN, this, this.onGameWin);
            Laya.stage.off(EventId.OPEN_WIN_VIEW,this,this.onOpenWinView);
            Laya.stage.off(EventId.OPEN_FAILED_VIEW,this,this.onOpenFailedView);
            Laya.stage.off(EventId.GAME_RESET_START,this,this.onGameOverToStart);
            Laya.stage.off(EventId.APP_SHOW, this, this.onGameShow);
            Laya.stage.off(EventId.APP_HIDE, this, this.onGameHide);
            Laya.stage.off(EventId.APP_JUMP_CANCEL, this, this.onJumpCancel);
            Laya.stage.off(EventId.NET_XHR_RESPONSE, this, this.onNetXHRResponse);
        }

        onGameCfgReady() {
            var cfg = Laya.loader.getRes("config/gameCfg.json");
            AppMain.appConfig = cfg;
            AppMain.appConfig.version = Laya.loader.getRes("config/publishVer.json");
            AppMain.playerInfo = cfg.defaultCfg.playerInfo;
            AppMain.gameSetting = cfg.defaultCfg.gameSetting;
            WebService.WebApiMap = AppMain.appConfig.webApiMap;
            WebService.UseWebApi = AppMain.appConfig.useWebApi;
            WebService.RequestSign = AppMain.appConfig.webApiSign;
            UIService.viewConfig = cfg.viewMap;
            UIService.openSound = cfg.soundViewOpen;
            Laya.stage.once(EventId.UI_VIEW_OPENED, this, this.onLoadingOpened, [cfg.baseResList, cfg.fontList, cfg.configList]);
            UIService.showLoading();

            if (AppMain.appConfig.useWebAdApi) {
                Laya.loader.load(["config/platformCfg.json"], Laya.Handler.create(this, this.onPlatformCfgReady));
            }
            this.login();
        }

        /**初始化广告数据 */
        onPlatformCfgReady(){
            var platformCfg = Laya.loader.getRes("config/platformCfg.json");
            zs.laya.platform.PlatformMgr.initCFG(platformCfg);
            zs.laya.platform.PlatformMgr.initSoundUrl(AppMain.appConfig.soundViewOpen,AppMain.appConfig.soundClick);
            var self = this;
            zs.laya.zsapp.zsAppSdk.loadConfig(
                function (data) {
                    zs.laya.platform.ADConfig.initAdSetting(AppMain.appConfig.version,data);
                    zs.laya.platform.PlatformMgr.initGameAd();
                    Laya.stage.event(zs.laya.game.EventId.AD_CONFIIG_LOADED);
                },
                function (error) {
                    console.error(error);
                    zs.laya.platform.ADConfig.initAdSetting(AppMain.appConfig.version,platformCfg.adCfg);
                    zs.laya.platform.PlatformMgr.initGameAd();
                }
            );
        }

        onLoadingOpened() {
            if (this.progressHandler) {
                this.progressHandler.recover();
                this.progressHandler = null;
            }
            this.loadSubpackage();
        }

        loadSubpackage() {
            while (AppMain.appConfig.subpackage && AppMain.appConfig.subpackage.length > 0) {
                const pkgName = AppMain.appConfig.subpackage.shift();
                const res = zs.laya.sdk.SdkService.loadSubpackage(
                    pkgName,
                    null,
                    Laya.Handler.create(this, this.loadSubpackage),
                    Laya.Handler.create(this, this.loadSubpackage));
                if (res) {
                    return;
                }
            }
            if (this.progressHandler) {
                this.progressHandler.recover();
                this.progressHandler = null;
            }
            this.loadBaseConfig();
            this.loadFont();
        }

        loadBaseConfig() {
            var urls = [];
            AppMain.appConfig.configList.forEach(function (cfgUrl) {
                urls.push(cfgUrl);
            });

            if (urls.length == 0) {
                this.onBaseConfigReady();
            }
            else {
                this.progressHandler = Laya.Handler.create(this, this.onLoadProgressUpdate, [0], false);
                Laya.loader.load(urls,
                    Laya.Handler.create(this, this.onBaseConfigReady),
                    this.progressHandler
                );
            }
        }

        onBaseConfigReady() {
            if (this.progressHandler) {
                this.progressHandler.recover();
                this.progressHandler = null;
            }
            this.loadBaseRes();
        }

        loadBaseRes() {
            var urls = [];
            AppMain.appConfig.baseResList.forEach(function (cfgUrl) {
                urls.push(zs.laya.Resource.Get3dPrefabUrl(cfgUrl));
            });

            if (urls.length == 0) {
                this.onBaseResReady();
            }
            else {
                this.progressHandler = Laya.Handler.create(this, this.onLoadProgressUpdate, [1], false);
                Laya.loader.create(urls,
                    Laya.Handler.create(this, this.onBaseResReady),
                    this.progressHandler
                );
            }
        }

        onBaseResReady() {
            if (this.progressHandler) {
                this.progressHandler.recover();
                this.progressHandler = null;
            }
            this.loadScene3d();
        }

        loadFont() {
            var self = this;
            AppMain.appConfig.fontList.forEach(function (fontUrl) {
                var font = new Laya.BitmapFont();
                font.loadFont(`font/${fontUrl}.fnt`, Laya.Handler.create(self, self.onFontReady, [font, fontUrl]));
            });
        }

        onFontReady(font, fontUrl) {
            Laya.Text.registerBitmapFont(fontUrl, font);
        }

        loadScene3d() {
            if (AppMain.appConfig.default3DScene == null || AppMain.appConfig.default3DScene.length == 0) {
                this.onLaunchResReady(null);
                return;
            }

            this.progressHandler = Laya.Handler.create(this, this.onLoadProgressUpdate, [2], false);
            zs.laya.Resource.LoadScene3dAsyn(
                AppMain.appConfig.default3DScene,
                Laya.Handler.create(this, this.onLaunchResReady),
                this.progressHandler
            );
        }

        onLaunchResReady(s) {
            if (this.progressHandler) {
                this.progressHandler.recover();
                this.progressHandler = null;
            }
            this.launchResReady = true;
            this.default3DScene = s;
            this.launchCompleted();
        }

        onLoadProgressUpdate(step, val) {
            Laya.stage.event(EventId.UI_PROGRESS_UPDATE, step * 0.25 + 0.25 * val)
        }

        onNetXHRResponse(result, api, params, response) {
            if (api == WebService.WebApiMap.login) {
                if (result == 1) {
                    AppMain.playerInfo = AppMain.webResponseAdatper.LoginResponse(response.data);
                    zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.loginEvt(AppMain.playerInfo.user_id));
                    var objLoginCahce = {
                        userId: AppMain.playerInfo.user_id,
                        lastLoginDate: Date.now(),
                        t: AppMain.playerInfo.t,
                        timestamp: AppMain.playerInfo.timestamp
                    }
                    Laya.LocalStorage.setJSON("loginCacheData", objLoginCahce);
                    this.isLoginSuccess = true;
                    
                    if (AppMain.playerInfo.level_id == null) {
                        AppMain.playerInfo.level_id = AppMain.LevId;
                    }
                }
                else {
                    AppMain.playerInfo = AppMain.appConfig.defaultCfg.playerInfo;
                    this.isLoginSuccess = false;
                    if (AppMain.playerInfo.level_id == null) {
                        AppMain.playerInfo.level_id = AppMain.LevId;
                    }
                }
                WebService.RequestHeader = { t: AppMain.playerInfo.t, timestamp: AppMain.playerInfo.timestamp };
                zs.laya.zsapp.zsAppSdk.init(AppMain.playerInfo.user_id, Laya.Browser.onAndroid ? 1 : 0);

                if (this.loginFirstReady == false) {
                    this.loginFirstReady = true;
                    this.launchCompleted();
                }
                //Laya.stage.event(EventId.DATA_LOGIN_INFO_UPDATE);
            }
            if (api == WebService.WebApiMap.logVideo) {
                if (result == 1) {
                    zs.laya.zsapp.zsAppSdk.sendVideoLog();
                }
            }
            else if (api == WebService.WebApiMap.gameCfg) {
                if (result == 1) {
                    AppMain.gameSetting = AppMain.webResponseAdatper.BaseCfgResponse(response.data);
                    AppMain.storeCfg = {}
                    if (response.data.ai_config && response.data.ai_config.Shop) {
                        AppMain.storeCfg.shopPrice = response.data.ai_config.Shop;
                    }
                    else {
                        AppMain.storeCfg.shopPrice = [];
                    }
                    if (response.data.config_list && response.data.config_list.videoCoin) {
                        AppMain.storeCfg.videoCoin = Number(response.data.config_list.videoCoin)
                    }
                    else {
                        AppMain.storeCfg.videoCoin = 100;
                    }
                    this.isSettingReady = true;
                }
                else {
                    this.isSettingReady = false;
                }
                Laya.stage.event(EventId.DATA_SETTING_UPDATE);
                if (this.configFirstReady == false) {
                    this.configFirstReady = true;
                    this.launchCompleted();
                }
            }
            else if (api == WebService.WebApiMap.updateInfo) {
                if (result == 1) {
                    console.log("------ update info success!");
                }
            }
            else if (api == WebService.WebApiMap.gameStart) {
                if (result == 1) {
                    AppMain.levelData = response.data;
                    if(response.data.game_id){
                        AppMain.levelData.game_id = response.data.game_id;
                    }
                }
                else {
                    AppMain.levelData = AppMain.appConfig.defaultCfg.levelData;
                }
                AppMain.gameStartRet = AppMain.webResponseAdatper.GameStartResponse(response.data);
                zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.gameStartEvt(AppMain.playerInfo.user_id, AppMain.levelData.game_id));
                Laya.stage.event(EventId.GAME_PREPARE, response.data);
            }
            else if (api == WebService.WebApiMap.gameEnd) {
                if (result == 1) {
                    if (response.data.gold) {
                        AppMain.playerInfo.gold = Number(response.data.gold);
                    }
                    if (AppMain.isWin) {
                        AppMain.LevId += 1;
                        if (response.data.level_id) {
                            AppMain.playerInfo.level_id = response.data.level_id ;
                        }else {
                            AppMain.playerInfo.level_id = AppMain.LevId;
                        }
                    }
                }
                if (AppMain.isWin) {
                    zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.gameOverEvt(AppMain.playerInfo.user_id, AppMain.levelData.game_id, "win"));
                    zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.levelCompletedEvt(AppMain.playerInfo.user_id, AppMain.LevId.toString()));
                }
                else {
                    zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.gameOverEvt(AppMain.playerInfo.user_id, AppMain.levelData.game_id, "failed"));
                }
                AppMain.gameEndRet = AppMain.webResponseAdatper.GameEndResponse(response.data);
                this.reConnect();
                Laya.stage.event(EventId.GAME_OVER);
            }
        }

        launchCompleted() {
            if (this.launchResReady && this.configFirstReady && this.loginFirstReady) {
                Laya.stage.event(EventId.LAUNCH_COMPLETED, this.default3DScene);
                
                PlatformInterface.Instance.enterGamePopup();
            }
        }

        onGameHome(data) {
            AppMain.GameState = GameState.STATE_UNBEGIN;
            this.openEggTimes = 0;
            if (AppMain.autoStartNext == false) {
                Laya.stage.once(EventId.UI_VIEW_OPENED, this, this.onHomeOpened)
                UIService.showHome(data);
            }else {
                UIService.hideLoading();
            }
        }

        onHomeOpened() {
            UIService.hideLoading();
        }

        onGamePrepare(data) {
            AppMain.GameState = GameState.STATE_PREPARE;
            if (AppMain.appConfig.bgm) {
                zs.laya.SoundService.playMusic(AppMain.appConfig.bgm);
            }
            UIService.hideHome();
            UIService.showPlaying(data);
        }

        onGameStart() {
            AppMain.isWin = false;
            AppMain.autoStartNext = false;
            AppMain.GameState = GameState.STATE_PLAYING;
        }

        onOpenFailedView(data) {
            if (AppMain.GameState != GameState.STATE_PLAYING) {
                return;
            }
            AppMain.isWin = false;
            AppMain.autoStartNext = false;
            zs.laya.SoundService.stopMusic();
            AppMain.GameState = GameState.STATE_PAUSE;
            UIService.showRelive(data);
            AppMain.reliveChance -= 1;
        }

        onOpenWinView(data) {
            if (AppMain.GameState != GameState.STATE_PLAYING) {
                return;
            }
            AppMain.isWin = true;
            AppMain.autoStartNext = false;
            zs.laya.SoundService.stopMusic();
            AppMain.GameState = GameState.STATE_PAUSE;
            
            UIService.showScore(data);
        }
        
        /**是否打开导出 */
        isOpenExportGame(){
            return AppMain.appConfig.useWebAdApi && zs.laya.platform.ADConfig.zs_jump_switch && zs.laya.platform.ADConfig.isPublicVersion();
        }

        onGameFailed(data) {
            if (this.isOpenExportGame()) {
                PlatformInterface.Instance.onGameFaildPopUp(data);
            }else {
                this.onOpenFailedView(data);
            }
        }

        onGameWin(data) {
            if (this.isOpenExportGame()) {
                PlatformInterface.Instance.onGameWinPopUp(data);
            }else {
                this.onOpenWinView(data);
            }
        }

        onGameOver() {
            AppMain.reliveChance = 2;
            UIService.hideRelive();
            UIService.hidePlaying();
            UIService.hideScore();
            if (AppMain.appConfig.useWebAdApi) {
                zs.laya.zsapp.zsAppSdk.loadConfig(function (data) {
                    zs.laya.platform.ADConfig.initAdSetting(AppMain.appConfig.version,data);
                },
                    function (error) {
                        console.log(error);
                    });
            }
            if(this.isOpenExportGame()){
                PlatformInterface.Instance.onGameOverPopUp();
            }else{
                this.onGameOverToStart();
            }
        }

        /**游戏结束重新开始游戏 */
        onGameOverToStart(){
            Laya.stage.event(EventId.GAME_HOME);
            if (AppMain.autoStartNext && AppMain.isWin) {
                WebService.startGame(WebRequestArgs.reqStartGameArgs());
            }
            AppMain.isWin = false;
        }

        onGameRelive() {
            if (AppMain.GameState != GameState.STATE_PAUSE) {
                return;
            }
            if (AppMain.appConfig.bgm) {
                zs.laya.SoundService.playMusic(AppMain.appConfig.bgm);
            }
            AppMain.GameState = GameState.STATE_PLAYING;
            UIService.hideRelive();
        }

        onGameShow() {
            // Laya.timer.scale = 1;
            Laya.stage.renderingEnabled = true;
            if (AppMain.appConfig.bgm) {
                zs.laya.SoundService.playMusic(AppMain.appConfig.bgm);
            }
        }

        onGameHide() {
            // Laya.timer.scale = 0;
            Laya.stage.renderingEnabled = false;
            zs.laya.SoundService.stopMusic();
        }

        onJumpCancel() {
            if(AppMain.appConfig.useWebAdApi){
                PlatformInterface.Instance.onExportJumpCancel();
            }
        }

        reConnect() {
            if (this.isSettingReady == false) {
                WebService.requestBaseCfg(WebRequestArgs.reqBaseCfgArgs());
            }
            if (this.isLoginSuccess == false) {
                this.login();
            }
        }

        login() {
            WebService.requestBaseCfg(WebRequestArgs.reqBaseCfgArgs());
            var objLoginCache = Laya.LocalStorage.getJSON("loginCacheData");
            if (objLoginCache && objLoginCache.lastLoginDate && zs.laya.MiscUtils.isToday(objLoginCache.lastLoginDate)) {
                WebService.RequestHeader = { t: objLoginCache.t, timestamp: objLoginCache.timestamp };
                WebService.requestLoginByUserId(objLoginCache.userId, WebRequestArgs.reqLoginArgs());
                return;
            }
            zs.laya.sdk.SdkService.login(
                Laya.Handler.create(this, function (loginData) {
                    if (loginData) {
                        this.loginData = loginData;
                        WebService.requestLoginByCode(this.loginData.identityId, WebRequestArgs.reqLoginArgs());
                    }
                    else {
                        WebService.requestLoginByUserId(AppMain.appConfig.defaultCfg.playerInfo.user_id, WebRequestArgs.reqLoginArgs());
                    }
                }),
                Laya.Handler.create(this, function (msg) {
                    console.error(EventId.UI_TOAST_MESSAGE, msg);
                    WebService.requestLoginByUserId(AppMain.appConfig.defaultCfg.playerInfo.user_id, WebRequestArgs.reqLoginArgs());
                })
            );
        }

    }
    AppMain.appConfig = null;
    AppMain.playerInfo = {};
    AppMain.storeCfg = {};
    AppMain.gameSetting = {};
    AppMain.levelData = {};
    AppMain.authorizeData = {};
    AppMain.gameStartRet = {};
    AppMain.gameEndRet = {};
    AppMain.gameState = GameState.STATE_LOADING;
    AppMain.reliveChance = 2;
    AppMain.autoStartNext = false;
    AppMain.isWin = false;
    AppMain.webResponseAdatper = {
        LoginResponse: function (data) { return data; },
        UserInfoResponse: function (data) { return data; },
        BaseCfgResponse: function (data) { return data; },
        GameStartResponse: function (data) { return data; },
        GameEndResponse: function (data) { return data; },
        TopRankResponse: function (data) { return data; },
    };
    Laya.ILaya.regClass(AppMain);
    Laya.ClassUtils.regClass("zs.laya.game.AppMain", AppMain);
    Laya.ClassUtils.regClass("Zhise.AppMain", AppMain);


    class Launch extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            zs.laya.tdapp.tdAppSdk.event(new zs.laya.tdapp.startupEvt());
            zs.laya.sdk.SdkService.initSDK();
            Laya.stage.addComponent(zs.laya.Resource);
            Laya.stage.addComponent(zs.laya.ObjectPool);
            Laya.stage.addComponent(zs.laya.DeviceService);
            Laya.stage.addComponent(zs.laya.EffectFactory);
            Laya.stage.addComponent(UIService);
            Laya.loader.load(["config/gameCfg.json", "config/publishVer.json"], Laya.Handler.create(this, this.onGameCfgReady));
        }

        onGameCfgReady() {
            var cfg = Laya.loader.getRes("config/gameCfg.json");
            AppMain.appConfig = cfg;
            AppMain.appConfig.version = Laya.loader.getRes("config/publishVer.json");
            AppMain.playerInfo = cfg.defaultCfg.playerInfo;
            AppMain.gameSetting = cfg.defaultCfg.gameSetting;
            WebService.WebApiMap = AppMain.appConfig.webApiMap;
            WebService.UseWebApi = AppMain.appConfig.useWebApi;
            WebService.RequestSign = AppMain.appConfig.webApiSign;
            UIService.viewConfig = cfg.viewMap;
            UIService.openSound = cfg.soundViewOpen;
            UIService.viewScript = {
                loading: zs.laya.ui.LoadingView,
                home: zs.laya.ui.HomeView,
                playing: zs.laya.base.ZhiSeView,
                relive: zs.laya.ui.ReliveView,
                score: zs.laya.ui.WinView,
                rank: zs.laya.ui.RankView,
                msgBox: zs.laya.ui.MsgBoxView
            }
            Laya.stage.once(EventId.UI_VIEW_OPENED, this, this.onLoadingOpened, [cfg.baseResList, cfg.fontList, cfg.configList]);
            UIService.showLoading();

            if (AppMain.appConfig.useWebAdApi) {
                Laya.loader.load(["config/platformCfg.json"], Laya.Handler.create(this, this.onPlatformCfgReady));
            }
        }

        /**初始化广告数据 */
        onPlatformCfgReady(){
            var platformCfg = Laya.loader.getRes("config/platformCfg.json");
            zs.laya.platform.PlatformMgr.initCFG(platformCfg);

            var self = this;
            zs.laya.zsapp.zsAppSdk.loadConfig(
                function (data) {
                    zs.laya.platform.ADConfig.initAdSetting(AppMain.appConfig.version,AppMain.appConfig.version,data);
                    zs.laya.platform.PlatformMgr.initGameAd();
                    Laya.stage.event(zs.laya.game.EventId.AD_CONFIIG_LOADED);
                },
                function (error) {
                    console.error(error);
                    zs.laya.platform.ADConfig.initAdSetting(AppMain.appConfig.version,platformCfg.adCfg);
                    zs.laya.platform.PlatformMgr.initGameAd();
                }
            );
        }

        onLoadingOpened(baseResList, fontList, configList) {
            var urls = [];
            configList.forEach(function (cfgUrl) {
                urls.push(cfgUrl);
            });

            if (urls.length == 0) {
                this.onBaseConfigReady(baseResList, fontList);
            }
            else {
                Laya.loader.load(urls,
                    Laya.Handler.create(this, this.onBaseConfigReady, [baseResList, fontList]),
                    Laya.Handler.create(this, this.onLoadProgressUpdate, [0])
                );
            }
        }

        onBaseConfigReady(baseResList, fontList) {
            var urls = [];
            baseResList.forEach(function (cfgUrl) {
                urls.push(zs.laya.Resource.Get3dPrefabUrl(cfgUrl));
            });

            if (urls.length == 0) {
                this.onBaseResReady(AppMain.appConfig.default3DScene);
            }
            else {
                Laya.loader.create(urls,
                    Laya.Handler.create(this, this.onBaseResReady, [AppMain.appConfig.default3DScene]),
                    Laya.Handler.create(this, this.onLoadProgressUpdate, [1])
                );
            }

            var self = this;
            fontList.forEach(function (fontUrl) {
                var font = new Laya.BitmapFont();
                font.loadFont(`font/${fontUrl}.fnt`, Laya.Handler.create(self, self.onFontReady, [font, fontUrl]));
            });
        }

        onBaseResReady(default3DScene) {
            if (default3DScene == null || default3DScene.length == 0) {
                this.onLaunchResReady(null);
                return;
            }

            zs.laya.Resource.LoadScene3dAsyn(
                default3DScene,
                Laya.Handler.create(this, this.onLaunchResReady),
                Laya.Handler.create(this, this.onLoadProgressUpdate, [2])
            );
        }

        onFontReady(font, fontUrl) {
            Laya.Text.registerBitmapFont(fontUrl, font);
        }

        onLaunchResReady(s) {
            Laya.stage.event(EventId.LAUNCH_COMPLETED, s);
        }

        onLoadProgressUpdate(step, val) {
            Laya.stage.event(zs.laya.ui.Loading.EVENT_UI_PROGRESS_UPDATE, step * 0.5 + 0.5 * val)
        }
    }
    Laya.ILaya.regClass(Launch);
    Laya.ClassUtils.regClass("zs.laya.game.Launch", Launch);
    Laya.ClassUtils.regClass("Zhise.Launch", Launch);

    

    exports.EventId = EventId;
    exports.GameState = GameState;
    exports.WebRequestArgs = WebRequestArgs;
    exports.WebService = WebService;
    exports.UIService = UIService;
    exports.PlatformInterface = PlatformInterface;
    exports.AppMain = AppMain;
    exports.Launch = Launch;
}(window.zs.laya.game = window.zs.laya.game || {}, Laya));
