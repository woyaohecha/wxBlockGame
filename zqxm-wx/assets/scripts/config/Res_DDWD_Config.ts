import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Res_DDWD_Config')
export class Res_DDWD_Config {

    /**
     * 通用消息弹窗预制体path
     */
    public static readonly msgPath = {
        tips: "msg/Tips",
        toast: "msg/Toast",
        loading: "msg/Loading"
    }

    public static readonly defaultImgPath = "img/UserImg/spriteFrame";

    public static readonly taskPrefabPath = "prefab/item/TaskItem"

    public static readonly signPrefabPath = "prefab/item/SignItem"

    public static readonly blockPath = "prefab/blockType/Block_"

    public static readonly blockImgPath = "blockImg";

    public static readonly gridPath = "prefab/item/GridItem";

    public static readonly bossImgPath = "bossImg"

    public static readonly bossPrefabPath = "bossPrefab/Monster_"

    public static readonly ABPath = {

    }
}


