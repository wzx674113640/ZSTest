window.zs = window.zs || {};
window.zs.laya = window.zs.laya || {};
(function (exports, Laya) {
    'use strict';
    class LoadingBar extends Laya.Script {

        constructor() {
            super();
            this.loadingVal = null;
            this.loadingBar = null;
            this.loadingMask = null;
        }

        onAwake() {
            this.loadingVal = this.owner.getChildByName("loadingVal");
            this.loadingMask = this.owner.getChildByName("loadingMask");
            this.loadingBar = this.loadingMask.getChildByName("loadingBar");
        }

        onEnable() {
            this.onLoadingUpdate(0.01);
            Laya.stage.on(LoadingBar.EVENT_UI_PROGRESS_UPDATE, this, this.onLoadingUpdate);
        }

        onDisable() {
            Laya.stage.off(LoadingBar.EVENT_UI_PROGRESS_UPDATE, this, this.onLoadingUpdate);
        }

        onLoadingUpdate(val) {
            if (this.loadingBar && this.loadingMask) {
                this.loadingMask.width = this.loadingBar.width * val;
            }
            this.loadingVal && (this.loadingVal.text = Math.floor(100 * val) + "%");
        }

    }
    LoadingBar.EVENT_UI_PROGRESS_UPDATE = "UI_PROGRESS_UPDATE";
    Laya.ILaya.regClass(LoadingBar);
    Laya.ClassUtils.regClass("zs.laya.ui.Loading", LoadingBar);
    Laya.ClassUtils.regClass("zs.laya.ui.LoadingBar", LoadingBar);
    Laya.ClassUtils.regClass("Zhise.LoadingBar", LoadingBar);

    class MsgBoxComp extends Laya.Script {

        constructor() {
            super();
            this.callback = null;
            this.confirmBtn = null;
        }

        initMsgBox(callback) {
            this.callback = callback;
        }

        onAwake() {
            this.confirmBtn = this.owner.getChildByName("confirmBtn");
        }

        onEnable() {
            this.confirmBtn.on(Laya.Event.CLICK, this, this.onClickConfirm);
        }

        onDisable() {
            this.confirmBtn.off(Laya.Event.CLICK, this, this.onClickConfirm);
        }

        onClickConfirm() {
            if (this.callback) {
                this.callback.run();
                this.callback = null;
            }
        }
    }
    Laya.ILaya.regClass(MsgBoxComp);
    Laya.ClassUtils.regClass("zs.laya.ui.MsgBox", MsgBoxComp);
    Laya.ClassUtils.regClass("zs.laya.ui.MsgBoxComp", MsgBoxComp);
    Laya.ClassUtils.regClass("Zhise.MsgBoxComp", MsgBoxComp);

    class StartBtn extends Laya.Script {

        constructor() {
            super();
            this.startGameData = null;
        }

        onClick() {
            Laya.SoundManager.playSound(zs.laya.game.AppMain.appConfig.soundClick);
            zs.laya.game.WebService.startGame(this.startGameData || zs.laya.game.WebRequestArgs.reqStartGameArgs());
        }
    }
    Laya.ILaya.regClass(StartBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.StartBtn", StartBtn);
    Laya.ClassUtils.regClass("Zhise.StartBtn", StartBtn);

    

    class StoreBtn extends Laya.Script {

        constructor() {
            super();
        }

        onClick() {
            Laya.SoundManager.playSound(zs.laya.game.AppMain.appConfig.soundClick);
            zs.laya.game.UIService.showStore();
        }
    }
    Laya.ILaya.regClass(StoreBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.StoreBtn", StoreBtn);
    Laya.ClassUtils.regClass("Zhise.StoreBtn", StoreBtn);

    class ReplayBtn extends Laya.Script {

        constructor() {
            super();
            this.statusClip = null;
        }

        onAwake() {
            this.statusClip = this.owner;
        }

        onEnable() {
            this.owner.mouseEnabled = true;
            this.freshBtnState();
        }

        onClick() {
            Laya.SoundManager.playSound(zs.laya.game.AppMain.appConfig.soundClick);
            this.owner.mouseEnabled = false;
            if (this.statusClip.index == 0) {
                zs.laya.sdk.SdkService.playVideo(
                    Laya.Handler.create(this, function () {
                        console.log("toRelive");
                        // Laya.stage.event(zs.laya.game.EventId.VIDEO_COMPLETED);
                        zs.laya.platform.ADConfig.updateVideoRevive();
                        this.relive();
                        console.log("toRelive2");
                    }),
                    Laya.Handler.create(this, function () {
                        this.owner.mouseEnabled = true;
                        this.freshBtnState();
                    }),
                    Laya.Handler.create(this, function () {
                        this.freshBtnState();
                        zs.laya.game.UIService.showToast("今日视频观看次数已用尽");
                    }));
            }
            else if (this.statusClip.index == 1) {
                Laya.stage.once(zs.laya.DeviceService.EVENT_ON_SHOW, this, function (timeStamp) {
                    if (Date.now() - timeStamp > 3000) {
                        zs.laya.platform.ADConfig.updateShareRevive();
                        Laya.stage.event(zs.laya.game.EventId.GAME_RELIVE);
                        this.relive();
                    }
                    else {
                        this.freshBtnState();
                        zs.laya.game.UIService.showToast("分享失败");
                    }
                }, [Date.now()]);
                zs.laya.sdk.SdkService.openShare(zs.laya.platform.ADConfig.zs_share_title, zs.laya.platform.ADConfig.zs_share_image);
            }
            else if (this.statusClip.index == 2) {
                this.relive();
            }
            else {
                this.onContinue();
            }
        }

        freshBtnState() {
            this.owner.mouseEnabled = true;
            var useWebAdApi = zs.laya.game.AppMain.appConfig.useWebAdApi;
            if (zs.laya.game.AppMain.ReliveChance <= 0) {
                this.statusClip.index = 3;
            }
            else if (useWebAdApi && zs.laya.platform.ADConfig.enableClickRevive()) {
                this.statusClip.index = 2;
            }
            else if (useWebAdApi && zs.laya.platform.ADConfig.enableVideoRevive() && zs.laya.sdk.SdkService.isVideoEnable()) {
                this.statusClip.index = 0;
            }
            else if (useWebAdApi && zs.laya.platform.ADConfig.enableShareRevive()) {
                this.statusClip.index = 1;
            }
            else {
                this.statusClip.index = 3;
            }
        }

        relive() {
            Laya.stage.timerOnce(100, this, function () {
                Laya.stage.event(zs.laya.game.EventId.GAME_RELIVE);
                this.onRelive();
            });
        }

        onContinue() {

        }

        onRelive() {

        }
    }
    Laya.ILaya.regClass(ReplayBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.ReplayBtn", ReplayBtn);
    Laya.ClassUtils.regClass("Zhise.ReplayBtn", ReplayBtn);

    class ReplayNextHomeBtn extends ReplayBtn {
        constructor() {
            super();
        }

        onContinue() {
            zs.laya.game.WebService.endGame(zs.laya.game.WebRequestArgs.reqEndGameArgs());
        }
    }
    Laya.ILaya.regClass(ReplayNextHomeBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.ReplayNextHomeBtn", ReplayNextHomeBtn);
    Laya.ClassUtils.regClass("Zhise.ReplayNextHomeBtn", ReplayNextHomeBtn);

    class AwardBtn extends Laya.Script {

        constructor() {
            super();
        }

        onEnable() {
            this.owner.mouseEnabled = true;
        }

        onClick() {
            Laya.SoundManager.playSound(zs.laya.game.AppMain.appConfig.soundClick);
            this.owner.mouseEnabled = false;
            zs.laya.game.WebService.endGame(zs.laya.game.WebRequestArgs.reqEndGameArgs());
        }
    }
    Laya.ILaya.regClass(AwardBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.AwardBtn", AwardBtn);
    Laya.ClassUtils.regClass("Zhise.AwardBtn", AwardBtn);

    class ExAwardBtn extends AwardBtn {

        constructor() {
            super();
        }

        onClick() {
            Laya.SoundManager.playSound(zs.laya.game.AppMain.appConfig.soundClick);
            this.owner.mouseEnabled = false;
            zs.laya.sdk.SdkService.playVideo(
                Laya.Handler.create(this, function () {
                    zs.laya.game.WebService.endGame(zs.laya.game.WebRequestArgs.reqEndGameArgs());
                }),
                Laya.Handler.create(this, function () {
                    this.owner.mouseEnabled = true;
                }),
                Laya.Handler.create(this, function () {
                    this.owner.mouseEnabled = true;
                    zs.laya.game.UIService.showToast("今日视频观看次数已用尽");
                }));
        }
    }
    Laya.ILaya.regClass(ExAwardBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.ExAwardBtn", ExAwardBtn);
    Laya.ClassUtils.regClass("Zhise.ExAwardBtn", ExAwardBtn);

    class Award2HomeBtn extends AwardBtn {

        constructor() {
            super();
        }

        onClick() {
            zs.laya.game.AppMain.autoStartNext = false;
            super.onClick();
        }
    }
    Laya.ILaya.regClass(Award2HomeBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.Award2HomeBtn", Award2HomeBtn);
    Laya.ClassUtils.regClass("Zhise.Award2HomeBtn", Award2HomeBtn);

    class Award2NextBtn extends AwardBtn {

        constructor() {
            super();
        }

        onClick() {
            zs.laya.game.AppMain.autoStartNext = true;
            super.onClick();
        }
    }
    Laya.ILaya.regClass(Award2NextBtn);
    Laya.ClassUtils.regClass("zs.laya.ui.Award2NextBtn", Award2NextBtn);
    Laya.ClassUtils.regClass("Zhise.Award2NextBtn", Award2NextBtn);

    class ScoreInfo extends Laya.Script {
        constructor() {
            super();
            this.curScore = null;
            this.maxScore = null;
        }

        initScoreInfo(curScore, maxScore) {
            if (this.curScore && curScore != null) {
                this.curScore.text = curScore.toString();
            }
            if (this.maxScore && maxScore != null) {
                this.maxScore.text = maxScore.toString();
            }
        }

        onAwake() {
            this.curScore = this.owner.getChildByName("curScore");
            this.maxScore = this.owner.getChildByName("maxScore");
        }
    }
    Laya.ILaya.regClass(ScoreInfo);
    Laya.ClassUtils.regClass("zs.laya.ui.ScoreInfo", ScoreInfo);
    Laya.ClassUtils.regClass("Zhise.ScoreInfo", ScoreInfo);

    class TickCount extends Laya.Script {
        constructor() {
            super();
            this.running = false;
            this.tickCount = null;
            this.tickCountMask = null;
            this.passedTime = 0;
            this.waitingTime = 5000;
            this.newLeftTime = 0;
            this.leftTime = 0;
            this.endGameData = null;
        }

        onAwake() {
            this.tickCount = this.owner.getChildByName("tickCount");
            var tickCountProgress = this.owner.getChildByName("tickProgress");
            if (tickCountProgress) {
                this.tickCountMask = new Laya.Sprite();
                tickCountProgress.mask = this.tickCountMask;
            }

            this.running = true;
            this.passedTime = 0;
            this.leftTime = this.newLeftTime = this.waitingTime = zs.laya.platform.ADConfig.zs_revive_countdown;
            this.waitingTime *= 1000;
            Laya.stage.on(zs.laya.game.EventId.APP_SHOW, this, this.onAppShow);
            Laya.stage.on(zs.laya.game.EventId.APP_HIDE, this, this.onAppHide);
        }

        onDestroy() {
            Laya.stage.off(zs.laya.game.EventId.APP_SHOW, this, this.onAppShow);
            Laya.stage.off(zs.laya.game.EventId.APP_HIDE, this, this.onAppHide);
        }

        onUpdate() {
            if (this.running == false) {
                return;
            }

            this.passedTime += Laya.timer.delta;
            if (this.passedTime >= this.waitingTime) {
                this.running = false;
                this.owner.event(TickCount.EVENT_UI_TICK_COUNT_COMPLETE)
            }

            this.newLeftTime = Math.floor((this.waitingTime - this.passedTime) * 0.001);
            this.tickCount.changeText(this.newLeftTime.toString());
            if (this.newLeftTime != this.leftTime) {
                this.leftTime = this.newLeftTime;
                if (this.tickCountMask) {
                    this.tickCountMask.graphics.clear(true);
                    this.tickCountMask.graphics.drawPie(140, 140, 140, -90, (this.leftTime * 1000 / this.waitingTime) * 360 - 90, "#ff0000");
                }
            }

        }

        onAppShow() {
            this.running = true;
        }

        onAppHide() {
            this.running = false;
        }
    }
    TickCount.EVENT_UI_TICK_COUNT_COMPLETE = "UI_TICK_COUNT_COMPLETE";
    Laya.ILaya.regClass(TickCount);
    Laya.ClassUtils.regClass("zs.laya.ui.TickCount", TickCount);
    Laya.ClassUtils.regClass("Zhise.TickCount", TickCount);

    class LoadingView extends zs.laya.base.ZhiSeView {

        constructor() {
            super();
        }

        onAwake() {
            super.onAwake();
            var middleUI = this.owner.getChildByName("middleUI");
            var loadingBar = middleUI.getChildByName("loadingBar");
            loadingBar.addComponent(LoadingBar);
        }
    }
    Laya.ILaya.regClass(LoadingView);
    Laya.ClassUtils.regClass("zs.laya.ui.LoadingView", LoadingView);
    Laya.ClassUtils.regClass("Zhise.LoadingView", LoadingView);

    class HomeView extends zs.laya.base.ZhiSeView {
        constructor() {
            super();
        }

        onAwake() {
            super.onAwake();
            var topUI = this.owner.getChildByName("topUI");
            var  storeBtn, startBtn;
            if (topUI) {
                
                storeBtn = topUI.getChildByName("storeBtn");
                startBtn = topUI.getChildByName("startBtn");
            }
            var middleUI = this.owner.getChildByName("middleUI");
            if (middleUI) {
                storeBtn = storeBtn || middleUI.getChildByName("storeBtn");
                startBtn = startBtn || middleUI.getChildByName("startBtn");
            }
            var bottomUI = this.owner.getChildByName("bottomUI");
            if (bottomUI) {
                storeBtn = storeBtn || bottomUI.getChildByName("storeBtn");
                startBtn = startBtn || bottomUI.getChildByName("startBtn");
            }
            var leftUI = this.owner.getChildByName("leftUI");
            if (leftUI) {
                storeBtn = storeBtn || leftUI.getChildByName("storeBtn");
            }
            var rightUI = this.owner.getChildByName("rightUI");
            if (rightUI) {
                storeBtn = storeBtn || rightUI.getChildByName("storeBtn");
            }

            storeBtn && storeBtn.addComponent(StoreBtn);
            startBtn && startBtn.addComponent(StartBtn);
        }
    }
    Laya.ILaya.regClass(HomeView);
    Laya.ClassUtils.regClass("zs.laya.ui.HomeView", HomeView);
    Laya.ClassUtils.regClass("Zhise.HomeView", HomeView);

    class ReliveView extends zs.laya.base.ZhiSeView {

        constructor() {
            super();
            this.replayBtn = null;
            this.jumpBtn = null;
        }

        onAwake() {
            super.onAwake();
            var topUI = this.owner.getChildByName("topUI");
            var middleUI = this.owner.getChildByName("middleUI");
            var bottomUI = this.owner.getChildByName("bottomUI");
            this.replayBtn = bottomUI.getChildByName("replayBtn");
            this.jumpBtn = bottomUI.getChildByName("jumpByShareBtn");
            
            this.replayBtn.addComponent(ReplayNextHomeBtn);
            this.jumpBtn.addComponent(AwardBtn);
        }
    }
    Laya.ILaya.regClass(ReliveView);
    Laya.ClassUtils.regClass("zs.laya.ui.ReliveView", ReliveView);
    Laya.ClassUtils.regClass("Zhise.ReliveView", ReliveView);

    class WinView extends zs.laya.base.ZhiSeView {

        constructor() {
            super();
            this.nextBtn = null;
            this.homeBtn = null;
        }

        initView(data) {
            
        }

        onAwake() {
            super.onAwake();
            var topUI = this.owner.getChildByName("topUI");
            var middleUI = this.owner.getChildByName("middleUI");
            var bottomUI = this.owner.getChildByName("bottomUI");
            this.homeBtn = bottomUI.getChildByName("homeBtn");
            this.nextBtn = bottomUI.getChildByName("nextBtn");
            this.homeBtn.addComponent(Award2HomeBtn);
            this.nextBtn.addComponent(Award2NextBtn);
        }
    }
    Laya.ILaya.regClass(WinView);
    Laya.ClassUtils.regClass("zs.laya.ui.WinView", WinView);
    Laya.ClassUtils.regClass("Zhise.WinView", WinView);

    class MsgBoxView extends zs.laya.base.ZhiSeView {

        constructor() {
            super();
            this.callback = null;
            this.content = null;
            this.confirmBtn = null;
        }

        initView(args) {
            this.content.text = args.content;
            this.callback = args.callback;
        }

        onAwake() {
            super.onAwake();
            var middleUI = this.owner.getChildByName("middleUI");
            this.content = middleUI.getChildByName("content");
            this.confirmBtn = middleUI.getChildByName("confirmBtn");
            this.confirmBtn.on(Laya.Event.CLICK, this, this.onClickConfirm);
        }

        onDestroy() {
            this.confirmBtn.off(Laya.Event.CLICK, this, this.onClickConfirm);
        }

        onClickConfirm() {
            if (this.callback) {
                this.callback.run();
                this.callback = null;
            }
            this.owner.close();
            Laya.SoundManager.playSound(zs.laya.game.AppMain.appConfig.soundClick);
        }
    }
    Laya.ILaya.regClass(MsgBoxView);
    Laya.ClassUtils.regClass("zs.laya.ui.MsgBoxView", MsgBoxView);
    Laya.ClassUtils.regClass("Zhise.MsgBoxView", MsgBoxView);

    class GoodsCatalogue {
        constructor() {
            this.goodsPages = [];
        }
    }

    class StorePage extends zs.laya.base.ZhiSeView {

        constructor() {
            super();
            this.goldNum = null;
            this.closeBtn = null;
            this.typeTab = null;
            this.jumpTag = null;
            this.goodsList = null;
            this.unlockBtn = null;
            this.exchangeBtn = null;
            this.selectItemData = null;
            this.equipCd = false;
            this.buyOrUseCd = false;
            this.exchangeCoinCd = false;
        }

        onEnable() {
            Laya.stage.on(zs.laya.game.EventId.NET_XHR_RESPONSE, this, this.onNetXhrResponse);
        }

        onDisable() {
            Laya.stage.off(zs.laya.game.EventId.NET_XHR_RESPONSE, this, this.onNetXhrResponse);
        }

        onStart() {
            var topUI = this.owner.getChildByName("topUI");
            this.goldNum = topUI.getChildByName("goldNum");
            this.closeBtn = topUI.getChildByName("closeBtn");
            var middleUI = this.owner.getChildByName("middleUI");
            if (!this.closeBtn) {
                this.closeBtn = middleUI.getChildByName("closeBtn");
            }
            this.typeTab = middleUI.getChildByName("typeTab");
            this.goodsList = middleUI.getChildByName("goodsList");
            this.unlockBtn = middleUI.getChildByName("unlockBtn");
            this.exchangeBtn = middleUI.getChildByName("exchangeBtn");

            this.closeBtn.on(Laya.Event.CLICK, this, this.closeStore);
            this.unlockBtn.on(Laya.Event.CLICK, this, this.unlockItemByGold);
            this.exchangeBtn.on(Laya.Event.CLICK, this, this.exchangeCoin);

            this.exchangeBtn.gray = zs.laya.sdk.SdkService.isVideoEnable() == false;

            this.jumpTag = this.owner.getChildByName("jumpTag");

            this.goldNum.text = zs.laya.game.AppMain.playerInfo.gold.toString();
            this.typeTab.selectHandler = Laya.Handler.create(this, this.onSwitchType, null, false);
            this.typeTab.selectedIndex = 0;
            this.goodsList.renderHandler = Laya.Handler.create(this, this.onRenderItem, null, false);
            this.goodsList.hScrollBarSkin = "";

            StorePage.requestStoreData(null);
        }

        onDestroy() {
            this.closeBtn.off(Laya.Event.CLICK, this, this.closeStore);
            this.unlockBtn.off(Laya.Event.CLICK, this, this.unlockItemByGold);
            this.exchangeBtn.off(Laya.Event.CLICK, this, this.exchangeCoin);
        }

        onNetXhrResponse(result, api, params, response) {
            var appMain = zs.laya.game.AppMain;
            if (api == appMain.appConfig.storeCfg.webApi.RequestStoreData) {
                this.onStoreDataReady(response.data);
            }
            else if (api == appMain.appConfig.storeCfg.webApi.RequestEquipItem) {
                this.onEquipedItem(response.data, params.goods_type, params.goods_id);
            }
            else if (api == appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold) {
                if (result == 0) {
                    this.buyOrUseCd = false;
                    return;
                }
                this.onBuyItemByGoldSuccess(response.data, params.goods_type, params.goods_id);
            }
            else if (api == appMain.appConfig.storeCfg.webApi.ExchangeCoin) {
                this.exchangeCoinCd = false;
                if (result == 0) {
                    return;
                }
                this.onExchangeCoinSuccess(response.data);
            }
        }

        onSwitchType(index) {
            if (index == -1) {
                return;
            }
            this.goodsList.repeatY = 1;
            var catelogue = this.storeContent[index].goodsPages;
            var arr = [];
            for (let idx = Math.ceil(catelogue.length / 6); idx > 0; idx--) {
                arr.push(idx);
            }
            this.goodsList.array = arr;
            var itemsInBag = zs.laya.game.AppMain.playerInfo.goods_ids[index];
            var payNum = itemsInBag.length - 1;
            var priceCfg = zs.laya.game.AppMain.storeCfg.shopPrice[index][payNum];
            if (priceCfg.price > 0) {
                this.unlockBtn.gray = priceCfg.price > zs.laya.game.AppMain.playerInfo.gold;
                this.unlockBtn.getChildByName("label").text = priceCfg.price.toString();
            }
            else {
                this.unlockBtn.gray = true;
                this.unlockBtn.getChildByName("label").text = "";
            }
            Laya.stage.event(StorePage.EVENT_SWITCH_TAB, index);
        }

        onSelectItem(data, pageIdx, index) {
            if (this.equipCd) {
                return ;
            }
            if (data == null) {
                return;
            }
            zs.laya.game.AppMain.playerInfo.goods_id[data.goods_type] = data.goods_id;
            this.goodsList.setItem(pageIdx, Date.now());
            Laya.stage.event(StorePage.EVENT_SWITCH_ITEM, [data]);
            StorePage.requestEquipItem({ goods_type: data.goods_type, goods_id: data.goods_id });
        }

        onRenderItem(item, pageIdx) {
            var goodsIdx = pageIdx * zs.laya.game.AppMain.appConfig.storeCfg.pageSize;
            var catelogue = this.storeContent[this.typeTab.selectedIndex].goodsPages;
            var itemsInBag = zs.laya.game.AppMain.playerInfo.goods_ids[this.typeTab.selectedIndex];
            for (let index = 0; index < item.numChildren; index++ , goodsIdx++) {
                const element = item.getChildAt(index);
                var goodsData = goodsIdx < catelogue.length ? catelogue[goodsIdx] : null;
                if (goodsData != null && itemsInBag != null && itemsInBag.indexOf(goodsData.goods_id) >= 0) {
                    this.initGoodsItem(element, goodsData, pageIdx, index);
                }
                else {
                    this.initGoodsItem(element, null, pageIdx, index);
                }
            }
        }

        initGoodsItem(item, goodsData, pageIdx, index) {
            if (goodsData == null) {
                item.getChildByName("bg").index = 1;
                item.getChildByName("icon").visible = false;
                item.off(Laya.Event.CLICK, this, this.onSelectItem);
            }
            else {
                item.getChildByName("bg").index = (goodsData.goods_id == zs.laya.game.AppMain.playerInfo.goods_id[this.typeTab.selectedIndex]) ? 2 : 0;
                item.getChildByName("icon").visible = true;
                item.getChildByName("icon").skin = zs.laya.game.AppMain.appConfig.storeCfg.typeMap[goodsData.goods_type] + "_" + goodsData.goods_id.toString() + ".png";
                item.off(Laya.Event.CLICK, this, this.onSelectItem);
                item.on(Laya.Event.CLICK, this, this.onSelectItem, [goodsData, pageIdx, index]);
            }
        }

        closeStore() {
            this.owner.close();
        }

        unlockItemByGold() {
            if (this.buyOrUseCd) {
                return;
            }
            var itemsInBag = zs.laya.game.AppMain.playerInfo.goods_ids[this.typeTab.selectedIndex];
            var itemsInStore = this.storeContent[this.typeTab.selectedIndex].goodsPages;
            if (itemsInBag.length == itemsInStore.length) {
                return;
            }
            var itemsUnlocked = [];
            for (let index = 0; index < itemsInStore.length; index++) {
                if (itemsInBag.indexOf(itemsInStore[index].goods_id) == -1) {
                    itemsUnlocked.push(itemsInStore[index]);
                }
            }
            var unlockIdx = Math.floor(Math.random() * itemsUnlocked.length);
            var unlockItem = itemsUnlocked[unlockIdx];
            this.buyOrUseCd = true;
            var payNum = itemsInBag.length - 1;
            var priceCfg = zs.laya.game.AppMain.storeCfg.shopPrice[this.typeTab.selectedIndex][payNum];
            StorePage.requestUnlockGoodsByGold({ goods_type: unlockItem.goods_type, goods_id: unlockItem.goods_id, gold: priceCfg.price });
        }

        exchangeCoin() {
            if (this.exchangeCoinCd) {
                return;
            }
            this.exchangeCoinCd = true;
            var self = this;
            zs.laya.sdk.SdkService.playVideo(Laya.Handler.create(null, function () {
                StorePage.requestExchangeCoin({ video_type: 10, gold: zs.laya.game.AppMain.storeCfg.videoCoin });
            }), Laya.Handler.create(null, function () {
                self.exchangeCoinCd = false;
            }), Laya.Handler.create(null, function () {
                self.exchangeCoinCd = false;
                self.exchangeBtn.gray = true;
            }))
        }

        onStoreDataReady(data) {
            this.storeContent = {};
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (this.storeContent[element.goods_type] == null) {
                    this.storeContent[element.goods_type] = new GoodsCatalogue();
                }
                this.storeContent[element.goods_type].goodsPages.push(element);
            }
            this.onSwitchType(this.typeTab.selectedIndex);
        }

        onEquipedItem(data, goods_type, goods_id) {
            var arr = this.storeContent[goods_type].goodsPages;
            for (let index = 0; index < arr.length; index++) {
                if (arr[index].goods_id == goods_id) {
                    arr[index].status = 2;
                }
                else if (arr[index].status == 2) {
                    arr[index].status = 1;
                }
            }
            Laya.stage.event(StorePage.EVENT_ITEM_EQUIPED, [data]);
            this.onSwitchType(this.typeTab.selectedIndex);
        }

        onExchangeCoinSuccess(data) {
            this.exchangeCoinCd = false;
            zs.laya.game.AppMain.playerInfo.gold = data.gold;
            this.goldNum.text = zs.laya.game.AppMain.playerInfo.gold.toString();
        }

        onBuyItemByGoldSuccess(data, goods_type, goods_id) {
            zs.laya.game.AppMain.playerInfo.goods_ids = data.goods_ids;
            zs.laya.game.AppMain.playerInfo.gold = data.gold;
            this.goldNum.text = zs.laya.game.AppMain.playerInfo.gold.toString();
            // fresh list;
            var idx = this.storeContent[goods_type].goodsPages.findIndex((val, index, arr) => { return val.goods_id == goods_id; });
            var goodsData = this.storeContent[goods_type].goodsPages[idx];
            goodsData.status = 1;
            var pageIdx = Math.floor(idx / zs.laya.game.AppMain.appConfig.storeCfg.pageSize);
            var itemIdx = idx % zs.laya.game.AppMain.appConfig.storeCfg.pageSize;
            if (zs.laya.game.AppMain.appConfig.storeCfg.randomEffect == false) {
                this.buyOrUseCd = false;
                this.onSwitchType(this.typeTab.selectedIndex);
                this.onSelectItem(goodsData, pageIdx, itemIdx);
                var self = this;
                this.owner.frameOnce(2, this, function(){
                    self.goodsList.scrollTo(pageIdx);
                });
                return ;
            }
            this.playRandomUnlockEffect(goodsData, pageIdx, itemIdx);
            //this.onSwitchType(this.typeTab.selectedIndex);
            //var idxInBag = data.goods_ids.indexOf(goods_id);
            //this.onSelectItem(goodsData, Math.floor(idxInBag / zs.laya.game.AppMain.appConfig.storeCfg.pageSize), idxInBag % zs.laya.game.AppMain.appConfig.storeCfg.pageSize);
        }

        playRandomUnlockEffect(goodsData, pageIdx, itemIdx) {
            var targetPage = this.goodsList.getCell(pageIdx);
            var unlockNum = 0;
            var startIdx = 0;
            for (let index = 0; index < targetPage.numChildren; index++) {
                var goodsItem = targetPage.getChildAt(index);
                if (goodsItem.getChildByName("icon").visible == false) {
                    unlockNum++;
                    if (startIdx == 0) {
                        startIdx = index - 1;
                    }
                }
            }
            if (unlockNum == 1) {
                this.buyOrUseCd = false;
                this.onSwitchType(this.typeTab.selectedIndex);
                this.onSelectItem(goodsData, pageIdx, itemIdx);
            }
            else {
                this.equipCd = true;
                this.typeTab.mouseEnabled = false;
                this.closeBtn.mouseEnabled = false;
                var repeatNum = Math.floor(zs.laya.game.AppMain.appConfig.storeCfg.pageSize * 2 / unlockNum) + 1;
                this.owner.timerOnce(100, this, this.updateEffect, [goodsData, pageIdx, itemIdx, repeatNum, startIdx]);
            }
        }

        updateEffect(goodsData, pageIdx, itemIdx, repeatNum, curIdx) {
            var targetPage = this.goodsList.getCell(pageIdx);
            var startIdx = (curIdx + 1) % targetPage.numChildren;
            for (let index = startIdx; index < targetPage.numChildren; index++) {
                var goodsItem = targetPage.getChildAt(index);
                if (goodsItem.getChildByName("icon").visible == false) {
                    goodsItem.addChild(this.jumpTag);
                    this.jumpTag.x = 0;
                    this.jumpTag.y = 0;
                    this.jumpTag.visible = true;
                    if (index == itemIdx) {
                        if (repeatNum == 0) {
                            this.buyOrUseCd = false;
                            this.equipCd = false;
                            this.typeTab.mouseEnabled = true;
                            this.closeBtn.mouseEnabled = true;
                            this.jumpTag.visible = false;
                            this.onSwitchType(this.typeTab.selectedIndex);
                            this.onSelectItem(goodsData, pageIdx, itemIdx);
                        }
                        else {
                            this.owner.timerOnce(100, this, this.updateEffect, [goodsData, pageIdx, itemIdx, repeatNum - 1, index]);
                        }
                    }
                    else {
                        this.owner.timerOnce(100, this, this.updateEffect, [goodsData, pageIdx, itemIdx, repeatNum, index]);
                    }
                    break;
                }
            }
        }

        static requestStoreData(args) {
            var webArgs = args || {};
            var appMain = zs.laya.game.AppMain;
            var webService = zs.laya.game.WebService;
            webArgs["user_id"] = appMain.playerInfo.user_id;
            webArgs["timestamp"] = Date.now();
            // if (webService["UseWebApi"]) {
            if (webService["RequestSign"]) {
                zs.laya.XHRUtils.xhrPostWithSignAndHeader(appMain.appConfig.storeCfg.webApi.RequestStoreData, webArgs,
                    webService["RequestSign"], webService["RequestHeader"]);
            }
            else {
                zs.laya.XHRUtils.xhrPost(appMain.appConfig.storeCfg.webApi.RequestStoreData, webArgs);
            }
            console.log(appMain.appConfig.storeCfg.webApi.RequestStoreData);
            // }
            // else {
            //     console.log(appMain.appConfig.storeCfg.webApi.RequestStoreData);
            //     Laya.stage.frameOnce(1, this, function () {
            //         Laya.stage.event(zs.laya.game.EventId.NET_XHR_RESPONSE, [
            //             1,
            //             appMain.appConfig.storeCfg.webApi.RequestStoreData,
            //             webArgs,
            //             { "data": appMain.appConfig.defaultCfg.userInfo }]);
            //     });
            // }
        }

        static requestEquipItem(args) {
            var webArgs = args || {};
            var appMain = zs.laya.game.AppMain;
            var webService = zs.laya.game.WebService;
            webArgs["user_id"] = appMain.playerInfo.user_id;
            webArgs["timestamp"] = Date.now();
            // if (webService["UseWebApi"]) {
            if (webService["RequestSign"]) {
                zs.laya.XHRUtils.xhrPostWithSignAndHeader(appMain.appConfig.storeCfg.webApi.RequestEquipItem, webArgs,
                    webService["RequestSign"], webService["RequestHeader"]);
            }
            else {
                zs.laya.XHRUtils.xhrPost(appMain.appConfig.storeCfg.webApi.RequestEquipItem, webArgs);
            }
            console.log(appMain.appConfig.storeCfg.webApi.RequestEquipItem);
            // }
            // else {
            //     console.log(appMain.appConfig.storeCfg.webApi.RequestEquipItem);
            //     Laya.stage.frameOnce(1, this, function () {
            //         Laya.stage.event(zs.laya.game.EventId.NET_XHR_RESPONSE, [
            //             1,
            //             appMain.appConfig.storeCfg.webApi.RequestEquipItem,
            //             webArgs,
            //             { "data": appMain.appConfig.defaultCfg.userInfo }]);
            //     });
            // }
        }

        static requestExchangeCoin(args) {
            var webArgs = args || {};
            var appMain = zs.laya.game.AppMain;
            var webService = zs.laya.game.WebService;
            webArgs["user_id"] = appMain.playerInfo.user_id;
            webArgs["timestamp"] = Date.now();
            // if (webService["UseWebApi"]) {
            if (webService["RequestSign"]) {
                zs.laya.XHRUtils.xhrPostWithSignAndHeader(appMain.appConfig.storeCfg.webApi.ExchangeCoin, webArgs,
                    webService["RequestSign"], webService["RequestHeader"]);
            }
            else {
                zs.laya.XHRUtils.xhrPost(appMain.appConfig.storeCfg.webApi.ExchangeCoin, webArgs);
            }
            console.log(appMain.appConfig.storeCfg.webApi.ExchangeCoin);
            // }
            // else {
            //     console.log(appMain.appConfig.storeCfg.webApi.ExchangeCoin);
            //     Laya.stage.frameOnce(1, this, function () {
            //         Laya.stage.event(zs.laya.game.EventId.NET_XHR_RESPONSE, [
            //             1,
            //             appMain.appConfig.storeCfg.webApi.ExchangeCoin,
            //             webArgs,
            //             { "data": appMain.appConfig.defaultCfg.userInfo }]);
            //     });
            // }
        }

        static requestUnlockGoodsByGold(args) {
            var webArgs = args || {};
            var appMain = zs.laya.game.AppMain;
            var webService = zs.laya.game.WebService;
            webArgs["user_id"] = appMain.playerInfo.user_id;
            webArgs["timestamp"] = Date.now();
            // if (webService["UseWebApi"]) {
            if (webService["RequestSign"]) {
                zs.laya.XHRUtils.xhrPostWithSignAndHeader(appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold, webArgs,
                    webService["RequestSign"], webService["RequestHeader"]);
            }
            else {
                zs.laya.XHRUtils.xhrPost(appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold, webArgs);
            }
            console.log(appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold);
            // }
            // else {
            //     console.log(appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold);
            //     Laya.stage.frameOnce(1, this, function () {
            //         Laya.stage.event(zs.laya.game.EventId.NET_XHR_RESPONSE, [
            //             1,
            //             appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold,
            //             webArgs,
            //             { "data": appMain.appConfig.defaultCfg.userInfo }]);
            //     });
            // }
        }

        static requestUnlockGoodsByVideo(args) {
            var webArgs = args || {};
            var appMain = zs.laya.game.AppMain;
            var webService = zs.laya.game.WebService;
            webArgs["user_id"] = appMain.playerInfo.user_id;
            webArgs["timestamp"] = Date.now();
            // if (webService["UseWebApi"]) {
            if (webService["RequestSign"]) {
                zs.laya.XHRUtils.xhrPostWithSignAndHeader(appMain.appConfig.storeCfg.webApi.UnlockGoodsByVideo, webArgs,
                    webService["RequestSign"], webService["RequestHeader"]);
            }
            else {
                zs.laya.XHRUtils.xhrPost(appMain.appConfig.storeCfg.webApi.UnlockGoodsByVideo, webArgs);
            }
            console.log(appMain.appConfig.storeCfg.webApi.UnlockGoodsByVideo);
            // }
            // else {
            //     console.log(appMain.appConfig.storeCfg.webApi.UnlockGoodsByVideo);
            //     Laya.stage.frameOnce(1, this, function () {
            //         Laya.stage.event(zs.laya.game.EventId.NET_XHR_RESPONSE, [
            //             1,
            //             appMain.appConfig.storeCfg.webApi.UnlockGoodsByVideo,
            //             webArgs,
            //             { "data": appMain.appConfig.defaultCfg.userInfo }]);
            //     });
            // }
        }
    }
    StorePage.EVENT_SWITCH_TAB = "STORE_SWITCH_TAB";
    StorePage.EVENT_SWITCH_ITEM = "STORE_SWITCH_ITEM";
    StorePage.EVENT_ITEM_EQUIPED = "STORE_ITEM_EQUIPED";
    StorePage.EVENT_ITEM_UNLOCKED = "EVENT_ITEM_UNLOCKED";
    Laya.ILaya.regClass(StorePage);
    Laya.ClassUtils.regClass("zs.laya.ui.StorePage", StorePage);
    Laya.ClassUtils.regClass("Zhise.StorePage", StorePage);

    class NormalStorePage extends zs.laya.base.ZhiSeView {

        constructor() {
            super();
            this.goldNum = null;
            this.closeBtn = null;
            this.typeTab = null;
            this.pageList = null;
            this.goodsList = null;
            this.prePageBtn = null;
            this.nextPageBtn = null;
            this.goldUnlockBtn = null;
            this.videoUnlockBtn = null;
            this.selectItemData = null;
            this.equipCd = false;
            this.buyOrUseCd = false;
            this.selectType = 0;
            this.selectItemIdx = -1;
        }

        onEnable() {
            Laya.stage.on(zs.laya.game.EventId.NET_XHR_RESPONSE, this, this.onNetXhrResponse);
        }

        onDisable() {
            Laya.stage.off(zs.laya.game.EventId.NET_XHR_RESPONSE, this, this.onNetXhrResponse);
        }

        onStart() {
            var topUI = this.owner.getChildByName("topUI");
            this.goldNum = topUI.getChildByName("goldNum");
            this.closeBtn = topUI.getChildByName("closeBtn");
            var middleUI = this.owner.getChildByName("middleUI");
            if (!this.closeBtn) {
                this.closeBtn = middleUI.getChildByName("closeBtn");
            }
            this.prePageBtn = middleUI.getChildByName("prePageBtn");
            this.nextPageBtn = middleUI.getChildByName("nextPageBtn");
            this.typeTab = middleUI.getChildByName("typeTab");
            this.pageList = middleUI.getChildByName("pageList");
            this.goodsList = middleUI.getChildByName("goodsList");
            this.goldUnlockBtn = middleUI.getChildByName("goldUnlockBtn");
            this.videoUnlockBtn = middleUI.getChildByName("videoUnlockBtn");

            this.closeBtn.on(Laya.Event.CLICK, this, this.closeStore);
            this.goldUnlockBtn.on(Laya.Event.CLICK, this, this.unlockItemByGold);
            this.videoUnlockBtn.on(Laya.Event.CLICK, this, this.unlockItemByVideo);
            this.prePageBtn.on(Laya.Event.CLICK, this, this.prePage);
            this.nextPageBtn.on(Laya.Event.CLICK, this, this.nextPage);

            this.goldNum.text = zs.laya.game.AppMain.playerInfo.gold.toString();
            this.typeTab.selectHandler = Laya.Handler.create(this, this.onSwitchType, null, false);
            this.typeTab.selectedIndex = 0;

            this.pageList.renderHandler = Laya.Handler.create(this, this.onRenderPageTag, null, false);

            this.goodsList.renderHandler = Laya.Handler.create(this, this.onRenderItem, null, false);
            this.goodsList.selectHandler = Laya.Handler.create(this, this.onSelectItem, null, false);
            this.goodsList.hScrollBarSkin = "";
            this.goodsList.scrollBar.changeHandler = Laya.Handler.create(this, this.onScrollChanged, null, false);

            this.goldUnlockBtn.visible = false;
            this.videoUnlockBtn.visible = false;

            StorePage.requestStoreData(null);
        }

        onDestroy() {
            this.closeBtn.off(Laya.Event.CLICK, this, this.closeStore);
            this.goldUnlockBtn.off(Laya.Event.CLICK, this, this.unlockItemByGold);
            this.videoUnlockBtn.off(Laya.Event.CLICK, this, this.unlockItemByVideo);
            this.prePageBtn.off(Laya.Event.CLICK, this, this.prePage);
            this.nextPageBtn.off(Laya.Event.CLICK, this, this.nextPage);
        }

        prePage() {
            var curPage = Math.floor(this.goodsList.startIndex / this.goodsList.repeatX);
            var newPage = curPage - 1;
            if (newPage < 0) {
                newPage = 0;
            }
            if (newPage == 0) {
                this.prePageBtn.visible = false;
            }
            if (this.goodsList.totalPage > 1) {
                this.nextPageBtn.visible = true;
            }
            this.goodsList.scrollTo(newPage * this.goodsList.repeatX * this.goodsList.repeatY)
            this.pageList.selectedIndex = newPage;
        }

        nextPage() {
            var curPage = Math.floor(this.goodsList.startIndex / this.goodsList.repeatX);
            var newPage = curPage + 1;
            if (newPage >= this.goodsList.totalPage) {
                newPage = this.goodsList.totalPage - 1;
            }
            if (newPage == this.goodsList.totalPage - 1) {
                this.nextPageBtn.visible = false;
            }
            if (this.goodsList.totalPage > 1) {
                this.prePageBtn.visible = true;
            }
            this.goodsList.scrollTo(newPage * this.goodsList.repeatX * this.goodsList.repeatY)
            this.pageList.selectedIndex = newPage;
        }

        onNetXhrResponse(result, api, params, response) {
            var appMain = zs.laya.game.AppMain;
            if (api == appMain.appConfig.storeCfg.webApi.RequestStoreData) {
                this.onStoreDataReady(response.data);
            }
            else if (api == appMain.appConfig.storeCfg.webApi.RequestEquipItem) {
                this.onEquipedItem(response.data, params.goods_type, params.goods_id);
            }
            else if (api == appMain.appConfig.storeCfg.webApi.UnlockGoodsByGold) {
                if (result == 0) {
                    this.buyOrUseCd = false;
                    return;
                }
                zs.laya.game.AppMain.playerInfo.gold = response.data.gold;
                this.goldNum.text = zs.laya.game.AppMain.playerInfo.gold.toString();  
                if (zs.laya.game.AppMain.playerInfo.goods_ids[params.goods_type].indexOf(params.goods_id) == -1) {
                    zs.laya.game.AppMain.playerInfo.goods_ids[params.goods_type].push(params.goods_id);
                }
                console.log("goods_ids: " + JSON.stringify(zs.laya.game.AppMain.playerInfo.goods_ids));
                this.freshGoodsList(response.data, params.goods_type, params.goods_id);
                Laya.stage.event(StorePage.EVENT_ITEM_UNLOCKED);
            }
            else if (api == appMain.appConfig.storeCfg.webApi.UnlockGoodsByVideo) {
                this.exchangeCoinCd = false;
                if (result == 0) {
                    return;
                } 
                if (zs.laya.game.AppMain.playerInfo.goods_ids[params.goods_type].indexOf(params.goods_id) == -1) {
                    zs.laya.game.AppMain.playerInfo.goods_ids[params.goods_type].push(params.goods_id);
                }
                console.log("goods_ids: " + JSON.stringify(zs.laya.game.AppMain.playerInfo.goods_ids));
                this.freshGoodsList(response.data, params.goods_type, params.goods_id);
                Laya.stage.event(StorePage.EVENT_ITEM_UNLOCKED);
            }
        }

        unlockItemByGold() {
            if (this.buyOrUseCd) {
                return;
            }
            this.buyOrUseCd = true;
            var goodItemData = this.goodsList.array[this.goodsList.selectedIndex];
            StorePage.requestUnlockGoodsByGold({ goods_type: goodItemData.goods_type, goods_id: goodItemData.goods_id, gold: goodItemData.gold });
        }

        unlockItemByVideo() {
            if (this.buyOrUseCd) {
                return;
            }
            this.buyOrUseCd = true;
            var goodItemData = this.goodsList.array[this.goodsList.selectedIndex];
            zs.laya.sdk.SdkService.playVideo(
                Laya.Handler.create(this, function (){
                    StorePage.requestUnlockGoodsByVideo({ goods_type: goodItemData.goods_type, goods_id: goodItemData.goods_id });
                }),
                Laya.Handler.create(this,function (){
                    this.buyOrUseCd = false;
                }),
                Laya.Handler.create(this,function (){
                    zs.laya.game.UIService.showToast("今日视频观看次数已用尽");
                    this.buyOrUseCd = false;
                })
            );
        }

        onStoreDataReady(data) {
            this.storeContent = {};
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (this.storeContent[element.goods_type] == null) {
                    this.storeContent[element.goods_type] = new GoodsCatalogue();
                }
                this.storeContent[element.goods_type].goodsPages.push(element);
            }
            this.onSwitchType(this.typeTab.selectedIndex);
        }

        onEquipedItem(data, goods_type, goods_id) {
            zs.laya.game.AppMain.playerInfo.goods_id[goods_type] = goods_id;
            var arr = this.storeContent[goods_type].goodsPages;
            var preEquipedIdx = -1;
            var curEquipedIdx = -1;
            for (let index = 0; index < arr.length; index++) {
                if (arr[index] == null) {
                    continue ;
                }
                else if (arr[index].goods_id == goods_id) {
                    arr[index].status = 2;
                    curEquipedIdx = index;
                }
                else if (arr[index].status == 2) {
                    arr[index].status = 1;
                    preEquipedIdx = index;
                }
            }
            Laya.stage.event(StorePage.EVENT_ITEM_EQUIPED, [arr[curEquipedIdx]]);
            this.onSwitchType2(goods_type, preEquipedIdx, curEquipedIdx);
        }

        freshGoodsList(data, goods_type, goods_id) {
            var arr = this.storeContent[goods_type].goodsPages;
            for (let index = 0; index < arr.length; index++) {
                if (arr[index] == null) {
                    continue;
                }
                else if (arr[index].goods_id == goods_id) {
                    arr[index].status = 2;
                }
                else if (arr[index].status == 2) {
                    arr[index].status = 1;
                }
            }
            // fresh list;
            var idx = this.storeContent[goods_type].goodsPages.findIndex((val, index, arr) => { return val.goods_id == goods_id; });
            var goodsData = this.storeContent[goods_type].goodsPages[idx];
            goodsData.status = 1;
            this.buyOrUseCd = false;
            this.onSwitchType(this.typeTab.selectedIndex);
            this.selectedIndex = idx; 
        }
        
        onSwitchType(index) {
            if (index == -1) {
                return;
            }
            var catelogue = this.storeContent[index].goodsPages;
            var pageSize = this.goodsList.repeatY * this.goodsList.repeatX;
            var emptyCellNum = pageSize - (catelogue.length % pageSize);
            for (let index = 0; emptyCellNum < pageSize && index < emptyCellNum; index++) {
                catelogue.push(null);
            }
            this.goodsList.array = catelogue;
            this.goodsList.selectedIndex = -1;
            this.goodsList.scrollTo(0);
            if (this.totalPage > 1) {
                this.nextPageBtn.visible = true;
            }
            else {
                this.nextPageBtn.visible = false;
            }
            this.prePageBtn.visible = true;
            var arr = [];
            for (let index = 0; index < this.goodsList.totalPage; index++) {
                arr.push(index);
            }
            this.pageList.array = arr;
            this.pageList.selectedIndex = this.goodsList.page;
            Laya.stage.event(StorePage.EVENT_SWITCH_TAB, index);
        }
        
        onSwitchType2(type, preEquipedIdx, curEquipedIdx) {
            if (this.typeTab.selectedIndex != type) {
                return;
            }
            var catelogue = this.storeContent[type].goodsPages;
            if (preEquipedIdx >= 0) {
                var goodsData = catelogue[preEquipedIdx];
                goodsData.time = Date.now();
                this.goodsList.setItem(preEquipedIdx, goodsData);
            }
            if (curEquipedIdx >= 0) {
                var goodsData = catelogue[curEquipedIdx];
                goodsData.time = Date.now();
                this.goodsList.setItem(curEquipedIdx, goodsData);
            }
        }

        onSelectItem(index) {
            if (this.equipCd) {
                return ;
            }

            console.log("SelectItem:" + index);

            var goodsData = this.goodsList.array[index];
            var preItemIdx = this.selectItemIdx;
            var preItemData = this.goodsList.array[preItemIdx];
            this.selectItemIdx = index;
            if (preItemData != null) {
                preItemData.time = Date.now();
                this.goodsList.setItem(preItemIdx, preItemData);
            }
            if (goodsData != null) {
                goodsData.time = Date.now();
                this.selectType = goodsData.goods_type;
                this.goodsList.setItem(this.selectItemIdx, goodsData);
            }
            else {
                this.goldUnlockBtn.visible = false;
                this.videoUnlockBtn.visible = false;
                this.selectType = -1;
                return ;
            }
            if (goodsData.status == 1 && goodsData.is_use == 1) {
                // 装备
                Laya.stage.event(StorePage.EVENT_SWITCH_ITEM, [goodsData]);
                StorePage.requestEquipItem({ goods_type: goodsData.goods_type, goods_id: goodsData.goods_id });
                this.goldUnlockBtn.visible = false;
                this.videoUnlockBtn.visible = false;
            }
            else if (goodsData.status == 0) {
                // 购买
                if (goodsData.buy_type == 2) {
                    this.goldUnlockBtn.visible = true;
                    this.goldUnlockBtn.getChildByName("price").text = goodsData.gold.toString();
                    this.videoUnlockBtn.visible = false;
                    this.goldUnlockBtn.gray = goodsData.gold > zs.laya.game.AppMain.playerInfo.gold;
                }
                else if (goodsData.buy_type == 3){
                    this.goldUnlockBtn.visible = false;
                    this.videoUnlockBtn.visible = true;
                    this.videoUnlockBtn.gray = !zs.laya.sdk.SdkService.isVideoEnable();
                }
            }
            else {
                this.goldUnlockBtn.visible = false;
                this.videoUnlockBtn.visible = false;
            }
        }

        onRenderItem(item, index) {
            var goodsData = this.goodsList.array[index];
            if (goodsData == null) {
                item.getChildByName("bg").index = 0;
                item.getChildByName("jumpTag").visible = false;
                item.getChildByName("icon").visible = false;
                return ;
            }
            
            if (goodsData.status == 0) {
                item.getChildByName("bg").index = 1;
            }
            else if (goodsData.status == 2) {
                item.getChildByName("bg").index = 2;
            }
            else {
                item.getChildByName("bg").index = 0;
            }
            if (this.selectType == goodsData.goods_type && this.selectItemIdx == index) {
                item.getChildByName("jumpTag").visible = true;
            }
            else {
                item.getChildByName("jumpTag").visible = false;
            }
            item.getChildByName("icon").visible = true;
            item.getChildByName("icon").skin = zs.laya.game.AppMain.appConfig.storeCfg.typeMap[goodsData.goods_type] + goodsData.goods_icon + ".png";
        }

        onRenderPageTag(item, pageIdx) {
            item.index = pageIdx == this.pageList.selectedIndex ? 1 : 0;
        }

        onScrollChanged(val) {
            if (this.goodsList.array == null) {
                return ;
            }
            var curPage = Math.floor(this.goodsList.startIndex / this.goodsList.repeatX);
            if (curPage == 0) {
                this.prePageBtn.visible = false;
                this.nextPageBtn.visible = true;
            }
            else if (curPage == this.goodsList.totalPage - 1) {
                this.prePageBtn.visible = true;
                this.nextPageBtn.visible = false;
            }
            else {
                this.prePageBtn.visible = true;
                this.nextPageBtn.visible = true;
            }
            this.pageList.selectedIndex = curPage;
        }

        closeStore() {
            this.owner.close();
        }
    }
    Laya.ILaya.regClass(NormalStorePage);
    Laya.ClassUtils.regClass("zs.laya.ui.NormalStorePage", NormalStorePage);
    Laya.ClassUtils.regClass("Zhise.NormalStorePage", NormalStorePage);

    exports.LoadingBar = LoadingBar;
    exports.MsgBoxComp = MsgBoxComp;
    exports.StartBtn = StartBtn;
    exports.StoreBtn = StoreBtn;
    exports.ReplayBtn = ReplayBtn;
    exports.ReplayNextHomeBtn = ReplayNextHomeBtn;
    exports.AwardBtn = AwardBtn;
    exports.ExAwardBtn = ExAwardBtn;
    exports.Award2HomeBtn = Award2HomeBtn;
    exports.Award2NextBtn = Award2NextBtn;
    exports.TickCount = TickCount;
    exports.LoadingView = LoadingView;
    exports.HomeView = HomeView;
    exports.ReliveView = ReliveView;
    exports.WinView = WinView;
    exports.MsgBoxView = MsgBoxView;
    exports.StorePage = StorePage;
    exports.NormalStorePage = NormalStorePage;
}(window.zs.laya.ui = window.zs.laya.ui || {}, Laya));