import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Grid_DDWD_Logic')
export class Grid_DDWD_Logic extends Component {
    /**
     * 消除特效
     */
    effect: any = null;

    sprite: Sprite = null;
    initImg: SpriteFrame = null;
    filled: boolean = false;
    fillImg: SpriteFrame = null;

    onLoad() {
        this.sprite = this.node.getComponent(Sprite);
        this.initImg = this.sprite.spriteFrame;
    }

    /**
     * 初始化grid
     */
    init() {
        this.filled = false;
        this.sprite.spriteFrame = this.initImg;
        this.sprite.color = new Color().fromHEX("#999999ff")
        this.sprite.grayscale = false;
    }

    /**
     * 设置预览图
     * @param spriteFrame 
     */
    preSetImg(spriteFrame: SpriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.color = new Color().fromHEX("#ffffff64")
    }

    /**
     * 设置为不可放置不可拖动状态
     */
    setGray() {
        this.sprite.grayscale = true;
    }


    /**
     * 设置对应图片
     * @param spriteFrame 
     */
    setImg(spriteFrame: SpriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.color = new Color().fromHEX("#ffffffff")
        this.filled = true;
    }
}


