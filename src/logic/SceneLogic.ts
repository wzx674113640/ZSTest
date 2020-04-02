import { DyqqMaterial } from "../render/material/DyqqMaterial";

export default class SceneLogic extends Laya.Script {
    private Scene:Laya.Scene3D;
    private Cube:Laya.Sprite3D;
    owner
    constructor() { super(); }
    
    onStart()
    {
        this.Scene = this.owner as Laya.Scene3D;
        this.Cube = this.Scene.getChildByName("Cube") as Laya.Sprite3D;
        var material = new DyqqMaterial();
        Laya.loader.load(["res/layabox.png", "res/clip_replay_btn.png"], Laya.Handler.create(null, function() {
            material.BaseTextureSrc = Laya.loader.getRes("res/layabox.png") as Laya.BaseTexture;
            material.BaseTextureDst = Laya.loader.getRes("res/clip_replay_btn.png") as Laya.BaseTexture;
            material.alpha = 0.1;
        }));
        (this.Cube as Laya.MeshSprite3D).meshRenderer.material = material;
    }

    onUpdate()
    {
        this.Cube.transform.rotate(new Laya.Vector3(0, 2, 0), false, false);
    }
    
    onEnable(): void {
    }

    onDisable(): void {
    }

    wakeup(): void {
    }

    sleep(): void {
    }
}