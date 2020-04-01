declare module zs.laya.ui {
    
    class LoadingView extends zs.laya.base.ZhiSeView{
    }

    class StorePage extends zs.laya.base.ZhiSeView {

        static requestStoreData(): void;

        /*
        args: { goods_type: goodsData.goods_type, goods_id: goodsData.goods_id }
        */
        static requestEquipItem(args: any): void;

        /*
        args: { goods_type: goodsData.goods_type, goods_id: goodsData.goods_id, gold:goodsData.gold }
        */
        static requestUnlockGoodsByGold(args: any): void;

        /*
        args: { goods_type: goodsData.goods_type, goods_id: goodsData.goods_id }
        */
        static requestUnlockGoodsByVideo(args: any): void;
    }

    class WinView extends zs.laya.base.ZhiSeView{
    }

    class HomeView extends zs.laya.base.ZhiSeView{
    }

    class ReliveView extends zs.laya.base.ZhiSeView{
    }

    class NormalStorePage extends zs.laya.base.ZhiSeView {
    }
    
    class LoadingBar extends Laya.Script {

        public static readonly EVENT_UI_PROGRESS_UPDATE;

        public loadingVal: Laya.UIComponent;
        public loadingBar: Laya.UIComponent;
        public loadingMask: Laya.UIComponent;
    }

    class MsgBox extends Laya.Script {
        public initMsgBox(callback: Laya.Handler);
    }

    class StartBtn extends Laya.Script {
        public startGameData: any;
    }

    class StoreBtn extends Laya.Script {
    }

    class ReplayBtn extends Laya.Script {
        public freshBtnState();
    }

    class ReplayNextHomeBtn extends ReplayBtn {
        public endGameData: any;
    }

    class AwardBtn extends Laya.Script {
        public endGameData: any;
    }

    class ExAwardBtn extends Laya.Script {
        public endGameData: any;
    }

    class TickCount extends Laya.Script {
        public endGameData: any;
        public waitingTime: number;
        public onTimeOver();
    }
}