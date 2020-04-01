import EventId = zs.laya.game.EventId;

export default class GamePlayUI extends Laya.Script {
    
    /** @prop {name:goldLabel,type:Node}*/
    public goldLabel:Laya.Label;
    /** @prop {name:otherLabel,type:Node}*/
    public otherLabel:Laya.Label;
    /** @prop {name:scoreLabel,type:Node}*/
    public scoreLabel:Laya.Label;
    
    constructor() { super(); }

    onEnable(): void {
        super.onEnable();
        this.goldLabel.text = zs.laya.game.AppMain.playerInfo.gold.toString();
        //Laya.stage.event(EventId.GAME_START);
        // Laya.stage.on(EventId.EGG_GET_AWARD,this,this.onGetEggReward);
    }

    onDisable(): void {
        super.onDisable();
    }

    
    onClick() {
        // zs.laya.game.UIService.showKnockEggView();
        let random:number = Math.round(Math.random()*10);
        if(random < 5){
            Laya.stage.event(EventId.GAME_FAILED);
        }else{
            Laya.stage.event(EventId.GAME_WIN);
        }        
    }

    // onGetEggReward(){
    //     let random:number = Math.round(Math.random()*10);
    //     if(random < 5){
    //         Laya.stage.event(EventId.GAME_FAILED);
    //     }else{
    //         Laya.stage.event(EventId.GAME_WIN);
    //     }
    // }
}