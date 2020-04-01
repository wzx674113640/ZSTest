import ObjectPool = zs.laya.ObjectPool;
import EventId = zs.laya.game.EventId;
import SceneLogic from "./SceneLogic";
import DyqqShader from "../render/shader/DyqqShader";
import ShaderTest from "../test/ShaderTest";
import WebRequestArgs = zs.laya.game.WebRequestArgs;
import AppMain = zs.laya.game.AppMain;
export default class GameLogic extends zs.laya.game.AppMain {
    
    constructor() {super()}
    
    onAwake() {
        super.onAwake();

        zs.laya.game.UIService.viewScript.store = zs.laya.ui.NormalStorePage;
        
        // WebRequestArgs.Instance.reqStartGameArgs = function(){
        //     return {level_id: 0};
        // }
        // WebRequestArgs.Instance.reqEndGameArgs = function(){
        //     return {level_id: 0, gold: 0, is_win:this.isWin?1:0};
        // }
        
        Laya.stage.once(EventId.LAUNCH_COMPLETED, this, this.onGameLaunchReady);
        Laya.stage.on(EventId.UI_VIEW_CLOSED, this, this.onViewClosed);
        Laya.stage.on(EventId.UI_VIEW_OPENED, this, this.onViewOpened);
    }

    onDestroy() {
        this.sceneLogic = null;
        Laya.stage.off(EventId.UI_VIEW_CLOSED, this, this.onViewClosed);
        Laya.stage.off(EventId.UI_VIEW_OPENED, this, this.onViewOpened);
    }

    private sceneLogic: SceneLogic = null;
    private onGameLaunchReady(s: Laya.Scene3D) {
		DyqqShader.initShader();
        ObjectPool.ClearCache();
        
        if (s) {
            this.sceneLogic = Laya.stage.addChildAt(s, 0).addComponent(SceneLogic);
        }
        else {
            Laya.stage.addComponent(ShaderTest);
        }
        Laya.stage.event(EventId.GAME_HOME);
    }

    private onViewClosed(viewName: string) {
        console.log(`${viewName} closed`);
    }
    
    private onViewOpened(viewName: string) {
        console.log(`${viewName} opened`);
    }
}