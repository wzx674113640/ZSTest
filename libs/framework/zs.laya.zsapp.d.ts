declare module zs.laya.zsapp {

    interface adData {
        position_type: string;
        app_desc: string;
        link_path: string;
        app_id: string;
        open_ad: string;
        appid: string;
        app_icon: string;
        app_title: string;
        app_qrcode: string;
        link_text: string;
        type: string;
    }

    interface adDataSet {
        promotion: adData[];
        indexLeft: adData[];
        endPage: adData[];
        backAd: adData[];
    }

    class zsAppSdk {
    
        /**
         * 加载广告配置
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         */
        static loadConfig(success: Function, failed: Function);
        
        /**
         * 初始化 sdk
         * @param {*} user_id    用户唯一标识
         * @param {*} platform_id 后台定义的平台id
         */
        static init(user_id, platform_id);
        
        /**
         * 发送视频观看记录
         */
        static sendVideoLog();
        
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
        static loadAd(callback:Function);
    
        /**
         * 跳转小程序
         * @param {*} row    从loadAd接口中返回的数组项   @example indexLeft[0]
         * @param {*} openid 小游戏中的用户openid
         * @param {function} success 接口调用成功的回调函数
         * @param {function} fail 接口调用失败的回调函数
         * @param {function} complete 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        static navigate2Mini(adData: adData, uniqueId: string, success: Function, failed: Function, completed: Function);

    }
}