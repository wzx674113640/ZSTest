window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
    
    class Layout extends Laya.Script {

        constructor() {
            super();
            this.active = false;

            this.topUI = null;
            this.middleUI = null;
            this.bottomUI = null;
            this.leftFloatUI = null;
            this.rightFloatUI = null;
            this.fullUI = null;

            this.applyStatusBar = true;
            this.isFull = true;
            this.vLayout = Layout.VERTICAL_MIDDLE;
            this.hLayout = Layout.HORIZONTAL_CENTER;
        }

        initLayout(applyStatusBar, isFull, vLayout, hLayout) {
            this.applyStatusBar = applyStatusBar;
            this.isFull = isFull;
            this.vLayout = vLayout;
            this.hLayout = hLayout;
            this.applyLayout();
        }

        onAwake() {

            this.topUI = this.owner.getChildByName("topUI");
            this.middleUI = this.owner.getChildByName("middleUI");
            this.bottomUI = this.owner.getChildByName("bottomUI");
            this.leftFloatUI = this.owner.getChildByName("leftFloatUI");
            this.rightFloatUI = this.owner.getChildByName("rightFloatUI");
            this.fullUI = this.owner.getChildByName("fullUI");
        }

        onEnable() {
            this.applyLayout();
        }

        onDisable() {
        }

        applyLayout() {
            var view = this.owner;
            if (this.isFull) {
                view.top = 0;
                view.bottom = 0;
                view.left = 0;
                view.right = 0;
            }
            else {

                if (this.vLayout == 0) {
                    view.top = 0;
                }
                else if (this.vLayout == 1) {
                    view.centerY = 0;
                }
                else {
                    view.bottom = 0;
                }

                if (this.hLayout == 0) {
                    view.left = 0;
                }
                else if (this.hLayout == 1) {
                    view.centerX = 0;
                }
                else {
                    view.right = 0;
                }
            }

            if (this.topUI) {
                this.topUI.top = this.applyStatusBar ? zs.laya.DeviceService.statusBarHeight() * Laya.stage.height / zs.laya.DeviceService.screenHeight() : 0;
                this.topUI.centerX = 0;
            }

            if (this.middleUI) {
                this.middleUI.centerY = 0;
                this.middleUI.centerX = 0;
            }

            if (this.bottomUI) {
                this.bottomUI.bottom = 0;
                this.bottomUI.centerX = 0;
            }

            if (this.leftFloatUI) {
                this.leftFloatUI.left = 0;
                this.leftFloatUI.centerY = 0;
            }

            if (this.rightFloatUI) {
                this.rightFloatUI.left = Laya.stage.width;
                this.rightFloatUI.centerY = 0;
            }

            if (this.fullUI) {
                this.fullUI.top = -2;
                this.fullUI.bottom = -2;
                this.fullUI.left = -2;
                this.fullUI.right = -2;
            }
        }
    }
    Layout.VERTICAL_TOP = 0;
    Layout.VERTICAL_MIDDLE = 1;
    Layout.VERTICAL_BOTTOM = 2;
    Layout.HORIZONTAL_LEFT = 0;
    Layout.HORIZONTAL_CENTER = 1;
    Layout.HORIZONTAL_RIGHT = 2;
    Laya.ILaya.regClass(Layout);
    Laya.ClassUtils.regClass("zs.laya.base.Layout", Layout);
    Laya.ClassUtils.regClass("Zhise.Layout", Layout);

    class BaseView extends Laya.Script {

        constructor() {
            super();
            this.viewName = "";
        }

        onAwake() {
            this.viewName = this.owner.url;
            this.viewName = this.viewName.substring(this.viewName.lastIndexOf('/') + 1, this.viewName.lastIndexOf('.'));
        }

        onEnable() {
            Laya.stage.event(BaseView.EVENT_UI_VIEW_OPENED, [this.viewName, this.owner]);
        }

        onDisable() {
            Laya.stage.event(BaseView.EVENT_UI_VIEW_CLOSED, [this.viewName, this.owner]);
        }
    }
    BaseView.EVENT_UI_VIEW_CLOSED = "UI_VIEW_CLOSED";
    BaseView.EVENT_UI_VIEW_OPENED = "UI_VIEW_OPENED";
    Laya.ILaya.regClass(BaseView);
    Laya.ClassUtils.regClass("zs.laya.base.BaseView", BaseView);
    Laya.ClassUtils.regClass("Zhise.BaseView", BaseView);

    class ZhiSeView extends BaseView {
        constructor() {
            super();
        }

        onAwake() {
            super.onAwake();
            this.owner.addComponent(Layout);
            
            //如果打开了广告数据请求开关，页面添加这些广告处理逻辑
            if(zs.laya.game.AppMain.appConfig.useWebAdApi){
                var bannerCfg = zs.laya.platform.PlatformMgr.platformCfg.bannerCfg;
                if(bannerCfg && bannerCfg[this.viewName]){
                    this.owner.addComponent(zs.laya.platform.BannerCtrl);
                }

                var exportGameCfg = zs.laya.platform.PlatformMgr.platformCfg.exportGameCfg;
                if (exportGameCfg && exportGameCfg[this.viewName]) {
                    this.owner.addComponent(zs.laya.platform.ExportGameCtrl);
                }
                var nativeAdCfg = zs.laya.platform.PlatformMgr.platformCfg.nativeAdCfg;
                if (nativeAdCfg && nativeAdCfg[this.viewName] && nativeAdCfg[this.viewName].auto != false) {
                    this.owner.addComponent(zs.laya.platform.NativeAdsCtrl);
                }
                var mistakenlyTouchCfg = zs.laya.platform.PlatformMgr.platformCfg.mistakenlyTouchCfg;
                if (mistakenlyTouchCfg && mistakenlyTouchCfg[this.viewName]) {
                    this.owner.addComponent(zs.laya.platform.MistakenlyTouchCtrl);
                }
            }   
        }

        initView(data) {

        }
    }
    Laya.ILaya.regClass(ZhiSeView);
    Laya.ClassUtils.regClass("zs.laya.base.ZhiSeView", ZhiSeView);
    Laya.ClassUtils.regClass("Zhise.View", ZhiSeView);

    exports.Layout = Layout;
    exports.BaseView = BaseView;
    exports.ZhiSeView = ZhiSeView;
}(window.zs.laya.base = window.zs.laya.base || {}, Laya));