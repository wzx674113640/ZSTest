
import Player from "../wzx/Player";
import RunwayControl from "../wzx/RunwayControl";
import Camera from "../wzx/Camera";
import AIPlayer from "../wzx/AIPlayer";
import Game from "../wzx/Game";

export default class SceneLogic extends Laya.Script {
    private Scene:Laya.Scene3D;
    private Player:Laya.MeshSprite3D;
    private Runway:Laya.MeshSprite3D;
    private Camrea:Laya.Sprite3D;
    owner;
    constructor() { super(); }
    
    onStart()
    {
        this.Scene = this.owner as Laya.Scene3D;
        this.Player = this.Scene.getChildByName("Player") as Laya.MeshSprite3D;
        this.Runway = this.Scene.getChildByName("Runway") as Laya.MeshSprite3D;
        this.Camrea = this.Scene.getChildByName("Main Camera") as Laya.Sprite3D;
        RunwayControl.getInstance().SetRunwayPrefabs(this.Runway);
        RunwayControl.getInstance().Init();
        Game.getInstance().Player = this.Player;
        this.CloneAIPlayer();
        this.addComponent();
        this.loadSkyBox();
        this.loadFog();
    }

    addComponent()
    {
        this.Player.addComponent(Player);
        this.Camrea.addComponent(Camera);
    }

    CloneAIPlayer()
    {
        var playerPos = this.Player.transform.position;
        var disz = 1;
        var runWidth = this.Runway.transform.scale.x - this.Player.transform.scale.x;
        var posList = 
        [
            new Laya.Vector3(-runWidth/2,playerPos.y,playerPos.z),
            new Laya.Vector3(-runWidth/4,playerPos.y,playerPos.z + disz),
            new Laya.Vector3(0,playerPos.y,playerPos.z + 2 * disz),
            new Laya.Vector3(runWidth/4,playerPos.y,playerPos.z + disz),
            new Laya.Vector3(runWidth/2,playerPos.y,playerPos.z),
        ]
        
        for(var i = 0; i < 5; i++)
        {
            var car = this.Player.clone() as Laya.MeshSprite3D;
            this.Scene.addChild(car);
            car.transform.position = posList[i];
            car.addComponent(AIPlayer);
            Game.getInstance().AIPlayerList.push(car);
        }
    }

    loadSkyBox()
    {
        var self = this;
        Laya.BaseMaterial.load("res/atlas/SkyBox/skyMaterial.lmat", Laya.Handler.create(self, function (mat: Laya.SkyBoxMaterial): void {
            var camera = self.Scene.getChildByName("Main Camera") as Laya.Camera;
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            var skyRenderer: Laya.SkyRenderer = self.Scene.skyRenderer;
            skyRenderer.mesh = Laya.SkyBox.instance;
            skyRenderer.material = mat;
        }))
    }

    loadFog()
    {
        var scene = this.Scene
        scene.ambientColor = new Laya.Vector3(0.94, 0.40, 0.52);
        // 雾化代码
        scene.enableFog = true;
        // 设置雾化的颜色
        scene.fogColor = new Laya.Vector3(0.96, 0.62, 0.70);
        // 设置雾化的起始位置，相对于相机的距离
        scene.fogStart = 20;
        // 设置雾化最浓处的距离。
        scene.fogRange = 60;
    }
}