/***数据定义 */
declare module zs.laya.data {
    
    interface DefaultCfg {
        userId: zs.game.data.PlayerInfo;
        gameSetting: zs.game.data.GameSetting;
        levelData: zs.game.data.LevelData;
    }
    
    interface ViewMap {
        loading: string;
        home: string;
        playing: string;
        relive: string;
        score: string;
        guide: string;
        msgBox: string;
        store: string;
    }

    interface ViewScriptMap {
        loading: any;
        home: any;
        playing: any;
        relive: any;
        score: any;
        guide:any;
        msgBox: any;
        store: any;
    }
    
    interface WebApiMap {
        login: string;
        authorize: string;
        gameCfg: string;
        userInfo: string;
        gameStart: string;
        gameEnd: string;
        worldRank: string;
        logVideo: string;
    }
    
    interface AppConfig {
        appId: string;
        version: string;
        bgm: string;
        soundClick: string;
        soundViewOpen: string;
        default3DScene: string;
        iosFilterAppIds: string[];
        viewMap: ViewMap;
        useWebApi: boolean;
        webApiSign: string;
        useWebAdApi: boolean;
        webApiMap: WebApiMap;
        defaultCfg: DefaultCfg;
    }
}