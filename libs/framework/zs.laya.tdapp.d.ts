declare module zs.laya.tdapp {

    class tdAppEvent {
        id: string;
        label: string;
        params: any;
        constructor();
    }

    class tdAppSdk {
        static event(evt: tdAppEvent);
    }

    class startupEvt extends tdAppEvent {
        constructor();
    }

    class loginEvt extends tdAppEvent {
        constructor(userId: string);
    }

    class gameStartEvt extends tdAppEvent {
        constructor(userId: string, gameId: string);
    }

    class gameOverEvt extends tdAppEvent {
        constructor(userId: string, gameId: string, result: string);
    }

    class levelCompletedEvt extends tdAppEvent {
        constructor(userId: string, levelId: string);
    }
}