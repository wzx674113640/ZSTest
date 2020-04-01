

window.zsSdk = (function () {
    function zsSdk(){};
    zsSdk.rewardedVideoAd = null;
    zsSdk.videoCompletedHandler = null;
    zsSdk.videoInterruptHandler = null;
    zsSdk.videoErrorHandler = null;
    zsSdk.bannerAd = null;
    zsSdk.bannerAdUnitId = null;
    zsSdk.fullScreenAD = null;
    zsSdk.fullScreenADUnitId = null;
    zsSdk.userInfoButton = null;
    zsSdk.bannerAdScale = 0.9;
    zsSdk.bannerLiveTime = 0;
    zsSdk.bannerLastShowTime = 0;
    zsSdk.init = function() {
        
        wx.showShareMenu({
            withShareTicket: true
        });

        if (window.zsResUrl) {
            Laya.URL.basePath = window.zsResUrl;
            Laya.MiniAdpter.nativefiles = window.zsNativefiles;
        }
        Laya.MiniAdpter.getUrlEncode = function(url, type) {
            if (url.indexOf(".fnt") != -1 || url.indexOf(".json") != -1) {
                return "utf8";
            } 
            else if (type == "arraybuffer") {
                return "";
            }
            return "ascii";
        };
        console.log("zsSdk.init");
    }
    
    zsSdk.login = function(successHandler, failedHandler) {
		wx.login({
			success: function(res) {   
				if (res.code) {
                    if(successHandler)successHandler.runWith({identityId:res.code});
				}
				else {
                    if(failedHandler)failedHandler.runWith("Code不存在");
				}
			},
			fail: function() {
                if(failedHandler)failedHandler.runWith("登陆失败");
			},
			complete: function() {
			}
		});
    }

    zsSdk.loadSubpackage = function(pkgName, progressHandler, successHandler, failedHandler) {
        var loadTask = wx.loadSubpackage({
            name: pkgName, // name 可以填 name 或者 root
            success(res) {
              // 分包加载成功后通过 success 回调
              successHandler && successHandler.runWith(1);
            },
            fail(res) {
              // 分包加载失败通过 fail 回调
              failedHandler && failedHandler.runWith(1);
            }
        });
        if (loadTask) {
            if (progressHandler) {
                loadTask.onProgressUpdate(function(res) {
                    progressHandler.runWith(res.progress);
                })
            }
            return true;
        }
        return false;
    }
    
    zsSdk.createUserInfoButton = function(percentRect, successHandler) {   
        var systemInfo = wx.getSystemInfoSync();
        this.userInfoButton = wx.createUserInfoButton({
            type: 'image',
            text: '',
            //image: 'zsGame/img_back.png',
            style: {
            left: systemInfo.windowWidth * percentRect.x,
            top: systemInfo.windowHeight * percentRect.y,
            width: systemInfo.windowWidth * percentRect.width,
            height: systemInfo.windowHeight * percentRect.height,
            //filter:(alpha=0),
            opacity:1,
            }
        });
        var self = this;
        this.userInfoButton.onTap(function(res) {
            console.log("userInfoButtonOnTap:" + res);
            if(successHandler)successHandler.runWith(res);
        });
    }

    zsSdk.showUserInfoButton = function() {
        if (this.userInfoButton) {
            this.userInfoButton.show();
        }
    }

    zsSdk.hideUserInfoButton = function() {
        if (this.userInfoButton) {
            this.userInfoButton.hide();
        }
    }

    zsSdk.destroyUserInfoButton = function() {
        if (this.userInfoButton) {
            this.userInfoButton.destroy();
            this.userInfoButton = null;
        }
    }
    
    zsSdk.openShare = function(text, iconUrl) {        
        wx.shareAppMessage({
            title: text,
            imageUrl: iconUrl
          });
    }

    zsSdk.initVideoAD = function(videoAdUnit) {
        if (videoAdUnit == null || videoAdUnit == "") {
            this.rewardedVideoAd = null;
            return;
        }
        this.rewardedVideoAd = wx.createRewardedVideoAd({adUnitId: videoAdUnit});
        if (this.rewardedVideoAd == null) {
            return;
        }
        var self = this;
        this.rewardedVideoAd.onError(function (err) {
            console.log(err);
            self.rewardedVideoAd = null;
            if (self.errorHandler) {
                self.errorHandler.runWith(err);
            }
        });

        this.rewardedVideoAd.onClose(function (res) {
          // 用户点击了【关闭广告】按钮
          // 小于 2.1.0 的基础库版本，res 是一个 undefined
          if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
            if (self.videoCompletedHandler) {
                self.videoCompletedHandler.run();
            }
          } else {
            // 播放中途退出，不下发游戏奖励
            if (self.videoInterruptHandler) {
                self.videoInterruptHandler.run();
            }
          }
        })
    }

    zsSdk.isVideoEnable = function() {
        return this.rewardedVideoAd != null;
    }
    
    zsSdk.playVideo = function(completedHandler, interruptHandler, errorHandler) {
        if (this.rewardedVideoAd == null) {
            if (errorHandler) {
                errorHandler.runWith("video disable");
            }
            return;
        }
        this.videoErrorHandler = errorHandler;
        this.videoCompletedHandler = completedHandler;
        this.videoInterruptHandler = interruptHandler;
        
        var self = this;
        this.rewardedVideoAd.show()
        .catch(function (err) {
            self.rewardedVideoAd.load()
            .then(function(){self.rewardedVideoAd.show()})
        });
        
    }

    zsSdk.initBannerAD = function(bannerAdUnit, bannerAdScale, bannerLiveTime, errorHandler) {
        this.bannerAdUnitId = bannerAdUnit;   
        this.bannerAdScale = bannerAdScale;     
        this.bannerLiveTime = bannerLiveTime;
        this.bannerLastShowTime = 0;
        var slideScale = (1 - this.bannerAdScale) * 0.5;
        var systemInfo = wx.getSystemInfoSync();
        this.bannerAd = wx.createBannerAd({
            adUnitId: bannerAdUnit,
            style: {
              top: systemInfo.windowHeight - 100,
              width: systemInfo.windowWidth * zsSdk.bannerAdScale,
              left: systemInfo.windowWidth * slideScale
            }
        });

        if (this.bannerAd == null) {
            return ;
        }

        // 720 * 250
        this.bannerAd.onResize(function(size){
          console.log(systemInfo);
          if (zsSdk.bannerAd) {
            zsSdk.bannerAd.style.top = systemInfo.windowHeight - size.height - 10;
            zsSdk.bannerAd.style.left = (systemInfo.windowWidth - size.width) * 0.5;
          }
        });

        var self = this;
        this.bannerAd.onError(function(err){
            console.log(err);
            self.bannerAd=null;
            if (errorHandler) {
                errorHandler.run();
            }
        });
        this.bannerLastShowTime = Date.now();
        console.log("initBanner:" + this.bannerLastShowTime + "," + this.bannerLiveTime);
    }

    zsSdk.showBanner = function(errorHandler) {
        if (this.bannerAdUnitId == null) {
            return ;
        }
        if (this.bannerAd == null) {
            this.initBannerAD(this.bannerAdUnitId, this.bannerAdScale, this.bannerLiveTime, errorHandler);
        }
        if (this.bannerAd) {
            this.bannerAd.show();
        }
    }

    zsSdk.hideBanner = function() {
        if (this.bannerAd) {
            this.bannerAd.hide();
            if (this.bannerLastShowTime > 0 && Date.now() - this.bannerLastShowTime > this.bannerLiveTime) {
                this.bannerAd.destroy();
                this.bannerAd = null;
                this.initBannerAD(this.bannerAdUnitId, this.bannerAdScale, this.bannerLiveTime);
            }
        }
    }

    zsSdk.initFullScreenAD = function (fullScreenADUnitId, errorHandler) {
        var systemInfo = wx.getSystemInfoSync();
        if (systemInfo.SDKVersion <= "2.6.0") {
            if (errorHandler) {
                errorHandler.runWith(systemInfo.SDKVersion + " <= 2.6.0");
            }
            return ;
        }
        this.fullScreenADUnitId = fullScreenADUnitId;   
    }

    zsSdk.loadFullScreenAD = function(loadedHandler, errorHandler) {
        if (this.fullScreenADUnitId == null) {
            return ;
        }
        
        this.fullScreenAD = wx.createInterstitialAd({adUnitId: this.fullScreenADUnitId});
        if (this.fullScreenAD == null) {
            return ;
        }

        var self = this;
        this.fullScreenAD.onLoad(function(){
            if (loadedHandler) {
                loadedHandler.run();
            }
        })

        this.fullScreenAD.onError(function(err){
            console.log(err);
            self.fullScreenAD=null;
            if (errorHandler) {
                errorHandler.runWith(err);
            }
        });
    }

    zsSdk.showFullScreenAD = function(closeHandler) {
        if (this.fullScreenAD == null) {
            return ;
        }

        var self = this;
        this.fullScreenAD.onClose(function () {
            self.fullScreenAD=null;
            if (closeHandler) {
                closeHandler.runWith(err);
            }
        });
        this.fullScreenAD.show();
    }

    zsSdk.setUserCloudStorage = function(kvDataList, onSuccess, onFailed, onCompleted) {
        wx.setUserCloudStorage({
            KVDataList:kvDataList,
            success:function(e){
                console.log('-----success:' + JSON.stringify(e));
                if (onSuccess) {
                    onSuccess.runWith(e);
                }
            },
            fail:function(e){
                console.log('-----fail:' + JSON.stringify(e));
                if (onFailed) {
                    onFailed.runWith(e);
                }
            },
            complete:function(e){
                console.log('-----complete:' + JSON.stringify(e));
                if (onCompleted) {
                    onCompleted.runWith(e);
                }
            }
        });
    }

    return zsSdk;
})();

window.zsDevice = (function () {
    function zsDevice(){};

    zsDevice.deviceInfo = null;

    zsDevice.init = function() {
        this.deviceInfo = wx.getSystemInfoSync();
        console.log(this.deviceInfo);
        console.log("zsDevice.init");
    }

    zsDevice.onShow = function(handler) {
        wx.onShow(function (res) {
            console.log("zsDevice.show:" + Date.now());
            if (handler)handler.runWith(res);
        });
    }

    zsDevice.onHide = function(handler) {
        wx.onHide(function () {
            console.log("zsDevice.hide:" + Date.now());
            if (handler)handler.run();
        });

    }
    
    zsDevice.vibrateShort = function() {      
        wx.vibrateShort({
			fail: function() {
                console.log("vibrateShort failed");
			},
        });
    }
    
    zsDevice.vibrateLong = function() {      
        wx.vibrateLong({
			fail: function() {
                console.log("vibrateShort failed");
			},
        });
    }

    zsDevice.isNetValid = function() {
        return true;
    }

    zsDevice.statusBarHeight=function() {
        return this.deviceInfo ? this.deviceInfo.statusBarHeight : 0;
    }

    zsDevice.screenWidth=function() {
        return this.deviceInfo ? this.deviceInfo.screenWidth : 1;
    }

    zsDevice.screenHeight=function() {
        return this.deviceInfo ? this.deviceInfo.screenHeight : 1;
    }

    return zsDevice;
})();
