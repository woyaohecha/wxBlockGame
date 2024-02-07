import { _decorator, Component, Node, NodeEventType, EventTouch, UITransform, Vec3, find, Sprite, SpriteFrame } from 'cc';
import { Event_DDWD_Manager } from '../manager/Event_DDWD_Manager';
import { Block_DDWD_Pool } from './Block_DDWD_Pool';
import { Grid_DDWD_Logic } from './Grid_DDWD_Logic';
import { Grid_DDWD_PanelLogic } from './Grid_DDWD_PanelLogic';
import { Next_DDWD_PanelLogic } from './Next_DDWD_PanelLogic';
const { ccclass, property } = _decorator;

interface NodePosition {
    x: number;
    y: number;
}

@ccclass('Block_DDWD_Logic')
export class Block_DDWD_Logic extends Component {

    touchOffset: Vec3 = new Vec3(0, 300, 0);
    blockImg: SpriteFrame = null;
    blockType: any = null;
    canDrag: boolean = true;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.getType();
    }

    /**
     * 重置数据
     */
    initBlock() {
        this.node.setScale(new Vec3(1, 1, 1));
        for (let child of this.node.children) {
            child.setScale(new Vec3(1, 1, 1));
        }
        for (let child of this.node.children) {
            child.getComponent(Sprite).grayscale = false;
        }
    }


    /**
     * 获取当前block的矩阵
     * @returns 
     */
    getType() {
        if (!this.blockType) {
            let nodes = this.node.children;
            let xValuesSet = new Set<number>();
            let yValuesSet = new Set<number>();
            nodes.forEach(node => {
                const { x } = node.position;
                xValuesSet.add(x);
            });
            nodes.forEach(node => {
                const { y } = node.position;
                yValuesSet.add(y);
            });
            let uniqueXValues = Array.from(xValuesSet);
            let sortedXValues = uniqueXValues.sort((a, b) => a - b);
            let uniqueYValues = Array.from(yValuesSet);
            let sortedYValues = uniqueYValues.sort((a, b) => a - b);


            let len = sortedXValues[sortedXValues.length - 1] - sortedXValues[0] + nodes[0].getComponent(UITransform).width;
            let hei = sortedYValues[sortedYValues.length - 1] - sortedYValues[0] + nodes[0].getComponent(UITransform).height;
            let row = hei / nodes[0].getComponent(UITransform).height;
            let column = len / nodes[0].getComponent(UITransform).width;

            let type = [];
            for (let i = 0; i < row; i++) {
                type[i] = [];
                for (let j = 0; j < column; j++) {
                    let node = nodes.find((node => {
                        return node.position.x === sortedXValues[j] && node.position.y === sortedYValues[row - i - 1];
                    }))
                    type[i][j] = node ? 1 : 0;
                }
            }
            this.blockType = type;
        }
        return this.blockType;
    }


    /**
     * 设置block的颜色
     * @param sp 颜色图片sp
     */
    setColor(sp?: SpriteFrame) {
        if (sp && !this.blockImg) {
            this.blockImg = sp;
        }
        this.canDrag = true;
        for (let child of this.node.children) {
            child.getComponent(Sprite).spriteFrame = this.blockImg;
        }
    }

    onTouch: boolean = false;
    onTouchStart(e: EventTouch) {
        if (!this.canDrag || this.onTouch) {
            return;
        }
        this.onTouch = true;
        let touchPos = new Vec3(e.getUILocation().x, e.getUILocation().y);
        let localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(touchPos);
        let targetPos = new Vec3(localPos.x + this.touchOffset.x, localPos.y + this.touchOffset.y, localPos.z + this.touchOffset.z);
        this.drag(targetPos);
    }

    onTouchMove(e: EventTouch) {
        if (!this.canDrag) {
            return;
        }
        let touchPos = new Vec3(e.getUILocation().x, e.getUILocation().y);
        let localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(touchPos);
        let targetPos = new Vec3(localPos.x + this.touchOffset.x, localPos.y + this.touchOffset.y, localPos.z + this.touchOffset.z);
        this.node.setPosition(targetPos);
        this.checkGridPanel();
    }

    onTouchEnd() {
        if (!this.canDrag || !this.onTouch) {
            return;
        }
        this.onTouch = false;
        this.place();
    }

    onTouchCancel() {
        if (!this.canDrag || !this.onTouch) {
            return;
        }
        this.onTouch = false;
        this.place();
    }


    /**
     * 拖拽
     * @param pos 拖拽位置
     */
    drag(pos: Vec3) {
        this.node.setScale(new Vec3(2, 2, 1));
        for (let child of this.node.children) {
            child.setScale(new Vec3(0.9, 0.9, 1));
        }
        this.node.setPosition(pos);
    }


    /**
     * 复位
     */
    reset() {
        this.node.setScale(new Vec3(1, 1, 1));
        for (let child of this.node.children) {
            child.setScale(new Vec3(1, 1, 1));
        }
        this.node.setPosition(Vec3.ZERO)
    }


    /**
     * 寻找girdPanel上对应的格子
     */
    checkGridPanel() {
        let gridPanelLogic = find("Canvas/Play/GridPanel").getComponent(Grid_DDWD_PanelLogic);
        return gridPanelLogic.checkCanPlace(this.node);
    }


    /**
     * 检查下方是否为空
     * @returns 
     */
    checkNextEmpty() {
        let nextPanelLogic = find("Canvas/Play/NextPanel").getComponent(Next_DDWD_PanelLogic);
        return nextPanelLogic.checkEmpty();
    }

    /**
     * 放置
     * @param pos 
     */
    place() {
        let result = this.checkGridPanel();
        if (result) {
            for (let child of result.canPutGrid) {
                child.getComponent(Grid_DDWD_Logic).setImg(result.spriteFrame)
            }
            Block_DDWD_Pool.getInstance().removeBlock(this.node);
            let gridPanelLogic = find("Canvas/Play/GridPanel").getComponent(Grid_DDWD_PanelLogic);
            gridPanelLogic.checkCanEliminate();
            if (this.checkNextEmpty()) {
                let nextPanelLogic = find("Canvas/Play/NextPanel").getComponent(Next_DDWD_PanelLogic);
                nextPanelLogic.freshThreeBlock();
            }
        } else {
            this.reset();
        }
    }


    /**
     * 置灰，表示当前gridPanel没有地方可以放置
     */
    setGray() {
        this.canDrag = false;
        Block_DDWD_Pool.getInstance().getImg(7, (sp: SpriteFrame) => {
            for (let child of this.node.children) {
                child.getComponent(Sprite).spriteFrame = sp;
            }
        })

    }


    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}


