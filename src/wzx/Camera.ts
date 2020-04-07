export default class Camera extends Laya.Script3D {
    private Player:Laya.Sprite3D;
    private offerPos: Laya.Vector3 = new Laya.Vector3();
    private myPos:Laya.Vector3 = new Laya.Vector3();
    private myPosLerp:Laya.Vector3 = new Laya.Vector3();
    owner : Laya.Sprite3D;
    constructor() { super(); }

    onStart()
    {
        this.Player = this.owner.parent.getChildByName("Player") as Laya.Sprite3D;
        Laya.Vector3.subtract(this.Player.transform.position,this.owner.transform.position,this.offerPos);
    }   

    onUpdate()
    {
        Laya.Vector3.subtract(this.Player.transform.position,this.offerPos,this.myPos);
        
        Laya.Vector3.lerp(this.owner.transform.position,this.myPos,0.1,this.myPosLerp);
        
        this.owner.transform.position = this.myPosLerp;
    }
}
