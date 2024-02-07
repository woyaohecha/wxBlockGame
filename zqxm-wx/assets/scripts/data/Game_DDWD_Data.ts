import { _decorator, Component, Node, SpriteFrame, resources, Prefab } from 'cc';
import { Res_DDWD_Config } from '../config/Res_DDWD_Config';
import { User_DDWD_Data } from './User_DDWD_Data';
const { ccclass, property } = _decorator;

@ccclass('Game_DDWD_Data')
export class Game_DDWD_Data {

    private static boss_DDWD_Imgs: SpriteFrame[] = [];
    private static boss_DDWD_Prefabs: Prefab[] = [];

    /**
     * 获取关卡数据
     * @param success 返回关卡数据
     * @param fail 
     */
    public static get_DDWD_LevelData(level: number) {

    }

    /**
     * 获取升级所需金币
     * @returns 
     */
    public static get_DDWD_AtkLevelUpGold() {
        return (User_DDWD_Data.getInstance().atkLevel + 1) * 20;
    }

    /**
     * 获取当前攻击力
     */
    public static get_DDWD_Atk() {
        return User_DDWD_Data.getInstance().atkLevel * 2 + 5;
    }

    /**
     * 获取当前关卡奖励
     * @returns 
     */
    public static get_DDWD_LevelReward() {
        return (User_DDWD_Data.getInstance().level + 2) * 15
    }

    public static getLevelBossHp() {
        return (User_DDWD_Data.getInstance().level + 10) * 2;
    }

    public static get_DDWD_BossImg(success: Function) {
        if (!this.boss_DDWD_Imgs[User_DDWD_Data.getInstance().level]) {
            let imgIndex = (User_DDWD_Data.getInstance().level) % 5;
            console.log("imgIndex:", imgIndex);
            resources.load(Res_DDWD_Config.bossImgPath + `/${imgIndex}/spriteFrame`, (e, img: SpriteFrame) => {
                if (e) {
                    console.error(e);
                    return;
                }
                this.boss_DDWD_Imgs[User_DDWD_Data.getInstance().level] = img;
                success(img);
            })
        } else {
            success(this.boss_DDWD_Imgs[User_DDWD_Data.getInstance().level]);
        }
    }

    public static get_DDWD_BossPrefab(success: Function) {
        if (!this.boss_DDWD_Prefabs[User_DDWD_Data.getInstance().level]) {
            let prefabIndex = (User_DDWD_Data.getInstance().level) % 5;
            console.log("prefabIndex:", prefabIndex);
            resources.load(Res_DDWD_Config.bossPrefabPath + prefabIndex, (e, prefab: Prefab) => {
                if (e) {
                    console.error(e);
                    return;
                }
                this.boss_DDWD_Prefabs[User_DDWD_Data.getInstance().level] = prefab;
                success(prefab);
            })
        } else {
            success(this.boss_DDWD_Prefabs[User_DDWD_Data.getInstance().level]);
        }
    }
}


