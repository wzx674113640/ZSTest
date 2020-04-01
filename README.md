# laya-template

#### 介绍
laya游戏项目模板，引入sdk子项目和通用模块子项目，通过git来实现子项目的同步

#### 使用说明
1. 初始化依赖库：克隆或第一次拉取代码后，执行"git submodule init"和"git submodule update"
2. 日常的更新: 在依赖库目录下，像正常使用git一样，使用fetch, pull即可

#### 目录说明
1. compZS: 指色通用ui控件目录
2. data: 数据类目录。数据与配置结构说明目录
3. define: 定义类目录。定义事件id等
4. logic: 逻辑类目录。gamelogic负责游戏整体流程控制，包括场景切换，配置加载，web请求结果的部分处理；webrequest提供所有请求的接口
5. ui: laya创建的ui类存放目录
5. view: ui页面逻辑目录。有额外的逻辑时，通过创建View的runscript，并绑定对应的View来增加额外的逻辑。
