/**
 * @copyright www.egret.com
 * @author city
 * @desc 显示对象最基本的操作。
 *      显示对象可以是外部加载的JPG、PNG图片资源，也可以是程序绘制的形状。
 *      所有的显示对象显示均需要添加到显示列表。
 * @version 5.0.7
 */

class basicTest extends egret.DisplayObjectContainer {

    /// 旋转及缩放步长设定
    private static STEP_ROT:number = 3;
    private static STEP_SCALE:number = .03;

    public constructor() {
        super();
        this.once( egret.Event.ADDED_TO_STAGE, this.onAddToStage, this );
    }

    private onAddToStage(event:egret.Event) {
        var imgLoader:egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once( egret.Event.COMPLETE, this.imgLoadHandler, this );
        imgLoader.load( "resource/assets/egret_icon.png" );
    }

    private _txInfo:egret.TextField;
    private _bgInfo:egret.Shape;
    
    private imgLoadHandler( evt:egret.Event ):void{
        //获取加载到的纹理对象
        var bmd:egret.BitmapData = evt.currentTarget.data;
        // console.log(bmd)
        /*** 本示例关键代码段开始 ***/
        /// 将已加载完成的图像显示出来

        //创建纹理对象
        var texture = new egret.Texture();
        texture.bitmapData = bmd;
        //创建 Bitmap 进行显示
        var bird:egret.Bitmap = new egret.Bitmap( texture );
        bird.x = 100;
        bird.y = 100;
        this.addChild( bird );
        /*** 本示例关键代码段结束 ***/
            
        /// 为定位设置基准点(即锚点)
        bird.anchorOffsetX = bmd.width / 2;
        bird.anchorOffsetY = bmd.height / 2;
        bird.x = this.stage.stageWidth * .5;
        bird.y = this.stage.stageHeight * .5;
        
        /// 提示信息
        this._txInfo = new egret.TextField;
        this.addChild( this._txInfo );

        this._txInfo.size = 28;
        this._txInfo.x = 50;
        this._txInfo.y = 50;
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        this._txInfo.textColor = 0x000000;
        this._txInfo.type = egret.TextFieldType.DYNAMIC;
        this._txInfo.lineSpacing = 6;
        this._txInfo.multiline = true;
        
        this._txInfo.text =
                "轻触屏幕调整显示对象位置";

        this._bgInfo = new egret.Shape;
        this.addChildAt( this._bgInfo, this.numChildren - 1 );

        this._bgInfo.x = this._txInfo.x;
        this._bgInfo.y = this._txInfo.y;
        this._bgInfo.graphics.clear();
        this._bgInfo.graphics.beginFill( 0xffffff, .5 );
        this._bgInfo.graphics.drawRect( 0, 0, this._txInfo.width, this._txInfo.height );
        this._bgInfo.graphics.endFill();
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, ( evt:egret.TouchEvent )=>{
            bird.x = evt.localX ;
            bird.y = evt.localY ;
        }, this );
        
    }
    
}