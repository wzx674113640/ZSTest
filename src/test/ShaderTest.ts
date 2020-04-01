import { DyqqMaterial } from "../render/material/DyqqMaterial";

export default class ShaderTest extends Laya.Script {
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    private testMaterial: DyqqMaterial;
    private totalTime: number = 4000;
    private curTime: number = 0;
    
    constructor() { super(); }
    
    onEnable(): void {
    }

    onDisable(): void {
    }

    onStart() {
        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChildAt(new Laya.Scene3D(), 0) as Laya.Scene3D;

        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 3, 3));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        //添加方向光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));

        //添加自定义模型
        var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        var material = new DyqqMaterial();
        Laya.loader.load(["res/layabox.png", "res/clip_replay_btn.png"], Laya.Handler.create(null, function() {
            material.BaseTextureSrc = Laya.loader.getRes("res/layabox.png") as Laya.BaseTexture;
            material.BaseTextureDst = Laya.loader.getRes("res/clip_replay_btn.png") as Laya.BaseTexture;
            material.alpha = 0.1;
        }));
        box.meshRenderer.material = material;
        this.testMaterial = material;
    }

    onUpdate() {
        if (this.testMaterial == null) {
            return ;
        }
        this.curTime += Laya.timer.delta;
        if (this.curTime > this.totalTime) {
            this.curTime -= this.totalTime;
        }
        var percent = this.curTime / this.totalTime;
        if (percent < 0.5) {
            this.testMaterial.alpha = percent * 2;
        }
        else {
            this.testMaterial.alpha = 1 - (percent - 0.5) * 2;
        }
    }
}