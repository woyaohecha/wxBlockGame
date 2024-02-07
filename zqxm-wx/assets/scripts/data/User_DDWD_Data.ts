import { Label, SpriteFrame, sys, tweenUtil, utils, _decorator } from 'cc';
import { Util } from '../Util';
import { Game_DDWD_Data } from './Game_DDWD_Data';
const { ccclass, property } = _decorator;

@ccclass('User_DDWD_Data')
export class User_DDWD_Data {

    private static _userData: User_DDWD_Data;

    public static getInstance() {
        if (!this._userData) {
            this._userData = new User_DDWD_Data();
        }
        return this._userData;
    }


    /**
     * 关卡进度
     */
    get level() {
        let _level = sys.localStorage.getItem("level");
        return Number(_level);
    }
    set level(value: number) {
        sys.localStorage.setItem("level", `${value}`);
    }

    /**
     * 今天是否签到过
     */
    get signed() {
        let lastLoginData = sys.localStorage.getItem("lastLoginData");
        if (!lastLoginData || (lastLoginData && Util.isNewDay(JSON.parse(lastLoginData)))) {
            console.log("new day");
            sys.localStorage.setItem("lastLoginData", JSON.stringify(new Date()));
            return false;
        } else {
            console.log("not new day");
            let signed = sys.localStorage.getItem("signed");
            return Boolean(signed && JSON.parse(signed));
        }
    }
    set signed(value: boolean) {
        sys.localStorage.setItem("signed", JSON.stringify(true));
    }

    /**
     * 金币
     */
    get gold() {
        let _gold = sys.localStorage.getItem("gold");
        return Number(_gold);
    }
    set gold(value: number) {
        sys.localStorage.setItem("gold", `${value}`);
    }

    /**
     * 攻击力等级
     */
    get atkLevel() {
        let _atkLevel = sys.localStorage.getItem("atkLevel");
        return Number(_atkLevel);
    }
    set atkLevel(value: number) {
        sys.localStorage.setItem("atkLevel", `${value}`);
    }

    /**
     * 升级攻击力等级
     */
    atkLevelUp(success: Function, fail: Function) {
        if (this.gold >= Game_DDWD_Data.get_DDWD_AtkLevelUpGold()) {
            this.gold -= Game_DDWD_Data.get_DDWD_AtkLevelUpGold();
            this.atkLevel += 1;
            success(this.gold, Game_DDWD_Data.get_DDWD_Atk(), Game_DDWD_Data.get_DDWD_AtkLevelUpGold());
        } else {
            let msg = "金币不足";
            fail(msg);
        }

    }
}


