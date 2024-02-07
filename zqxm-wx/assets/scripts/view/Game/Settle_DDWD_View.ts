import { _decorator, Component, Node, Label, game, director } from 'cc';
import { Game_DDWD_Data } from '../../data/Game_DDWD_Data';
import { User_DDWD_Data } from '../../data/User_DDWD_Data';
import { Event_DDWD_Manager } from '../../manager/Event_DDWD_Manager';
import { Game_DDWD_Page } from './Game_DDWD_Page';
const { ccclass, property } = _decorator;

@ccclass('Settle_DDWD_View')
export class Settle_DDWD_View extends Component {

    @property(Label)
    goldCountLabel: Label = null;


    init(value: boolean) {
        this.node.getChildByName("Win").active = value;
        this.node.getChildByName("Lose").active = !value;
        this.goldCountLabel.string = `x${Game_DDWD_Data.get_DDWD_LevelReward()}`;
        if (value) {
            User_DDWD_Data.getInstance().gold += Game_DDWD_Data.get_DDWD_LevelReward();
            User_DDWD_Data.getInstance().level++;
        }
    }


    onBtnBack() {
        Event_DDWD_Manager.getInstance().emit("gameQuit");
    }

    onBtnContinue() {
        Event_DDWD_Manager.getInstance().emit("gameStart");
    }


    onBtnRelive() {
        Event_DDWD_Manager.getInstance().emit("gameRelive");
    }

    onBtnRetry() {
        Event_DDWD_Manager.getInstance().emit("gameStart");
    }
}


