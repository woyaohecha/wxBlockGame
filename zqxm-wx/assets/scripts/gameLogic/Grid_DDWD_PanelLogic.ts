import { _decorator, Component, Node, resources, Prefab, instantiate, UITransform, Vec3, rect, Rect, Sprite, Color, Vec2, SpriteFrame, math } from 'cc';
import { Res_DDWD_Config } from '../config/Res_DDWD_Config';
import { Event_DDWD_Manager } from '../manager/Event_DDWD_Manager';
import { Block_DDWD_Logic } from './Block_DDWD_Logic';
import { Grid_DDWD_Logic } from './Grid_DDWD_Logic';
import { Next_DDWD_PanelLogic } from './Next_DDWD_PanelLogic';
const { ccclass, property } = _decorator;

@ccclass('Grid_DDWD_PanelLogic')
export class Grid_DDWD_PanelLogic extends Component {

    gridList: Node[][] = [];
    gridListTrans: Node[][] = [];
    gridPrefab: Prefab = null;

    nextPanelLogic: Next_DDWD_PanelLogic = null;

    onLoad() {
        this.nextPanelLogic = this.node.parent.getChildByName("NextPanel").getComponent(Next_DDWD_PanelLogic);
    }


    /**
     * 初始化格子容器
     */
    initGridPanel() {
        console.log("init gridPanel");
        if (!this.gridPrefab) {
            resources.load(Res_DDWD_Config.gridPath, (e, prefab: Prefab) => {
                if (e) {
                    console.error(e);
                    return;
                }
                this.gridPrefab = prefab;
                this.initGridPanel();
            })
        } else {
            if (!this.gridList || this.gridList.length == 0) {
                for (let i = 0; i < 8; i++) {
                    this.gridList[i] = [];
                    for (let j = 0; j < 8; j++) {
                        let grid = instantiate(this.gridPrefab);
                        grid.setParent(this.node);
                        this.gridList[i][j] = grid;
                        this.gridList[i][j].getComponent(Grid_DDWD_Logic).init();
                    }
                }
            } else {
                for (let i = 0; i < this.gridList.length; i++) {
                    for (let j = 0; j < this.gridList[i].length; j++) {
                        this.gridList[i][j].getComponent(Grid_DDWD_Logic).init();
                    }
                }
            }
            this.nextPanelLogic.initNextPanel();
        }
    }


    /**
     * 检查是否可以放置
     * @param block 
     */
    checkCanPlace(block: Node): any {
        let canPutGrid: Node[] = [];
        let spriteFrame: SpriteFrame = null;
        for (let k = 0; k < block.children.length; k++) {
            for (let i = 0; i < this.gridList.length; i++) {
                for (let j = 0; j < this.gridList[i].length; j++) {
                    let filled = this.gridList[i][j].getComponent(Grid_DDWD_Logic).filled;
                    if (filled) {
                        continue;
                    }
                    let isOverlap = this.checkNodeBound(block.children[k], this.gridList[i][j]);
                    if (isOverlap) {
                        canPutGrid.push(this.gridList[i][j])
                        spriteFrame = block.children[k].getComponent(Sprite).spriteFrame;
                    } else {
                        this.gridList[i][j].getComponent(Grid_DDWD_Logic).init();
                    }
                }
            }
        }
        let result = {
            canPutGrid: canPutGrid,
            spriteFrame: spriteFrame
        }

        if (canPutGrid.length == block.children.length) {
            for (let child of canPutGrid) {
                child.getComponent(Grid_DDWD_Logic).preSetImg(spriteFrame);
            }

            return result;
        } else {
            return null;
        }

    }


    /**
     * 检查是否有可以消除的
     */
    checkCanEliminate() {
        let canEliminateGrid = [];
        for (let i = 0; i < this.gridList.length; i++) {
            let count = 0;
            for (let j = 0; j < this.gridList[i].length; j++) {
                let gridLogic = this.gridList[i][j].getComponent(Grid_DDWD_Logic);
                if (gridLogic.filled) {
                    count++;
                }
            }
            if (count == this.gridList[i].length) {
                canEliminateGrid.push(this.gridList[i]);
            }
        }
        //转置矩阵
        if (this.gridListTrans.length == 0 || !this.gridListTrans) {
            this.gridListTrans = this.getTranspose(this.gridList);
        }
        for (let i = 0; i < this.gridListTrans.length; i++) {
            let count = 0;
            for (let j = 0; j < this.gridListTrans[i].length; j++) {
                let gridLogic = this.gridListTrans[i][j].getComponent(Grid_DDWD_Logic);
                if (gridLogic.filled) {
                    count++;
                }
            }
            if (count == this.gridListTrans[i].length) {
                canEliminateGrid.push(this.gridListTrans[i]);
            }
        }
        if (canEliminateGrid.length > 0) {
            for (let i = 0; i < canEliminateGrid.length; i++) {
                for (let j = 0; j < canEliminateGrid[i].length; j++) {
                    canEliminateGrid[i][j].getComponent(Grid_DDWD_Logic).init();
                }
                Event_DDWD_Manager.getInstance().emit("bossHurt");
            }
        }
        Event_DDWD_Manager.getInstance().emit("blockPlace");
    }

    /**
     * 查找是否有可以放置block的位置
     */
    findBlockEmpty(blockLogic: Block_DDWD_Logic): boolean {
        let type = blockLogic.getType();
        const bigRows = this.gridList.length;
        const bigCols = this.gridList[0].length;
        const smallRows = type.length;
        const smallCols = type[0].length;

        for (let i = 0; i <= bigRows - smallRows; i++) {
            for (let j = 0; j <= bigCols - smallCols; j++) {
                let match = true;
                for (let x = 0; x < smallRows; x++) {
                    for (let y = 0; y < smallCols; y++) {
                        if (this.gridList[i + x][j + y].getComponent(Grid_DDWD_Logic).filled && type[x][y] == 1) {
                            match = false;
                            break;
                        }
                    }
                    if (!match) {
                        break;
                    }
                }
                if (match) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 检查两个节点是否重合，满足四分之一面积即可
     * @param nodeA 被检查的点
     * @param nodeB 目标点
     */
    private checkNodeBound(nodeA: Node, nodeB: Node) {
        let worldPosA = nodeA.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO);
        let localPosA = nodeB.parent.getComponent(UITransform).convertToNodeSpaceAR(worldPosA);
        let rectB = nodeB.getComponent(UITransform).getBoundingBox();

        return rectB.contains(new Vec2(localPosA.x, localPosA.y));

    }



    private getTranspose(arr: any[][]): any[][] {
        const rows = arr.length;
        const cols = arr[0].length;
        const transpose: any[][] = [];

        for (let j = 0; j < cols; j++) {
            transpose[j] = [];
            for (let i = 0; i < rows; i++) {
                transpose[j][i] = arr[i][j];
            }
        }
        return transpose;
    }
}


