import { _decorator, Component, Node, director } from 'cc';
import { Grid_DDWD_PanelLogic } from '../../gameLogic/Grid_DDWD_PanelLogic';
import { Event_DDWD_Manager } from '../../manager/Event_DDWD_Manager';
import { Play_DDWD_View } from './Play_DDWD_View';
import { Settle_DDWD_View } from './Settle_DDWD_View';
const { ccclass, property } = _decorator;

export const enum View {
    PLAY = "Play",
    PAUSE = "Pause",
    SETTLE = "Settle",
    TIPS = "Tips"
}

@ccclass('Game_DDWD_Page')
export class Game_DDWD_Page extends Component {

    @property(Node)
    playView: Node = null;

    @property(Node)
    pauseView: Node = null;

    @property(Node)
    settleView: Node = null;

    @property(Node)
    tipsView: Node = null;

    gridPanelLogic: Grid_DDWD_PanelLogic = null;
    inGame: boolean = false;

    onLoad() {
        this.gridPanelLogic = this.playView.getChildByName("GridPanel").getComponent(Grid_DDWD_PanelLogic);
        Event_DDWD_Manager.getInstance().on("gameStart", this.onStart, this);
        Event_DDWD_Manager.getInstance().on("gamePause", this.onPause, this);
        Event_DDWD_Manager.getInstance().on("gameContinue", this.onPause, this);
        Event_DDWD_Manager.getInstance().on("gameRelive", this.onRelive, this);
        Event_DDWD_Manager.getInstance().on("gameSettle", this.onSettle, this);
        Event_DDWD_Manager.getInstance().on("gameQuit", this.onQuit, this);
    }

    start() {
        this.tipsView.active = true;
        this.onStart();
    }


    /**
     * 游戏开始
     */
    onStart() {
        console.log("gamePage onStart");
        this.playView.active = true;
        this.pauseView.active = false;
        this.settleView.active = false;
        this.playView.getComponent(Play_DDWD_View).initGamePage();
        this.inGame = true;
    }


    /**
     * 复活
     */
    onRelive() {
        console.log("gamePage onRelive");
        this.gridPanelLogic.initGridPanel();
        this.playView.active = true;
        this.pauseView.active = false;
        this.settleView.active = false;
        this.inGame = true;
    }

    /**
     * 暂停
     */
    onPause() {
        console.log("gamePage onPause");
        this.pauseView.active = true;
    }


    /**
     * 继续游戏
     */
    onContinue() {
        console.log("gamePage onContinue");
        this.pauseView.active = false;
    }


    /**
     * 结算
     * @param value win-true lose-false
     * @param goldCount 获胜时的奖励
     */
    onSettle(result: boolean) {
        this.inGame = false;
        console.log("gamePage onSettle:", result);
        this.settleView.getComponent(Settle_DDWD_View).init(result)
        this.settleView.active = true;
    }


    /**
     * 退出游戏
     */
    onQuit() {
        this.inGame = false;
        console.log("gamePage onQuit");
        director.loadScene("Home");
    }


    onDisable() {
        Event_DDWD_Manager.getInstance().off("gameStart", this.onStart, this);
        Event_DDWD_Manager.getInstance().off("gamePause", this.onPause, this);
        Event_DDWD_Manager.getInstance().off("gameContinue", this.onPause, this);
        Event_DDWD_Manager.getInstance().off("gameRelive", this.onRelive, this);
        Event_DDWD_Manager.getInstance().off("gameSettle", this.onSettle, this);
        Event_DDWD_Manager.getInstance().off("gameQuit", this.onQuit, this);
    }
}


