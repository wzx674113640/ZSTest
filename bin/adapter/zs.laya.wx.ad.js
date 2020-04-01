var conf = window.zs.wx;

var sdk = (function() {
    var self = {};
    var adUrl = "https://ad.ali-yun.wang/api/";
    var selfCfgURL = conf.adApiUrl;

    /**
     * ********************************************************
     */
    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    var F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    }

    var G = function (x, y, z) {
        return (x & z) | (y & (~z));
    }

    var H = function (x, y, z) {
        return (x ^ y ^ z);
    }

    var I = function (x, y, z) {
        return (y ^ (x | (~z)));
    }

    var FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var uTF8Encode = function (string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    var md5 = function(string) {
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
        string = uTF8Encode(string);
        x = convertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }
        var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return tempValue.toLowerCase();
    }


    /**
     * *******************************************************************************
     */

    var _object2Query = function(obj) {
        var args = []
        for (var k in obj)
            args.push(k + "=" + obj[k])
        return args.join("&"); // 返回对象  
    }

    /**
     * var crypto = require('crypto');
     * 
     * var params = {
            openid: openId,
            key: key,
        }
    * @param {参数} params 对象
    */
    var _buildSign = function(params, isSecret) {
        isSecret = isSecret || true;
        var sortedKeys = Object.keys(params).sort();
        var signParam = '';
        for (var i = 0; i < sortedKeys.length; i++) {
            signParam += sortedKeys[i] + ":" + params[sortedKeys[i]];
        }
        if (isSecret)
            signParam += conf.secret;
        // signParam = signParam.toLowerCase();
        var md5sign = md5(signParam);

        md5sign = md5sign.toLowerCase();

        return md5sign;
    }

    var _getAdByPosition = function(position) {
        var allAdData = getCache("zsAd");
        switch (position) {
            case "1":
                return allAdData.more;
            break;
            case "2":
                return allAdData.promotion;
            break;
            case "3":
                return allAdData.indexFloat;
            break;
            case "7":
                return allAdData.indexLeft;
            break;
            case "8":
                return allAdData.gameFloat;
            break;
            case "9":
                return allAdData.endPage;
            break;
            case "11":
                return allAdData.indexLeftFloat;
            break;
            case "12":
                return allAdData.backAd;
            break;
            case "13":
                return allAdData.iosLinkAd;
            break;
            default:
            break;
        }
        return null;
    }

    var _getBoxMiniInfo = function(position) {
        var curAdData = _getAdByPosition(position);
        if (curAdData == null) {
            console.error("box is null");
            return null;
        }
        for (var index = 0; index < curAdData.length; index++) {
            if (curAdData[index].app_type == "4") {
                return curAdData[index];
            }
        }
        console.error("box is null");
        return null;
    }

    var _getCustomLink = function(position, appid) {
        var curAdData = _getAdByPosition(position);
        if (curAdData == null) {
            console.error("custom link is null");
            return null;
        }
        for (var index = 0; index < curAdData.length; index++) {
            if (curAdData[index].appid == appid) {
                return curAdData[index];
            }
        }
    }

    var request = function(url, data, method, success, fail, complete) {
        if (typeof wx === 'undefined') {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var response = xhr.responseText;
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var result = {};
                        try {
                            result = JSON.parse(response)
                        } catch (e) {
                            console.error('json parse error ', response)
                            if (fail)
                                fail(e);
                        }
                        if (success)
                            success(result);
                    } else {
                        console.error('error ', response)
                        if (fail)
                            fail(response);
                    }
                } else {
                }
            };
            xhr.timeout = 3000;
            xhr.ontimeout = function (event) {
                console.error('error ', event)
                if (fail)
                    fail(event);
            }
            xhr.open(method, url, true);
            if (method == "POST") {
                xhr.open('POST', url);
                xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
                xhr.send(_object2Query(data));
            } else {
                xhr.send();
            }
        } else {
            wx.request({
                url: url,
                data: data,
                header: {
                    'content-type': 'application/json'
                },
                method: method,
                success: function (res) {
                    if (success)
                        success(res.data);
                },
                fail: function (res) {
                    if (fail)
                        fail(res);
                },
                complete: function (res) {
                    if (complete)
                        complete(res);
                }
            })
        }
    }

    var sendExport=function(toAppId) {
        if (!conf.uploadLog) {
            return;
        }
        if (self.userId == null) {
            console.error("userId is null");
            return ;
        }
        var url = adUrl + "jump_log/app_to";
        var data = {
            appid: conf.appId,
            from_appid: self.srcAppId,
            to_appid: toAppId,
            user_id: self.userId,
        }
        request(url, data, 'POST',
            function () { },
            function () {
                console.log('jump_log/app_to" fail');
            },
            function () {
                console.log('jump_log/app_to" complete');
            });
    }

    var sendAppFrom=function() {
        if (!conf.uploadLog) {
            return;
        }
        if (self.userId == null) {
            console.error("userId is null");
            return ;
        }
        var url = adUrl + "jump_log/app_from";
        var data = {
            appid: conf.appId,
            from_appid: self.srcAppId,
            user_id: self.userId,
            scene: self.launchScene
        }
        request(url, data, 'POST',
            function () { },
            function () {
                console.log('jump_log/app_from" fail');
            },
            function () {
                console.log('jump_log/app_from" complete');
            });
    }

    var postExportAppLog = function(toid, openid) {
        var url = adUrl + "appad_new/collect";
        var currentTime = Math.round(new Date().getTime() / 1000).toString();
        var signParams = {
            user_id: openid,
            from_id: conf.appId,
            to_id: toid,
            timestamp: currentTime,
        };
        var sign = _buildSign(signParams);

        var data = Object.assign({}, signParams, {
            sign: sign,
        });
        request(url, data, 'POST',
            function () { },
            function () {
                console.log('appad_new/collect fail');
            },
            function () {
                console.log('appad_new/collect complete');
            });
    }

    var setStorageSync = function(key, value) {
        self.zsStorage = self.zsStorage || {};
        self.zsStorage[key] = value;
    }

    var getStorageSync = function(key) {
        self.zsStorage = self.zsStorage || {};
        return self.zsStorage[key];
    }

    var getCache = function(key, expire) {
        if (!expire) {
            return getStorageSync(key);
        }
        else {
            var lastCacheTime = getStorageSync(key + "_time");
            if (lastCacheTime == null || Date.now() - Number(lastCacheTime) < expire) {
                return getStorageSync(key);
            }
            else {
                return null;
            }
        }
    }

    var setCache = function(key, value) {
        setStorageSync(key, value);
        setStorageSync(key + "_time", Date.now());
    }

    var isFun = function(fun) {
        if (typeof fun == 'function')
            return true
        return false
    }
    
    /**
     * 跳转成功之后数据上报
     * @param {number} row  从loadAd接口中返回的数组项   @example indexLeft[0]
     * @param {string} userid  小游戏中的用户Id
     */
    var collect = function (row, userid) {
        if (row.app_type == "3") {
            var value = getStorageSync(row.appid);
            if (value == null) {
                setStorageSync(row.appid, 1);
            }
            else {
                setStorageSync(row.appid, Number(value) + 1);
            }
        }
        if (typeof wx === 'undefined') {
            return ;
        }
        postExportAppLog(row.app_id, userid);
        sendExport(row.appid);
    }

    self.userId = null;
    self.platformId = null;
    self.srcAppId = "";
    self.launchScene = "";
    self.adJumpNum = null;
    self.adJumpAppId = null;
    self.isEnableExportAdLinkId = "0";
    self.init = function(user_id, platform_id) {
        console.log("zsAdSdk.init");
        this.userId = user_id; 
        this.platformId = platform_id;
        if (typeof wx === 'undefined') {
            this.launchScene = 1038;
            this.srcAppId = "";
        }
        else {
            var launchInfo = wx.getLaunchOptionsSync();
            this.launchScene = launchInfo.scene ? launchInfo.scene : "";
            this.srcAppId = launchInfo.referrerInfo && launchInfo.referrerInfo.appId ? launchInfo.referrerInfo.appId : "";
        }        
        sendAppFrom();
    }
    
    self.sendVideoLog=function() {
        if (!conf.uploadLog) {
            return;
        }
        if (this.userId == null) {
            console.error("userId is null");
            return ;
        }
        var url = adUrl + "jump_log/app_video";
        var data = {
            appid: conf.appId,
            from_appid: this.srcAppId,
            user_id: this.userId
        }
        request(url, data, 'POST',
            function () { },
            function () {
                console.log('jump_log/app_to" fail');
            },
            function () {
                console.log('jump_log/app_to" complete');
            });
    }    

    self.cfgCbList = [];
    self.inCfgRequest = false;
    self.loadConfig = function (success, fail) {
        var url = selfCfgURL;
        var currentTime = Math.round(new Date().getTime() / 1000).toString();
        var signParams = {
            appid: conf.appId,
            timestamp: currentTime,
        };
        var sign = _buildSign(signParams);

        var data = Object.assign({}, signParams, {
            sign: sign,
        });
            
        var cacheExpire = 60000;//1000延长配置获取时间
        var cache = getCache("zsCfg", cacheExpire);
        if (cache) {
            if (isFun(success)) success(cache);
        }
        else if (this.inCfgRequest) {
            this.cfgCbList.push({success: success, fail: fail});
        }
        else {
            this.inCfgRequest = true;
            this.cfgCbList.push({success: success, fail: fail});
            request(url, data, 'POST',
                function (e) {
                    var retValue = e.data;
                    setCache("zsCfg", retValue);
                    self.adJumpNum = retValue.zs_ad_jump_num;
                    self.adJumpAppId = retValue.zs_jump_appid;
                    self.isEnableExportAdLinkId = retValue.zs_export_ad_switch;
                    for (var index = 0; index < self.cfgCbList.length; index++) {
                        if (isFun(self.cfgCbList[index].success))self.cfgCbList[index].success(retValue);
                    }
                    self.cfgCbList = [];
                    self.inCfgRequest = false;
                },
                function (e) {
                    for (var index = 0; index < self.cfgCbList.length; index++) {
                        if (isFun(self.cfgCbList[index].fail))self.cfgCbList[index].fail(e);
                    }
                    self.cfgCbList = [];
                    self.inCfgRequest = false;
                },
                function (e) {
                    self.cfgCbList = [];
                    self.inCfgRequest = false;
                    console.log('post loadConfig complete');
                }
            );
        }
    }

    self.adCbList = [];
    self.inAdRequest = false;
    /**
     * 获取广告数据
     * @param {*} callback 
     * @returns  more 更多好玩 个人中心的广告 现已经不用了
     *   promotion 首页推广   首页开始按钮下的广告
     *   indexFloat 首页浮动广告 首页右上的广告
     *   indexLeft 首页侧栏
     *   gameFloat 游戏页浮动广告 
     *   endPage 结束页广告
     */
    self.loadAd = function (callback) {
        var cacheExpire = 60000;//1000
        var cache = getCache("zsAd", cacheExpire);
        if (cache) {
            callback(cache);
        }
        else if (this.inAdRequest) {
            this.adCbList.push(callback);
        }
        else {
            this.inAdRequest = true;
            this.adCbList.push(callback);

            var url = adUrl + "appad_new/index";
            var currentTime = Math.round(new Date().getTime() / 1000).toString();
            var signParams = {
                appid: conf.appId,
                timestamp: currentTime,
            };
            var sign = _buildSign(signParams);    
            var data = Object.assign({}, signParams, { sign:sign });
            request(url, data, 'POST',
                function (res) {
                    self.inAdRequest = false;
                    for (var z in res.data) {
                        var arr = res.data[z];
                        arr.sort(function() {return Math.random() > 0.5 ? 1 : -1;});
                    }                    
                    var retValue = {
                        /**
                         * 个人中心的广告 现已经不用了
                         */
                        more: res.data["position-1"] || [],
                        /**
                         * 首页开始按钮下的广告
                         */
                        promotion: res.data["position-2"] || [],
                        /**
                         * 首页右上的浮动广告
                         */
                        indexFloat: res.data["position-3"] || [],
                        /**
                         * 首页右上的浮动广告
                         */
                        banner: res.data["position-4"] || [],
                        /**
                         * 首页侧栏
                         */
                        indexLeft: res.data["position-7"] || [],
                        /**
                         * 游戏页浮动广告
                         */
                        gameFloat: res.data["position-8"] || [],
                        /**
                         * 结束页广告
                         */
                        endPage: res.data["position-9"] || [],
                        /**
                         * 首页左侧浮动广告
                         */
                        indexLeftFloat: res.data["position-11"] || [],
                        /**
                         * 返回页广告
                         */
                        backAd: res.data["position-12"] || [],
                        /**
                         * ios跳转列表
                         */
                        iosLinkAd: res.data["position-13"] || [],
                    }
                    setCache("zsAd", retValue);
                    for (var index = 0; index < self.adCbList.length; index++) {
                        if (isFun(self.adCbList[index]))self.adCbList[index](retValue);
                    }
                    self.adCbList = [];
                },
                function (error) {
                    self.inAdRequest = false;
                    console.log('requestAdData fail');                
                    var retValue = {
                        /**
                         * 个人中心的广告 现已经不用了
                         */
                        more: [],
                        /**
                         * 首页开始按钮下的广告
                         */
                        promotion: [],
                        /**
                         * 首页右上的浮动广告
                         */
                        indexFloat: [],
                        /**
                         * 首页右上的浮动广告
                         */
                        banner: [],
                        /**
                         * 首页侧栏
                         */
                        indexLeft: [],
                        /**
                         * 游戏页浮动广告
                         */
                        gameFloat: [],
                        /**
                         * 结束页广告
                         */
                        endPage: [],
                        /**
                         * 首页左侧浮动广告
                         */
                        indexLeftFloat: [],
                        /**
                         * 返回页广告
                         */
                        backAd: [],
                        /**
                         * ios跳转列表
                         */
                        iosLinkAd: [],
                    }
                    for (var index = 0; index < self.adCbList.length; index++) {
                        if (isFun(self.adCbList[index]))self.adCbList[index](retValue);
                    }
                    self.adCbList = [];
                },
                function (res) {
                    console.log('requestAdData complete');
                }
            );
        }
    }
    /**
     * 跳转小程序
     * @param {*} row    从loadAd接口中返回的数组项   @example indexLeft[0]
     * @param {*} openid 小游戏中的用户openid
     * @param {function} success 接口调用成功的回调函数
     * @param {function} fail 接口调用失败的回调函数
     * @param {function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    self.navigate2Mini = function (row, openid, success, fail, complete) {
        var targetMini = row;
        if (this.adJumpNum != null && targetMini.app_type == "3") {
            try {
                var value = getStorageSync(targetMini.appid);
                value = value != null ? Number(value) : 0; 
                console.log(targetMini.appid + ":" + value + "," + this.adJumpNum);
                if (Number(value) + 1 >= this.adJumpNum) {
                    // Do something with return value
                    if (this.platformId == 1) {
                        var adCfg = getCache("zsAd");                        
                        if (adCfg.iosLinkAd.length > 0) {
                            var linkApp = adCfg.iosLinkAd[Math.floor(adCfg.iosLinkAd.length * Math.random())];
                            console.log("jump:" + JSON.stringify(linkApp));
                            targetMini = _getCustomLink(targetMini.position_type, linkApp.appid);
                        }
                        else if (this.adJumpAppId) {
                            console.log("jump:" + this.adJumpAppId);
                            targetMini = _getCustomLink(targetMini.position_type, this.adJumpAppId);
                        } 
                        else {
                            console.log("jump self");
                        }
                    }
                    else {
                        console.log("jump link in Android");
                        targetMini = _getBoxMiniInfo(targetMini.position_type);
                    }
                    if (targetMini == null) {
                        targetMini = row;
                    }
                }
            } 
            catch (e) {
                // Do something when catch error
                console.error(e);
            }
        }

        if (typeof wx === 'undefined') {
            if (isFun(fail))
                fail();
            if (isFun(complete))
                complete();
            return;
        }

        targetMini.extraData = targetMini.extraData || {};
        wx.navigateToMiniProgram({
            appId: targetMini.appid,
            path: targetMini.link_path,
            extraData: targetMini.extraData,
            success: function (e) {
                collect(targetMini, openid);
                if (isFun(success))
                    success();
            },
            fail: function (e) {
                if (isFun(fail))
                    fail();
            },
            complete: function (e) {
                if (isFun(complete))
                    complete();
            }
        })
    }

    self.getShareCard = function (success, fail) {
        var url = adUrl + "app_card/item";
        var currentTime = Math.round(new Date().getTime() / 1000).toString();
        var signParams = {
            appid: conf.appId,
            timestamp: currentTime,
        };
        var sign = _buildSign(signParams);

        var data = Object.assign({}, signParams, {"sign":sign});
        request(url, data, 'POST',
            function (e) {
                if (isFun(success) && e && e.data) {
                    success(e.data.card);
                }
                else if (isFun(fail)) {
                    fail(e);
                }
            }
            ,
            function (e) {
                if (isFun(fail))
                    fail(e);
            },
            function (e) {
                console.log('post GetShareCard complete!');
            });
    }

    self.collectShareCardClick = function (cardId, userId, success, fail) {
        var url = adUrl + "app_card/collect";
        var currentTime = Math.round(new Date().getTime() / 1000).toString();
        var signParams = {
            appid: conf.appId,
            card_id: cardId,
            user_id: userId,
            timestamp: currentTime,
        };
        var sign = _buildSign(signParams);
        var data = Object.assign({}, signParams, {
            sign: sign,
        });
        request(url, data, 'POST',
            function (e) {
                if (isFun(success))
                    success(e);
            },
            function (e) {
                if (isFun(fail))
                    fail(e);
            },
            function (e) {
                console.log('post CollectShareCardClick complete!');
            });
    }

    var linkSceneList = [1011, 1012, 1013, 1025, 1031, 1032, 1047, 1048, 1049, 1124, 1125, 1126];
    self.launchInfo = null;
    self.isExportValid = function () {
        if (this.launchInfo && linkSceneList.indexOf(this.launchInfo.scene) >= 0) {
            return false;
        }
        if (this.launchInfo != null && this.launchInfo.query != null) {
            return this.launchInfo.query.customLink != this.isEnableExportAdLinkId;
        }
        return true;
    }

    self.isFromLink = function () {
        if (this.launchInfo && linkSceneList.indexOf(this.launchInfo.scene) >= 0) {
            console.log("open by code");
            return true;
        }
        return this.launchInfo != null && this.launchInfo.query != null && this.launchInfo.query.customLink != null;
    }

    var onAppLaunch = function () {
        if (typeof wx === 'undefined') {
        }
        else {
            self.launchInfo = wx.getLaunchOptionsSync();
            console.log("scene:" + self.launchInfo.scene)
            if (self.isFromLink()) {
              console.log("open by link");
            }
        }
    }

    onAppLaunch();

    return self;
})();

var theEnv = (typeof window !== 'undefined' ? window : global)
theEnv.zs = theEnv.zs || {};
theEnv.zs.sdk = sdk;
