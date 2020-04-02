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
    GameConfig.startScene = "view/game/GamePage.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class SceneLogic extends Laya.Script {
        constructor() { super(); }
        onStart() {
            this.Scene = this.owner;
            this.Cube = this.Scene.getChildByName("Cube");
            var material = new DyqqMaterial();
            Laya.loader.load(["res/layabox.png", "res/clip_replay_btn.png"], Laya.Handler.create(null, function () {
                material.BaseTextureSrc = Laya.loader.getRes("res/layabox.png");
                material.BaseTextureDst = Laya.loader.getRes("res/clip_replay_btn.png");
                material.alpha = 0.1;
            }));
            this.Cube.meshRenderer.material = material;
        }
        onUpdate() {
            this.Cube.transform.rotate(new Laya.Vector3(0, 2, 0), false, false);
        }
        onEnable() {
        }
        onDisable() {
        }
        wakeup() {
        }
        sleep() {
        }
    }

    var ObjectPool = zs.laya.ObjectPool;
    var EventId = zs.laya.game.EventId;
    class GameLogic extends zs.laya.game.AppMain {
        constructor() {
            super();
            this.sceneLogic = null;
        }
        onAwake() {
            super.onAwake();
            zs.laya.game.UIService.viewScript.store = zs.laya.ui.NormalStorePage;
            Laya.stage.once(EventId.LAUNCH_COMPLETED, this, this.onGameLaunchReady);
            Laya.stage.on(EventId.UI_VIEW_CLOSED, this, this.onViewClosed);
            Laya.stage.on(EventId.UI_VIEW_OPENED, this, this.onViewOpened);
        }
        onDestroy() {
            this.sceneLogic = null;
            Laya.stage.off(EventId.UI_VIEW_CLOSED, this, this.onViewClosed);
            Laya.stage.off(EventId.UI_VIEW_OPENED, this, this.onViewOpened);
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
            Laya.stage.event(EventId.GAME_HOME);
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
