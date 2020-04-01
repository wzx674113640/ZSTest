window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';

    class MiscUtils {

        constructor() {

        }

        static compareVersion(v1, v2) {//比较版本
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

        static isToday(date) {
            var now = new Date(Date.now());
            var target = new Date(date);
            if (now.getFullYear() != target.getFullYear() || now.getMonth() != target.getMonth() || now.getDate() != target.getDate()) {
                return false;
            }
            else {
                return true;
            }
        }

        /** 获取范围内的随机数 [min,max) */
        static random(min, max) {
            return Math.random() * (max - min) + min << 0;
        }

        /**是否为数字 包括字符串数字*/
        static IsNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if (regPos.test(val) || regNeg.test(val)) {
                return true;
            } else {
                return false;
            }
        }

        static number2String4(val) {
            var strVal = val.toString();
            return "0000".slice(0, -strVal.length) + strVal;
        }

        static number2String3(val) {
            var strVal = val.toString();
            return "000".slice(0, -strVal.length) + strVal;
        }

        static number2String2(val) {
            var strVal = val.toString();
            return "00".slice(0, -strVal.length) + strVal;
        }

        static array2UrlStrArgs(arr) {
            if (!arr || arr.length == 0) {
                return "";
            }
            if (arr.length == 1) {
                return arr[0];
            }
            var params = arr[0] + "=" + arr[1];
            for (var index = 2; index + 1 < arr.length; index += 2) {
                params += "&" + arr[index] + "=" + arr[index + 1];
            }
            return params;
        }

        static object2UrlStrArgs(obj) {
            if (obj) {
                var params = "";
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        params += key + "=" + obj[key] + "&";
                    }
                }
                return params.substr(0, params.length - 1);
            }
            else {
                return "";
            }
        }

        static hex_md5(s) { return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
        static b64_md5(s) { return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
        static str_md5(s) { return this.binl2str(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
        static hex_hmac_md5(key, data) { return this.binl2hex(this.core_hmac_md5(key, data)); }
        static b64_hmac_md5(key, data) { return this.binl2b64(this.core_hmac_md5(key, data)); }
        static str_hmac_md5(key, data) { return this.binl2str(this.core_hmac_md5(key, data)); }
        /*
        * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
        * Digest Algorithm, as defined in RFC 1321.
        * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
        * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
        * Distributed under the BSD License
        * See http://pajhome.org.uk/crypt/md5 for more info.
        */

        /*
        * Configurable variables. You may need to tweak these to be compatible with
        * the server-side, but the defaults work in most cases.
        */

        /*
        * These are the functions you'll usually want to call
        * They take string arguments and return either hex or base-64 encoded strings
        */
        static hex_md5(s) { return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
        static b64_md5(s) { return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
        static str_md5(s) { return this.binl2str(this.core_md5(this.str2binl(s), s.length * this.chrsz)); }
        static hex_hmac_md5(key, data) { return this.binl2hex(this.core_hmac_md5(key, data)); }
        static b64_hmac_md5(key, data) { return this.binl2b64(this.core_hmac_md5(key, data)); }
        static str_hmac_md5(key, data) { return this.binl2str(this.core_hmac_md5(key, data)); }

        /*
        * Calculate the MD5 of an array of little-endian words, and a bit length
        */
        static core_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return Array(a, b, c, d);

        }

        /*
        * These functions implement the four basic operations the algorithm uses.
        */
        static md5_cmn(q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        }
        static md5_ff(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        static md5_gg(a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        static md5_hh(a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        static md5_ii(a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*
        * Calculate the HMAC-MD5, of a key and some data
        */
        static core_hmac_md5(key, data) {
            var bkey = this.str2binl(key);
            if (bkey.length > 16) bkey = this.core_md5(bkey, key.length * this.chrsz);

            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
            return this.core_md5(opad.concat(hash), 512 + 128);
        }

        /*
        * Add integers, wrapping at 2^32. This uses 16-bit operations internally
        * to work around bugs in some JS interpreters.
        */
        static safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
        * Bitwise rotate a 32-bit number to the left.
        */
        static bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
        * Convert a string to an array of little-endian words
        * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
        */
        static str2binl(str) {
            var bin = Array();
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
            return bin;
        }

        /*
        * Convert an array of little-endian words to a string
        */
        static binl2str(bin) {
            var str = "";
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += this.chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
            return str;
        }

        /*
        * Convert an array of little-endian words to a hex string.
        */
        static binl2hex(binarray) {
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        }

        /*
        * Convert an array of little-endian words to a base-64 string
        */
        static binl2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                    | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                    | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += this.b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }
    }
    MiscUtils.hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
    MiscUtils.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
    MiscUtils.chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */
    Laya.ILaya.regClass(MiscUtils);
    Laya.ClassUtils.regClass("zs.laya.MiscUtils", MiscUtils);
    Laya.ClassUtils.regClass("Zhise.MiscUtils", MiscUtils);

    class XHRUtils {

        constructor() {

        }

        static getArgsSign(agrs, secret) {
            var sortedKeys = Object.keys(agrs).sort();
            var signParam = '';
            for (var i = 0; i < sortedKeys.length; i++) {
                signParam += sortedKeys[i] + "=" + agrs[sortedKeys[i]];
            }
            if (secret) {
                signParam += secret;
            }
            var md5sign = zs.laya.MiscUtils.hex_md5(signParam);
            return md5sign.toLowerCase();
        }

        static xhrPost(api, args) {
            if (zs.laya.DeviceService.IsNetValid() == false) {
                Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, null]);
                return;
            }
            if (XHRUtils.xhrRequestList[api] != null) {
                return;
            }
            XHRUtils.xhrRequestList[api] = Date.now();

            var params = zs.laya.MiscUtils.object2UrlStrArgs(args);
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000;//设置超时时间；
            xhr.once(Laya.Event.ERROR, this, this.onXHRError, [api, args]);
            xhr.once(Laya.Event.COMPLETE, this, this.onXHRCompleted, [api, args]);
            xhr.send(api, params, "post", "text");
        }

        static xhrPostWithSign(api, args, secret) {
            if (zs.laya.DeviceService.IsNetValid() == false) {
                Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, null]);
                return;
            }
            if (XHRUtils.xhrRequestList[api] != null) {
                return;
            }
            XHRUtils.xhrRequestList[api] = Date.now();

            // 添加sign
            args.sign = this.getArgsSign(args, secret);
            var params = zs.laya.MiscUtils.object2UrlStrArgs(args);
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000;//设置超时时间；
            xhr.once(Laya.Event.ERROR, this, this.onXHRError, [api, args]);
            xhr.once(Laya.Event.COMPLETE, this, this.onXHRCompleted, [api, args]);
            xhr.send(api, params, "post", "text");
        }

        static xhrPostWithSignAndHeader(api, args, secret, headerInfo) {
            if (zs.laya.DeviceService.IsNetValid() == false) {
                Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, args, null]);
                return;
            }
            if (XHRUtils.xhrRequestList[api] != null) {
                return;
            }
            XHRUtils.xhrRequestList[api] = Date.now();

            // 添加sign
            args.sign = this.getArgsSign(args, secret);

            // 头数据header
            var headers = ["Content-Type", "application/x-www-form-urlencoded"];
            var headerKeys = Object.keys(headerInfo)
            for (var i = 0; i < headerKeys.length; i++) {
                headers.push(headerKeys[i]),
                    headers.push(headerInfo[headerKeys[i]])
            }

            var params = zs.laya.MiscUtils.object2UrlStrArgs(args);
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000;//设置超时时间；
            xhr.once(Laya.Event.ERROR, this, this.onXHRError, [api, args]);
            xhr.once(Laya.Event.COMPLETE, this, this.onXHRCompleted, [api, args]);
            xhr.send(api, params, "post", "text", headers);
        }

        static onXHRError(api, params, data) {
            XHRUtils.xhrRequestList[api] = null;
            console.log("onXHRError:" + api + ",params:" + JSON.stringify(params) + ",response:" + data);
            Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, data]);
        }

        static onXHRCompleted(api, params, data) {
            XHRUtils.xhrRequestList[api] = null;
            // console.log("onXHRCompleted:" + api + ",params:" + JSON.stringify(params) + ",response:" + data);
            var response = JSON.parse(data);

            if (response.code) {

                if (response.code != 200) {
                    Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, response.msg]);
                    return;
                }

                if (response.data == null) {
                    Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, "登陆失败，数据体为空"]);
                    return;
                }

                if (response.data.status != 1) {
                    Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, response.data.msg]);
                    return;
                }
            }
            else if (response.ret) {

                if (response.ret != 200) {
                    Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, response.msg]);
                    return;
                }

                if (response.data == null) {
                    Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, "登陆失败，数据体为空"]);
                    return;
                }
            }
            else {
                Laya.stage.event(this.NET_XHR_RESPONSE, [0, api, params, response.msg]);
                return;
            }

            Laya.stage.event(this.NET_XHR_RESPONSE, [1, api, params, response]);
        }

    }
    XHRUtils.NET_XHR_RESPONSE = "NET_XHR_RESPONSE";
    XHRUtils.xhrRequestList = {};
    Laya.ILaya.regClass(XHRUtils);
    Laya.ClassUtils.regClass("zs.laya.XHRUtils", XHRUtils);
    Laya.ClassUtils.regClass("Zhise.XHRUtils", XHRUtils);

    class DataCache {

        constructor() {
        }

        static setStorageSync(key, value) {
            this.localStorage[key] = value;
        }

        static getStorageSync(key) {
            return this.localStorage[key];
        }

        static clearStorageSync(key) {
            delete this.localStorage[key];
        }

        static clearCache(key) {
            this.clearStorageSync(key);
            this.clearStorageSync(key + "_time");
        }

        static getCache(key, expire) {
            if (expire) {
                var lastCacheTime = this.getStorageSync(key + "_time");
                if (lastCacheTime == null || Date.now() < lastCacheTime + Number(expire)) {
                    return this.getStorageSync(key);
                }
                else {
                    return null;
                }
            }
            else {
                return this.getStorageSync(key);
            }
        }

        static setCache(key, value) {
            this.setStorageSync(key, value);
            this.setStorageSync(key + "_time", Date.now());
        }

    }
    DataCache.localStorage = {};
    Laya.ILaya.regClass(DataCache);
    Laya.ClassUtils.regClass("zs.laya.DataCache", DataCache);
    Laya.ClassUtils.regClass("Zhise.DataCache", DataCache);

    class Resource extends Laya.Script {
        constructor() {
            super();
        }

        static Get3dResUrl(filename) {
            return this.threeDResRootPath + filename;
        }

        static Get3dPrefabUrl(filename) {
            return this.threeDResRootPath + filename + ".lh";
        }

        static Get3dSceneUrl(filename) {
            return this.threeDResRootPath + filename + ".ls";
        }

        static CurScene3dUrl() {
            return this.curScene3d ? this.curScene3d["zs_res_url"] : null;
        }

        static LoadRes() {

        }

        static LoadResAsyn(url, onCompleted, onProgress) {
        }

        static LoadSprite3d(url) {
            return Laya.loader.getRes(this.Get3dPrefabUrl(url));
        }

        static LoadSpriteAsyn(url, onCompleted, onProgress) {
            var spriteUrl = this.Get3dPrefabUrl(url);
            var origin = Laya.loader.getRes(spriteUrl);
            if (origin) {
                if (onProgress) {
                    onProgress.runWith(1);
                }
                if (onCompleted) {
                    onCompleted.runWith(origin);
                }
                return;
            }
            Laya.loader.create(spriteUrl, Laya.Handler.create(null, function (s) {
                if (onCompleted) {
                    onCompleted.runWith(s);
                }
            }), onProgress);
        }

        static LoadScene3d(url) {
            var scene3d = this.curScene3d;
            this.curScene3d = null;
            var lastSceneUrl = scene3d != null ? scene3d["zs_res_url"] : null;
            if (scene3d) {
                scene3d.removeSelf();
                scene3d.destroy();
                scene3d = null;
            }
            this.curScene3d = Laya.loader.getRes(this.Get3dSceneUrl(url));
            if (this.curScene3d) {
                this.curScene3d["zs_res_url"] = url;
            }
            if (lastSceneUrl) {
                this.unloadSceneRes(lastSceneUrl);
            }
            return this.curScene3d;
        }

        static LoadScene3dAsyn(url, onCompleted, onProgress) {
            if (this.curDownloadSceneUrl != url) {
                Laya.loader.cancelLoadByUrl(this.curDownloadSceneUrl);
            }
            this.curDownloadSceneUrl = null;
            var scene3d = this.curScene3d;
            this.curScene3d = null;
            var lastSceneUrl = scene3d != null ? scene3d["zs_res_url"] : null;
            if (scene3d) {
                scene3d.removeSelf();
                scene3d.destroy();
                scene3d = null;
                Laya.loader.clearRes(lastSceneUrl);
            }
            var sceneUrl = this.Get3dSceneUrl(url);
            this.curScene3d = Laya.loader.getRes(sceneUrl);
            if (this.curScene3d) {
                this.curScene3d["zs_res_url"] = url;
                if (lastSceneUrl) {
                    this.unloadSceneRes(lastSceneUrl);
                }
                if (onProgress) {
                    onProgress.runWith(1);
                }
                if (onCompleted) {
                    onCompleted.runWith(this.curScene3d);
                }
                return this.curScene3d;
            }

            this.curDownloadSceneUrl = sceneUrl;
            var self = this;
            Laya.loader.create(sceneUrl, Laya.Handler.create(null, function (s) {
                self.curDownloadSceneUrl = null;
                self.curScene3d = s;
                if (self.curScene3d) {
                    self.curScene3d["zs_res_url"] = url;
                }
                if (lastSceneUrl) {
                    self.unloadSceneRes(lastSceneUrl);
                }
                if (onCompleted) {
                    onCompleted.runWith(self.curScene3d);
                }
            }), onProgress);
            return null;
        }

        static unloadSceneRes(sceneUrl) {
            Laya.loader.load(this.Get3dResUrl(sceneUrl + ".json"), Laya.Handler.create(this, this.DestroyScene3dRes, [this.Get3dResUrl(sceneUrl + ".json")]));
        }

        static printSceneDependences(sceneUrl) {
            Laya.loader.load(this.Get3dResUrl(sceneUrl + ".json"), Laya.Handler.create(this, this.printScene3dRes, [this.Get3dResUrl(sceneUrl + ".json")]));
        }

        static printScene3dRes(resListUrl) {
            var arr = Laya.loader.getRes(resListUrl);
            if (arr == null) {
                return;
            }
            var log = {};
            for (var i = arr.length - 1; i > -1; i--) {
                //根据资源路径获取资源
                var resUrl = this.Get3dResUrl(arr[i])
                var resource = Laya.loader.getRes(resUrl);
                if (resource == null) {
                    //console.log("invalid resUrl:" + resUrl);
                }
                else {
                    log[resUrl] = resource.referenceCount;
                }
            }
            //console.log(JSON.stringify(log));
        }

        static DestroyScene3dRes(resListUrl) {
            var arr = Laya.loader.getRes(resListUrl);
            if (arr == null) {
                return;
            }
            for (var i = arr.length - 1; i > -1; i--) {
                //根据资源路径获取资源
                var resUrl = this.Get3dResUrl(arr[i])
                var resource = Laya.loader.getRes(resUrl);
                if (resource == null) {
                    //console.log("invalid resUrl:" + resUrl);
                }
                else if (resource.referenceCount > 0) {
                    //console.log("using resUrl:" + resUrl + ",refCount:" + resource.referenceCount);
                }
                else {
                    //资源释放
                    resource.destroy();
                    Laya.loader.clearRes(resUrl);
                    //console.log("release resUrl:" + resUrl);
                }
            }
        }
    }
    Resource.curScene3d = null;
    Resource.curDownloadSceneUrl = null;
    Resource.threeDResRootPath = "3dres/Conventional/";
    Laya.ILaya.regClass(Resource);
    Laya.ClassUtils.regClass("zs.laya.Resource", Resource);
    Laya.ClassUtils.regClass("zs.laya.ZSResource", Resource);
    Laya.ClassUtils.regClass("Zhise.Resource", Resource);

    class DeviceService extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            DeviceService.device = window["zsDevice"];
            if (DeviceService.device) {
                DeviceService.device.init();
                DeviceService.device.onShow(Laya.Handler.create(null, function (res) { Laya.stage.event(DeviceService.EVENT_ON_SHOW, res) }, null, false));
                DeviceService.device.onHide(Laya.Handler.create(null, function () { Laya.stage.event(DeviceService.EVENT_ON_HIDE) }, null, false));
            }
        }

        onDestroy() {
            DeviceService.device = null;
        }

        static statusBarHeight() {
            if (this.device) {
                return this.device.statusBarHeight();
            }
            else {
                return 0;
            }
        }

        static screenWidth() {
            if (this.device) {
                return this.device.screenWidth();
            }
            else {
                return Laya.stage.width;
            }
        }

        static screenHeight() {
            if (this.device) {
                return this.device.screenHeight();
            }
            else {
                return Laya.stage.height;
            }
        }

        static VibrateShort() {
            if (this.device) {
                this.device.vibrateShort();
            }
            else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(500);
            }
            else {
                console.log("vibrateShort");
            }
        }

        static VibrateLong() {
            if (this.device) {
                this.device.vibrateLong();
            }
            else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(1000);
            }
            else {
                console.log("VibrateLong");
            }
        }

        static IsNetValid() {
            if (this.device) {
                return this.device.isNetValid();
            }
            return navigator.onLine;
        }
    }
    DeviceService.device = null;
    DeviceService.EVENT_ON_RESUME = "DEVICE_ON_RESUME";
    DeviceService.EVENT_ON_HIDE = "DEVICE_ON_HIDE";
    DeviceService.EVENT_ON_SHOW = "DEVICE_ON_SHOW";
    Laya.ILaya.regClass(DeviceService);
    Laya.ClassUtils.regClass("zs.laya.DeviceService", DeviceService);
    Laya.ClassUtils.regClass("Zhise.DeviceService", DeviceService);

    class SoundService extends Laya.Script {

        constructor() {
            super();
        }

        onAwake() {
            Laya.stage.on(zs.laya.DeviceService.EVENT_ON_SHOW, this, this.onAppShow);
            Laya.stage.on(zs.laya.DeviceService.EVENT_ON_HIDE, this, this.onAppHide);
        }

        onDestroy() {
            Laya.stage.off(zs.laya.DeviceService.EVENT_ON_SHOW, this, this.onAppShow);
            Laya.stage.off(zs.laya.DeviceService.EVENT_ON_HIDE, this, this.onAppHide);
        }

        onAppShow() {
            SoundService.playMusic(SoundService.curMusic);
        }

        onAppHide() {
            SoundService.stopMusic();
        }

        static playMusic(music) {
            if (music == null) {
                return;
            }
            if (SoundService.curMusic == music && SoundService.bgPlaying) {
                return;
            }
            SoundService.curMusic = music;
            SoundService.bgPlaying = true;
            Laya.SoundManager.stopAll();
            Laya.SoundManager.playMusic(SoundService.curMusic, 0);
        }

        static stopMusic() {
            Laya.SoundManager.stopAll();
            SoundService.bgPlaying = false;
        }

    }
    SoundService.curMusic = null;
    SoundService.bgPlaying = false;
    Laya.ILaya.regClass(SoundService);
    Laya.ClassUtils.regClass("zs.laya.SoundService", SoundService);
    Laya.ClassUtils.regClass("Zhise.SoundService", SoundService);

    class ObjectPool extends Laya.Script {

        constructor() {
            super();
            this.poolStatus = {};
            this.recoverArr = [];
        }

        clearCache() {
            var self = this;
            this.recoverArr.forEach(function (sprite3d) {
                if (sprite3d["__InPool"]) return;
                if (!self.poolStatus[sprite3d["_zs_sign"]]) self.poolStatus[sprite3d["_zs_sign"]] = {};
                if (self.poolStatus[sprite3d["_zs_sign"]]["free"]) {
                    self.poolStatus[sprite3d["_zs_sign"]]["free"] += 1;
                }
                else {
                    self.poolStatus[sprite3d["_zs_sign"]]["free"] = 1;
                }
                Laya.Pool.recover(sprite3d["_zs_sign"], sprite3d);
            });
            this.recoverArr.splice(0, this.recoverArr.length);

            console.log("ObjectPool.poolStatus:" + JSON.stringify(this.poolStatus));
            for (var key in this.poolStatus) {
                if (this.poolStatus.hasOwnProperty(key)) {
                    Laya.Pool.clearBySign(key);
                }
            }
            this.poolStatus = {};
        }

        recoverSprite3d(sprite3d, immediate) {
            sprite3d.removeSelf();
            if (sprite3d["_zs_sign"] == null) {
                return;
            }
            if (immediate) {
                if (sprite3d["__InPool"]) return;
                if (!this.poolStatus[sprite3d["_zs_sign"]]) this.poolStatus[sprite3d["_zs_sign"]] = {};
                if (this.poolStatus[sprite3d["_zs_sign"]]["free"]) {
                    this.poolStatus[sprite3d["_zs_sign"]]["free"] += 1;
                }
                else {
                    this.poolStatus[sprite3d["_zs_sign"]]["free"] = 1;
                }
                Laya.Pool.recover(sprite3d["_zs_sign"], sprite3d);
            }
            else {
                this.recoverArr.push(sprite3d);
            }
        }

        getEmptySprite3d(sign) {
            var zs_sign = sign;
            if (this.poolStatus[zs_sign]) {
                this.poolStatus[zs_sign]["total"] += 1;
            }
            else {
                this.poolStatus[zs_sign] = {};
                this.poolStatus[zs_sign]["total"] = 1;
            }
            var self = this;
            return Laya.Pool.getItemByCreateFun(
                zs_sign,
                function () { return self.createEmptySprite3d(sign); });
        }

        createEmptySprite3d(sign) {
            var sprite3d = new Laya.Sprite3D();
            sprite3d["_zs_sign"] = sign;
            return sprite3d;
        }

        getSprite3d(original, sign) {
            var zs_sign = sign ? sign : original.url;
            if (this.poolStatus[zs_sign]) {
                this.poolStatus[zs_sign]["total"] += 1;
            }
            else {
                this.poolStatus[zs_sign] = {};
                this.poolStatus[zs_sign]["total"] = 1;
            }
            var self = this;
            return Laya.Pool.getItemByCreateFun(
                zs_sign,
                function () { return self.createSprite3d(original, zs_sign); })
        }

        createSprite3d(original, sign) {
            var sprite3d = Laya.Sprite3D.instantiate(original, null, false, Laya.Vector3._ZERO.clone());
            sprite3d["_zs_sign"] = sign
            return sprite3d;
        }

        onAwake() {
            ObjectPool.sInstance = this;
        }

        onDestroy() {
            ObjectPool.sInstance = null;
        }

        onLateUpdate() {
            if (this.recoverArr.length == 0) {
                return;
            }
            var self = this;
            this.recoverArr.forEach(function (sprite3d) {
                if (sprite3d["__InPool"]) return;
                if (self.poolStatus[sprite3d["_zs_sign"]]["free"]) {
                    self.poolStatus[sprite3d["_zs_sign"]]["free"] += 1;
                }
                else {
                    self.poolStatus[sprite3d["_zs_sign"]]["free"] = 1;
                }
                Laya.Pool.recover(sprite3d["_zs_sign"], sprite3d);
            });
            this.recoverArr.splice(0, this.recoverArr.length);
        }

        static ClearCache() {
            this.sInstance.clearCache();
        }

        static RecoverSprite3d(sprite3d, immediate) {
            this.sInstance.recoverSprite3d(sprite3d, immediate);
        }

        static GetEmptySprite3d(sign) {
            return this.sInstance.getEmptySprite3d(sign);
        }

        static GetSprite3d(original, sign) {
            return this.sInstance.getSprite3d(original, sign);
        }
    }
    ObjectPool.sInstance = null;
    Laya.ILaya.regClass(ObjectPool);
    Laya.ClassUtils.regClass("zs.laya.ObjectPool", ObjectPool);
    Laya.ClassUtils.regClass("Zhise.ObjectPool", ObjectPool);

    class EffectInfo {
        constructor(customId, sign, duaration, parent, isWorldSpace, position, rotation) {
            this.customId = customId;
            this.sign = sign;
            this.duaration = duaration;
            this.parent = parent;
            if (isWorldSpace != null) {
                this.isWorldSpace = isWorldSpace;
                this.position = position ? position.clone() : null;
                this.rotation = rotation ? rotation.clone() : null;
            }
            this.createTime = Laya.timer.currTimer;
        }
    }

    class EffectFactory extends Laya.Script {

        constructor() {
            super();
            this.effectWaitingList = [];
            this.recoverArr = [];
        }

        static CreateEffect(customId, sign, duaration, parent, isWorldSpace, position, rotation, effectScript) {
            this.sInstance.createEffect(customId, sign, duaration, parent, isWorldSpace, position, rotation, effectScript);
        }

        onAwake() {
            EffectFactory.sInstance = this;
        }

        onDestroy() {
            EffectFactory.sInstance = null;
        }

        createEffect(customId, sign, duaration, parent, isWorldSpace, position, rotation, effectScript) {
            var effectInfo = new EffectInfo(customId, sign, duaration, parent, isWorldSpace, position, rotation);
            effectInfo.effectScript = effectScript;
            this.effectWaitingList.push(effectInfo);
            if (this.effectWaitingList.length == 1) {
                this.instanceEffectDelay(2);
            }
        }

        instanceEffectDelay(delayFrame) {
            Laya.timer.frameOnce(delayFrame, this, this.instanceEffect, [delayFrame]);
        }

        instanceEffect(delayFrame) {
            var effectInfo = this.effectWaitingList.shift();
            if (Laya.timer.currTimer - effectInfo.createTime > effectInfo.duaration) {
                if (this.effectWaitingList.length > 0) {
                    this.instanceEffectDelay(delayFrame);
                }
                return;
            }

            zs.laya.Resource.LoadSpriteAsyn(effectInfo.sign, Laya.Handler.create(this, this.onEffectReady, [effectInfo]))

            if (this.effectWaitingList.length > 0) {
                this.instanceEffectDelay(delayFrame);
            }
        }

        onEffectReady(effectInfo, sprite) {

            if (Laya.timer.currTimer - effectInfo.createTime > effectInfo.duaration) {
                return;
            }

            var effect = zs.laya.ObjectPool.GetSprite3d(sprite);
            if (effect == null || effectInfo.parent.destroyed || effectInfo.parent.parent == null) {
                return;
            }

            effectInfo.parent.addChild(effect);
            effect.name = effectInfo.customId;
            if (effectInfo.isWorldSpace == null) {

            }
            else if (effectInfo.isWorldSpace) {
                effectInfo.position ? effect.transform.position = effectInfo.position : 1;
                effectInfo.rotation ? effect.transform.rotation = effectInfo.rotation : 1;
            }
            else {
                effectInfo.position ? effect.transform.localPosition = effectInfo.position : 1;
                effectInfo.rotation ? effect.transform.localRotation = effectInfo.rotation : 1;
            }
            var delayRecover = effect.getComponent(EffectScript3d);
            if (delayRecover == null) {
                delayRecover = effect.addComponent(EffectScript3d);
            }
            delayRecover.delay = effectInfo.duaration;
        }

    }
    EffectFactory.sInstance = null;
    Laya.ILaya.regClass(EffectFactory);
    Laya.ClassUtils.regClass("zs.laya.EffectFactory", EffectFactory);
    Laya.ClassUtils.regClass("Zhise.EffectFactory", EffectFactory);

    class EffectScript3d extends Laya.Script3D {

        constructor() {
            super();
            this.delay = Number.MAX_VALUE;
        }

        /**
         * cleanNode
         */
        cleanNode() {
            ObjectPool.RecoverSprite3d(this.owner);
        }

        onUpdate() {
            if (this.delay < 0) {
                return;
            }

            this.delay -= Laya.timer.delta;
            if (this.delay <= 0) {
                this.delay = Number.MAX_VALUE;
                zs.laya.ObjectPool.RecoverSprite3d(this.owner);
            }
        }

        onDestroy() {
            this.delay = null;
        }

    }
    Laya.ILaya.regClass(EffectScript3d);
    Laya.ClassUtils.regClass("zs.laya.EffectScript3d", EffectScript3d);
    Laya.ClassUtils.regClass("Zhise.EffectScript3d", EffectScript3d);

    class TriggerScript3d extends Laya.Script3D {

        constructor() {
            super();
            this.listener = null;
        }

        static Init(sprite3d, listener) {
            var trigger = sprite3d.getComponent(TriggerScript3d);
            if (!trigger) {
                trigger = sprite3d.addComponent(TriggerScript3d);
            }
            trigger.listener = listener;
        }

        onTriggerEnter(other) {
            if (this.listener != null && this.listener.zsTriggerEnter) {
                this.listener.zsTriggerEnter(this, other);
            }
        }

        onTriggerExit(other) {
            if (this.listener != null && this.listener.zsTriggerExit) {
                this.listener.zsTriggerExit(this, other);
            }
        }

        onTriggerStay(other) {
            if (this.listener != null && this.listener.zsTriggerStay) {
                this.listener.zsTriggerStay(this, other);
            }
        }

        onDestroy() {
            this.listener = null;
        }
    }
    Laya.ILaya.regClass(TriggerScript3d);
    Laya.ClassUtils.regClass("zs.laya.TriggerScript3d", TriggerScript3d);
    Laya.ClassUtils.regClass("Zhise.TriggerScript3d", TriggerScript3d);

    class Sprite3dAgent extends Laya.Script3D {

        constructor() {
            super();
            this.loadedCb = null;
            this.sign = null;
            this.sprite = null;
            this.sleep = true;
        }

        static init(sprite3d, sign, loaded) {
            var agent = sprite3d.getComponent(Sprite3dAgent);
            if (agent == null) {
                agent = sprite3d.addComponent(Sprite3dAgent);
            }
            agent.sign = sign;
            agent.loadedCb = loaded;
            agent.sleep = false;
            if (agent.sprite) {
                zs.laya.ObjectPool.RecoverSprite3d(agent.sprite, true);
            }
        }

        static release(sprite3d) {
            var agent = sprite3d.getComponent(Sprite3dAgent);
            if (agent) {
                agent.sleep = true;
            }
        }

        onSpriteReady(sign, sprite) {
            console.log("onSpriteReady:" + sign);
            if (this.sleep) {
                return ;
            }
            if (this.owner.parent) {
                this.sprite = zs.laya.ObjectPool.GetSprite3d(sprite, null);
            }
        }

        onLateUpdate() {
            if (this.sign) {
                zs.laya.Resource.LoadSpriteAsyn(this.sign, Laya.Handler.create(this, this.onSpriteReady, [this.sign]));
                this.sign = null;
            }
            if (this.sprite) {
                this.owner.parent.addChild(this.sprite);
                var agent = this.owner;
                this.sprite.transform.position = agent.transform.position.clone();
                this.sprite.transform.rotationEuler = agent.transform.rotationEuler.clone();
                this.sprite.transform.localScale = agent.transform.localScale.clone();
                if (this.loadedCb) {
                    this.loadedCb.runWith(this.sprite);
                    this.loadedCb = null;
                }
                this.sprite = null;
                zs.laya.ObjectPool.RecoverSprite3d(agent);
            }
        }
    }
    Laya.ILaya.regClass(Sprite3dAgent);
    Laya.ClassUtils.regClass("zs.laya.Sprite3dAgent", Sprite3dAgent);
    Laya.ClassUtils.regClass("Zhise.Sprite3dAgent", Sprite3dAgent);

    class Sprite3dRecover extends Laya.Script3D {

        constructor() {
            super();
            this.delay = Number.MAX_VALUE;
        }

        static delayRecover(sprite, delay) {
            var recover = sprite.getComponent(Sprite3dRecover);
            if (recover == null) {
                recover = sprite.addComponent(Sprite3dRecover);
            }
            recover.delay = delay;
        }

        /**
         * cleanNode
         */
        cleanNode() {
            ObjectPool.RecoverSprite3d(this.owner);
        }

        onUpdate() {
            if (this.delay < 0) {
                return;
            }

            this.delay -= Laya.timer.delta;
            if (this.delay <= 0) {
                this.delay = Number.MAX_VALUE;
                zs.laya.ObjectPool.RecoverSprite3d(this.owner);
            }
        }

        onDisable() {
            this.delay = Number.MAX_VALUE;
        }

        onDestroy() {
            this.delay = null;
        }

    }
    Laya.ILaya.regClass(Sprite3dRecover);
    Laya.ClassUtils.regClass("zs.laya.Sprite3dRecover", Sprite3dRecover);
    Laya.ClassUtils.regClass("Zhise.Sprite3dRecover", Sprite3dRecover);

    class AnimStateListener extends Laya.AnimatorStateScript {

        constructor() {
            super();
            this.stateName = "";
            this.animator = null;
            this.listener = null;
            this.onEnter = null;
            this.onExit = null;
        }

        static setListener(animator, stateName, caller, onEnter, onExit) {
            var controller = animator.getControllerLayer(0);
            var animState = controller.getAnimatorState(stateName);
            if (animState == null) {
                return;
            }
            var listener = animState.getScript(AnimStateListener);
            if (listener == null) {
                listener = animState.addScript(AnimStateListener);
            }
            listener.stateName = stateName;
            listener.animator = animator;
            listener.listener = caller;
            listener.onEnter = onEnter;
            listener.onExit = onExit;
        }

        static init(animator, stateName, binder) {
            var controller = animator.getControllerLayer(0);
            var animState = controller.getAnimatorState(stateName);
            if (animState == null) {
                return;
            }
            var listener = animState.getScript(AnimStateListener);
            if (listener == null) {
                listener = animState.addScript(AnimStateListener);
            }
            listener.stateName = stateName;
            listener.animator = animator;
            listener.listener = binder;
            listener.onEnter = null;
            listener.onExit = null;
        }

        static remove(animator, stateName) {
            var controller = animator.getControllerLayer(0);
            var animState = controller.getAnimatorState(stateName);
            if (animState == null) {
                return;
            }
            var listener = animState.getScript(AnimStateListener);
            if (listener == null) {
                return;
            }
            listener.stateName = null;
            listener.animator = null;
            listener.listener = null;
            listener.onEnter = null;
            listener.onExit = null;
        }

        onStateEnter() {
            if (this.listener && this.onEnter) {
                this.onEnter.call(this.listener, this.stateName, this.animator);
            }
            if (this.listener && this.listener.zsAnimStateEnter) {
                this.listener.zsAnimStateEnter(this.stateName, this.animator);
            }
        }

        onStateExit() {
            if (this.listener && this.onExit) {
                this.onExit.call(this.listener, this.stateName, this.animator);
            }
            if (this.listener && this.listener.zsAnimStateExit) {
                this.listener.zsAnimStateExit(this.stateName, this.animator);
            }
        }
    }
    Laya.ILaya.regClass(AnimStateListener);
    Laya.ClassUtils.regClass("zs.laya.AnimStateListener", AnimStateListener);
    Laya.ClassUtils.regClass("Zhise.AnimStateListener", AnimStateListener);

    exports.DataCache = DataCache;
    exports.XHRUtils = XHRUtils;
    exports.MiscUtils = MiscUtils;
    exports.Resource = Resource;
    exports.DeviceService = DeviceService;
    exports.SoundService = SoundService;
    exports.ObjectPool = ObjectPool;
    exports.EffectScript3d = EffectScript3d;
    exports.EffectFactory = EffectFactory;
    exports.TriggerScript3d = TriggerScript3d;
    exports.Sprite3dAgent = Sprite3dAgent;
    exports.Sprite3dRecover = Sprite3dRecover;
    exports.AnimStateListener = AnimStateListener;
}(window.zs.laya, Laya));