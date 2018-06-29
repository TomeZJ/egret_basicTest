//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
   
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private _icon:egret.Bitmap;
    private createBitmapByName(name: string): egret.Bitmap {
        let _icon:egret.Bitmap = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        _icon.texture = texture;
        return _icon;
    }
     /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        // this.addChild(topMask);

        let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        // console.log(icon)
       
        this.addChild(icon);

         /// 为定位设置基准点(即锚点)
        //  console.log(icon)
        icon.anchorOffsetX =35;
        icon.anchorOffsetY = 45;
        icon.x = 30;
        icon.y = 38;
        icon.rotation = 60;
        icon.scaleX = 1;
        icon.scaleY = 1;

        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, ( evt:egret.TouchEvent )=>{
            // console.log(evt.localX)
            icon.x = evt.localX ;
            icon.y = evt.localY ;
        }, this );

        let button = new eui.Button();
        button.label = "Click!";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        this.launchAnimations('egret_icon_png');
        this.onGet()
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }

    /*
    *   锚点及x旋转缩放
    *
    */ 
    // private _bird:egret.Bitmap;
    
    /// 旋转及缩放步长设定
    private STEP_ROT:number = 3;
    private STEP_SCALE:number = .03;
     /// 用于记录当前的模式，模式切换通过触摸舞台触发
    private _iAnimMode:number;
    private _nScaleBase:number;

    private launchAnimations(name):void {
        this._icon = this.createBitmapByName(name);
        
        this._iAnimMode = AnimModes.ANIM_ROT;
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            this._iAnimMode = ( this._iAnimMode + 1 ) % 3;
            // console.log("typetypetypetypetypetypetype："+this._iAnimMode)
        }, this );

        this._nScaleBase = 0;
        
        /// 根据当前模式调整旋转度数或缩放正弦基数形成相应动画
        this.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
            // console.log(evt)
            /*** 本示例关键代码段开始 ***/
            switch ( this._iAnimMode ){
                case AnimModes.ANIM_ROT:        /// 仅旋转
                    this._icon.rotation += this.STEP_ROT;
                    // console.log(this._icon)
                    // console.log("旋转:"+this._icon.rotation)
                    break;
                case AnimModes.ANIM_SCALE:        /// 仅缩放，缩放范围 0.5~1
                  
                    this._icon.scaleX = this._icon.scaleY = 0.5 + 0.5* Math.abs( Math.sin( this._nScaleBase += this.STEP_SCALE ) );
                    // console.log("缩放:"+this._icon.scaleX,this._icon.scaleY)
                    break;
            }
            /*** 本示例关键代码段结束 ***/

            // this._txInfo.text = 
            //       "旋转角度:" + this._bird.rotation 
            //     +"\n缩放比例:" + this._bird.scaleX.toFixed(2)
            //     +"\n\n轻触进入" +(["缩放","静止","旋转"][this._iAnimMode])+ "模式";
            
            // return false;  /// 友情提示： startTick 中回调返回值表示执行结束是否立即重绘
        }, this );
    }

    
    onGet() {


        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("http://httpbin.org/post", egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);   //成功
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);   //失败
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);   //进度


    }
    public requestRoomId: number;
    public requestUserId: number;
    onGetComplete(event: egret.Event) {  //成功
        var request = <egret.HttpRequest>event.currentTarget;
        console.log(request.response);
        var requestData = JSON.parse(request.response);
        console.log(requestData);

        this.requestRoomId = requestData.data.roomId;
        this.requestUserId = requestData.data.userId;


        var responseLabel = new egret.TextField();
        responseLabel.size = 18;
        this.addChild(responseLabel);

        responseLabel.text = "I'm Jack, I will use Egret create a fantasy mobile game!"; 
        responseLabel.x = 50;
        responseLabel.y = 70;

        // this.onWebSocket()

    }

    onGetIOError(event: egret.IOErrorEvent) {
        console.log("get error : " + event);
    }

    onGetProgress(event: egret.ProgressEvent) {
        console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }
}

class AnimModes{
    public static ANIM_ROT:number = 0;
    public static ANIM_SCALE:number = 1;
}