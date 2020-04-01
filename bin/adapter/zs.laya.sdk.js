window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
     /***平台提供的接口**/
    class SdkService{

        constructor() {
            this.sdkService = null;
        }

        static initSDK() {
            this.sdkService = window["zsSdk"];
            if (this.sdkService) {
                this.sdkService.init();
            }
        }

        static destroySDK() {
            this.sdkService = null;
        }

        static login(successHandler, failedHandler) {
            if (this.sdkService) {
                this.sdkService.login(successHandler, failedHandler);
            }
            else if (successHandler) {
                successHandler.runWith(null);
            }
        }

        static loadSubpackage(pkgName, progressHandler, successHandler, failedHandler) {
            if (this.sdkService) {
                return this.sdkService.loadSubpackage(pkgName, progressHandler, successHandler, failedHandler);
            }
            else {
                return false;
            }
        }

        static initVideoAd(adUnitId) {
            if (this.sdkService) {
                if (this.sdkService.initVideoAD) {
                    this.sdkService.initVideoAD(adUnitId);
                }
            }
        }

        static playVideo(completedHandler, interuptHandler, errorHandler) {
            if (this.sdkService) {
                Laya.stage.event(SdkService.EVENT_AD_VIDEO_PLAY);
                this.sdkService.playVideo(
                    Laya.Handler.create(null, function () { Laya.stage.event(SdkService.EVENT_AD_VIDEO_CLOSED); completedHandler && completedHandler.run() }, null, false),
                    Laya.Handler.create(null, function () { Laya.stage.event(SdkService.EVENT_AD_VIDEO_CLOSED); interuptHandler && interuptHandler.run() }, null, false),
                    Laya.Handler.create(null, function (error) { Laya.stage.event(SdkService.EVENT_AD_VIDEO_CLOSED); errorHandler && errorHandler.runWith(error) }, null, false)
                );
            }
            else if (completedHandler) {
                completedHandler.run();
            }
        }

        static isVideoEnable() {
            if (this.sdkService) {
                return this.sdkService.isVideoEnable();
            }
            return false;
        }

        static createUserInfoButton(rectInPercent, successHandler) {
            if (this.sdkService) {
                this.sdkService.createUserInfoButton(rectInPercent, successHandler);
            }
            else if (successHandler) {
                successHandler.runWith(null);
            }
        }

        static hideUserInfoButton() {
            if (this.sdkService) {
                this.sdkService.hideUserInfoButton();
            }
        }

        static showUserInfoButton() {
            if (this.sdkService) {
                this.sdkService.showUserInfoButton();
            }
        }

        static destroyUserInfoButton() {
            if (this.sdkService) {
                this.sdkService.destroyUserInfoButton();
            }
        }

        static openShare(text, imgUrl) {
            if (this.sdkService) {
                this.sdkService.openShare(text, imgUrl);
            }
            else {
                console.log("share:" + text + ",img:" + imgUrl);
            }
        }

        static initInsertAd(adUnitId, errorHandler) {
            if (this.sdkService) {
                if (this.sdkService.initInsertAd) {
                    this.sdkService.initInsertAd(adUnitId, errorHandler);
                }
                else if (this.sdkService.initFullScreenAD) {
                    this.sdkService.initFullScreenAD(adUnitId, errorHandler);
                }
            }
        }

        static loadInsertAd(loadedHandler, errorHandler) {
            if (this.sdkService) {
                if (this.sdkService.loadInsertAd) {
                    this.sdkService.loadInsertAd(loadedHandler, errorHandler);
                }
                else if (this.sdkService.loadFullScreenAD) {
                    this.sdkService.loadFullScreenAD(loadedHandler, errorHandler);
                }
            }
            else if (errorHandler) {
                errorHandler.runWith("null");
            }
        }

        static showInsertAd(closeHandler) {
            if (this.sdkService) {
                if (this.sdkService.showInsertAd) {
                    this.sdkService.showInsertAd(closeHandler);
                }
                else if (this.sdkService.loadFullScreenAD) {
                    this.sdkService.showFullScreenAD(closeHandler);
                }
            }
            else {
                if (closeHandler) {
                    closeHandler.runWith("not in wx");
                }
                console.log("showFullScreenAD:" + Date.now());
            }
        }

        static setUserCloudStorage(kvDataList, onSuccess, onFailed, onCompleted) {
            if (this.sdkService) {
                return this.sdkService.setUserCloudStorage(kvDataList, onSuccess, onFailed, onCompleted);
            }
            else if (onSuccess) {
                onSuccess.runWith(null);
            }
        }
    }

    SdkService.sdkService = null;
    SdkService.EVENT_AD_VIDEO_PLAY = "EVENT_AD_VIDEO_PLAY";
    SdkService.EVENT_AD_VIDEO_CLOSED = "EVENT_AD_VIDEO_CLOSED";
    Laya.ILaya.regClass(SdkService);
    Laya.ClassUtils.regClass("zs.laya.sdk.SdkService", SdkService);
    Laya.ClassUtils.regClass("Zhise.SdkService", SdkService);

    exports.SdkService = SdkService;

}(window.zs.laya.sdk = window.zs.laya.sdk || {}, Laya));