import { _decorator, Component, Node, Prefab, instantiate, resources, Label } from 'cc';
import { User_DDWD_Data } from '../../data/User_DDWD_Data';
import { Event_DDWD_Manager } from '../../manager/Event_DDWD_Manager';
const { ccclass, property } = _decorator;

@ccclass('Sign_DDWD_View')
export class Sign_DDWD_View extends Component {
    @property(Label)
    goldCountLabel: Label = null;

    signGold: number = 20;

    /**
     * 每次打开签到列表，刷新签到
     */
    onLoad() {
        this.goldCountLabel.string = `${this.signGold}`
    }

    /**
     * 创建签到
     * @param signData 签到信息
     * @param parent 签到挂载的父节点
     */
    onBtnGet() {
        User_DDWD_Data.getInstance().gold += this.signGold;
        this.node.active = false;
        User_DDWD_Data.getInstance().signed = true;
        Event_DDWD_Manager.getInstance().emit("gold");
    }
}


