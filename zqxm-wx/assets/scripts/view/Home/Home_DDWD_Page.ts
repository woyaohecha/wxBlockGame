import { _decorator, Component, Node, director, Label, animation, Animation } from 'cc';
import { User_DDWD_Data } from '../../data/User_DDWD_Data';
import { Tips_DDWD_Manager } from '../../manager/Tips_DDWD_Manager';
import { Event_DDWD_Manager } from '../../manager/Event_DDWD_Manager';
import { Game_DDWD_Data } from '../../data/Game_DDWD_Data';
const { ccclass, property } = _decorator;

export const enum LayerType {
    HOME = "Home",
    SIGN = "Sign"
}

@ccclass('Home_DDWD_Page')
export class Home_DDWD_Page extends Component {

    @property(Node)
    homeLayer: Node = null;

    @property(Node)
    signLayer: Node = null;

    @property(Label)
    goldLabel: Label = null;

    @property(Label)
    atkLabel: Label = null;

    @property(Label)
    atkLevelUpGoldLabel: Label = null;

    onLoad() {
        Event_DDWD_Manager.getInstance().on("gold", this.initHome, this)
        this.initHome();
    }

    start() {

    }


    initHome() {
        this.goldLabel.string = `${User_DDWD_Data.getInstance().gold}`;
        this.atkLabel.string = `${Game_DDWD_Data.get_DDWD_Atk()}`;
        this.atkLevelUpGoldLabel.string = `${Game_DDWD_Data.get_DDWD_AtkLevelUpGold()}`;
        this.homeLayer.active = true;
        this.signLayer.active = !User_DDWD_Data.getInstance().signed;
    }

    private _clickStart: boolean = false;
    onBtnStart() {
        if (this._clickStart) {
            return;
        }
        this._clickStart = true;
        director.loadScene("Game");
    }

    private _clickAtk: boolean = false;
    onBtnAtkLevelUp() {
        if (this._clickAtk) {
            return
        }
        this._clickAtk = true;
        User_DDWD_Data.getInstance().atkLevelUp((gold, atk, atkLevelUpGold) => {
            this.goldLabel.string = gold;
            this.atkLabel.string = atk;
            this.atkLevelUpGoldLabel.string = atkLevelUpGold;
            this._clickAtk = false;
        }, (msg) => {
            Tips_DDWD_Manager.getInstance().showTips(msg);
            this._clickAtk = false;
        })
    }
}


