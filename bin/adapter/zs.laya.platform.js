window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
    class PlatformMgr extends Laya.Script {
        constructor() {
            super();
        }

        /**初始化平台配置 以及对应的页面展示代码 */
        static initCFG(data){
            this.platformCfg = data;

            this.adViewUrl = {
                "screenAd": "view/ad/FullAd.scene",
                "floatAd": "view/ad/FloatAd.scene",
                "listAd": "view/ad/ListAd.scene",
                "knockEggAd": "view/ad/KnockEgg.scene"
            };
            this.adViewScript = {
                "screenAd": FullScreeAdView,
                "floatAd": HomeFloatAdView,
                "listAd":ListAdView,
                "knockEggAd":KnockEggView
            }

            
            if (typeof wx !== "undefined") {
                wx.onShareAppMessage(() => {
                    return {
                      title: ADConfig.zs_share_title,
                      imageUrl: ADConfig.zs_share_image
                    }
                  })
            }
            
            zs.laya.game.PlatformInterface.Instance.enterGamePopup = PlatformMgr.enterGamePopup;
            zs.laya.game.PlatformInterface.Instance.onGameFaildPopUp = PlatformMgr.onGameFaildPopUp;
            zs.laya.game.PlatformInterface.Instance.onGameWinPopUp = PlatformMgr.onGameWinPopUp;
            zs.laya.game.PlatformInterface.Instance.onGameOverPopUp = PlatformMgr.onGameOverPopUp;
            zs.laya.game.PlatformInterface.Instance.showInsertAd = PlatformMgr.showInsertAd;
            zs.laya.game.PlatformInterface.Instance.onExportJumpCancel = PlatformMgr.onExportJumpCancel;
        }

        /**初始化平台音乐文件路径 */
        static initSoundUrl(openSound,clickSound){
            this.openSound = openSound;
            this.clickSound = clickSound;
        }

        /**初始化平台广告 */
        static initGameAd() {
            zs.laya.sdk.SdkService.initVideoAd(ADConfig.zs_video_adunit);
            zs.laya.sdk.SdkService.initInsertAd(ADConfig.zs_full_screen_adunit, null);
        }

        /**进入游戏弹窗 */
        static enterGamePopup(){
            if(ADConfig.zs_jump_switch && ADConfig.isPublicVersion()){
                Laya.timer.once(1500,this,()=>{
                    if(zs.laya.game.AppMain.playerInfo.is_new != undefined && zs.laya.game.AppMain.playerInfo.is_new == 0){
                        PlatformMgr.showHomeFloatAd();
                    }else if(zs.laya.game.AppMain.playerInfo.is_new == undefined){
                        PlatformMgr.showHomeFloatAd();
                    }
                });
            }
        }

        /**游戏失败弹窗前处理 */
        static onGameFaildPopUp(data){
            if(ADConfig.isBeforeGameAccount()){
                Laya.stage.on(PlatformMgr.UI_VIEW_CLOSED, null, PlatformMgr.onHideExportView, [0, data]); 
                PlatformMgr.showListAd();
            }else{
                Laya.stage.event(PlatformMgr.OPEN_FAILED_VIEW,[data]);
            }
        }

        /**游戏成功后弹窗处理 */
        static onGameWinPopUp(data){
            if(ADConfig.isBeforeGameAccount()){
                PlatformMgr.showListAd();
                Laya.stage.on(PlatformMgr.UI_VIEW_CLOSED, null, PlatformMgr.onHideExportView, [1, data]);
            }else{
                Laya.stage.event(PlatformMgr.OPEN_WIN_VIEW,[data]);
            }
        }

        static onHideExportView(status,data,viewName){
            if(viewName == "FullAd" || viewName == "FloatAd" || viewName == "ListAd"){
                if (status == 0) {
                    Laya.stage.event(PlatformMgr.OPEN_FAILED_VIEW,[data]);
                } else if(status == 1){
                    Laya.stage.event(PlatformMgr.OPEN_WIN_VIEW,[data]);
                }else if(status == 2){
                    Laya.stage.event(PlatformMgr.GAME_RESET_START);
                }
                Laya.stage.off(PlatformMgr.UI_VIEW_CLOSED, null, PlatformMgr.onHideExportView);
            }
        }

        static onGameOverPopUp(){
            if(ADConfig.isAfterGameAccount()){
                Laya.stage.on(PlatformMgr.UI_VIEW_CLOSED, null, PlatformMgr.onHideExportView, [2,null]); 
                PlatformMgr.showScreenAd();
            }else{
                Laya.stage.event(PlatformMgr.GAME_RESET_START);
            }
        }

        /**微信结算后插入全屏广告 */
        static showInsertAd() {
            if (!ADConfig.zs_full_screen_ad_enable) {
                return;
            }
            var timestamp = Laya.LocalStorage.getItem("zs_full_screen_ad_time_stamp");
            if (timestamp == null || timestamp == "" || zs.laya.MiscUtils.isToday(Number(timestamp)) == false) {
                var self = this;
                zs.laya.sdk.SdkService.loadInsertAd(Laya.Handler.create(null, function () {
                    if (self.gameState == GameState.STATE_UNBEGIN) {
                        zs.laya.sdk.SdkService.showInsertAd(null);
                        Laya.LocalStorage.setItem("zs_full_screen_ad_time_stamp", Date.now().toString());
                    }
                }), null);
            }
        }

        static onExportJumpCancel(){
            if (ADConfig.zs_jump_switch && ADConfig.isPublicVersion() && ADConfig.zs_full_screen_jump) {
                PlatformMgr.showScreenAd();
            }
        }

        static initView(view, type, data) {
            if (view instanceof Laya.View) {
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
        }

        /**
         * showScreenAd
         */
        static showScreenAd(data) {
            if (this.adViewUrl.screenAd == null) {
                console.error("showScreenAd error");
                return;
            }
            Laya.Scene.open(this.adViewUrl.screenAd, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.adViewScript.screenAd, data);
            }));
            Laya.SoundManager.playSound(this.openSound);
        }

        static hideScreenAd() {
            if (this.adViewUrl.screenAd == null) {
                return;
            }
            Laya.Scene.close(this.adViewUrl.screenAd)
        }

         /**
         * showListAd
         */
        static showListAd(data) {
            if (this.adViewUrl.listAd == null) {
                console.error("showListAd error");
                return;
            }
            Laya.Scene.open(this.adViewUrl.listAd, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.adViewScript.listAd, data);
            }));
            Laya.SoundManager.playSound(this.openSound);
        }

        static hideListAd() {
            if (this.adViewUrl.listAd == null) {
                return;
            }
            Laya.Scene.close(this.adViewUrl.listAd)
        }

        /**
         * showHomeFloatAd
         */
        static showHomeFloatAd(data) {
            if (this.adViewUrl.floatAd == null) {
                console.error("showHomeFloatAd error");
                return;
            }
            Laya.Scene.open(this.adViewUrl.floatAd, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.adViewScript.floatAd, data);
            }));
            Laya.SoundManager.playSound(this.openSound);
        }

        static hideHomeFloatAd() {
            if (this.adViewUrl.floatAd == null) {
                return;
            }
            Laya.Scene.close(this.adViewUrl.floatAd)
        }

        /**打开砸金蛋 */
        static showKnockEggView(data) {
            if (this.adViewUrl.knockEggAd == null) {
                console.error("knockEggAd error");
                return;
            }
            Laya.Scene.open(this.adViewUrl.knockEggAd, false, data, Laya.Handler.create(this, function (view) {
                this.initView(view, this.adViewScript.knockEggAd, data);
            }));
        }

        static hideKnockEggAd(){
            if (this.adViewUrl.knockEggAd == null) {
                return;
            }
            Laya.Scene.close(this.adViewUrl.knockEggAd);
        }

    }
    PlatformMgr.platformCfg = null;

    PlatformMgr.APP_SHOW = "DEVICE_ON_SHOW";
    PlatformMgr.APP_HIDE = "DEVICE_ON_HIDE";
    // PlatformMgr.APP_JUMP_CANCEL = "NAVIGATE_FAILED"; // 跳转失败
    // PlatformMgr.APP_JUMP_SUCCESS = "NAVIGATE_SUCCESS";//跳转成功
    PlatformMgr.AD_CONFIIG_LOADED = "AD_CONFIIG_LOADED";
    PlatformMgr.UI_VIEW_OPENED = "UI_VIEW_OPENED";// zs.laya.base.BaseView.EVENT_UI_VIEW_CLOSED
    PlatformMgr.UI_VIEW_CLOSED = "UI_VIEW_CLOSED";
    PlatformMgr.OPEN_WIN_VIEW = "OPEN_WIN_VIEW";
    PlatformMgr.OPEN_FAILED_VIEW = "OPEN_FAILED_VIEW";
    PlatformMgr.GAME_RESET_START = "GAME_RESET_START";
    Laya.ILaya.regClass(PlatformMgr);
    Laya.ClassUtils.regClass("zs.laya.platform.PlatformMgr", PlatformMgr);
    Laya.ClassUtils.regClass("Zhise.PlatformMgr", PlatformMgr);

    class ADConfig {
        constructor() {
            this.current_version = "1.0";
        }

        static initAdSetting(current_version,webResponse) {
            this.current_version = current_version;
            this.response = webResponse;
            var filterSystem = webResponse.zs_banner_system ? String(webResponse.zs_banner_system).toUpperCase() : null;
            this.zs_version = webResponse.zs_number ? webResponse.zs_number : "0.0";
            var enable_banner_op = !filterSystem || !Laya.Browser.onMobile || !((filterSystem.indexOf("ANDROID") != -1 && Laya.Browser.onAndroid) || (filterSystem.indexOf("IOS") != -1 && !Laya.Browser.onAndroid));
            this.zs_switch = webResponse.zs_switch == 1 && enable_banner_op && this.isPublicVersion();
            this.egg_switch = webResponse.zs_switch == 1 && this.isPublicVersion();
            this.zs_video_adunit = webResponse.zs_video_adunit;
            this.zs_banner_adunit = webResponse.zs_banner_adunit;
            this.zs_full_screen_adunit = webResponse.zs_full_screen_adunit;
            this.zs_full_screen_ad_enable = webResponse.zs_full_screen_ad == 1;
            this.zs_banner_text_time = webResponse.zs_banner_text_time ? Number(webResponse.zs_banner_text_time) : 1000;
            this.zs_banner_banner_time = webResponse.zs_banner_banner_time ? Number(webResponse.zs_banner_banner_time) : 1000;
            this.zs_banner_refresh_time = webResponse.zs_banner_refresh_time ? Number(webResponse.zs_banner_refresh_time) : 1000;
            this.zs_banner_move_time = webResponse.zs_banner_move_time ? Number(webResponse.zs_banner_move_time) : 1000;
            this.zs_unmiss_text_time = webResponse.zs_unmiss_text_time ? Number(webResponse.zs_unmiss_text_time) : 2000;
            this.zs_banner_vertical_enable = webResponse.zs_banner_vertical_enable == 1;
            this.zs_banner_horizontal_enable = webResponse.zs_banner_horizontal_enable == 1;
            this.zs_share_title = webResponse.zs_share_title;
            this.zs_share_image = webResponse.zs_share_img;
            this.zs_shield_gdt_export = webResponse.zs_shield_gdt_export == 1;
            this.zs_jump_switch = webResponse.zs_jump_switch == 1 && (zs.laya.zsapp.zsAppSdk.Instance.isFromLink() == false || this.zs_shield_gdt_export);

            this.zs_revive_type = webResponse.zs_revive_type;
            this.zs_revive_click_num = webResponse.zs_revive_click_num;
            this.zs_revive_video_num = webResponse.zs_revive_video_num;
            this.zs_revive_share_num = webResponse.zs_revive_share_num;

            this.zs_full_screen_jump = webResponse.zs_full_screen_jump == 1;
            this.zs_history_list_jump = webResponse.zs_history_list_jump == 1;
            this.zs_finish_jump = webResponse.zs_finish_jump == 1;

            this.repair_click_num = this.zs_click_award_percent = webResponse.zs_click_award_percent || [0.3, 0.7];
            this.zs_click_award_back = webResponse.zs_click_award_back ? Number(webResponse.zs_click_award_back) : 0.00423;
            this.zs_click_award_num = zs.laya.MiscUtils.IsNumber(webResponse.zs_click_award_num) ? webResponse.zs_click_award_num : webResponse.zs_click_award_num || 0;
            this.zs_click_award_add = webResponse.zs_click_award_add || 0.1;

            this.zs_revive_countdown = webResponse.zs_revive_countdown ? Number(webResponse.zs_revive_countdown) : 10;
            this.zs_jump_style = webResponse.zs_jump_style ? Number(webResponse.zs_jump_style) : 0;

            this.zs_banner_rotate_id1 = webResponse.zs_banner_rotate_id1;
            this.zs_banner_rotate_id2 = webResponse.zs_banner_rotate_id2;
            this.zs_banner_rotate_id3 = webResponse.zs_banner_rotate_id3;

            this.zs_click_award_system = webResponse.zs_click_award_system;

            this.zs_banner_show_number = this.getNumberVal(webResponse.zs_banner_show_number, 2);

            this.zs_full_screen_rotate = this.getNumberVal(webResponse.zs_full_screen_rotate, 0) == 1;

            this.zs_unmiss_text_time = this.getNumberVal(webResponse.zs_unmiss_text_time, 0);


            this.initOpenAwardNum();
        }

        static getNumberVal(val, def) {
            def = zs.laya.MiscUtils.IsNumber(def) ? Number(def) : 0;
            return zs.laya.MiscUtils.IsNumber(val) ? Number(val) : def;
        }

        static initOpenAwardNum() {
            //初始化砸金蛋次数
            this.open_award_num = Laya.LocalStorage.getItem("open_award_num") || 0;

            this.openEggTimes = 0;

            var awardNumTimestamp = Laya.LocalStorage.getItem("open_award_num_time_stamp");
            if (awardNumTimestamp == null || awardNumTimestamp == "" || zs.laya.MiscUtils.isToday(Number(awardNumTimestamp)) == false) {
                return;
            }

            Laya.LocalStorage.setItem("open_award_num_time_stamp", Date.now().toString());
            Laya.LocalStorage.setItem("open_award_num", this.open_award_num = 0);

        }

        static isPublicVersion() {
            return this.current_version != this.zs_version;
        }

        static isOpenEgg(lv) {

            if (!this.egg_switch) return false;

            if (this.openEggTimes && this.openEggTimes > 0) return false;

            if (this.zs_click_award_system) {
                var zs_click_award_system = this.zs_click_award_system.trim().toLowerCase();
                //屏蔽安卓
                if (zs_click_award_system == "android" && Laya.Browser.onAndroid) {
                    return false;
                }

                //屏蔽ios
                if (zs_click_award_system == "ios" && Laya.Browser.onIOS) {
                    return false;
                }
            }

            if (zs.laya.MiscUtils.IsNumber(this.zs_click_award_num)) {

                //如果是-1则是无限制
                if (this.zs_click_award_num == -1) return true;
                var open_award_num = Laya.LocalStorage.getItem("open_award_num") || 0;
                if (Number(this.zs_click_award_num) > Number(open_award_num)) return true;
            }

            if (this.zs_click_award_num && this.zs_click_award_num.length > 0) {
                if (this.zs_click_award_num.length == 1 && this.zs_click_award_num[0] == -1)
                    return true;

                var index = this.zs_click_award_num.indexOf(lv);
                if (index != -1) {
                    return true;
                }
            }
            return false;
        }

        static enableClickRevive() {
            return this.isReviveTypeEnable("zs_revive_click_num");
        }

        static updateClickRevive() {
            this.updateReviveTypeInfo("zs_revive_click_num");
        }

        static enableVideoRevive() {
            return this.isReviveTypeEnable("zs_revive_video_num");
        }

        static updateVideoRevive() {
            this.updateReviveTypeInfo("zs_revive_video_num");
        }

        static enableShareRevive() {
            return this.isReviveTypeEnable("zs_revive_share_num");
        }

        static updateShareRevive() {
            this.updateReviveTypeInfo("zs_revive_share_num");
        }

        static isReviveTypeEnable(type) {
            if (this[type] == 0) {
                return false;
            }
            if (this[type] == -1) {
                return true;
            }
            var clickTimestamp = Laya.LocalStorage.getItem(type + "_time_stamp");
            if (clickTimestamp == null || clickTimestamp == "" || zs.laya.MiscUtils.isToday(Number(clickTimestamp)) == false) {
                return true;
            }
            var strNum = Laya.LocalStorage.getItem(type);
            var numVal = strNum == null || strNum == "" ? 0 : Number(strNum);
            return numVal < this[type];
        }

        static updateReviveTypeInfo(type) {
            Laya.LocalStorage.setItem(type + "_time_stamp", Date.now().toString());
            var strNum = Laya.LocalStorage.getItem(type);
            var numVal = strNum == null || strNum == "" ? 0 : Number(strNum);
            numVal++;
            Laya.LocalStorage.setItem(type, numVal.toString());
        }

        /**游戏结束前 */
        static isBeforeGameAccount(){
            return ADConfig.zs_history_list_jump;
        }

        /**游戏结束后 */
        static isAfterGameAccount(){
            return ADConfig.zs_full_screen_jump;
        }
    }
    ADConfig.response = null;
    ADConfig.zs_share_title = "";//: string;                      //分享标题
    ADConfig.zs_share_image = "";//: string;                      //分享图片地址
    ADConfig.zs_switch = false;//: boolean;                          //误触总开关(1-开 0-关)
    ADConfig.zs_version = "1.0.0";//: string;                //版本号（区分提审环境-无误触、正式环境-有误触）
    ADConfig.zs_video_adunit = "";//: string;                     //视频广告ID
    ADConfig.zs_banner_adunit = "";//: string;                    //广点通bannerID [废弃]
    ADConfig.zs_banner_rotate_id1 = "";//string                   //bannerID 1
    ADConfig.zs_banner_rotate_id2 = "";//string                   //bannerID 2
    ADConfig.zs_banner_rotate_id3 = "";//string                   //bannerID 3

    ADConfig.zs_full_screen_adunit = "";//: string;               //插屏广告ID
    ADConfig.zs_full_screen_ad_enable = false;//: boolean;           //插屏广告开启状态
    ADConfig.zs_banner_text_time = 0;//: number;                 //广点通文字延时移动时间（单位：毫秒）
    ADConfig.zs_banner_banner_time = 0;//: number;               //广点通banner延时显示时间（单位：毫秒）
    ADConfig.zs_banner_refresh_time = 0;//: number;              //广点通banner广告刷新时长间隔（单位：毫秒）
    ADConfig.zs_banner_move_time = 500;//                        //广点通文字上移动画时间长度（单位：毫秒）
    ADConfig.zs_banner_vertical_enable = false;//: boolean;          //广点通文字上移开关（0关，1开）
    ADConfig.zs_banner_horizontal_enable = false;//: boolean;        //广点通文字左右移动开关（0关，1开）
    ADConfig.zs_jump_switch = false;//: boolean;                     //导出位置开关（1开 0关）
    ADConfig.zs_revive_type = 0;//: number;                      //游戏复活方式（0不复活，1狂点复活，2视频复活，3分享复活，4普通复活）
    ADConfig.zs_revive_click_num = 0;//: number;                 //游戏狂点复活次数（-1不限制，0使用视频复活，N次后使用视频复活）
    ADConfig.zs_revive_video_num = 0;//: number;                 //游戏视频复活次数（-1不限制，0使用分享复活，N次后使用分享复活，没视频了使用分享复活）
    ADConfig.zs_revive_share_num = 0;//: number;                 //游戏分享复活次数（-1不限制，0使用普通复活，N次后使用普通复活）
    ADConfig.zs_continue_auto_share = false;//: boolean;
    ADConfig.zs_full_screen_jump = false;//: boolean;           //增加全屏导出位开关
    ADConfig.zs_history_list_jump = false;//: boolean;           //增加我的小程序列表导出位开关
    ADConfig.zs_finish_jump = false;//: boolean;                //增加复活页结算页导出位开关
    ADConfig.zs_revive_countdown = 10;//: number;               //复活倒计时
    ADConfig.zs_jump_style = 1;//: number;                      //结算页样式
    ADConfig.zs_shield_gdt_export = true;                       //广点通来路屏蔽导出开关

    Laya.ILaya.regClass(ADConfig);
    Laya.ClassUtils.regClass("zs.laya.platform.ADConfig", ADConfig);
    Laya.ClassUtils.regClass("Zhise.ADConfig", ADConfig);

    /**-------------------------------------以下是导出相关内容-------------------------------------*/
    class AdList extends Laya.Script {

        constructor() {
            super();

            this.userId = null;
            this.adType = null;
            this.autoScroll = false;
            this.scrollDir = AdList.SCROLL_NONE;

            this.dragSleep = 5000;
            this.scrollSpeed = 5000;

            this.passedTime = 0;
            this.inAutoScroll = false;

            this.adData = [];
            this.iosFilterAppIds = [];

            this.list = null;
            this.hotIds = [];

            this.maxNum = null;
            this.isDataUpdate = false;

            this.touchIndex = -1;

            this.isRandomSelect = false;
        }

        requestAdData(adType, autoScroll, scrollDir, iosFilterAppIds, maxNum,randomSelect) {
            this.userId = zs.laya.game.AppMain.playerInfo.user_id;
            this.adType = adType;
            this.autoScroll = autoScroll;
            this.scrollDir = scrollDir;
            this.iosFilterAppIds = iosFilterAppIds || [];
            this.maxNum = maxNum;
            this.isRandomSelect = randomSelect;
            
            if (this.scrollDir == AdList.SCROLL_VERTICAL) {
                this.list.vScrollBarSkin = "";
            }
            else if (this.scrollDir == AdList.SCROLL_HORIZONTAL) {
                this.list.hScrollBarSkin = "";
            }
            var self = this;
            zs.laya.zsapp.zsAppSdk.loadAd(function (data) {
                if(self.list){
                    self.adData = data[self.adType.toString()];
                    self.initHotIds();
                    self.freshAdList();
                }
            });
        }

        freshAdList() {
            var self = this;
            this.adData = this.adData.filter(function (elment) {
                return Laya.Browser.onAndroid || self.iosFilterAppIds.indexOf(elment.appid) == -1;
            })
            if (this.maxNum != null) {
                if (this.adData.length < this.maxNum) {
                    while (this.adData.length < this.maxNum) {
                        this.adData.push(this.adData[Math.floor(Math.random() * this.adData.length)]);
                    }
                }else if (this.adData.length > this.maxNum) {
                    while (this.adData.length > this.maxNum) {
                        this.adData.splice(Math.floor(Math.random() * this.adData.length), 1);
                    }
                }
            }
            this.list.array = this.adData;
            if (this.autoScroll) {
                Laya.stage.frameOnce(1, this, this.startAutoScrollAd);
            }
        }

        initHotIds() {
            var hotNum = Math.random() < 0.5 ? 3 : 4;
            var interval = Math.floor(this.adData.length / hotNum);
            for (let index = 0; index < hotNum; index++) {
                this.hotIds.push(Math.floor(interval * Math.random()) + index * interval);
            }
        }
        
        startAutoScrollAd() {
            if(!this.list){
                return;
            }
            this.inAutoScroll = true;
            var repeatX = (this.list.repeatX ? this.list.repeatX : 1);
            var repeatY = (this.list.repeatY ? this.list.repeatY : 1);
            if (this.scrollDir == AdList.SCROLL_VERTICAL) {
                var num = repeatX*repeatY;
                var temp = this.list.array.length%repeatX == 0 ? 0:repeatX;
                var endPos = this.list.array.length - Math.floor(this.list.array.length/num)*num + temp;
                // var endPos = this.list.array.length - (this.list.array.length % repeatX) - repeatX;
                this.autoScrollAd(0, endPos, endPos * this.scrollSpeed);
            }else if (this.scrollDir == AdList.SCROLL_HORIZONTAL) {
                var endPos = Math.ceil(this.list.array.length / repeatY) - repeatX;
                this.autoScrollAd(0, endPos, endPos * this.scrollSpeed);
            }
        }

        autoScrollAd(start, end, duaration) {
            this.list.tweenTo(end, duaration, Laya.Handler.create(this, this.autoScrollAd, [end, start, duaration]));
        }

        onItemRender(item, index) {
            var data = this.list.array[index];
            if (!data) {
                item.visible = false;
                return;
            }
            var icon = item.getChildByName("icon");
            if (icon) {
                icon.loadImage(data.app_icon, null);
            }else{
                var iconBox = item.getChildByName("iconBox");
                if(iconBox){
                    var icon = iconBox.getChildByName("icon");
                    if (icon) {
                        icon.skin = data.app_icon;
                    }
                }
            }
            var name = item.getChildByName("name");
            if (name) {
                name.text = data.app_title;
            }
            var desc = item.getChildByName("desc");
            if (desc) {
                desc.text = data.app_desc;
            }
            if (this.isDataUpdate == true) {
                return
            }
            var titleBg = item.getChildByName("titleBg");
            if (titleBg) {
                titleBg.index = Math.floor(titleBg.clipY * Math.random());
            }
            var tag = item.getChildByName("tag");
            if (tag) {
                if (this.hotIds.indexOf(index) > 0) {
                    tag.visible = true;
                    tag.index = Math.floor(tag.clipY * Math.random());
                }
                else {
                    tag.visible = false;
                }
            }
            else {
                var hotTag = item.getChildByName("hot");
                var newTag = item.getChildByName("new");
                hotTag && (hotTag.visible = false);
                newTag && (newTag.visible = false);
                if (this.hotIds.indexOf(index) > 0) {
                    if (hotTag && newTag) {
                        if (Math.random() < 0.5) {
                            hotTag.visible = true;
                        }
                        else {
                            newTag.visible = true;
                        }
                    }
                    else if (hotTag && !newTag) {
                        hotTag.visible = true;
                    }
                    else if (newTag && !hotTag) {
                        newTag.visible = true;
                    }
                }
            }
        }

        onTouchEnd(e) {
            if(this.isRandomSelect && this.touchIndex == -1){
                this.touchIndex = Math.floor(Math.random()*this.list.array.length);
                console.log("RandomSelect:"+this.touchIndex + " data list length:" + this.list.array.length);
            }
            this.onSelectAd(this.touchIndex);
            console.log("onTouchEnd:"+this.touchIndex);
            this.touchIndex = -1;
        }

        onMouseAd(e, index){
            if(e.type == Laya.Event.MOUSE_DOWN){
                this.touchIndex = index;
            }
            console.log(e.type,this.touchIndex);
        }

        onSelectAd(index) {
            if (index == -1) {
                return;
            }
            if(!this.list){
                return;
            }
            if (!this.list.array){
                return;
            }
            var data = this.list.array[index];
            var self = this;
            self.isDataUpdate = true;
            zs.laya.zsapp.zsAppSdk.navigate2Mini(data, this.userId,
                function () {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_SUCCESS);
                },
                function () {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_FAILED);
                },
                function () {
                    self.list.selectedIndex = -1;
                    Laya.stage.event(AdList.EVENT_NAVIGATE_COMPLETED);
                });
        }

        params2String(args) {
            var params = args[0] + "=" + args[1];
            for (let index = 2; index < args.length; index += 2) {
                params += "&" + args[index] + "=" + args[index + 1];
            }
            return params;
        }

        onDragStateChanged(newState) {
            this.inAutoScroll = false;
            if (this.autoScroll && newState == 0) {
                this.passedTime = 0;
            }
        }

        onAwake() {
            this.list = this.owner;
            this.list.selectEnable = true;
            this.list.renderHandler = Laya.Handler.create(this, this.onItemRender, null, false);
            this.list.mouseHandler = Laya.Handler.create(this, this.onMouseAd, null, false);
        }

        onEnable(){
            this.owner.on(Laya.Event.MOUSE_UP, this, this.onTouchEnd);

            this.list.on(Laya.Event.MOUSE_UP, this, this.onDragStateChanged, [0]);
            this.list.on(Laya.Event.MOUSE_OUT, this, this.onDragStateChanged, [0]);
            this.list.on(Laya.Event.MOUSE_DOWN, this, this.onDragStateChanged, [1]);
        }

        onDisable() {
            this.owner.off(Laya.Event.MOUSE_UP, this, this.onTouchEnd);

            this.list.off(Laya.Event.MOUSE_UP, this, this.onDragStateChanged);
            this.list.off(Laya.Event.MOUSE_OUT, this, this.onDragStateChanged);
            this.list.off(Laya.Event.MOUSE_DOWN, this, this.onDragStateChanged);
        }

        onUpdate() {
            if (this.list.array && this.list.array.length > 0 && this.autoScroll && this.inAutoScroll == false) {
                this.passedTime += Laya.timer.delta;
                if (this.passedTime > this.dragSleep) {
                    this.startAutoScrollAd();
                }
            }
        }
    }
    AdList.EVENT_NAVIGATE_SUCCESS = "NAVIGATE_SUCCESS";
    AdList.EVENT_NAVIGATE_FAILED = "NAVIGATE_FAILED";
    AdList.EVENT_NAVIGATE_COMPLETED = "NAVIGATE_COMPLETED";
    AdList.SCROLL_NONE = 0;
    AdList.SCROLL_VERTICAL = 1;
    AdList.SCROLL_HORIZONTAL = 2;
    Laya.ILaya.regClass(AdList);
    Laya.ClassUtils.regClass("zs.laya.platform.AdList", AdList);
    Laya.ClassUtils.regClass("Zhise.AdList", AdList);

    class AdList2 extends AdList {
        constructor() {
            super();
        }

        onItemRender(item, index) {
            var data = this.list.array[index];
            if (!data) {
                item.visible = false;
                return;
            }

            if (this.isDataUpdate == true) {
                return;
            }

            var icon = item.getChildByName("icon");
            if (icon) {
                if (index != 6) {
                    icon.visible = true;
                    icon.loadImage(data.app_icon, null);
                }
                else {
                    icon.visible = false;
                }
            }
            var name = item.getChildByName("name");
            if (name) {
                name.text = index != 6 ? data.app_title : "";
            }
            var desc = item.getChildByName("desc");
            if (desc) {
                desc.text = index != 6 ? data.app_desc : "";
            }

            var arrow = item.getChildByName("arrow");
            if (arrow) {
                arrow.visible = index == 6;
                if (index == 6) {
                    arrow.visible = true;
                    arrow.index = data.arrowIdx ? data.arrowIdx : 0;
                }
                else {
                    arrow.visible = false;
                }
            }
        }

        onSelectAd(index) {
            if (index == -1) {
                return;
            }
            var data = this.list.array[index];
            if (index == 6) {
                if (data.arrowIdx == null || data.arrowIdx == 0) {
                    data.arrowIdx = 1;
                    this.owner.event(AdList2.EVENT_AD_SWITCH_SHOW);
                }
                else {
                    data.arrowIdx = 0;
                    this.owner.event(AdList2.EVENT_AD_SWITCH_HIDE);
                }
                this.list.selectedIndex = -1;
                return;
            }
            var self = this;
            self.isDataUpdate = true;
            zs.laya.zsapp.zsAppSdk.navigate2Mini(data, this.userId,
                function () {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_SUCCESS);
                },
                function () {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_FAILED);
                },
                function () {
                    self.list.selectedIndex = -1;
                    Laya.stage.event(AdList.EVENT_NAVIGATE_COMPLETED);
                });
        }
    }
    AdList2.EVENT_AD_SWITCH_SHOW = "EVENT_AD_SWITCH_SHOW";
    AdList2.EVENT_AD_SWITCH_HIDE = "EVENT_AD_SWITCH_HIDE";
    Laya.ILaya.regClass(AdList2);
    Laya.ClassUtils.regClass("zs.laya.platform.AdList2", AdList2);
    Laya.ClassUtils.regClass("Zhise.AdList2", AdList2);

    class ExportGameCtrl extends Laya.Script {

        constructor() {
            super();
            this.args = null;
            this.adView = null;
            this.monitorOtherPageOpen = false;
            this.visibleArr = null;
        }

        onEnable() {
            if (this.adView == null) {
                Laya.stage.on(PlatformMgr.AD_CONFIIG_LOADED, this, this.onStart);
            }
        }

        onDisable() {
            if (this.adView == null) {
                Laya.stage.off(PlatformMgr.AD_CONFIIG_LOADED, this, this.onStart);
            }

            if(this.monitorOtherPageOpen){
                Laya.stage.off(PlatformMgr.UI_VIEW_OPENED, this, this.onViewOpened);
                Laya.stage.off(PlatformMgr.UI_VIEW_CLOSED, this, this.onViewClosed);
            }
        }

        onDestroy() {
            if (this.adView == null) {
                return ;
            }
            for (let index = 0; index < this.adView.length; index++) {
                if (this.adView[index] != null) {
                    this.adView[index].destroy();
                }            
            }  
            this.adView = null;
        }

        onStart() {
            if(this.adView){
                return;
            }
            if (ADConfig.zs_jump_switch == false || ADConfig.isPublicVersion() == false) {
                return;
            }

            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            this.args = PlatformMgr.platformCfg.exportGameCfg[viewName];
            if (!this.args) {
                return;
            }

            this.monitorOtherPageOpen = false;
            for (let index = 0; index < this.args.length; index++) {
                var element = this.args[index];
                if (element.checkKey == null || ADConfig[element.checkKey]) {
                    this.monitorOtherPageOpen = this.monitorOtherPageOpen|| element.isHide;
                }
            }
            if(this.monitorOtherPageOpen){
                Laya.stage.on(PlatformMgr.UI_VIEW_OPENED, this, this.onViewOpened);
                Laya.stage.on(PlatformMgr.UI_VIEW_CLOSED, this, this.onViewClosed);
            }

            this.adView = [];
            for (let index = 0; index < this.args.length; index++) {
                var element = this.args[index];
                if (element.readonly) {
                    this.adView.push(null);
                }
                else if (element.checkKey == null || ADConfig[element.checkKey]) {                    
                    Laya.loader.create(element.viewUrl, Laya.Handler.create(this, this.onPrefabReady), null, Laya.Loader.PREFAB);
                    break;
                }
                else {
                    this.adView.push(null);
                }
            }
        }

        onPrefabReady(prefab) {
            if (this.destroyed) {
                return;
            }
            var params = this.args[this.adView.length];
            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            
            if(!this.owner.getChildByName(params.parentRoot)){
                console.log(viewName +" page parentRoot " + params.parentRoot + " is null");
                return;
            }
           
            var scriptType = this.getViewScript(params.scriptType);
            if (scriptType == null) {
                console.log(viewName + " page" + params.viewUrl +" scriptType is null");
                return;
            }
            var view = prefab.create();
            this.owner.getChildByName(params.parentRoot).addChild(view);
            view.pos(params.x,params.y);
            // view.visible = this.owner.visible;
            var script = view.getComponent(scriptType);
            if (script == null) {
                script = view.addComponent(scriptType);
            }
            if(params.adType){
                script.initView(params);
            }
            
            this.adView.push(view);
            if (this.adView.length < this.args.length) {
                var next = this.args[this.adView.length];
                if (next.readonly) {
                    this.adView.push(null);
                }else if (next.checkKey == null || ADConfig[next.checkKey]) {
                    Laya.loader.create(next.viewUrl, Laya.Handler.create(this, this.onPrefabReady), null, Laya.Loader.PREFAB);
                }else {
                    this.adView.push(null);
                }
            }
        }

        getViewScript(type) {
            switch(type){
                case "ExportScrollH":
                    return ExportScrollH;
                break;
                case "ExportScrollV":
                    return ExportScrollV;
                break;
                case "ExportScrollNone":
                    return ExportScrollNone;
                break;
                case "ShakeExportBox":
                    return ShakeExportBox;
                break;
                case "RankBtn":
                    return RankBtn;
                break;
                case "InviteBtn":
                    return InviteBtn;
                break;
                case "FakeExitBtn":
                    return FakeExitBtn;
                break;
                case "FloatExportBtn":
                    return FloatExportBtn;
                break;
                case "ScreenExportBtn":
                    return ScreenExportBtn;
                break;
                case "ExportLeftPop":
                    return ExportLeftPop;
                break;
                case "ExportRightPop":
                    return ExportRightPop;
                break; 
                case "ExportLeftFlyBox":
                    return ExportLeftFlyBox;
                break;
            }
        }

        onViewOpened(viewName){
            if(viewName && this.adView){
                this.visibleArr = [];
                for (let index = 0; index < this.adView.length; index++) {
                    if (this.adView[index] != null && this.args[index].isHide) {
                        this.visibleArr[index] = this.adView[index].visible;
                        this.adView[index].visible = false;
                    }            
                }
            }
        }

        onViewClosed(viewName){
            if(viewName && this.adView){
                if(!this.visibleArr){
                    return;
                }
                for (let index = 0; index < this.adView.length; index++) {
                    if (this.adView[index] != null && this.args[index].isHide) {
                        if(this.visibleArr[index]){
                            this.adView[index].visible = this.visibleArr[index];
                        }  
                    }            
                }
            }
        }
    }
    Laya.ILaya.regClass(ExportGameCtrl);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportGameCtrl", ExportGameCtrl);
    Laya.ClassUtils.regClass("Zhise.ExportGameCtrl", ExportGameCtrl);   
    
    class ExportScrollH extends Laya.Script {
        constructor() {
            super();
            this.adList = null;
        }

        initView(data) {
            this.adList = this.owner.getChildByName("adList").addComponent(AdList);       
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(data.adType, true, AdList.SCROLL_HORIZONTAL, appConfig.iosFilterAppIds);
        }
    }
    Laya.ILaya.regClass(ExportScrollH);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportScrollH", ExportScrollH);
    Laya.ClassUtils.regClass("Zhise.ExportScrollH", ExportScrollH);
    
    class ExportScrollV extends Laya.Script {
        constructor() {
            super();
            this.adList = null;
        }

        initView(data) {            
            this.adList = this.owner.getChildByName("adList").addComponent(AdList);      
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(data.adType, true, AdList.SCROLL_VERTICAL, appConfig.iosFilterAppIds);
        }
    }
    Laya.ILaya.regClass(ExportScrollV);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportScrollV", ExportScrollV);
    Laya.ClassUtils.regClass("Zhise.ExportScrollV", ExportScrollV);

    class ExportScrollNone extends Laya.Script {
        constructor() {
            super();
            this.adList = null;// AdList;
        }

        initView(data) {            
            this.adList = this.owner.getChildByName("adList").addComponent(AdList);            
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(data.adType, false, AdList.SCROLL_NONE, appConfig.iosFilterAppIds, 3);
        }
    }
    Laya.ILaya.regClass(ExportScrollNone);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportScrollNone", ExportScrollNone);
    Laya.ClassUtils.regClass("Zhise.ExportScrollNone", ExportScrollNone);

    class ShakeExportIcon extends Laya.Script {

        constructor() {
            super();
            this.list = null;
            this.delayAnimTime = 1000;
            this.animIntervalTime = 4000;
            this.animDuaration = 500;
            this.adIdx = 0;
            this.rotOffset = 10;
            this.loopTime = 2;
            this.currentAdData = null;
            this.adDataArr = null;
            this.subAnimDuaration = 0;
        }

        initAd(adArr) {
            this.adDataArr = adArr;
            this.adIdx %= adArr.length;
            this.onItemRender(adArr[this.adIdx]);
            this.owner.timerLoop(this.delayAnimTime + this.animIntervalTime, this, this.freshAdItems);
        }

        freshAdItems() {
            this.adIdx += 4;
            this.adIdx %= this.adDataArr.length;
            this.onItemRender(this.adDataArr[this.adIdx]);
            this.playShakeAnim(0);
        }

        playShakeAnim(idx) {
            if (idx / 4 >= this.loopTime) {
                return;
            }
            var uiComp = this.owner;
            switch (idx % 4) {
                case 0:
                    Laya.Tween.to(uiComp, { rotation: this.rotOffset }, this.subAnimDuaration, Laya.Ease.linearNone, Laya.Handler.create(this, this.playShakeAnim, [idx + 1]));
                    break;
                case 1:
                    Laya.Tween.to(uiComp, { rotation: 0 }, this.subAnimDuaration, Laya.Ease.linearNone, Laya.Handler.create(this, this.playShakeAnim, [idx + 1]));
                    break;
                case 2:
                    Laya.Tween.to(uiComp, { rotation: this.rotOffset }, this.subAnimDuaration, Laya.Ease.linearNone, Laya.Handler.create(this, this.playShakeAnim, [idx + 1]));
                    break;
                case 3:
                    Laya.Tween.to(uiComp, { rotation: 0 }, this.subAnimDuaration, Laya.Ease.linearNone, Laya.Handler.create(this, this.playShakeAnim, [idx + 1]));
                    break;
            }
        }

        onItemRender(adData) {
            if (adData == null) {
                if (this.currentAdData == null) {
                    this.owner.visible = false;
                }
                return ;
            }
            this.currentAdData = adData;
            this.owner.visible = true;
            var item = this.owner;
           
            var icon = item.getChildByName("icon");
            if (icon) {
                icon.loadImage(adData.app_icon,null);
            }
            var name = item.getChildByName("name");
            if (name) {
                name.text = adData.app_title;
            }
            var desc = item.getChildByName("desc");
            if (desc) {
                desc.text = adData.app_desc;
            }
        }

        onClick() {
            if (this.currentAdData == null) {
                return;
            }
            zs.laya.zsapp.zsAppSdk.navigate2Mini(this.currentAdData, zs.laya.game.AppMain.playerInfo.user_id,
                () => {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_SUCCESS);
                },
                () => {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_FAILED);
                },
                () => {
                });
        }

        onStart() {
            this.subAnimDuaration = this.animDuaration / (4 * this.loopTime);
        }
    }
    Laya.ILaya.regClass(ShakeExportIcon);
    Laya.ClassUtils.regClass("zs.laya.platform.ShakeExportIcon", ShakeExportIcon);
    Laya.ClassUtils.regClass("Zhise.ShakeExportIcon", ShakeExportIcon);

    class ShakeExportBox extends Laya.Script {
        constructor() {
            super();
            this.adType = 0;
            this.iconScriptArr = [];
        }

        initView(data) {
            this.adType = data.adType;
            for (let index = 0; index < this.owner.numChildren; index++) {
                var element = this.owner.getChildAt(index);
                var zsGameIcon = element.addComponent(ShakeExportIcon);
                zsGameIcon.adIdx = index;
                this.iconScriptArr.push(zsGameIcon);
            }
            this.requestAdData();
        }

        requestAdData() {
            var self = this;
            zs.laya.zsapp.zsAppSdk.loadAd((data) => {
                var adData = data[self.adType.toString()];
                adData = adData.filter(elment => {
                    return Laya.Browser.onAndroid || (elment.appid != "wx48820730357d81a6" && elment.appid != "wxc136d75bfc63107c");
                })

                for(var index = 0;index < self.iconScriptArr.length;index++){
                    var zsGameIcon = self.iconScriptArr[index];
                    zsGameIcon.initAd(adData);
                }
            });
        }
    }
    Laya.ILaya.regClass(ShakeExportBox);
    Laya.ClassUtils.regClass("zs.laya.platform.ShakeExportBox", ShakeExportBox);
    Laya.ClassUtils.regClass("Zhise.ShakeExportBox", ShakeExportBox);


    class FakeExitBtn extends Laya.Script {
        constructor() {
            super();
        }

        onAwake() {
            this.owner.mouseEnabled = true;
            this.owner.visible = ADConfig.zs_jump_switch && ADConfig.isPublicVersion() && ADConfig.zs_history_list_jump;
        }

        onClick() {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            this.owner.mouseEnabled = false;
            PlatformMgr.showListAd();
            this.owner.mouseEnabled = true;
        }
    }
    Laya.ILaya.regClass(FakeExitBtn);
    Laya.ClassUtils.regClass("zs.laya.platform.FakeExitBtn", FakeExitBtn);
    Laya.ClassUtils.regClass("Zhise.FakeExitBtn", FakeExitBtn);

    class FloatExportBtn extends Laya.Script {
        constructor() {
            super();
        }

        onAwake() {
            this.owner.mouseEnabled = true;
            this.owner.visible = ADConfig.zs_jump_switch && ADConfig.isPublicVersion() && ADConfig.zs_history_list_jump;
        }

        onClick() {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            this.owner.mouseEnabled = false;
            PlatformMgr.showHomeFloatAd();
            this.owner.mouseEnabled = true;
        }
    }
    Laya.ILaya.regClass(FloatExportBtn);
    Laya.ClassUtils.regClass("zs.laya.platform.FloatExportBtn", FloatExportBtn);
    Laya.ClassUtils.regClass("Zhise.FloatExportBtn", FloatExportBtn);

    class ScreenExportBtn extends Laya.Script {
        constructor() {
            super();
        }

        onAwake() {
            this.owner.mouseEnabled = true;
            this.owner.visible = ADConfig.zs_jump_switch && ADConfig.isPublicVersion() && ADConfig.zs_history_list_jump;
        }

        onClick() {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            this.owner.mouseEnabled = false;
            PlatformMgr.showScreenAd();
            this.owner.mouseEnabled = true;
        }
    }
    Laya.ILaya.regClass(ScreenExportBtn);
    Laya.ClassUtils.regClass("zs.laya.platform.ScreenExportBtn", ScreenExportBtn);
    Laya.ClassUtils.regClass("Zhise.ScreenExportBtn", ScreenExportBtn);
    
    /**邀请或者分享按钮 */
    class InviteBtn extends Laya.Script {
        constructor() {
            super();
        }

        onClick() {
            console.log("openInvite");
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            zs.laya.sdk.SdkService.openShare(zs.laya.platform.ADConfig.zs_share_title, zs.laya.platform.ADConfig.zs_share_image);
        }
    }
    Laya.ILaya.regClass(InviteBtn);
    Laya.ClassUtils.regClass("zs.laya.platform.InviteBtn", InviteBtn);
    Laya.ClassUtils.regClass("Zhise.InviteBtn", InviteBtn);

    class RankBtn extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            zs.laya.sdk.SdkService.showUserInfoButton();
        }

        onDisable() {
            zs.laya.sdk.SdkService.hideUserInfoButton();
        }

        onAwake() {
            var rankBtn = this.owner;
            var rankRoot = this.owner.parent;
            var rect = new Laya.Rectangle();
            rect.x = (rankBtn.x + + rankRoot.x) / Laya.stage.width;
            rect.y = (rankBtn.y + rankRoot.y) / Laya.stage.height;
            rect.width = rankBtn.width / Laya.stage.width;
            rect.height = rankBtn.height / Laya.stage.height;
            zs.laya.sdk.SdkService.createUserInfoButton(rect, Laya.Handler.create(this, this.openRank, null, false));
            zs.laya.sdk.SdkService.showUserInfoButton();
        }

        onDestroy() {
            zs.laya.sdk.SdkService.hideUserInfoButton();
            zs.laya.sdk.SdkService.destroyUserInfoButton();
        }

        openRank(res) {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            console.log("openRank");
            if (res && res.rawData != null) {
                PlatformMgr.showRank();
                zs.laya.sdk.SdkService.hideUserInfoButton();
                var userInfo = JSON.parse(res.rawData);
                zs.laya.game.AppMain.authorizeData = JSON.parse(res.rawData);
                zs.laya.game.WebService.requestAuthorize(userInfo.nickName, userInfo.avatarUrl, userInfo.gender);
            }
        }
    }
    Laya.ILaya.regClass(RankBtn);
    Laya.ClassUtils.regClass("zs.laya.platform.RankBtn", RankBtn);
    Laya.ClassUtils.regClass("Zhise.RankBtn", RankBtn);


    class ExportLeftPop extends Laya.Script {
        constructor() {
            super();
            this.srcX = 0;
            this.adList = null;// AdList;
            this.adCheckBox = null;// Laya.Image;
        }

        initView(data) {
            this.srcX = this.owner.x;
            this.adList = this.owner.getChildByName("adList").addComponent(AdList);
            this.adCheckBox = this.owner.getChildByName("adCheckBox");
            this.adCheckBox.on(Laya.Event.CLICK, this, this.updateFloatPos);
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(data.adType, true, AdList.SCROLL_NONE, appConfig.iosFilterAppIds);
        }

        onDestroy() {
            this.adCheckBox.off(Laya.Event.CLICK, this, this.updateFloatPos);
        }

        updateFloatPos() {
            zs.laya.sdk.SdkService.hideUserInfoButton();
            this.adCheckBox.mouseEnabled = false;
            if (this.adCheckBox.selected) {
                Laya.Tween.to(this.owner, { x: 0 }, 500, null, Laya.Handler.create(this, this.onTweenCompleted));
            }
            else {
                Laya.Tween.to(this.owner, { x: this.srcX }, 500, null, Laya.Handler.create(this, this.onTweenCompleted));
            }
        }

        onTweenCompleted() {
            this.adCheckBox.mouseEnabled = true;
            if (this.adCheckBox.selected == false) {
                zs.laya.sdk.SdkService.showUserInfoButton();
            }
        }
    }
    Laya.ILaya.regClass(ExportLeftPop);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportLeftPop", ExportLeftPop);
    Laya.ClassUtils.regClass("Zhise.ExportLeftPop", ExportLeftPop);

    class ExportRightPop extends Laya.Script {
        constructor() {
            super();
            this.adFrame = null;
            this.adList = null;
        }

        initView(data) {
            this.adFrame = this.owner.getChildByName("adFrame")
            this.adList = this.owner.getChildByName("adList").addComponent(AdList2);
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(data.adType, false, AdList.SCROLL_NONE, appConfig.iosFilterAppIds, 9);
            this.adList.owner.on(AdList2.EVENT_AD_SWITCH_HIDE, this, this.onAdHide);
            this.adList.owner.on(AdList2.EVENT_AD_SWITCH_SHOW, this, this.onAdShow);
        }

        onAdHide() {
            this.adList.owner.mouseEnabled = false;
            Laya.Tween.to(this.owner, { x: -150 }, 500, null, Laya.Handler.create(this, this.onTweenCompleted));
        }

        onAdShow() {
            this.adList.owner.mouseEnabled = false;
            Laya.Tween.to(this.owner, { x: -450 }, 500, null, Laya.Handler.create(this, this.onTweenCompleted));
        }

        onTweenCompleted() {
            this.adList.owner.mouseEnabled = true;
        }
    }
    Laya.ILaya.regClass(ExportRightPop);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportRightPop", ExportRightPop);
    Laya.ClassUtils.regClass("Zhise.ExportRightPop", ExportRightPop);

    
    class ExportLeftFlyBox extends Laya.Script {
        constructor() {
            super();
            this.isClick = false;
            this.adData = [];
            this.unData = [];
        }

        initView(params) {
            if (!ADConfig.zs_jump_switch || !ADConfig.isPublicVersion()) {
                this.owner.visible = false;
                return;
            }
            for (let i = 0; i < 6; i++) {
                let box = this.owner.getChildByName("ad_" + i);
                if (box) {
                    //播放动画
                    Laya.Tween.from(box, { rotation: 360, x: box.x - 500 }, 700, null, Laya.Handler.create(this, () => {
                        this.isClick = true;
                    }));
                }
            }
            var adType = params.adType.toString();
            zs.laya.zsapp.zsAppSdk.loadAd((data) => {
                this.adData = data[adType];
                this.freshAdBox();
            });
        }

        freshAdBox() {
            var appConfig = PlatformMgr.platformCfg;
            this.adData = this.adData.filter(function (elment) {
                return Laya.Browser.onAndroid || appConfig.iosFilterAppIds.indexOf(elment.appid) == -1;
            })
            //随机选取6个数据
            if (this.adData.length < 6) {
                while (this.adData.length < 6) {
                    this.adData.push(this.adData[Math.floor(Math.random() * this.adData.length)]);
                }
            }
            else if (this.adData.length > 6) {
                while (this.adData.length > 6) {
                    let data = this.adData.splice(Math.floor(Math.random() * this.adData.length), 1);
                    this.unData.push(data[0]);
                }
            }
            for (let i = 0; i < 6; i++) {
                let box = this.owner.getChildByName("ad_" + i);
                if (box) {
                    let icon = box.getChildByName("icon");
                    if (icon) {
                        icon.loadImage(this.adData[i].app_icon, null);
                    }
                    box.on(Laya.Event.CLICK, this, this.onBoxClick, [i]);
                }
            }
        }

        onBoxClick(i) {
            if (!this.isClick) return;
            zs.laya.zsapp.zsAppSdk.navigate2Mini(this.adData[i], this.userId,
                function () {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_SUCCESS);
                },
                function () {
                    Laya.stage.event(AdList.EVENT_NAVIGATE_FAILED);
                },
                function () {
    
                });
            //更换该位置的数据
            if (this.unData.length > 0) {
                let data = this.unData.splice(Math.floor(Math.random() * this.unData.length), 1);
                this.unData.push((this.adData.splice(i, 1, data[0]))[0]);
                let box = this.owner.getChildByName("ad_" + i);
                if (box) {
                    let icon = box.getChildByName("icon");
                    if (icon) {
                        icon.loadImage(this.adData[i].app_icon, null);
                    }
                }
            }
        }
    }
    Laya.ILaya.regClass(ExportLeftFlyBox);
    Laya.ClassUtils.regClass("zs.laya.platform.ExportLeftFlyBox", ExportLeftFlyBox);
    Laya.ClassUtils.regClass("Zhise.ExportLeftFlyBox", ExportLeftFlyBox);


    class HomeFloatAdView extends zs.laya.base.ZhiSeView {
        constructor() {
            super();
            this.adList = null;
            this.closeBtn = null;
        }

        onAwake() {
            super.onAwake();
            var middleUI = this.owner.getChildByName("middleUI");
            this.adList = middleUI.getChildByName("adList").addComponent(AdList);
            this.closeBtn = middleUI.getChildByName("closeBtn");
            this.closeBtn.on(Laya.Event.CLICK, this, this.closeView);
        }

        onDestroy() {
            this.closeBtn.off(Laya.Event.CLICK, this, this.closeView);
        }

        onStart() {
            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            var args = PlatformMgr.platformCfg.exportGameCfg[viewName];
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(args ? args[0].adType : "promotion", false, AdList.SCROLL_NONE, appConfig.iosFilterAppIds, 9);
        }

        closeView() {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            this.owner.close();
            if(!ADConfig.zs_history_list_jump){
                return;
            }
            if(!zs.laya.game.AppMain.playerInfo.is_new || (zs.laya.game.AppMain.playerInfo.is_new != undefined && zs.laya.game.AppMain.playerInfo.is_new == 0)){
                PlatformMgr.showListAd();
            }
        }
    }

    Laya.ILaya.regClass(HomeFloatAdView);
    Laya.ClassUtils.regClass("zs.laya.platform.HomeFloatAdView", HomeFloatAdView);
    Laya.ClassUtils.regClass("Zhise.HomeFloatAdView", HomeFloatAdView);

    class FullScreeAdView extends zs.laya.base.ZhiSeView {
        constructor() {
            super();
            this.headAdList = null;
            this.mainAdList = null;
            this.closeBtn = null;
        }

        onAwake() {
            super.onAwake();
            var middleUI = this.owner.getChildByName("middleUI");
            this.headAdList = middleUI.getChildByName("headAdList").addComponent(AdList);
            this.mainAdList = middleUI.getChildByName("mainAdList").addComponent(AdList);
            this.closeBtn = middleUI.getChildByName("closeBtn");
            this.closeBtn.on(Laya.Event.CLICK, this, this.closeView);
            this.continueBtn = middleUI.getChildByName("continueBtn");
            this.continueBtn.on(Laya.Event.CLICK, this, this.closeView);
        }

        onDestroy() {
            this.closeBtn.off(Laya.Event.CLICK, this, this.closeView);
            this.continueBtn.off(Laya.Event.CLICK, this, this.closeView);
        }

        onStart() {
            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            var args = PlatformMgr.platformCfg.exportGameCfg[viewName];
            var adType = args ? args[0].adType : "promotion";
            var appConfig = PlatformMgr.platformCfg;
           
            this.headAdList.requestAdData(adType, true, AdList.SCROLL_HORIZONTAL, appConfig.iosFilterAppIds);
            this.mainAdList.requestAdData(adType, true, AdList.SCROLL_VERTICAL, appConfig.iosFilterAppIds, null,true);
        }

        closeView() {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            this.owner.close();
        }
    }
    Laya.ILaya.regClass(FullScreeAdView);
    Laya.ClassUtils.regClass("zs.laya.platform.FullScreeAdView", FullScreeAdView);
    Laya.ClassUtils.regClass("Zhise.FullScreeAdView", FullScreeAdView);

    class ListAdView extends zs.laya.base.ZhiSeView {
        constructor() {
            super();
            this.adList = null;
            this.closeBtn = null;
        }

        onAwake() {
            super.onAwake();
            var topUI = this.owner.getChildByName("topUI");
            this.adList = topUI.getChildByName("adList").addComponent(AdList);
            this.closeBtn = topUI.getChildByName("topFrame").getChildByName("closeBtn");
            this.closeBtn.on(Laya.Event.CLICK, this, this.closeView);

            var bottomUI = this.owner.getChildByName("bottomUI");
            var bottomImg = bottomUI.getChildByName("bottomImg");
            if(bottomImg){
                var backHomeBtn = bottomImg.getChildByName("backHomeBtn");
                backHomeBtn && backHomeBtn.on(Laya.Event.CLICK, this, this.closeView);

                var continueBtn = bottomImg.getChildByName("continueBtn");
                continueBtn && continueBtn.on(Laya.Event.CLICK, this, this.closeView);
            }
        }

        onDestroy() {
            this.closeBtn.off(Laya.Event.CLICK, this, this.closeView);
        }

        onStart() {
            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            var args = PlatformMgr.platformCfg.exportGameCfg[viewName];
            var appConfig = PlatformMgr.platformCfg;
            this.adList.requestAdData(args ? args[0].adType : "promotion", false, AdList.SCROLL_VERTICAL, appConfig.iosFilterAppIds,null,true);
        }

        closeView() {
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
            this.owner.close();
        }
    }
    Laya.ILaya.regClass(ListAdView);
    Laya.ClassUtils.regClass("zs.laya.platform.ListAdView", ListAdView);
    Laya.ClassUtils.regClass("Zhise.ListAdView", ListAdView);
    
    
    
    class KnockEggView extends zs.laya.base.ZhiSeView {
        constructor() { super(); }

        onAwake() {
            super.onAwake();
            this.initData();
            
            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            var args = PlatformMgr.platformCfg.exportGameCfg[viewName];
            var adType = args ? args[0].adType : "promotion";
            var appConfig = PlatformMgr.platformCfg;

            var bottomUI = this.owner.getChildByName("bottomUI");
            if (bottomUI) {
                this.btn_repair = bottomUI.getChildByName("eggBtn");
            }

            var middleUI = this.owner.getChildByName("middleUI");

            var eggUI = this.eggUI = middleUI.getChildByName("eggUI");

            if (eggUI) {

                if (!this.btn_repair) {
                    this.btn_repair = eggUI.getChildByName("eggBtn");
                }
                this.progressBar = eggUI.getChildByName("loading_1");
                this.progressWidth = this.progressBar.bitmap.width;
                this.progressHeight = this.progressBar.bitmap.height;
            }

            this.bannerMoveType = 0;
            this.initCfg();


            //事件监听
            Laya.stage.on(PlatformMgr.APP_HIDE, this, this.onAppHide);
            Laya.stage.on(PlatformMgr.APP_SHOW, this, this.onAppShow);

            if (this.btn_repair) {
                this.btn_repair.on(Laya.Event.MOUSE_DOWN, this, this.onTouchStart);
                this.btn_repair.on(Laya.Event.MOUSE_UP, this, this.clickHammer);
            }

            this.hammerAni = this.owner["knockAni"];
        }

        initCfg() {
            this.knockEggCfg = Laya.loader.getRes("config/KnockEggCfg.json");
            this.awardDelay = 1000;
            this.closeDelay = 1000;

            if (this.knockEggCfg) {
                if (zs.laya.MiscUtils.IsNumber(this.knockEggCfg.awardDelay)) {
                    this.awardDelay = Number(this.knockEggCfg.awardDelay);
                }

                if (zs.laya.MiscUtils.IsNumber(this.knockEggCfg.closeDelay)) {
                    this.closeDelay = Number(this.knockEggCfg.closeDelay);
                }
            }
        }

        isShowAward() {
            return this.knockEggCfg && this.knockEggCfg.isShowAward;
        }

        onTouchStart(e) {
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
        }

        initData() {
            this.btn_repair = null;
            this.progressBar = null;
            this.hammerAni = null;
            this.egg = null;
            this.touchNode = null;

            //修车进度
            this.repairProgress = 0;

            //每次点击增加的百分比
            this.click_add_percent = 0.14;

            //是否已经打开广告
            this.isOpenAd = false;

            //修车显示广告 随机区间
            this.repair_click_num = [0.3, 0.7];

            /**显示Banner区间 */
            this.showBannerRange = 1;

            this.isGetAward = false;

            this.callback = null;
        }

        onEnable() {
            super.onEnable();
            // WxBannerAd.Instance.hide();
            this.initBannerGroup();
            this.initRepair();
        }

        onDisable() {
            super.onDisable();
        }

        onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        removeEvent() {
            Laya.timer.clear(this, this.cutBack);
            Laya.stage.off(PlatformMgr.APP_HIDE, this, this.onAppHide);
            Laya.stage.off(PlatformMgr.APP_SHOW, this, this.onAppShow);
            if (this.btn_repair) {
                this.btn_repair.off(Laya.Event.MOUSE_DOWN, this, this.onTouchStart);
                this.btn_repair.off(Laya.Event.MOUSE_UP, this, this.clickHammer);
            }
        }

        onAppHide() {
            if (!this.isOpenAd) return;

            if (this.btn_repair) {
                this.btn_repair.off(Laya.Event.MOUSE_DOWN, this, this.onTouchStart);
                this.btn_repair.off(Laya.Event.MOUSE_UP, this, this.clickHammer);
            }

            this.isOpenAd = true;
            Laya.timer.clear(this, this.resetIsOpenAd);
            Laya.timer.clear(this, this.cutBack);

            var open_award_num = Laya.LocalStorage.getItem("open_award_num") || 0;
            Laya.LocalStorage.setItem("open_award_num", Number(open_award_num) + 1);

            if (this.isShowAward()) {

            } else {
                this.onFinish();
            }
        }

        initBannerGroup() {
            var bannerCfg = PlatformMgr.platformCfg.bannerCfg;
            if (bannerCfg) {
                this.viewName = this.owner.url;
                this.viewName = this.viewName.substring(this.viewName.lastIndexOf('/') + 1, this.viewName.lastIndexOf('.'));
                var data = bannerCfg[this.viewName];
                if (data) {
                    var showData = data.showData;
                    if (showData) {
                        if (showData.sign || showData.sign == 0 || showData.sign == false) {
                            this.bannerGroup = zs.laya.banner.WxBannerMgr.Instance.getBannerGroup(showData.sign);
                            this.bannerGroup && this.bannerGroup.hide();
                        }
                        var moveType = showData.moveType;
                        if (moveType == 1) {
                            this.bannerMoveType = moveType;
                        }
                    } else {
                        console.error("==============initBannerGroup===============", data.showData);
                    }
                }
            }
        }

        onAppShow() {
            if (!this.isOpenAd) return;
            this.bannerGroup && this.bannerGroup.hide();
            if (this.isShowAward()) {
                this.onFinish();
            }
        }

        //初始化修车
        initRepair() {

            this.isGetAward = false;
            ADConfig.openEggTimes = zs.laya.MiscUtils.IsNumber(ADConfig.openEggTimes) ? Number(ADConfig.openEggTimes) + 1 : 1;
            Laya.timer.loop(20, this, this.cutBack);
            if (ADConfig.zs_click_award_percent.indexOf("[") >= 0) {
                this.repair_click_num = JSON.parse(ADConfig.zs_click_award_percent);
            } else {
                this.repair_click_num = ADConfig.zs_click_award_percent.split(",");
            }


            this.click_add_percent = ADConfig.zs_click_award_add;

            this.zs_click_award_back = ADConfig.zs_click_award_back;

            this.click_add_percent = zs.laya.MiscUtils.random(this.click_add_percent * 0.9 * 100, this.click_add_percent * 1.1 * 100) * 0.01;

            console.log("===============repair_click_num=====================", this.repair_click_num);

            this.showBannerRange = zs.laya.MiscUtils.random(Number(this.repair_click_num[0]) * 100, Number(this.repair_click_num[1]) * 100) * 0.01;
        }

        setCloseCallback(callback) {
            this.callback = callback;
        }

        //修车处理方法
        clickHammer() {
            if (this.repairProgress + this.click_add_percent <= 1) {

                this.updateRepairPorgress(this.repairProgress + this.click_add_percent);

                this.hammerAni && this.hammerAni.play(0, false);

                // console.log("this.showBannerRange", this.click_add_percent, this.showBannerRange, this.repair_click_num);
                if (this.repairProgress >= this.showBannerRange && !this.isOpenAd) {

                    this.isOpenAd = true;

                    switch (this.bannerMoveType) {
                        case 1:
                            this.bannerGroup && this.bannerGroup.updateY(this.lastMouseY);
                            break;
                        default:
                            this.bannerGroup && this.bannerGroup.updateBottonTouch();
                            break;
                    }

                    this.bannerGroup && this.bannerGroup.show();
                    Laya.timer.once(800, this, this.resetIsOpenAd);

                    Laya.timer.once(800, this, function () {
                        this.initBannerGroup();
                        this.bannerGroup && this.bannerGroup.hide();

                    });
                }
            } else {
                this.updateRepairPorgress(this.repairProgress + this.click_add_percent);

                this.bannerGroup && this.bannerGroup.hide();

                Laya.timer.clear(this, this.cutBack);

                Laya.timer.clear(this, this.resetIsOpenAd);

                this.onFinish();
            }
        }

        resetIsOpenAd() {
            this.isOpenAd = false;
        }

        onFinish() {
            if (this.isGetAward) return;

            this.isGetAward = true;

            Laya.timer.once(this.awardDelay, this, () => {
                Laya.stage.event(PlatformMgr.EGG_GET_AWARD);
            });
            Laya.timer.once(Math.max(this.closeDelay, this.awardDelay + 40), this, this.onClose);
        }

        onClose() {
            console.log("====================关闭金蛋==================");
            this.callback && this.callback();
            this.bannerGroup && this.bannerGroup.hide();
            this.owner.close();
        }

        //更新修车进度
        updateRepairPorgress(val) {
            this.repairProgress = Math.min(1, Math.max(0, val));
            if (this.progressWidth < this.progressHeight) {
                this.progressBar && (this.progressBar.height = this.progressBar.clipHeight = Math.max(1, this.progressHeight * this.repairProgress));
            } else {
                this.progressBar && (this.progressBar.width = Math.max(1, this.progressWidth * this.repairProgress));
            }
        }

        //修车进度回退
        cutBack() {
            this.repairProgress -= this.zs_click_award_back;
            this.updateRepairPorgress(this.repairProgress);
        }
    }
    Laya.ILaya.regClass(KnockEggView);
    Laya.ClassUtils.regClass("zs.laya.platform.KnockEggView", KnockEggView);
    Laya.ClassUtils.regClass("Zhise.KnockEggView", KnockEggView);

    class RankView extends zs.laya.base.ZhiSeView {

        constructor() {
            RankView.__super.call(this);
            this.closeBtn = null;
            this.openView = null;
        }

        onAwake() {
            super.onAwake();
            this.openView = this.owner.getChildByName("fullUI");
            this.closeBtn = this.owner.getChildByName("closeBtn");
        }

        onEnable() {
            zs.laya.sdk.SdkService.hideUserInfoButton();
        }

        onDisable() {
            zs.laya.sdk.SdkService.showUserInfoButton();
        }

        onStart() {
            if (Laya.Browser.onMiniGame) {
                this.openView.postMsg(new zs.laya.opendata.MainScopeMsg(zs.laya.opendata.EventDefine.OpenRank, { userId: zs.laya.game.AppMain.playerInfo.user_id, atlasUrl: this.AtlasURL }));
                Laya.loader.load(this.AtlasURL, Laya.Handler.create(this, function () {
                    Laya.MiniAdpter.sendAtlasToOpenDataContext(RankView.AtlasURL);
                }));
            }
            Laya.stage.on(EventId.NET_XHR_RESPONSE, this, this.onRankDataReady);
            zs.laya.game.WebService.requestTopRank();

            this.closeBtn && this.closeBtn.on(Laya.Event.CLICK, this, this.closeRank);
        }

        onDestroy() {
            this.closeBtn && this.closeBtn.off(Laya.Event.CLICK, this, this.closeRank);
        }

        closeRank() {
            if (Laya.Browser.onMiniGame) {
                this.openView.postMsg(new zs.laya.opendata.MainScopeMsg(zs.laya.opendata.EventDefine.CloseRank))
            }
            PlatformMgr.hideRank();
            Laya.SoundManager.playSound(PlatformMgr.soundClick);
        }

        onRankDataReady(result, api, params, response) {

            if (api == zs.laya.game.WebService.WebApiMap.worldRank) {
                if (result == 1) {
                    Laya.stage.off(EventId.NET_XHR_RESPONSE, this, this.onRankDataReady);
                    if (response && response.data && response.data.list && Laya.Browser.onMiniGame) {
                        var rankDatas = [];
                        var dataArr = response.data.list;
                        var selfId = zs.laya.game.AppMain.playerInfo.user_id;
                        dataArr.forEach(function (element, idx) {
                            rankDatas.push(new zs.laya.opendata.RankData(idx + 1, element.avatar, element.nickname, element.max_score, element.user_id == selfId));
                        })
                        this.openView.postMsg(new zs.laya.opendata.MainScopeMsg(zs.laya.opendata.EventDefine.ShowRank, { rankType: zs.laya.opendata.RankType.WorldRank, rankData: rankDatas }));
                    }
                }
            }
        }

    }
    RankView.AtlasURL = "res/atlas/rankUI.atlas";
    Laya.ILaya.regClass(RankView);
    Laya.ClassUtils.regClass("zs.laya.platform.RankView", RankView);
    Laya.ClassUtils.regClass("Zhise.RankView", RankView);
    
    /**-------------------------------------以下是平台的原生广告-------------------------------------*/
    class NativeAdsCtrl extends Laya.Script {
        constructor() {
            super();
            this.args = null;
            this.adView = null;
        }

        onDestroy() {
            if (this.adView) {
                var scriptType = this.getViewScript(this.args.scriptType);
                if (scriptType == null) {
                    scriptType = NativeIconAdView;
                }
                var script = this.adView.getComponent(scriptType);
                if (script) {
                    script.releaseView();
                }
                this.adView.removeSelf();
                this.adView = null;
            }
        }

        onStart() {
            if(this.adView){
                this.adView.visible = true;
                return;
            }
            if (zs.laya.zsapp.zsAppSdk.Instance && zs.laya.zsapp.zsAppSdk.Instance.isFromLink() && zs.laya.zsapp.zsAppSdk.Instance.isExportValid() == false) {
                return;
            }
            if (ADConfig.zs_jump_switch == false || ADConfig.isPublicVersion() == false) {
                return;
            }

            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            this.args = PlatformMgr.platformCfg.nativeAdCfg[viewName];
            if (!this.args) {
                return;
            }

            Laya.loader.create(this.args.viewUrl, Laya.Handler.create(this, this.onPrefabReady), null, Laya.Loader.PREFAB);
        }

        onPrefabReady(prefab) {
            if (this.destroyed) {
                return;
            }

            if(!this.owner.getChildByName(this.args.parentRoot)){
                console.log(viewName +" page parentRoot " + this.args.parentRoot + " is null");
                return;
            }
            this.adView = prefab.create();
            this.owner.getChildByName(this.args.parentRoot).addChild(this.adView);
            this.adView.x = this.args.x;
            this.adView.y = this.args.y;

            var scriptType = this.getViewScript(this.args.scriptType);
            if (scriptType == null) {
                scriptType = NativeIconAdView;
            }
            
            var script = this.adView.getComponent(scriptType);
            if (script == null) {
                script = this.adView.addComponent(scriptType);
            }
            script.initView(this.args);
        }

        getViewScript(type) {
            switch(type){
                case "NativeIconAdView":
                    return NativeIconAdView;
                break;
            }
        }
    }
    Laya.ILaya.regClass(NativeAdsCtrl);
    Laya.ClassUtils.regClass("zs.laya.platform.NativeAdsCtrl", NativeAdsCtrl);
    Laya.ClassUtils.regClass("Zhise.NativeAdsCtrl", NativeAdsCtrl);

    class NativeIconAdView extends Laya.Script {

        constructor() {
            super();
            this.gameIcon = null;
            this.config = null;
            this.maskViewNum = 0;
            this.iconReady = false;
        }

        initView(data) {
            this.config = data;
            this.maskViewNum = 0;
            this.iconReady = false;
            var stageRoot = Laya.stage.getChildByName("root");
            for (let index = stageRoot.numChildren - 1; index >= 0; index--) {
                var element = stageRoot.getChildAt(index);
                if (element.zOrder && element.zOrder > this.owner.zOrder) {
                    this.maskViewNum++;
                }
                console.log("stage:" + element.name);
            }
            Laya.stage.on(PlatformMgr.UI_VIEW_OPENED, this, this.onViewOpened);
            Laya.stage.on(PlatformMgr.UI_VIEW_CLOSED, this, this.onViewClosed);
        }

        onStart() {
            var styles = [];
            var nativeAdValid = typeof wx !== "undefined";
            if (nativeAdValid == false) {
                return ;
            }
            
            var systemInfo = wx.getSystemInfoSync();
            nativeAdValid = zs.laya.MiscUtils.compareVersion(systemInfo.SDKVersion, "2.8.2") >= 0;
            this.owner.visible = nativeAdValid;
            if (nativeAdValid == false) {
                return ;
            }
            
            // this.updateIconStyle("topUI", styles, systemInfo);
            // this.updateIconStyle("middleUI", styles, systemInfo);
            this.updateIconStyle(styles, systemInfo);
            if (styles.length == 0) {
                return ;
            }
            console.log(styles);
            this.gameIcon = wx.createGameIcon({
                adUnitId: ADConfig.response[this.config.idKey],
                count: styles.length,
                style: styles
            });
            if (this.gameIcon) {
                console.log("load gameIcon");
                var self = this;
                this.gameIcon.onError(function (err) {
                    console.error(err);
                    self.gameIcon = null;
                })
                this.gameIcon.load();
                this.gameIcon.onLoad(function () {
                    console.log("gameIcon loaded");
                    self.iconReady = true;
                    if (self.maskViewNum == 0 && self.owner.visible) {
                        self.gameIcon.show();
                    }
                });
            }
        }

        onEnable() {
            if (this.gameIcon) {
                this.gameIcon.show();
            }
        }

        onDisable() {
            if (this.gameIcon) {
                this.gameIcon.hide();
            }
        }

        updateIconStyle(styles, systemInfo) {//rootName,
            var iconsRoot = this.owner.getChildByName("container");
            if (iconsRoot == null) {
                return ;
            }
            for (let index = 0; index < iconsRoot.numChildren; index++) {
                const element = iconsRoot.getChildAt(index);
                element.visible = false;
                var resultPoint = this.owner.localToGlobal(new Laya.Point(element.x ,element.y),true);
                styles.push({
                    appNameHidden: true,
                    color: 'white',
                    borderWidth: 1,
                    borderColor: 'white',
                    top: resultPoint.y / Laya.stage.height * systemInfo.windowHeight,
                    left: resultPoint.x / Laya.stage.width * systemInfo.windowWidth,
                    size: element.width / Laya.stage.width * systemInfo.windowWidth
                });
            }
        }

        releaseView() {
            this.maskViewNum = -1;
            Laya.stage.off(PlatformMgr.UI_VIEW_OPENED, this, this.onViewOpened);
            Laya.stage.off(PlatformMgr.UI_VIEW_CLOSED, this, this.onViewClosed);
            if (this.gameIcon) {
                this.gameIcon.destroy();
                this.gameIcon = null;
            }
        }

        onViewOpened(viewName, viewObj) {
            if (viewObj.zOrder > this.owner.zOrder) {
                this.maskViewNum++;
            }
            if (this.maskViewNum != 0 && this.gameIcon && this.iconReady) {
                this.gameIcon.hide();
            }
        }

        onViewClosed(viewName, viewObj) {
            if (viewObj.zOrder > this.owner.zOrder) {
                this.maskViewNum--;
            }
            if (this.maskViewNum == 0 && this.gameIcon && this.iconReady) {
                this.gameIcon.show();
            }
        }
    }
    Laya.ILaya.regClass(NativeIconAdView);
    Laya.ClassUtils.regClass("zs.laya.platform.NativeIconAdView", NativeIconAdView);
    Laya.ClassUtils.regClass("Zhise.NativeIconAdView", NativeIconAdView);

    /**-------------------------------------以下是误触动画控制-------------------------------------*/
    class MistakenlyTouchCtrl extends Laya.Script {
        constructor() {
            super();
        }

        onAwake() {

            if (ADConfig.isPublicVersion() != true) {
                return;
            }

            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            var configs = PlatformMgr.platformCfg.mistakenlyTouchCfg[viewName];
            if (!configs) {
                return;
            }
            for (let index = 0; index < configs.length; index++) {
                const element = configs[index];
                const child = this.findChildByPath(element.path);
                var srcX = child.x;
                var srcY = child.y;
                if (ADConfig.zs_switch) {
                    if (ADConfig.zs_banner_vertical_enable) {
                        child.x += element.offsetX;
                        child.y += element.offsetY;
                        this.owner.timerOnce(ADConfig.zs_banner_text_time, this, this.moveBack, [srcX, srcY, ADConfig.zs_banner_move_time, child], false);
                    }
                    else if (ADConfig.zs_unmiss_text_time > 0) {
                        child.visible = false;
                        this.owner.timerOnce(ADConfig.zs_unmiss_text_time, this, this.showObj, [child], false);
                    }
                }
            }

        }

        onStart() {
            if (ADConfig.isPublicVersion() != true) {
                return;
            }

            var viewName = this.owner.url.substring(this.owner.url.lastIndexOf('/') + 1, this.owner.url.lastIndexOf('.'));
            var configs = PlatformMgr.platformCfg.mistakenlyTouchCfg[viewName];
            if (!configs) {
                return;
            }
            for (let index = 0; index < configs.length; index++) {
                const element = configs[index];
                const child = this.findChildByPath(element.path);
                if (ADConfig.zs_switch) {
                    if (ADConfig.zs_banner_vertical_enable) {
                        child.x += element.offsetX;
                        child.y += element.offsetY;
                        child.mouseEnabled = false;
                    }
                }
            }
        }

        moveBack(srcX, srcY, duaration, obj) {
            Laya.Tween.to(obj, { x: srcX, y: srcY }, duaration, null, Laya.Handler.create(this, this.activeObj, [obj]))
        }

        activeObj(obj) {
            obj.visible = false;
            obj.mouseEnabled = true;
            obj.visible = true;
        }

        showObj(obj) {
            obj.visible = true;
            obj.mouseEnabled = true;
        }

        findChildByPath(path) {
            var nodes = path.split("/");
            var child = this.owner;
            for (let index = 0; index < nodes.length; index++) {
                child = child.getChildByName(nodes[index]);
            }
            return child;
        }
    }
    Laya.ILaya.regClass(MistakenlyTouchCtrl);
    Laya.ClassUtils.regClass("zs.laya.platform.MistakenlyTouchCtrl", MistakenlyTouchCtrl);
    Laya.ClassUtils.regClass("Zhise.MistakenlyTouchCtrl", MistakenlyTouchCtrl);

    class BannerCtrl extends Laya.Script {

        onEnable() {

            this.viewName = this.owner.url;
            this.viewName = this.viewName.substring(this.viewName.lastIndexOf('/') + 1, this.viewName.lastIndexOf('.'));
            var bannerCfg = PlatformMgr.platformCfg.bannerCfg;
            if (bannerCfg) {
                var data = bannerCfg[this.viewName];
                if (data) {
                    var groupArr = data.initGroupArr;
                    if (groupArr) {
                        console.log("setAdUnitId:", ADConfig.zs_banner_rotate_id1,
                        ADConfig.zs_banner_rotate_id2, ADConfig.zs_banner_rotate_id3);

                        zs.laya.banner.WxBannerMgr.Instance.setAdUnitId(ADConfig.zs_banner_rotate_id1,
                            ADConfig.zs_banner_rotate_id2, ADConfig.zs_banner_rotate_id3);

                        for (let i = 0; i < groupArr.length; i++) {
                            const groupData = groupArr[i];
                            zs.laya.banner.WxBannerMgr.Instance.initBannerGroupBySign(groupData.sign, groupData.length, groupData.autoChange, groupData.isReset);
                        }
                    }
                    console.log("==================", this.viewName, "=================", data);

                    var showData = data.showData;
                    if (showData) {
                        zs.laya.banner.WxBannerMgr.Instance.hideAllShow();
                        if (!showData.unAutoShow && (showData.sign || showData.sign == 0 || showData.sign == false)) {
                            var bannerGroup = zs.laya.banner.WxBannerMgr.Instance.getBannerGroup(showData.sign);
                            if (showData.isDelay && ADConfig.zs_banner_banner_time) {
                                Laya.timer.once(ADConfig.zs_banner_banner_time, this, this.showBanner, [bannerGroup]);
                            } else {
                                this.showBanner(bannerGroup);
                            }
                        }
                    }

                    var exposureData = data.exposureData;

                    if (exposureData) {
                        // 如果当前页面是全屏，并且全屏增加白点是打开状态
                        var pageType = data.pageType;
                        if (pageType == 1) {
                            if (ADConfig.zs_full_screen_rotate) {
                                zs.laya.banner.WxBannerMgr.Instance.lockHideExposure();
                            } else {
                                return;
                            }
                        }

                        if (exposureData.sign || exposureData.sign == 0 || exposureData.sign == false) {
                            var bannerGroup = zs.laya.banner.WxBannerMgr.Instance.getBannerGroup(exposureData.sign);
                            var anchorArr = exposureData.anchorArr;
                            if (anchorArr) {
                                for (let i = 0; i < anchorArr.length; i++) {
                                    const anchor = anchorArr[i];
                                    bannerGroup && bannerGroup.showExposure(zs.laya.banner.WxBanner[anchor]);
                                }
                            }
                        }
                    }

                    var lockHide = data.lockHide;
                    if (lockHide) {
                        zs.laya.banner.WxBannerMgr.Instance.lockHide();
                    }
                }
            }
        }

        showBanner(bannerGroup) {
            bannerGroup && bannerGroup.updateBottonTouch();
            bannerGroup && bannerGroup.show();
        }

        onDisable() {
            this.viewName = this.owner.url;
            this.viewName = this.viewName.substring(this.viewName.lastIndexOf('/') + 1, this.viewName.lastIndexOf('.'));
            var bannerCfg = PlatformMgr.platformCfg.bannerCfg;
            if (bannerCfg) {
                var data = bannerCfg[this.viewName];
                if (data) {
                    var showData = data.showData;
                    if (showData) {
                        if (showData.sign || showData.sign == 0 || showData.sign == false) {
                            Laya.timer.clear(this, this.showBanner);
                            var bannerGroup = zs.laya.banner.WxBannerMgr.Instance.getBannerGroup(showData.sign);
                            bannerGroup && bannerGroup.hide();
                        }
                    }

                    var exposureData = data.exposureData;
                    if (exposureData) {
                        var pageType = data.pageType;
                        if (pageType == 1) {
                            if (zs.laya.platform.ADConfig.zs_full_screen_rotate) {
                                zs.laya.banner.WxBannerMgr.Instance.hideResumeExposure();
                            } else {
                                return;
                            }
                        }

                        if (exposureData.sign || exposureData.sign == 0 || exposureData.sign == false) {
                            var bannerGroup = zs.laya.banner.WxBannerMgr.Instance.getBannerGroup(exposureData.sign);
                            bannerGroup && bannerGroup.hideExposure();
                        }
                    }


                    var lockHide = data.lockHide;
                    if (lockHide) {
                        zs.laya.banner.WxBannerMgr.Instance.hideResume();
                    }
                }
            }
        }
    }
    Laya.ILaya.regClass(BannerCtrl);
    Laya.ClassUtils.regClass("zs.laya.platform.BannerCtrl", BannerCtrl);
    Laya.ClassUtils.regClass("Zhise.BannerCtrl", BannerCtrl);

    exports.PlatformMgr = PlatformMgr;
    exports.ADConfig = ADConfig;
    exports.ExportGameCtrl = ExportGameCtrl;
    exports.NativeAdsCtrl = NativeAdsCtrl;
    exports.MistakenlyTouchCtrl = MistakenlyTouchCtrl;
    exports.BannerCtrl = BannerCtrl;

}(window.zs.laya.platform = window.zs.laya.platform || {}, Laya));