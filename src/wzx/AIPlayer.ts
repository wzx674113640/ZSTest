import Game, { GameState } from "./Game";
import BasePlayer from "./BasePlayer";

enum State
{
    Normal = 1,
    Left,
    Right,
}



export default class AIPlayer extends BasePlayer
{
    private myState: State;
    private lRSpeed:number = 0.03;
    private lRTimer = 0.5;
    private lRCoolTimer = 0.5;
    private normalTimer = 0;
    private minNormalTimer = 2;
    private maxNormalTimer = 5;
    
    private _minSpeed = 0;
    constructor()
    {
        super();
    }

    onStart()
    {
        super.onStart();
        
        this.myState = State.Normal;
        this.normalTimer = this.randomMintoMax(this.minNormalTimer,this.maxNormalTimer);
        this._minSpeed = 0.15;
        this.maxSpeed = 0.28; 
        this.minSpeed = this.randomMintoMax(this._minSpeed,this.maxSpeed);
    }

    randomMintoMax(min:number,max:number)
    {
        return Math.random() * (max - min) + min;
    }
    
    onUpdate()
    {
        super.onUpdate();
        if(Game.getInstance().MyGameState == GameState.Gameing)
        {
            switch(this.myState)
            {
                case State.Normal:
                    this.normalMove();
                    break;
                case State.Left:
                    this.leftMove();
                    break;
                case State.Right:
                    this.rightMove();
                    break;
            }
        }
    }

    normalMove()
    {
       this.normalTimer -= Laya.timer.delta/1000;
       if(this.normalTimer < 0)
       {
            this.normalTimer = this.randomMintoMax(this.minNormalTimer,this.maxNormalTimer);
            this.minSpeed = this.randomMintoMax(this._minSpeed,this.maxSpeed);
            this.randomState();
       }
    }

    leftMove()
    {
        this.lRTimer -= Laya.timer.delta/1000;
        if(this.lRTimer < 0)
        {
            this.lRTimer = this.lRCoolTimer;
            this.myState = State.Normal;
        }
        this.owner.transform.translate(new Laya.Vector3(-this.lRSpeed,0,0));
    }

    rightMove()
    {
        this.lRTimer -= Laya.timer.delta/1000;
        if(this.lRTimer < 0)
        {
            this.lRTimer = this.lRCoolTimer;
            this.myState = State.Normal;
        }
        this.owner.transform.translate(new Laya.Vector3(this.lRSpeed,0,0));
    }


    randomState()
    {
        var random = Math.floor(Math.random() * 3);
        switch(random)
        {
            case 0:
                this.myState = State.Normal;
                break;
            case 1:
                this.myState = State.Left;
                break;
            case 2: 
                this.myState = State.Right;
                break;
        }
    }
}