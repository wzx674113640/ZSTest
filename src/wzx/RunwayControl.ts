export default class RunwayControl {

    private static _instance: RunwayControl = null;
    public static getInstance() : RunwayControl
    {   
        if(this._instance == null)
        {
            this._instance = new RunwayControl();
        }
        return this._instance;
    }
    
    public RunwayPrefabs: Laya.MeshSprite3D;
    public RunwayList : Array<any> = new Array<any>(); //赛道池
    private startPosz: number = 0;
    private runwayCount:number = 5; //初始多少赛道 用于自动生成
    private disZ: number = 0; // 每个赛道之间的间隔
    private runwayIndex: number = 0; //赛道下标 表示玩家处于那块赛道上

    private FnishDis = 50; //终点的距离
    private Fnish:Laya.Sprite3D; //终点触发器

    constructor() {

    }

    SetRunwayPrefabs(runway:Laya.MeshSprite3D)
    {
        this.RunwayPrefabs = runway;
        this.startPosz = this.RunwayPrefabs.transform.position.z;
        this.Fnish = this.RunwayPrefabs.parent.getChildByName("Fnish") as Laya.Sprite3D;
    }

    /**
     *  初始化赛道
     */
    Init()
    {
        if(this.RunwayPrefabs == null)
        {
           console.error("赛道对象为null");
           return;
        }
        this.disZ = this.RunwayPrefabs.transform.scale.z;
        var currentPosz = this.startPosz;
        this.RunwayList.push({
            "object": this.RunwayPrefabs,
            "posz" : this.startPosz
        });
        for(var i = 0; i < this.runwayCount - 1; i++)
        {
            let runway = this.RunwayPrefabs.clone() as Laya.Sprite3D;
            this.RunwayPrefabs.parent.addChild(runway);
            currentPosz += this.disZ ;
            console.log(runway,currentPosz);
            runway.transform.localPositionZ = currentPosz;
            this.RunwayList.push({
                "object": runway,
                "posz" : currentPosz
            });
        }
    }

    /**
     * 重置赛道位置
     */
    ResetRunway()
    {
         for(var i = 0; i< this.RunwayList.length; i++)
         {
            this.RunwayList[i].object.transform.localPositionZ = this.RunwayList[i].posz;
         }
    }

    /**
     * 生成赛道
     */
    CreatorRunway()
    {
        this.RunwayList[this.runwayIndex].object.transform.localPositionZ += (this.disZ * this.runwayCount);
       
        this.runwayIndex++;
        if(this.runwayIndex >= this.RunwayList.length)
        {
            this.runwayIndex = 0;
        }
        if(this.RunwayList[this.runwayIndex].object.transform.localPositionZ > this.FnishDis)
        {   
            console.log("生成终点");
            this.Fnish.active = true;
            this.Fnish.transform.localPositionZ = this.RunwayList[this.runwayIndex].object.transform.localPositionZ;
        }
    }
}