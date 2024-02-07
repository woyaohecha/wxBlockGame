import { _decorator, Component, Node, director, find, ProgressBar, math, Label, EditBox, sys, debug, profiler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Load_DDWD_ing')
export class Load_DDWD_ing extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar = null;

    @property(Label)
    percentLabel: Label = null;

    private _progress: number = 0;
    private _preloadScene: boolean = false;

    private set progress(value: number) {
        this._progress = value > 1 ? 1 : value;
        this.progressBar.progress = this._progress;
        this.percentLabel.string = (this._progress * 100).toFixed(0) + "%";
    }

    private get progress() {
        return this._progress;
    }

    onLoad() {
        if (!window["wx"]) {
            window["vConsole"].$dom.style.display = "none"
        }

        profiler.hideStats();
        let root2D = find("Root2D");
        let root3D = find("Root3D");
        director.addPersistRootNode(root2D);
        director.addPersistRootNode(root3D);
        director.preloadScene("Home", () => {
            this._preloadScene = true;
        })
    }

    start() {
        this.init();
    }

    update(dt) {
        this.loadBar(dt);
    }

    init() {
        this.progress = 0;
    }

    loadBar(dt: number) {
        if (this.progress < 1) {
            this.progress += dt * math.random();
        } else {
            if (this._preloadScene) {
                this._preloadScene = false;
                director.loadScene("Home");
            }
        }
    }
}


