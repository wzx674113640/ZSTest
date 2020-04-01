window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
    
    class zsAppSdk {

        constructor() {
        }

        static loadConfig(success, failed) {
            this.Instance.loadConfig(success, failed);
        }

        static init(user_id, platform_id) {
            this.Instance.init(user_id, platform_id);
        }
        
        static sendVideoLog() {
            this.Instance.sendVideoLog();
        }

        static loadAd(callback) {
            this.Instance.loadAd(callback);
        }
    
        static navigate2Mini(adData, uniqueId, success, failed, completed) {
            this.Instance.navigate2Mini(adData, uniqueId, success, failed, completed);
        }

        static get Instance() {
            if (!this.initialized) {
                this.initialized = true;
                if (zs.sdk) {
                    this.instance = zs.sdk;
                }
                else {
                    this.instance = {
                        loadConfig: function (success, failed) {
                            if (failed) failed();
                            console.log("zs.sdk is undefined");
                        },
                        init: function(user_id, platform_id) {
                            console.log("zs.sdk.init");
                            console.log("zs.sdk is undefined");
                        },
                        sendVideoLog: function() {
                            console.log("zs.sdk.sendVideoLog");
                            console.log("zs.sdk is undefined");
                        },                
                        loadAd: function (callback) {
                            if (callback) callback({
                                promotion: [],
                                indexLeft: [],
                                endPage: [],
                                backAd: []
                            });
                            console.log("zs.sdk is undefined");
                        },
                        navigate2Mini: function (adData, uniqueId, success, failed, completed) {
                            if (failed) failed();
                            if (completed) completed();
                            console.log("zs.sdk is undefined");
                        }
                    };
                }
            }
            return this.instance;
        }
    }
    zsAppSdk.instance = null;
    zsAppSdk.initialized = false;
    Laya.ClassUtils.regClass("zs.laya.zsapp.zsAppSdk", zsAppSdk);
    
    exports.zsAppSdk = zsAppSdk;
}(window.zs.laya.zsapp = window.zs.laya.zsapp || {}, Laya));
