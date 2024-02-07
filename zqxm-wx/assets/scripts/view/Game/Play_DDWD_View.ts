import { _decorator, Component, Label, Node, Sprite, ProgressBar, Animation, animation, instantiate, AnimationState } from 'cc';
import { Game_DDWD_Data } from '../../data/Game_DDWD_Data';
import { User_DDWD_Data } from '../../data/User_DDWD_Data';
import { Grid_DDWD_PanelLogic } from '../../gameLogic/Grid_DDWD_PanelLogic';
import { Next_DDWD_PanelLogic } from '../../gameLogic/Next_DDWD_PanelLogic';
import { Event_DDWD_Manager } from '../../manager/Event_DDWD_Manager';
import { Game_DDWD_Page } from './Game_DDWD_Page';
const { ccclass, property } = _decorator;

@ccclass('Play_DDWD_View')
export class Play_DDWD_View extends Component {

    @property(Label)
    levelLabel: Label = null;

    @property(Label)
    bossHpLabel: Label = null;

    @property(ProgressBar)
    bossHpProgress: ProgressBar = null;

    @property(Sprite)
    bossImg: Sprite = null;

    @property(Label)
    atkLabel: Label = null;

    @property(Node)
    role: Node = null;

    roleAnim: Animation = null;
    bossAnim: Animation = null;
    boss: Node = null;



    /**
     * 当前关卡
     */
    private _level: number = 0;
    set level(value: number) {
        this._level = value;
        this.levelLabel.string = `第${this.level + 1}关`;
    }
    get level() {
        return this._level;
    }

    /**
     * 当前关卡bossHp
     */
    private _bossHp: number = 0;
    set bossHp(value: number) {
        this._bossHp = value;
        this.bossHpLabel.string = `${this._bossHp}`;
        this.bossHpProgress.progress = this._bossHp / Game_DDWD_Data.getLevelBossHp();
    }
    get bossHp() {
        return this._bossHp;
    }

    /**
     * 当前攻击力
     */
    private _atk: number = 0;
    set atk(value: number) {
        this._atk = value;
        this.atkLabel.string = `${this._atk}`;
    }
    get atk() {
        return this._atk;
    }


    nextPanelLogic: Next_DDWD_PanelLogic = null;
    gridPanelLogic: Grid_DDWD_PanelLogic = null;

    onLoad() {
        this.gridPanelLogic = this.node.getChildByName("GridPanel").getComponent(Grid_DDWD_PanelLogic);
        this.nextPanelLogic = this.node.getChildByName("NextPanel").getComponent(Next_DDWD_PanelLogic);
        Event_DDWD_Manager.getInstance().on("bossHurt", this.bossHurt, this);
        this.roleAnim = this.role.getComponent(Animation);
    }

    initGamePage() {
        console.log("Play_DDWD_View init");
        this.level = User_DDWD_Data.getInstance().level;
        this.bossHp = Game_DDWD_Data.getLevelBossHp();
        this.atk = Game_DDWD_Data.get_DDWD_Atk();
        this.bossImg.node.parent.getChildByName("Hurt").active = false;
        Game_DDWD_Data.get_DDWD_BossImg((img) => {
            this.bossImg.spriteFrame = img;
        })
        this.bossDie();
        Game_DDWD_Data.get_DDWD_BossPrefab((prefab) => {
            this.boss = instantiate(prefab);
            this.boss.parent = this.node;
            this.bossAnim = this.boss.getComponent(Animation);
            this.bossEnter();
            this.roleEnter();
        })
        this.gridPanelLogic.initGridPanel();
    }


    bossHurt() {
        // this.unscheduleAllCallbacks();
        if (!this.roleAnim.getState("role_atk").isPlaying) {
            this.roleAtk();
        }
        let hp = this.bossHp - this.atk;
        // this.bossImg.node.parent.getChildByName("Hurt").active = true;
        // this.scheduleOnce(() => {
        //     this.bossImg.node.parent.getChildByName("Hurt").active = false;
        // }, 0.5)
        this.scheduleOnce(() => {
            this.bossHit();
        }, 0.3)
        if (hp > 0) {
            this.bossHp -= this.atk;
        } else {
            this.bossHp = 0;
            this.bossDie();
            Event_DDWD_Manager.getInstance().emit("gameSettle", true);
        }
    }

    bossEnter() {
        this.bossAnim.once(Animation.EventType.FINISHED, () => {
            this.bossAnim.play("idle");
        })
        this.bossAnim.play("enter");
    }

    bossHit() {
        this.bossAnim.once(Animation.EventType.FINISHED, () => {
            this.bossAnim.play("idle");
        })
        this.bossAnim.play("hit");
    }

    bossDie() {
        if (this.boss && this.boss.isValid) {
            this.node.removeChild(this.boss);
        }
    }


    roleEnter() {
        this.roleAnim.once(Animation.EventType.FINISHED, () => {
            this.roleAnim.play("role_idle");
        })
        this.roleAnim.play("role_enter");
    }

    roleAtk() {
        this.roleAnim.once(Animation.EventType.FINISHED, () => {
            this.roleAnim.play("role_idle");
        })
        this.roleAnim.play("role_atk");
    }

    onBtnPause() {
        this.node.parent.getComponent(Game_DDWD_Page).onPause();
    }

    onBtnFresh() {
        this.node.getChildByName("NextPanel").getComponent(Next_DDWD_PanelLogic).freshThreeBlock();
    }

    onDisable() {
        Event_DDWD_Manager.getInstance().off("bossHurt", this.bossHurt, this);
    }
}


