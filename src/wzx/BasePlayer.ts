import RunwayControl from "./RunwayControl";
import Game, { GameState } from "./Game";

export enum SpeedState{
    normal = 1,
    addSpeed,
    stop,
}

export default class BasePlayer extends Laya.Script3D
{
    public speedState:SpeedState ;
    protected maxSpeed:number = 0.25;
    protected minSpeed:number = 0.1;
    protected mySpeed:number = 0;
    protected addSpeed:number = 0.005;
    protected startPos: Laya.Vector3;
    protected maxDisX:number;
    public owner : Laya.Sprite3D;
   

    onStart()
    {
        this.speedState = SpeedState.normal;
        this.mySpeed = this.minSpeed;
        this.startPos = this.owner.transform.position;
        this.maxDisX = (RunwayControl.getInstance().RunwayPrefabs.transform.scale.x - this.owner.transform.scale.x)/2;
    }
    
    onUpdate()
    {
       if(Game.getInstance().MyGameState == GameState.GameReady)
            return;
        this.limit();
        this.owner.transform.translate(new Laya.Vector3(0,0,this.mySpeed));
        switch(this.speedState)
        {
            case SpeedState.normal:
                if(Game.getInstance().MyGameState == GameState.Gameing)
                {
                    this.AttainSpeed(this.minSpeed);
                }
                break;
            case SpeedState.addSpeed:
                if(Game.getInstance().MyGameState == GameState.Gameing)
                {
                    this.AttainSpeed(this.maxSpeed);
                }
                break;
            case SpeedState.stop:
                this.AttainSpeed(0);
                break;
        }    
    }

    UpdateState()
    {
        switch(Game.getInstance().MyGameState)
        {
            case GameState.GamePass:
                this.AttainSpeed(0);
                break;
            case GameState.Gameing:
                break;
            case GameState.GameOver:
                break;
            case GameState.GameReady:
                break;
        }
    }

    // 限制车子左右距离
    private limit()
    {
        if(this.owner.transform.localPositionX > this.maxDisX)
        {
            this.owner.transform.localPositionX = this.maxDisX;
        }
        if(this.owner.transform.localPositionX < -this.maxDisX)
        {
            this.owner.transform.localPositionX = -this.maxDisX;
        }
    }

    /**
     * 重置赛车位置
     */
    Reset()
    {   
        this.owner.transform.position = this.startPos;
    }

    /**
     * 加速或者减速
     * @param speed //需要达到的目标速度
     */

    AttainSpeed(speed)
    {
        if(this.mySpeed < speed)
        {
            this.mySpeed += this.addSpeed;
        }
        else if(this.mySpeed > speed) 
        {
            this.mySpeed -= this.addSpeed;
        }
        if(this.mySpeed < 0.01)
        {
            this.mySpeed = 0;
        }
    }
    
    onTriggerEnter(other:Laya.PhysicsComponent)
    {
        if(other.owner.name == "Fnish")
        {
            this.speedState = SpeedState.stop;
            Game.getInstance().GamePass();
        }
    }
}