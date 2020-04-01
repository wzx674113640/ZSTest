declare module zs.laya{

    class Resource extends Laya.Script{

        public static Get3dResUrl(filename: string): string;
    
        public static Get3dPrefabUrl(filename: string): string;
    
        public static Get3dSceneUrl(filename: string): string;
    
        public static CurScene3dUrl(): string;
    
        public static LoadRes(): any;
    
        public static LoadResAsyn(url: string, onCompleted: Laya.Handler, onProgress?: Laya.Handler): void;
    
        public static LoadSprite3d(url: string): Laya.Sprite3D;
    
        public static LoadSpriteAsyn(url: string, onCompleted?: Laya.Handler, onProgress?: Laya.Handler): void;
    
        public static LoadScene3d(url: string): Laya.Scene3D;

        public static LoadScene3dAsyn(url: string, onCompleted?: Laya.Handler, onProgress?: Laya.Handler): void;
    
        public static unloadSceneRes(sceneUrl: string): void;
    
        public static printSceneDependences(sceneUrl: string): void;
    
    }

    class ObjectPool extends Laya.Script {

        public static ClearCache(): void;
    
        public static RecoverSprite3d(sprite3d: Laya.Sprite3D, immediate?: boolean): void;
    
        public static GetEmptySprite3d(sign: string) : Laya.Sprite3D;    
        
        public static GetSprite3d(original: Laya.Sprite3D, sign?: string): Laya.Sprite3D;
    }

    interface UIMsgBoxArgs {
        content: string;
        btnDesc: string;
        callback: Laya.Handler;
    }

    class EffectFactory extends Laya.Script {    
        public static CreateEffect(customId: string, sign: string, duaration: number, parent: Laya.Node, 
            isWorldSpace?: boolean, position?: Laya.Vector3, rotation?: Laya.Quaternion, effectScript?: any): void;
    }
    
    class DeviceService extends Laya.Script {   

        public static EVENT_ON_SHOW: string;

        public static EVENT_ON_HIDE: string;

        public static VibrateShort(): void;

        public static VibrateLong(): void;

        public static IsNetValid(): boolean;
        
        public static statusBarHeight(): number;

        public static screenWidth(): number;

        public static screenHeight(): number;
    }

    class SoundService extends Laya.Script {
        public static playMusic(music);
        public static stopMusic();
    }

    class AnimStateListener extends Laya.AnimatorStateScript {

        public static init(animator: Laya.Animator, stateName: string, listener: any);

        public static setListener(animator: Laya.Animator, stateName: string, caller: any, onEnter: Function, onExit: Function): void;
    }

    interface Trigger3DListener {

        zsTriggerEnter(script: TriggerScript3d, trigger: Laya.PhysicsCollider);

        zsTriggerStay(script: TriggerScript3d, trigger: Laya.PhysicsCollider);

        zsTriggerExit(script: TriggerScript3d, trigger: Laya.PhysicsCollider);
    }

    class TriggerScript3d extends Laya.Script3D {

        public static Init(sprite3d: Laya.Node, listener: Trigger3DListener): void;
    }
   
    class Sprite3dAgent extends Laya.Script3D {

        public static init(sprite3d: Laya.Sprite3D, sign: string, loaded: Laya.Handler): void;

        public static release(sprite3d: Laya.Sprite3D);
    }
   
    class Sprite3dRecover extends Laya.Script3D {
        public static delayRecover(sprite3d: Laya.Sprite3D, delay: number);
    }
   
    class MiscUtils {

        /*
            val: utc date milesecond
        */
        public static compareVersion(left: string, right: string);
        
        public static isToday(val: number);

        public static number2String4(val: number);

        public static number2String3(val: number);

        public static number2String2(val: number);
        
        public static array2UrlStrArgs(args:any[]);
        
        public static object2UrlStrArgs(args:any);

        public static hex_md5(s);

        public static b64_md5(s);

        public static str_md5(s);

        public static hex_hmac_md5(key, data);

        public static b64_hmac_md5(key, data);
        
        public static str_hmac_md5(key, data);

        public static random(min, max);
    }

    class DataCache {
        
        public static clearCache(key);

        public static getCache(key, expire);

        public static setCache(key, value);
    }

    class XHRUtils {

        public static readonly NET_XHR_RESPONSE;
    
        public static xhrPost(api:string, args: any);
        
        public static xhrPostWithSign(api:string, args: any, secret: string)

        public static xhrPostWithSignAndHeader(api:string, args: any, secret: string, headers:any)
    }
}