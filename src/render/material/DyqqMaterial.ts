import DyqqShader from "../shader/DyqqShader";


export class DyqqMaterial extends Laya.BaseMaterial {

    //绑定漫反射贴图
    public static u_BaseTextureSrc = Laya.Shader3D.propertyNameToID("u_BaseTextureSrc");
    //绑定描边颜色
    public static u_BaseTextureDst = Laya.Shader3D.propertyNameToID("u_BaseTextureDst");
    //绑定描边宽度
    public static u_alpha = Laya.Shader3D.propertyNameToID("u_alpha");

    constructor() {
        super();
        //设置本材质使用的shader名字
        this.setShaderName(DyqqShader.ShaderName);
    }

    /**
     * 获取漫反射贴图。
     * @return 漫反射贴图。
     */
    get BaseTextureSrc(){
        return this._shaderValues.getTexture(DyqqMaterial.u_BaseTextureSrc);
    }
    /**
     * 设置漫反射贴图。
     * @param value 漫反射贴图。
     */
    set BaseTextureSrc(value) {
        if (value)
            this._defineDatas["add"](DyqqMaterial.u_BaseTextureSrc);
        else
            this._defineDatas["remove"](DyqqMaterial.u_BaseTextureSrc);
        this._shaderValues.setTexture(DyqqMaterial.u_BaseTextureSrc, value);
    }

    
    /**
     * 获取漫反射贴图。
     * @return 漫反射贴图。
     */
    get BaseTextureDst(){
        return this._shaderValues.getTexture(DyqqMaterial.u_BaseTextureDst);
    }
    /**
     * 设置漫反射贴图。
     * @param value 漫反射贴图。
     */
    set BaseTextureDst(value) {
        if (value)
            this._defineDatas["add"](DyqqMaterial.u_BaseTextureDst);
        else
            this._defineDatas["remove"](DyqqMaterial.u_BaseTextureDst);
        this._shaderValues.setTexture(DyqqMaterial.u_BaseTextureDst, value);
    }

    /**
     * 获取线条颜色
     * @return 线条颜色
     */
    get alpha() {
        return this._shaderValues.getNumber(DyqqMaterial.u_alpha);
    }
    set alpha(value) {
        this._shaderValues.setNumber(DyqqMaterial.u_alpha, value);
    }
}