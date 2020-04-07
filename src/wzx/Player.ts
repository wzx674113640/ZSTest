import EventId = zs.laya.game.EventId;
import RunwayControl from "./RunwayControl";
import Game, { GameState } from "./Game";
import BasePlayer, { SpeedState } from "./BasePlayer";

export default class Player extends BasePlayer {
   
    private dis: number = 0;
    private moveIndex: number = 1;
    private startTouch: number = 1;
    private isDown:boolean = false;
    private startPosX: number;
    private speedParticle: Laya.ShuriKenParticle3D;
    private particleofferPos:Laya.Vector3 = new Laya.Vector3();
    private particlePos: Laya.Vector3 = new Laya.Vector3();
    constructor() { super(); }
    
    onStart()
    {
        super.onStart();
        this.speedParticle = this.owner.parent.getChildByName("speedParticle") as Laya.ShuriKenParticle3D;
        Laya.Vector3.subtract(this.owner.transform.position,this.speedParticle.transform.position,this.particleofferPos);
        this.dis = RunwayControl.getInstance().RunwayPrefabs.transform.scale.z;
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,(event)=>
        {
            this.isDown = true;
            this.startTouch = event.stageX;
            this.startPosX = this.owner.transform.localPositionX;
            this.speedState = SpeedState.addSpeed;
            this.speedParticle.particleSystem.play(); 
        })
        
        Laya.stage.on(Laya.Event.MOUSE_UP,this,(event)=>
        {
            this.isDown = false;
            this.startPosX = 0;
            this.startTouch = 0;
            this.speedState = SpeedState.normal;
            this.speedParticle.particleSystem.stop(); 
        })

        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,(event)=>
        {   
            if(!this.isDown || Game.getInstance().MyGameState != GameState.Gameing)
                return;
            
            let offtouch = event.stageX - this.startTouch;
            this.owner.transform.localPositionX = (this.startPosX - offtouch/150);
        });
    }

    onUpdate()
    {
      
        super.onUpdate();
        Laya.Vector3.subtract(this.owner.transform.position,this.particleofferPos,this.particlePos);
        this.speedParticle.transform.position = this.particlePos;
       
        if(this.owner.transform.localPositionZ >= (this.moveIndex * this.dis - this.dis/2 + 5) )
        {
            this.moveIndex++;
            RunwayControl.getInstance().CreatorRunway();
        }   
    }
    
    Reset()
    {
        super.Reset();
        this.moveIndex = 1;
    }

    onTriggerEnter(other:Laya.PhysicsComponent)
    {
        super.onTriggerEnter(other);
        if(other.owner.name == "Fnish")
        {
            //Game.getInstance().onGameWin();
        }
    }
}