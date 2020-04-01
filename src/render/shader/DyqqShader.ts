export default class DyqqShader {

    public static get ShaderName() {
        return "DyqqShader";
    }
    	
	public static initShader(): void {        
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
		let subShader =new Laya.SubShader(attributeMap, uniformMap);
        customShader.addSubShader(subShader);
		subShader.addShaderPass(vs, ps);
	}
}