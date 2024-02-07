import { _decorator, Component, Node } from 'cc';
import { Tips_DDWD_Manager } from '../manager/Tips_DDWD_Manager';
const { ccclass, property } = _decorator;

@ccclass('Toast')
export class Toast extends Component {

    msgManager: Tips_DDWD_Manager;


    start() {
        this.msgManager = Tips_DDWD_Manager.getInstance();
    }

    onClose() {
        this.msgManager.hideToast();
    }
}


