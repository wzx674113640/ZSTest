/**提供平台提供的部分基础 */

declare module zs.laya.sdk {
    class SdkService extends Laya.Script {
        public static login(successHandler: Laya.Handler, failedHandler: Laya.Handler): void;

        public static loadSubpackage(pkgName: string, progressHandler: Laya.Handler, successHandler: Laya.Handler, failedHandler: Laya.Handler): void;

        public static playVideo(completedHandler: Laya.Handler, interuptHandler: Laya.Handler, errorHandler: Laya.Handler): void;

        public static isVideoEnable(): boolean;
    }
}