declare module zs.laya.game {
    class EventId {
        public static readonly UI_TOAST_MESSAGE: string;
        public static readonly NET_XHR_RESPONSE: string;
        public static readonly APP_SHOW: string;
        public static readonly APP_HIDE: string;

        public static readonly APP_JUMP_CANCEL: string;
        public static readonly APP_JUMP_SUCCESS: string;
        public static readonly UI_VIEW_CLOSED: string;
        public static readonly UI_VIEW_OPENED: string;
        public static readonly UI_STORE_SWITCH_TAB: string;
        public static readonly UI_STORE_SWITCH_ITEM: string;
        public static readonly UI_STORE_ITEM_EQUIPED: string;
        public static readonly UI_STORE_ITEM_UNLOCKED: string;
        public static readonly UI_PROGRESS_UPDATE: string;
        public static readonly LAUNCH_COMPLETED: string;

        public static readonly AD_VIDEO_PLAY: string;
        public static readonly AD_VIDEO_CLOSED: string;

        public static readonly GAME_HOME: string;
        public static readonly GAME_PREPARE: string;
        public static readonly GAME_START: string;
        public static readonly GAME_WIN: string;
        public static readonly GAME_FAILED: string;
        public static readonly GAME_RELIVE: string;
        public static readonly GAME_OVER: string;
        public static readonly GAME_AGAIN: string;
        public static readonly EGG_GET_AWARD: string;

        public static readonly GAME_SLEEP: string;
        public static readonly GAME_WAKEUP: string;

        public static readonly DATA_SETTING_UPDATE: string;
    }

    class GameState {
        public static readonly STATE_LOADING: number;
        public static readonly STATE_UNBEGIN: number;
        public static readonly STATE_PREPARE: number;
        public static readonly STATE_PLAYING: number;
        public static readonly STATE_PAUSE: number;
    }

    class WebService {

        public static WebApiMap: zs.laya.data.WebApiMap;
        public static RequestHeader:{};

        public static requestLoginByCode(code, args?);

        public static requestLoginByUserId(userId, args?);

        public static requestAuthorize(nickname, avatar, gender);

        public static requestBaseCfg(args?);

        public static updatePlayerInfo(args?);

        public static startGame(args?);

        public static endGame(args?);

        public static requestTopRank();

        public static updateVideoLog(args?);
    }

    interface WebRequestArgsInterface {
        reqLoginArgs();

        reqUserInfoArgs();

        reqBaseCfgArgs();

        reqStartGameArgs();

        reqEndGameArgs();

        reqTopRankArgs();

        uploadVideoArgs();
    }

    class WebRequestArgs {

        public static Instance: WebRequestArgsInterface;
    }

    class UIService extends Laya.Script {

        public static viewScript: zs.laya.data.ViewScriptMap;

        public static viewConfig: zs.laya.data.ViewMap;

        public static setOpenSound(soundUrl: string);

        public static setUIResConfig(config: any);

        /**
         * showLoading
         */
        public static showLoading(data?: any);

        public static hideLoading();

        /**
         * showCover
         */
        public static showHome(data?: any);

        public static hideHome();

        /**
         * showRank
         */
        public static showRank(data?: any);

        public static hideRank();

        /**
         * showPlaying
         */
        public static showPlaying(data?: any);

        /**
         * showPlaying
         */
        public static hidePlaying();

        /**
         * showRelive
         */
        public static showRelive(data?: any);

        /**
         * hideRelive
         */
        public static hideRelive();

        /**
         * showScore
         */
        public static showScore(data?: any);

        /**
         * hideScore
         */
        public static hideScore();

        public static showGuide(data?: any);

        public static hideGuide();

        public static showStore(data?: any);

        public static hideStore();

        public static showMsgBox(data: UIMsgBoxArgs);

        public static showToast(msg: string);

        public static initView(view: any, type: any, data?: any);
    }

    interface WebResponseAdapter {

        LoginResponse(data: any): zs.game.data.PlayerInfo;

        BaseCfgResponse(data: any): zs.game.data.GameSetting;

        GameStartResponse(data: any): zs.game.data.GameStartResponse;

        GameEndResponse(data: any): zs.game.data.GameEndResponse;

        TopRankResponse(data: any): zs.game.data.RankData;
    }

    class AppMain extends Laya.Script {
        public static appConfig: zs.laya.data.AppConfig;
        public static playerInfo: zs.game.data.PlayerInfo;
        public static storeCfg: zs.game.data.StoreConfig;
        public static gameSetting: zs.game.data.GameSetting;
        public static levelData: zs.game.data.LevelData;
        public static authorizeData: zs.game.data.AuthorizeData;
        public static gameStartRet: zs.game.data.GameStartResponse;
        public static gameEndRet: zs.game.data.GameEndResponse;
        public static GameState: GameState;
        public static LevId: number;
        public static ReliveChance: number;
        public static autoStartNext: boolean;
        public static webResponseAdatper: WebResponseAdapter;

        protected isWin: boolean;

        protected onLaunchResReady(s: Laya.Scene3D): void;
        protected onNetXHRResponse(result: number, api: string, params: string, response: any): void;
        protected onGameHome(data: any): void;
        protected onGamePrepare(data: any): void;
        protected onGameStart(data: any): void;
        protected onGameFailed(data: any): void;
        protected onGameWin(data: any): void;
        protected onGameOver(): void;
        protected onGameRelive(): void;
        protected onGameShow(): void;
        protected onGameHide(): void;
        protected onJumpCancel(): void;
    }

    class Launch extends Laya.Script {
        protected onLaunchResReady(s: Laya.Scene3D): void;
    }
}