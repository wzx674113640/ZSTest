declare module zs.game.data {
    //登录接口可以获取玩家的基础信息
    interface PlayerInfo {
        user_id: string;
        is_new:number;//是否是新用户 0不是 1是
        level_id:number;//当前关卡或者当前等级
        gold: number;//当前金币或者积分【每局游戏可以获得的奖励】
        goods_id: number[];
        goods_ids: any;
    }
    
    interface LevelData {
        game_id: number;     //每局游戏后台给的唯一id
        rewardGold:number;    //每局游戏获取的奖励【后台会在接受到游戏结束接口后，会增加到PlayerInfo.gold】
    }

    interface AuthorizeData {
        nickName: string;
        avatarUrl: string;
        gender: any; // 性别 0：未知、1：男、2：女
    }

    interface RankData {
        user_id: number;
        avatar: string;
        nickname: string;
        max_checkpoints: number;
        rank: number;
    }
    
    interface GameSetting {
        grave_speed: number;        // 激光笔雕刻速度
        paint_scope: number;        // 喷漆范围（大小）
        machine_space: number;      // 工具距离手的实际位置
        laser_size: number;         // 激光笔描边大小
        wood_percentage: number;    // 削木通关所需百分比
        game_valuegold: number;     // 结算金币最小值
        game_maxgold: number;       // 结算金币最大值
        doodle_range_transit: number;   // 喷枪渐变范围比例
        blend_val: number;
    }    
    
    interface GameStartResponse {

    }

    interface GameEndResponse {
        
    }

    interface GoodsData {
        goods_id: number; // 1,
        goods_name: string; // "初始",
        goods_type: number; // "无",
        goods_icon: string; // "初始",
        goods_path: string; // "无",
        buy_type: number; // 1,
        gold: number; // 0,
        video_num: number; // 0,
        type: string; // "默认",
        status: number; // 1,
        video_now: number; // 0
        is_used: number; // 0
    }
    
    interface StoreConfig {
        storeType: number;
        catalogue: any;
    }
}