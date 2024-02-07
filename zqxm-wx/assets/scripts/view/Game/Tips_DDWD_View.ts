import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tips_DDWD_View')
export class Tips_DDWD_View extends Component {

    onBtnClose() {
        this.node.active = false;
    }
}


