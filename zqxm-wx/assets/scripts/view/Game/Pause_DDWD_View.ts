import { _decorator, Component, director, Node } from 'cc';
import { Game_DDWD_Page } from './Game_DDWD_Page';

const { ccclass, property } = _decorator;

@ccclass('Pause_DDWD_View')
export class Pause_DDWD_View extends Component {

    @property(Node)
    audioSwitch: Node = null;



    onEnable() {
        this.setAudioSwitch();
    }


    /**
     * 设置音频开关
     * @param value 
     */
    setAudioSwitch(value?: boolean) {

    }


    onBtnSwitch() {

    }

    onBtnQuit() {
        // this.node.parent.getComponent(Game_DDWD_Page).onQuit();
        this.node.parent.getComponent(Game_DDWD_Page).onQuit();
    }

    onBtnClose() {
        this.node.parent.getComponent(Game_DDWD_Page).onContinue();
    }
}


