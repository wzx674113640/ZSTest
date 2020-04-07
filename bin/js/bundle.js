(function () {
    'use strict';

    class DyqqShader {
        static get ShaderName() {
            return "DyqqShader";
        }
        static initShader() {
            let attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            let uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_BaseTextureSrc': Laya.Shader3D.PERIOD_MATERIAL,
                'u_BaseTextureDst': Laya.Shader3D.PERIOD_MATERIAL,
                'u_alpha': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let vs = `
            attribute vec4 a_Position;
            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            attribute vec2 a_Texcoord;
            attribute vec3 a_Normal;
            varying vec3 v_Normal;
            varying vec2 v_Texcoord;
            void main()
            {
                gl_Position = u_MvpMatrix * a_Position;
                mat3 worldMat=mat3(u_WorldMat);
                v_Normal=worldMat*a_Normal;
                v_Texcoord = a_Texcoord;
            }`;
            let ps = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            varying vec3 v_Normal;
            varying vec2 v_Texcoord;
            uniform sampler2D u_BaseTextureSrc;
            uniform sampler2D u_BaseTextureDst;
            uniform float u_alpha;
            void main()
            {
                vec4 srcColor = texture2D(u_BaseTextureSrc,v_Texcoord);
                vec4 desColor = texture2D(u_BaseTextureDst,v_Texcoord);
                srcColor = srcColor * u_alpha;
                float destAlpha = 1.0 - u_alpha;
                desColor = desColor * destAlpha;
                gl_FragColor=srcColor + desColor;
            }`;
            let customShader = Laya.Shader3D.add(DyqqShader.ShaderName);
            let subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class DyqqMaterial extends Laya.BaseMaterial {
        constructor() {
            super();
            this.setShaderName(DyqqShader.ShaderName);
        }
        get BaseTextureSrc() {
            return this._shaderValues.getTexture(DyqqMaterial.u_BaseTextureSrc);
        }
        set BaseTextureSrc(value) {
            if (value)
                this._defineDatas["add"](DyqqMaterial.u_BaseTextureSrc);
            else
                this._defineDatas["remove"](DyqqMaterial.u_BaseTextureSrc);
            this._shaderValues.setTexture(DyqqMaterial.u_BaseTextureSrc, value);
        }
        get BaseTextureDst() {
            return this._shaderValues.getTexture(DyqqMaterial.u_BaseTextureDst);
        }
        set BaseTextureDst(value) {
            if (value)
                this._defineDatas["add"](DyqqMaterial.u_BaseTextureDst);
            else
                this._defineDatas["remove"](DyqqMaterial.u_BaseTextureDst);
            this._shaderValues.setTexture(DyqqMaterial.u_BaseTextureDst, value);
        }
        get alpha() {
            return this._shaderValues.getNumber(DyqqMaterial.u_alpha);
        }
        set alpha(value) {
            this._shaderValues.setNumber(DyqqMaterial.u_alpha, value);
        }
    }
    DyqqMaterial.u_BaseTextureSrc = Laya.Shader3D.propertyNameToID("u_BaseTextureSrc");
    DyqqMaterial.u_BaseTextureDst = Laya.Shader3D.propertyNameToID("u_BaseTextureDst");
    DyqqMaterial.u_alpha = Laya.Shader3D.propertyNameToID("u_alpha");

    class ShaderTest extends Laya.Script {
        constructor() {
            super();
            this.totalTime = 4000;
            this.curTime = 0;
        }
        onEnable() {
        }
        onDisable() {
        }
        onStart() {
            var scene = Laya.stage.addChildAt(new Laya.Scene3D(), 0);
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new DyqqMaterial();
            Laya.loader.load(["res/layabox.png", "res/clip_replay_btn.png"], Laya.Handler.create(null, function () {
                material.BaseTextureSrc = Laya.loader.getRes("res/layabox.png");
                material.BaseTextureDst = Laya.loader.getRes("res/clip_replay_btn.png");
                material.alpha = 0.1;
            }));
            box.meshRenderer.material = material;
            this.testMaterial = material;
        }
        onUpdate() {
            if (this.testMaterial == null) {
                return;
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

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("test/ShaderTest.ts", ShaderTest);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedauto";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "view/ad/FloatAd.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class RunwayControl {
        constructor() {
            this.RunwayList = new Array();
            this.startPosz = 0;
            this.runwayCount = 5;
            this.disZ = 0;
            this.runwayIndex = 0;
            this.FnishDis = 50;
        }
        static getInstance() {
            if (this._instance == null) {
                this._instance = new RunwayControl();
            }
            return this._instance;
        }
        SetRunwayPrefabs(runway) {
            this.RunwayPrefabs = runway;
            this.startPosz = this.RunwayPrefabs.transform.position.z;
            this.Fnish = this.RunwayPrefabs.parent.getChildByName("Fnish");
        }
        Init() {
            if (this.RunwayPrefabs == null) {
                console.error("赛道对象为null");
                return;
            }
            this.disZ = this.RunwayPrefabs.transform.scale.z;
            var currentPosz = this.startPosz;
            this.RunwayList.push({
                "object": this.RunwayPrefabs,
                "posz": this.startPosz
            });
            for (var i = 0; i < this.runwayCount - 1; i++) {
                let runway = this.RunwayPrefabs.clone();
                this.RunwayPrefabs.parent.addChild(runway);
                currentPosz += this.disZ;
                console.log(runway, currentPosz);
                runway.transform.localPositionZ = currentPosz;
                this.RunwayList.push({
                    "object": runway,
                    "posz": currentPosz
                });
            }
        }
        ResetRunway() {
            for (var i = 0; i < this.RunwayList.length; i++) {
                this.RunwayList[i].object.transform.localPositionZ = this.RunwayList[i].posz;
            }
        }
        CreatorRunway() {
            this.RunwayList[this.runwayIndex].object.transform.localPositionZ += (this.disZ * this.runwayCount);
            this.runwayIndex++;
            if (this.runwayIndex >= this.RunwayList.length) {
                this.runwayIndex = 0;
            }
            if (this.RunwayList[this.runwayIndex].object.transform.localPositionZ > this.FnishDis) {
                console.log("生成终点");
                this.Fnish.active = true;
                this.Fnish.transform.localPositionZ = this.RunwayList[this.runwayIndex].object.transform.localPositionZ;
            }
        }
    }
    RunwayControl._instance = null;

    var EventId = zs.laya.game.EventId;
    var GameState;
    (function (GameState) {
        GameState[GameState["GameReady"] = 0] = "GameReady";
        GameState[GameState["Gameing"] = 1] = "Gameing";
        GameState[GameState["GameOver"] = 2] = "GameOver";
        GameState[GameState["GamePass"] = 3] = "GamePass";
    })(GameState || (GameState = {}));
    class Game extends Laya.Script {
        constructor() {
            super();
            this.MyGameState = GameState.GameReady;
            this.AIPlayerList = new Array();
            Laya.stage.on(EventId.GAME_PREPARE, this, this.onGamePrepare);
        }
        static getInstance() {
            if (this.instance == null) {
                this.instance = new Game();
            }
            return this.instance;
        }
        onGamePrepare() {
            this.MyGameState = GameState.Gameing;
        }
        GamePass() {
            this.MyGameState = GameState.GamePass;
        }
    }
    Game.instance = null;

    var SpeedState;
    (function (SpeedState) {
        SpeedState[SpeedState["normal"] = 1] = "normal";
        SpeedState[SpeedState["addSpeed"] = 2] = "addSpeed";
        SpeedState[SpeedState["stop"] = 3] = "stop";
    })(SpeedState || (SpeedState = {}));
    class BasePlayer extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this.maxSpeed = 0.25;
            this.minSpeed = 0.1;
            this.mySpeed = 0;
            this.addSpeed = 0.005;
        }
        onStart() {
            this.speedState = SpeedState.normal;
            this.mySpeed = this.minSpeed;
            this.startPos = this.owner.transform.position;
            this.maxDisX = (RunwayControl.getInstance().RunwayPrefabs.transform.scale.x - this.owner.transform.scale.x) / 2;
        }
        onUpdate() {
            if (Game.getInstance().MyGameState == GameState.GameReady)
                return;
            this.limit();
            this.owner.transform.translate(new Laya.Vector3(0, 0, this.mySpeed));
            switch (this.speedState) {
                case SpeedState.normal:
                    if (Game.getInstance().MyGameState == GameState.Gameing) {
                        this.AttainSpeed(this.minSpeed);
                    }
                    break;
                case SpeedState.addSpeed:
                    if (Game.getInstance().MyGameState == GameState.Gameing) {
                        this.AttainSpeed(this.maxSpeed);
                    }
                    break;
                case SpeedState.stop:
                    this.AttainSpeed(0);
                    break;
            }
        }
        UpdateState() {
            switch (Game.getInstance().MyGameState) {
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
        limit() {
            if (this.owner.transform.localPositionX > this.maxDisX) {
                this.owner.transform.localPositionX = this.maxDisX;
            }
            if (this.owner.transform.localPositionX < -this.maxDisX) {
                this.owner.transform.localPositionX = -this.maxDisX;
            }
        }
        Reset() {
            this.owner.transform.position = this.startPos;
        }
        AttainSpeed(speed) {
            if (this.mySpeed < speed) {
                this.mySpeed += this.addSpeed;
            }
            else if (this.mySpeed > speed) {
                this.mySpeed -= this.addSpeed;
            }
            if (this.mySpeed < 0.01) {
                this.mySpeed = 0;
            }
        }
        onTriggerEnter(other) {
            if (other.owner.name == "Fnish") {
                this.speedState = SpeedState.stop;
                Game.getInstance().GamePass();
            }
        }
    }

    class Player extends BasePlayer {
        constructor() {
            super();
            this.dis = 0;
            this.moveIndex = 1;
            this.startTouch = 1;
            this.isDown = false;
            this.particleofferPos = new Laya.Vector3();
            this.particlePos = new Laya.Vector3();
        }
        onStart() {
            super.onStart();
            this.speedParticle = this.owner.parent.getChildByName("speedParticle");
            Laya.Vector3.subtract(this.owner.transform.position, this.speedParticle.transform.position, this.particleofferPos);
            this.dis = RunwayControl.getInstance().RunwayPrefabs.transform.scale.z;
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, (event) => {
                this.isDown = true;
                this.startTouch = event.stageX;
                this.startPosX = this.owner.transform.localPositionX;
                this.speedState = SpeedState.addSpeed;
                this.speedParticle.particleSystem.play();
            });
            Laya.stage.on(Laya.Event.MOUSE_UP, this, (event) => {
                this.isDown = false;
                this.startPosX = 0;
                this.startTouch = 0;
                this.speedState = SpeedState.normal;
                this.speedParticle.particleSystem.stop();
            });
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, (event) => {
                if (!this.isDown || Game.getInstance().MyGameState != GameState.Gameing)
                    return;
                let offtouch = event.stageX - this.startTouch;
                this.owner.transform.localPositionX = (this.startPosX - offtouch / 150);
            });
        }
        onUpdate() {
            super.onUpdate();
            Laya.Vector3.subtract(this.owner.transform.position, this.particleofferPos, this.particlePos);
            this.speedParticle.transform.position = this.particlePos;
            if (this.owner.transform.localPositionZ >= (this.moveIndex * this.dis - this.dis / 2 + 5)) {
                this.moveIndex++;
                RunwayControl.getInstance().CreatorRunway();
            }
        }
        Reset() {
            super.Reset();
            this.moveIndex = 1;
        }
        onTriggerEnter(other) {
            super.onTriggerEnter(other);
            if (other.owner.name == "Fnish") {
            }
        }
    }

    class Camera extends Laya.Script3D {
        constructor() {
            super();
            this.offerPos = new Laya.Vector3();
            this.myPos = new Laya.Vector3();
            this.myPosLerp = new Laya.Vector3();
        }
        onStart() {
            this.Player = this.owner.parent.getChildByName("Player");
            Laya.Vector3.subtract(this.Player.transform.position, this.owner.transform.position, this.offerPos);
        }
        onUpdate() {
            Laya.Vector3.subtract(this.Player.transform.position, this.offerPos, this.myPos);
            Laya.Vector3.lerp(this.owner.transform.position, this.myPos, 0.1, this.myPosLerp);
            this.owner.transform.position = this.myPosLerp;
        }
    }

    var State;
    (function (State) {
        State[State["Normal"] = 1] = "Normal";
        State[State["Left"] = 2] = "Left";
        State[State["Right"] = 3] = "Right";
    })(State || (State = {}));
    class AIPlayer extends BasePlayer {
        constructor() {
            super();
            this.lRSpeed = 0.03;
            this.lRTimer = 0.5;
            this.lRCoolTimer = 0.5;
            this.normalTimer = 0;
            this.minNormalTimer = 2;
            this.maxNormalTimer = 5;
            this._minSpeed = 0;
        }
        onStart() {
            super.onStart();
            this.myState = State.Normal;
            this.normalTimer = this.randomMintoMax(this.minNormalTimer, this.maxNormalTimer);
            this._minSpeed = 0.15;
            this.maxSpeed = 0.28;
            this.minSpeed = this.randomMintoMax(this._minSpeed, this.maxSpeed);
        }
        randomMintoMax(min, max) {
            return Math.random() * (max - min) + min;
        }
        onUpdate() {
            super.onUpdate();
            if (Game.getInstance().MyGameState == GameState.Gameing) {
                switch (this.myState) {
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
        normalMove() {
            this.normalTimer -= Laya.timer.delta / 1000;
            if (this.normalTimer < 0) {
                this.normalTimer = this.randomMintoMax(this.minNormalTimer, this.maxNormalTimer);
                this.minSpeed = this.randomMintoMax(this._minSpeed, this.maxSpeed);
                this.randomState();
            }
        }
        leftMove() {
            this.lRTimer -= Laya.timer.delta / 1000;
            if (this.lRTimer < 0) {
                this.lRTimer = this.lRCoolTimer;
                this.myState = State.Normal;
            }
            this.owner.transform.translate(new Laya.Vector3(-this.lRSpeed, 0, 0));
        }
        rightMove() {
            this.lRTimer -= Laya.timer.delta / 1000;
            if (this.lRTimer < 0) {
                this.lRTimer = this.lRCoolTimer;
                this.myState = State.Normal;
            }
            this.owner.transform.translate(new Laya.Vector3(this.lRSpeed, 0, 0));
        }
        randomState() {
            var random = Math.floor(Math.random() * 3);
            switch (random) {
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

    class SceneLogic extends Laya.Script {
        constructor() { super(); }
        onStart() {
            this.Scene = this.owner;
            this.Player = this.Scene.getChildByName("Player");
            this.Runway = this.Scene.getChildByName("Runway");
            this.Camrea = this.Scene.getChildByName("Main Camera");
            RunwayControl.getInstance().SetRunwayPrefabs(this.Runway);
            RunwayControl.getInstance().Init();
            Game.getInstance().Player = this.Player;
            this.CloneAIPlayer();
            this.addComponent();
            this.loadSkyBox();
            this.loadFog();
        }
        addComponent() {
            this.Player.addComponent(Player);
            this.Camrea.addComponent(Camera);
        }
        CloneAIPlayer() {
            var playerPos = this.Player.transform.position;
            var disz = 1;
            var runWidth = this.Runway.transform.scale.x - this.Player.transform.scale.x;
            var posList = [
                new Laya.Vector3(-runWidth / 2, playerPos.y, playerPos.z),
                new Laya.Vector3(-runWidth / 4, playerPos.y, playerPos.z + disz),
                new Laya.Vector3(0, playerPos.y, playerPos.z + 2 * disz),
                new Laya.Vector3(runWidth / 4, playerPos.y, playerPos.z + disz),
                new Laya.Vector3(runWidth / 2, playerPos.y, playerPos.z),
            ];
            for (var i = 0; i < 5; i++) {
                var car = this.Player.clone();
                this.Scene.addChild(car);
                car.transform.position = posList[i];
                car.addComponent(AIPlayer);
                Game.getInstance().AIPlayerList.push(car);
            }
        }
        loadSkyBox() {
            var self = this;
            Laya.BaseMaterial.load("res/atlas/SkyBox/skyMaterial.lmat", Laya.Handler.create(self, function (mat) {
                var camera = self.Scene.getChildByName("Main Camera");
                camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
                var skyRenderer = self.Scene.skyRenderer;
                skyRenderer.mesh = Laya.SkyBox.instance;
                skyRenderer.material = mat;
            }));
        }
        loadFog() {
            var scene = this.Scene;
            scene.ambientColor = new Laya.Vector3(0.94, 0.40, 0.52);
            scene.enableFog = true;
            scene.fogColor = new Laya.Vector3(0.96, 0.62, 0.70);
            scene.fogStart = 20;
            scene.fogRange = 60;
        }
    }

    var ObjectPool = zs.laya.ObjectPool;
    var EventId$1 = zs.laya.game.EventId;
    class GameLogic extends zs.laya.game.AppMain {
        constructor() {
            super();
            this.sceneLogic = null;
        }
        onAwake() {
            super.onAwake();
            zs.laya.game.UIService.viewScript.store = zs.laya.ui.NormalStorePage;
            Laya.stage.once(EventId$1.LAUNCH_COMPLETED, this, this.onGameLaunchReady);
            Laya.stage.on(EventId$1.UI_VIEW_CLOSED, this, this.onViewClosed);
            Laya.stage.on(EventId$1.UI_VIEW_OPENED, this, this.onViewOpened);
        }
        onDestroy() {
            this.sceneLogic = null;
            Laya.stage.off(EventId$1.UI_VIEW_CLOSED, this, this.onViewClosed);
            Laya.stage.off(EventId$1.UI_VIEW_OPENED, this, this.onViewOpened);
        }
        onGameLaunchReady(s) {
            DyqqShader.initShader();
            ObjectPool.ClearCache();
            if (s) {
                this.sceneLogic = Laya.stage.addChildAt(s, 0).addComponent(SceneLogic);
            }
            else {
                Laya.stage.addComponent(ShaderTest);
            }
            Laya.stage.event(EventId$1.GAME_HOME);
        }
        onViewClosed(viewName) {
            console.log(`${viewName} closed`);
        }
        onViewOpened(viewName) {
            console.log(`${viewName} opened`);
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.bgColor = "#ffffff";
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            console.log("2");
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Laya.stage.addComponent(GameLogic);
        }
    }
    new Main();

}());
