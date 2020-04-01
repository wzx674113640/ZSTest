declare module zs.laya.base {

    class BaseView extends Laya.Script {
        viewName;
        public static readonly EVENT_UI_VIEW_CLOSED: string;
        public static readonly EVENT_UI_VIEW_OPENED: string;
    }

    class Layout extends Laya.Script {
        public static readonly VERTICAL_TOP: number;
        public static readonly VERTICAL_MIDDLE: number;
        public static readonly VERTICAL_BOTTOM: number;

        public static readonly HORIZONTAL_LEFT: number;
        public static readonly HORIZONTAL_CENTER: number;
        public static readonly HORIZONTAL_RIGHT: number;

        public topUI: Laya.UIComponent;
        public middleUI: Laya.UIComponent;
        public bottomUI: Laya.UIComponent;
        public leftFloatUI: Laya.UIComponent;
        public rightFloatUI: Laya.UIComponent;
        public fullUI: Laya.UIComponent;

        public initLayout(applyStatusBar: boolean, isFull: boolean, vLayout: number, hLayout: number);
    }

    class ZhiSeView extends BaseView {
       
    }
}