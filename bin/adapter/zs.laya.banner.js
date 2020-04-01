window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};

(function (exports, Laya) {
    'use strict';

    class WxBanner {
        constructor(adUnitId, adIntervals) {
            this.initData();
            this.adUnitId = adUnitId;
            this.adIntervals = adIntervals;
            this.canShowBannerAd = this.isCanShowBannerAd();
        }

        initData() {

            this.baseSize = { w: 750, h: 1334 };  // 基准模版尺寸

            this.bannerAd = null;

            this.adUnitId = null;

            this.showType = WxBanner.BOTTOM_RIGHT; // 显示类型

            this.showMode = WxBanner.MODE_BOTTOM_TOUCH;

            this.exposureSize = { w: 1, h: 1 };//曝光模式下的曝光尺寸

            this.errorReLoadTimes = 3;   //banner加载失败 重新加载最大次数

            this.reLoadDelay = 500;

            this.realSize = { w: 1, h: 1 };

            this.showTimes = 0;

            this.showExposureTimes = 0;

            this.preStyle = { left: 0, top: 0, width: 1, height: 1 };
        }

        setBaseSize(w, h) {
            this.baseSize.w = w;
            this.baseSize.h = h;
        }

        setShowType(type) {
            this.showType = type;
        }

        setShowMode(mode) {
            this.showMode = mode;
        }

        setExposureSize(w, h) {
            this.exposureSize.w = w;
            this.exposureSize.h = h;
        }

        setBannerRect(top, left, width, height) {
            this.preStyle.top = top;
            this.preStyle.left = left;
            this.preStyle.width = width;
            this.preStyle.height = height;
        }

        createBanner() {
            if (!this.canShowBannerAd) return;
            var availHeight = window.screen.availHeight;
            var availWidth = window.screen.availWidth;
            var scaleX = availWidth / this.baseSize.w;
            var scaleY = availHeight / this.baseSize.h;

            var top = this.preStyle.top * scaleY;
            var height = this.preStyle.height * scaleY;

            var left = this.preStyle.left * scaleX;
            var width = this.preStyle.width * scaleX;

            console.log("=============createBanner start...:=============", this.adUnitId, top, left, width);

            if (this.bannerAd == null) {
                this.bannerAd = wx.createBannerAd({
                    adUnitId: this.adUnitId,
                    adIntervals: this.adIntervals,
                    style: {
                        left: left,
                        top: top,
                        width: width,
                        height: height
                    }
                });
            }

            if (!this.bannerAd) {
                console.error("Banner 创建失败!", this.bannerAd);
                if (this.errorReLoadTimes > 0) {
                    this.errorReLoadTimes--;
                    setTimeout(() => {
                        this.createBanner();
                    }, this.reLoadDelay);
                }
                return;
            }

            this.showTimes = 0;
            this.showExposureTimes = 0;

            this.bannerAd.onError(err => {
                console.error("Banner err:", err);
                if (this.errorReLoadTimes > 0) {
                    this.errorReLoadTimes--;
                    setTimeout(() => {
                        this.createBanner();
                    }, this.reLoadDelay);
                }
            });

            this.bannerAd.onResize(this.onResize.bind(this));
            // this.bannerResize.bind
        }

        onResize(size) {
            this.realSize = { w: size.width, h: size.height };
            switch (this.showMode) {
                case WxBanner.MODE_NONE:
                    this.updatePosition();
                    break;
                case WxBanner.MODE_EXPOSURE:
                    this.updateExposure();
                    break;
                case WxBanner.MODE_BOTTOM_TOUCH:
                    this.updateBottonTouch();
                    break;
            }
        }

        getOffsetY() {
            return window.screen.availHeight * 750 > 1600 * window.screen.availWidth ? 15 * window.screen.availHeight * 750 / 1600 / window.screen.availWidth : 0;
        }

        show() {
            if (this.adUnitId == null) return;

            if (this.bannerAd == null) {
                this.createBanner();
            }

            this.showMode = WxBanner.MODE_BOTTOM_TOUCH;

            this.bannerAd && this.bannerAd.show();

            this.showTimes++;
        }

        updateBottonTouch() {
            if (!this.bannerAd || !this.realSize) return;
            this.bannerAd.style.left = (window.screen.availWidth - this.realSize.w) * 0.5;
            this.bannerAd.style.top = window.screen.availHeight - this.realSize.h - this.getOffsetY();
        }

        updatePosition() {
            if (!this.bannerAd || !this.realSize) return;

            this.bannerAd.style.left = (window.screen.availWidth - this.realSize.w) * 0.5;

            this.bannerAd.style.top = window.screen.availHeight - this.realSize.h;
        }

        updateExposure() {
            if (!this.bannerAd || !this.realSize) return;
            var left = this.bannerAd.style.left;
            var top = this.bannerAd.style.top;

            switch (this.showType) {
                case WxBanner.TOP_LEFT:
                    left = (-this.realSize.w + this.exposureSize.w);
                    top = (-this.realSize.h + this.exposureSize.h);
                    break;
                case WxBanner.TOP_RIGHT:
                    left = (window.screen.availWidth - this.exposureSize.w);
                    top = (-this.realSize.h + this.exposureSize.h);
                    break;
                case WxBanner.BOTTOM_LEFT:
                    left = (-this.realSize.w + this.exposureSize.w);
                    top = (window.screen.availHeight - this.exposureSize.h);
                    break;
                case WxBanner.BOTTOM_RIGHT:
                    left = (window.screen.availWidth - this.exposureSize.w);
                    top = (window.screen.availHeight - this.exposureSize.h);
                    break;
            }
            if (left != this.bannerAd.style.left) this.bannerAd.style.left = left;
            if (top != this.bannerAd.style.top) this.bannerAd.style.top = top;

            console.log("更新曝光广告位置：", left, top);
        }

        showExposure(showType, w, h) {

            if (this.adUnitId == null) return;

            if (this.bannerAd == null) {
                console.log("更新广告不存在！重新创建！");
                this.createBanner();
            }

            if (!this.bannerAd) {
                return;
            }

            this.showType = showType || showType == WxBanner.NONE ? showType : this.showType;
            this.showMode = WxBanner.MODE_EXPOSURE;
            this.exposureSize.w = w || w == 0 ? w : this.exposureSize.w;
            this.exposureSize.h = h || h == 0 ? h : this.exposureSize.h;

            this.updateExposure();

            this.bannerAd && this.bannerAd.show();

            this.showExposureTimes++;

            console.log("显示曝光广告！");
        }

        compareVersion(v1, v2) {//比较版本
            v1 = v1.split('.');
            v2 = v2.split('.');
            var len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (var i = 0; i < len; i++) {
                var num1 = parseInt(v1[i]);
                var num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                } else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }

        hide() {
            this.bannerAd && this.bannerAd.hide();
        }

        isCanShowBannerAd() {
            var ret = false;
            if (window["wx"]) {
                var current_version = wx.getSystemInfoSync().SDKVersion;
                if (this.compareVersion(current_version, "2.0.4") == -1) {
                    console.log('=====版本不够2.0.4，视频广告不能用')
                } else {
                    ret = true;
                }
            }
            return ret;
        }

        updateY(top) {

            if (this.bannerAd && this.realSize) {

                var halfHeight = this.realSize.h * 0.5;

                var availHeight = window.screen.availHeight;

                var scaleY = availHeight / Laya.stage.height;

                this.bannerAd.style.top = top * scaleY - halfHeight;

                this.bannerAd.style.left = (window.screen.availWidth - this.realSize.w) * 0.5;
                console.log("更新广告Y坐标:", top);
            } else {
                console.log("更新广告不存在！");
            }
        }

        destroy() { //释放视频
            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }

    WxBanner.NONE = 0;
    WxBanner.HCENTER = 1;
    WxBanner.VCENTER = 2;
    WxBanner.LEFT = 4;
    WxBanner.RIGHT = 8;
    WxBanner.TOP = 16;
    WxBanner.TOP_LEFT = 20;
    WxBanner.TOP_RIGHT = 24;
    WxBanner.TOP_HCENTER = 17;
    WxBanner.VCENTER_LEFT = 6;
    WxBanner.VCENTER_RIGHT = 10;
    WxBanner.VCENTER_HCENTER = 3;
    WxBanner.BOTTOM_LEFT = 36;
    WxBanner.BOTTOM_RIGHT = 40;
    WxBanner.BOTTEOM_HCENTER = 33;

    WxBanner.MODE_NONE = 0;
    WxBanner.MODE_EXPOSURE = 1;
    WxBanner.MODE_BOTTOM_TOUCH = 2;  //底部防止误触

    class WxBannerGroup {
        constructor(bannerArray, autoChange) {

            this.initData();

            this.bannerArray = bannerArray;

            this.autoChange = autoChange;

            this.bannerIds = [];

            for (let i = 0; i < bannerArray.length; i++) {
                this.bannerIds[i] = i;
            }

            this.curShowId = zs.laya.MiscUtils.random(0, this.bannerArray.length);
            this.isChanged = true;
        }

        initData() {
            this.bannerArray = [];

            this.autoChange = false;

            this.curShowId = -1;

            this.bannerIds = [];

            this.exposureType = [];

            this.showExposureIds = [];

            this.isChanged = false;

            this.isLockHide = false;

            this.showCountRefresh = zs.laya.platform.ADConfig.zs_banner_show_number;
        }

        onAppShow() {
            console.log("======================== onAppShow start =========================================");
            Laya.stage.off(zs.laya.game.EventId.APP_SHOW, this, this.onAppShow);
            this.show();
            console.log("======================== onAppShow end =========================================");
        }

        onAppHide() {
            console.log("======================== onAppHide start =========================================");
            if (this.curShowId >= this.bannerArray.length) return;
            Laya.stage.off(zs.laya.game.EventId.APP_HIDE, this, this.onAppHide);
            Laya.stage.on(zs.laya.game.EventId.APP_SHOW, this, this.onAppShow);
            var wxBanner = this.bannerArray[this.curShowId];
            wxBanner.destroy();
            wxBanner.createBanner();
            this.isChanged = false;
            this.curShowBanner = null;
            console.log("======================== onAppHide end =========================================");
        }

        lockHide() {
            this.isLockHide = true;
            if (this.curShowBanner) {
                this.hide();
                this.getCurrentShowBanner();
            }
        }

        hideResume() {
            this.isLockHide = false;
            if (this.curShowBanner) {
                this.updateBottonTouch();
                this.show();
            }
        }

        lockHideExposure() {
            for (let i = 0; i < this.showExposureIds.length; i++) {
                const exposureId = this.showExposureIds[i];
                var wxBanner = this.bannerArray[exposureId];
                wxBanner && wxBanner.hide();
            }
        }

        hideResumeExposure() {
            for (let i = 0; i < this.showExposureIds.length; i++) {
                const exposureId = this.showExposureIds[i];
                var wxBanner = this.bannerArray[exposureId];
                wxBanner && wxBanner.showExposure(this.exposureType[i]);
            }
        }

        getCurrentShowBanner() {
            if (this.curShowId >= this.bannerArray.length)
                return null;

            if (this.curShowBanner) return this.curShowBanner;


            if (this.autoChange && !this.isChanged) {
                this.changeBanner();
            }
            return this.curShowBanner = this.bannerArray[this.curShowId];
        }

        changeBanner() {
            this.isChanged = true;
            var preExposureId = this.curShowId;
            this.curShowId = (this.curShowId + 1) % this.bannerArray.length;

            this.bannerArray[this.curShowId] && this.bannerArray[this.curShowId].updateBottonTouch();
            this.bannerArray[this.curShowId] && this.bannerArray[this.curShowId].hide();
           
            var index = this.showExposureIds.indexOf(this.curShowId);
            if (index != -1) {
                if (preExposureId != this.curShowId) {
                    this.showExposureIds[index] = preExposureId;
                    var wxBanner = this.bannerArray[preExposureId];
                    wxBanner && wxBanner.showExposure(this.exposureType[index])
                } else {
                    this.showExposureIds.splice(index, 1);
                    this.exposureType.slice(index, 1);              
                }
            }
        }

        show() {
            var wxBanner = this.getCurrentShowBanner();
            if (!wxBanner || this.isLockHide) return;

            Laya.stage.on(zs.laya.game.EventId.APP_HIDE, this, this.onAppHide);

            if (wxBanner.showTimes >= this.showCountRefresh) {
                wxBanner.destroy();
                wxBanner.createBanner();
            }

            wxBanner.show();
        }

        updateY(y) {
            var wxBanner = this.getCurrentShowBanner();
            if (!wxBanner) return;

            wxBanner.updateY(y);
        }


        updateBottonTouch() {
            var wxBanner = this.getCurrentShowBanner();
            if (!wxBanner) return;

            if (wxBanner) {
                wxBanner.updateBottonTouch();
            } else {
                console.log("======================== updateBottonTouch is error =========================================");
            }
        }


        showExposure(showType) {

            console.log("======================== wxbannerGroup showExposure", showType, "start=========================================");

            var ids = this.bannerIds.concat();

            //除去当前正常显示的Banner
            this.curShowBanner && this.remove(ids, this.curShowId);

            //除去当前曝光显示的Banner
            for (let i = 0; i < this.showExposureIds.length; i++) {
                const showExposureId = this.showExposureIds[i];
                this.remove(ids, showExposureId);
            }

            //从剩余的未显示的Banner 曝光显示
            if (ids.length > 0) {
                var showExposureId = ids[zs.laya.MiscUtils.random(0, ids.length)];
                var index = this.showExposureIds.length;
                this.showExposureIds[index] = showExposureId;
                this.exposureType[index] = showType;
                var wxBanner = this.bannerArray[showExposureId];
                if (wxBanner) {
                    wxBanner.showExposure(showType);
                } else {
                    console.error("======================== wxbannerGroup showExposure wxBanner  is error", showExposureId, this.bannerIds, ids, showType, "end=========================================");
                }

            }
            console.log("======================== wxbannerGroup showExposure", showType, "end=========================================");
        }

        remove(ids, id) {
            var index = ids.indexOf(id);
            if (index != -1) {
                ids.splice(index, 1);
            }
        }

        hide() {
            Laya.stage.off(zs.laya.game.EventId.APP_HIDE, this, this.onAppHide);
            Laya.stage.off(zs.laya.game.EventId.APP_SHOW, this, this.onAppShow);
            if (this.curShowId >= this.bannerArray.length) return;
            var wxBanner = this.bannerArray[this.curShowId];
            wxBanner && wxBanner.hide();

            this.isChanged = false;
            this.curShowBanner = null;
        }


        hideExposure() {
            if (!this.showExposureIds && this.showExposureIds.length == 0) {
                console.log("not have exposure banner is show!");
                return;
            }

            for (let i = 0; i < this.showExposureIds.length; i++) {
                const id = this.showExposureIds[i];
                var wxBanner = this.bannerArray[id];
                wxBanner && wxBanner.hide();
            }
            this.showExposureIds = [];
            this.exposureType = [];
        }

        hideAll() {
            this.hide();
            this.hideExposure();
        }

        destroy() {
            for (let i = 0; i < this.bannerArray.length; i++) {
                const banner = this.bannerArray[i];
                banner && banner.destroy();
            }
            this.curShowBanner = null;
        }
    }

    class WxBannerMgr {

        //曝光banner集合
        constructor() {
            // console.log("=================初始化广告管理器==================");

            this.bannerAdExposureList = [];

            this.adUnitIdData = [];

            this.wxbannerArray = [];

            this.bannerIds = [];

            this.bannerGroupArray = [];
        }

        setAdUnitId(...adUnitIds) {

            this.adUnitIdData = [];
            // this.bannerGroupArray = [];
            for (let i = 0; i < adUnitIds.length; i++) {
                this.adUnitIdData[i] = {
                    adUnitId: adUnitIds[i]
                };
            }

        }

        /**
         * 
         * @param sign banner组标志
         * @param length 创建banner长度
         * @param autoChange 是否自动切换 （每次隐藏后自动切换Banner）
         * @param isReset 是否重新设置id，true 会重新创建banner的id 组
         */
        initBannerGroupBySign(sign, length, autoChange = false, isReset = false) {
            sign = Number(sign);
            if (this.bannerGroupArray[sign]) {
                console.log("=============banner 组已经存在！===========");
                return;
            }


            length = length ? length : this.bannerIds.length;

            if (isReset || this.bannerIds.length < length) {
                this.bannerIds = [];
                for (let i = 0; i < this.adUnitIdData.length; i++) {
                    this.bannerIds[i] = i;
                }
            }

            var bannerArray = [];
            for (let i = 0; i < length; i++) {
                var bannerId = this.bannerIds.splice(zs.laya.MiscUtils.random(0, this.bannerIds.length), 1)[0];
                bannerArray[i] = new WxBanner(this.adUnitIdData[bannerId].adUnitId);
                bannerArray[i].createBanner();
            }
            console.log("创建Banner组", sign);
            this.bannerGroupArray[sign] = new WxBannerGroup(bannerArray, autoChange);
        }

        lockHide() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.lockHide();
            }
        }

        hideResume() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.hideResume();
            }
        }

        lockHideExposure() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.lockHideExposure();
            }
        }

        hideResumeExposure() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.hideResumeExposure();
            }
        }

        getBannerGroup(sign) {

            var bannerGroup = this.bannerGroupArray[sign];

            if (!bannerGroup) {
                console.error("bannerGroup is error", bannerGroup);
            }

            return this.bannerGroupArray[sign];
        }

        hideBySign(...signs) {
            for (let i = 0; i < signs.length; i++) {
                var bannerGroup = this.bannerGroupArray[signs[i]];
                bannerGroup && bannerGroup.hide();
            }
        }

        hideExposureBySign(...signs) {
            for (let i = 0; i < signs.length; i++) {
                var bannerGroup = this.bannerGroupArray[signs[i]];
                bannerGroup && bannerGroup.hideExposure();
            }
        }

        hideAllBySign(...signs) {
            for (let i = 0; i < signs.length; i++) {
                var bannerGroup = this.bannerGroupArray[signs[i]];
                bannerGroup && bannerGroup.hideAll();
            }
        }

        hideAllShow() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.hide();
            }
        }

        hideAll() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.hideAll();
            }
        }

        destoryAll() {
            for (let i = this.bannerGroupArray.length - 1; i >= 0; i--) {
                let bannerGroup = this.bannerGroupArray[i];
                bannerGroup && bannerGroup.destroy();
            }
        }
    }
    WxBannerMgr.Instance = new WxBannerMgr();

    exports.WxBanner = WxBanner;
    exports.WxBannerGroup = WxBannerGroup;
    exports.WxBannerMgr = WxBannerMgr;

}(window.zs.laya.banner = window.zs.laya.banner || {}, Laya));