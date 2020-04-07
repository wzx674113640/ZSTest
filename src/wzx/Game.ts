import EventId = zs.laya.game.EventId;
import BasePlayer from "./BasePlayer";
export enum GameState
{
    GameReady,
    Gameing,
    GameOver,
    GamePass
}

export default class Game extends Laya.Script
{
    private static instance: Game = null;
    public static getInstance()
    {
        if(this.instance == null )
        {
            this.instance = new Game();
        }
        return this.instance;
    }
    public MyGameState: GameState = GameState.GameReady;

    public AIPlayerList: Array<Laya.MeshSprite3D> = new Array<Laya.MeshSprite3D>();
    public Player: Laya.MeshSprite3D;
    constructor()
    {
        super();
        Laya.stage.on(EventId.GAME_PREPARE, this, this.onGamePrepare);
        //Laya.stage.on(EventId.GAME_WIN, this, this.onGameWin);
    }

    onGamePrepare()
    {
        this.MyGameState = GameState.Gameing;
    }

    GamePass()
    {
        this.MyGameState = GameState.GamePass;
    }
}