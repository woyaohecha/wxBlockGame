import { _decorator, Component, Node, Label, director, resources, Prefab, instantiate, Vec3, Widget, UITransform, Layers, Canvas, find, Acceleration, Button } from 'cc';
import { Res_DDWD_Config } from '../config/Res_DDWD_Config';
const { ccclass, property } = _decorator;

/**
 * todo:常驻节点根据层级，动态加入到某个层级中
 */
@ccclass('Tips_DDWD_Manager')
export class Tips_DDWD_Manager {
    private static _messageManager: Tips_DDWD_Manager;

    public static getInstance(): Tips_DDWD_Manager {
        if (!this._messageManager) {
            this._messageManager = new Tips_DDWD_Manager();
        }
        return this._messageManager;
    }

    /**
     * 消息提示根节点
     */
    private msgRoot_2D: Node;

    /**
     * 消息节点
     */
    private tips: Node;
    private toast: Node;
    private loading: Node;

    /**
     * 查找场景常驻节点---2D 
     * tips节点 
     * toast节点
     * loading节点
     */
    constructor() {
        this.msgRoot_2D = find("Root2D");
    }

    private tipsTimeoutId = null;
    /**
     * 展示提示文字,自动关闭
     * @param msg 提示文字内容
     * @param timeout 展示时间，单位秒，默认2秒
     * @param callback 关闭提示信息后的回调
     * @returns 
     */
    showTips(msg: string, timeout?: number) {
        if (this.tipsTimeoutId) {
            clearTimeout(this.tipsTimeoutId);
        }
        let setTips = () => {
            let tipsLabel = this.tips.getChildByName("Msg").getComponent(Label);
            tipsLabel.string = msg;
            this.tips.active = true;
            this.tipsTimeoutId = setTimeout(() => {
                this.tips.active = false;
                this.tipsTimeoutId = null;
            }, timeout ? timeout * 1000 : 2000);
        }
        if (this.tips) {
            this.tips.active = false;
            setTimeout(() => {
                setTips();
            }, 100);
        } else {
            resources.load(Res_DDWD_Config.msgPath.tips, (e, asset: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.tips = instantiate(asset);
                this.msgRoot_2D.addChild(this.tips);
                this.tips.setSiblingIndex(2);
                this.tips.setPosition(Vec3.ZERO);
                setTips();
            })
        }
    }

    /**
     * 展示弹窗信息，手动关闭
     * @param msgObj 消息对象，含标题，内容，按钮文字
     * @param btnClick 向按钮注入的点击方法,默认关闭弹窗
     * @param fullClose 是否支持全屏关闭,默认不支持
     */
    showToast(msgObj: { title: string, msg: string, btn: string }, btnClick?: Function, fullClose?: boolean) {
        let setToast = () => {
            let titleLabel = this.toast.getChildByName("Title").getComponent(Label);
            let msgLabel = this.toast.getChildByName("Msg").getComponent(Label);
            let btnLabel = this.toast.getChildByName("Btn").getComponent(Label);
            titleLabel.string = msgObj.title;
            msgLabel.string = msgObj.msg;
            btnLabel.string = msgObj.btn;
            this.toast.active = true;

            //向按钮注入点击事件
            let btnComp = btnLabel.getComponent(Button);
            let btnClickEvent = btnClick ? btnClick : this.hideToast;
            btnComp.node.on(Button.EventType.CLICK, btnClickEvent, this);

            if (fullClose) {
                let fullBtn = this.toast.getComponent(Button);
                fullBtn.node.on(Button.EventType.CLICK, this.hideToast, this);
            }
        }
        if (this.toast) {
            setToast();
        } else {
            resources.load(Res_DDWD_Config.msgPath.toast, (e, asset: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.toast = instantiate(asset);
                this.msgRoot_2D.addChild(this.toast);
                this.toast.setSiblingIndex(0);
                this.toast.setPosition(Vec3.ZERO);
                setToast();
            })
        }
    }

    /**
     * 关闭弹窗信息
     * @returns 
     */
    hideToast() {
        if (!this.toast) {
            return;
        }

        let btnComp = this.toast.getChildByName("Btn").getComponent(Button);
        btnComp.node.off(Button.EventType.CLICK);

        let fullBtn = this.toast.getComponent(Button);
        fullBtn.node.off(Button.EventType.CLICK);

        this.toast.active = false;
    }

    /**
     * 展示加载页面，需主动调用关闭
     * @param msg 加载页面文字信息
     * @returns 
     */
    showLoading(msg: string) {
        let setLoading = () => {

            let loadingLabel = this.loading.getChildByName("Msg").getComponent(Label);
            loadingLabel.string = msg;
            this.loading.active = true;
        }
        if (this.loading) {
            setLoading();
        } else {
            resources.load(Res_DDWD_Config.msgPath.loading, (e, asset: Prefab) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.loading = instantiate(asset);
                this.msgRoot_2D.addChild(this.loading);
                this.loading.setSiblingIndex(1);
                this.loading.setPosition(Vec3.ZERO);
                setLoading();
            })
        }
    }

    /**
     * 关闭加载页面
     */
    hideLoading() {
        if (!this.loading) {
            return;
        }
        this.loading.active = false;
    }
}


