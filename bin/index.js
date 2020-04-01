/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */

window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
loadLib("libs/domparserinone.js")
loadLib("libs/bytebuffer.js")
loadLib("libs/laya.physics3D.js")
//-----libs-end-------
loadLib("framework/zs.laya.base.js")

loadLib("adapter/zs.laya.wx.conf.js");
loadLib('adapter/zs.laya.wx.ad.js');
loadLib("adapter/zs.laya.sdk.js");
loadLib("adapter/zs.laya.banner.js");
loadLib("adapter/zs.laya.platform.js");

if (typeof wx !== "undefined") {
    loadLib('adapter/zs.laya.wx.js');
    loadLib('adapter/ald-game.js');
    loadLib('adapter/tdweapp.js');
    loadLib('adapter/h.js');
}

loadLib("framework/zs.laya.js")
loadLib("framework/zs.laya.ui.js")
loadLib("framework/zs.laya.game.js")
loadLib("framework/zs.laya.opendata.js")
loadLib("framework/zs.laya.tdapp.js")
loadLib("framework/zs.laya.zsapp.js")

loadLib("js/bundle.js");
