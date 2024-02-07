import { _decorator, Component, Node, Vec3, find } from 'cc';
import { Event_DDWD_Manager } from '../manager/Event_DDWD_Manager';
import { Util } from '../Util';
import { Game_DDWD_Page } from '../view/Game/Game_DDWD_Page';
import { Block_DDWD_Logic } from './Block_DDWD_Logic';
import { Block_DDWD_Pool } from './Block_DDWD_Pool';
import { Grid_DDWD_PanelLogic } from './Grid_DDWD_PanelLogic';
const { ccclass, property } = _decorator;

@ccclass('Next_DDWD_PanelLogic')
export class Next_DDWD_PanelLogic extends Component {

    nextPanel: Node = null;
    gridPanelLogic: Grid_DDWD_PanelLogic = null;

    private _blockPool: Block_DDWD_Pool = Block_DDWD_Pool.getInstance();

    onLoad() {
        this.nextPanel = this.node.getChildByName("Next");
        this.gridPanelLogic = this.node.parent.getChildByName("GridPanel").getComponent(Grid_DDWD_PanelLogic);
        Event_DDWD_Manager.getInstance().on("blockPlace", this.checkNextCanPlace, this);
    }

    /**
     * 初始化
     */
    initNextPanel() {
        console.log("init nextPanel");
        this.freshThreeBlock();
    }

    /**
     * 检查下方是否需要变色
     */
    checkNextCanPlace() {
        let grayCount = 0;
        let blockCount = 0;
        for (let i = 0; i < this.nextPanel.children.length; i++) {
            if (this.nextPanel.children[i].children[0]) {
                let blockLogic: Block_DDWD_Logic = this.nextPanel.children[i].children[0].getComponent(Block_DDWD_Logic);
                let canPlace = this.gridPanelLogic.findBlockEmpty(blockLogic);
                if (canPlace) {
                    blockLogic.setColor();
                } else {
                    blockLogic.setGray();
                    grayCount++;
                }
                blockCount++;
            }
            // this.scheduleOnce(() => {
            //     if (i == this.nextPanel.children.length - 1 && grayCount == blockCount && grayCount != 0) {
            //         let inGame = this.node.parent.parent.getComponent(Game_DDWD_Page).inGame;
            //         if (inGame) {
            //             Event_DDWD_Manager.getInstance().emit("gameSettle", false);
            //         }
            //     }
            // }, 1)
        }
        this.scheduleOnce(() => {
            if (grayCount == blockCount && grayCount != 0) {
                console.log(blockCount, grayCount)
                let inGame = this.node.parent.parent.getComponent(Game_DDWD_Page).inGame;
                if (inGame) {
                    this.scheduleOnce(() => {
                        Event_DDWD_Manager.getInstance().emit("gameSettle", false);
                    }, 0.5)
                }
            }
        }, 1)
    }


    /**
     * 创建下方三个块
     */
    createThreeBlock() {
        let indexs: number[] = Util.getRandomNumsFromNToM(0, 29, 3);

        for (let i = 0; i < this.nextPanel.children.length; i++) {
            this._blockPool.getBlock(indexs[i], (block: Node) => {
                block.setParent(this.nextPanel.children[i]);
                block.setPosition(Vec3.ZERO);
                Event_DDWD_Manager.getInstance().emit("blockPlace");
            })
        }
    }

    /**
     * 刷新下方三个块
     */
    freshThreeBlock() {
        for (let child of this.nextPanel.children) {
            child.removeAllChildren();
        }
        this.createThreeBlock();
    }

    /**
     * 检查下方是否有方块
     * @returns 
     */
    checkEmpty() {
        for (let child of this.nextPanel.children) {
            if (child.children.length > 0) {
                return false;
            }
        }
        return true;
    }
}


