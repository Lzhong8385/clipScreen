import html2canvas from 'html2canvas';
// 样式
const cssText = {
  box: 'overflow:hidden;position:fixed;left:0;top:0;right:0;bottom:0;background-color:rgba(255,255,255,0.9);z-index: 100000;',
  img: '',
  mask: 'position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.6);',
  rect: 'position:absolute;border:1px solid #3e8ef7;box-sizing:border-box;cursor:move;user-select:none;background: url() no-repeat;',
  toolBox: 'position:absolute;top:0;left:0;padding:0 10px;background:#eee;line-height:2em;text-align:right;',
  toolBtn: 'font-weight:bold;color:#111;margin:0 1em;user-select:none;font-size:12px;cursor:pointer;',
}
/**
 * dom节点截图工具（基于html2canvas）
 * dom: 要截图的目标dom
 * options: { 
 *   // 以下三个回调方法作用域this指向构造函数
 *   success: function(res), //截图完成触发 参数为截图结果
 *   fail: function(), //取消截图触发
 *   complete: function(), //截图结束触发 success和fail都会触发
 * }
 */
class ClipScreen {
  constructor(dom, options) {
    if (window.ClipScreen) return false;
    window.ClipScreen = this;
    this.dom = dom;
    this.options = options;
    html2canvas(this.dom).then((canvas) => {
      let dataURL = canvas.toDataURL("image/png");
      this.imgUrl = dataURL;
      this.start();
    });
  }
  // 初始化
  start() {
    this.border = 2; //用于计算选区拖拽点和边界的判断
    this.win_w = window.innerWidth;
    this.win_h = window.innerHeight;
    let box = this.box = document.createElement('div');
    box.id = 'ClipScreen';
    box.style.cssText = cssText.box;
    let img = document.createElement('img');
    img.style.cssText = cssText.img;
    img.src = this.imgUrl;
    let mask = document.createElement('div');
    mask.style.cssText = cssText.mask;
    box.appendChild(img);
    box.appendChild(mask);
    document.body.appendChild(box);
    img.onload = (e) => {
      let w = img.offsetWidth,
        h = img.offsetHeight,
        win_w = window.innerWidth,
        win_h = window.innerHeight,
        left = (win_w - w) / 2,
        top = (win_h - h) / 2;
      img.style.position = 'absolute';
      img.style.left = left + 'px';
      img.style.top = top + 'px';
      img.style.width = w + 'px';
      img.style.height = h + 'px';
      this.axis = {
        left,
        top
      }
      this.img = img;
      this.bindEvent(mask);
    }
  }
  // 绑定蒙版事件、键盘事件
  bindEvent(mask) {
    document.onkeydown = (e) => {
      if (e.keyCode == 27) {
        this.cancel();
      }
    }
    mask.onmousedown = (e) => {
      let offsetX = e.offsetX,
        offsetY = e.offsetY;
      document.onmousemove = (e) => {
        let x = e.offsetX,
          y = e.offsetY,
          sx = offsetX,
          sy = offsetY,
          w = Math.abs(offsetX - x),
          h = Math.abs(offsetY - y);
        if (x < offsetX) sx = x;
        if (y < offsetY) sy = y;
        this.createRect(sx, sy, w, h);
      }
      document.onmouseup = (e) => {
        this.moveToolBox();
        this.rect.style.pointerEvents = 'initial';
        this.unbindMouseEvent();
      }
    }
  }
  // 创建矩形截图选区
  createRect(x, y, w, h) {
    let rect = this.rect;
    if (!rect) {
      rect = this.rect = document.createElement('div');
      rect.style.cssText = cssText.rect;
      rect.style.backgroundImage = 'url(' + this.imgUrl + ')';
      // this.newImg = document.createElement('img');
      // this.newImg.style.cssText = cssText.rect_img;
      // rect.appendChild(this.newImg);
      let doms = this.createPoints(rect);
      this.box.appendChild(rect);
      this.bindRectEvent(doms);
    }
    let border = this.border;
    if (x <= border) x = border;
    if (y <= border) y = border;
    if (x + w >= this.win_w - border) x = this.win_w - border - w;
    if (y + h >= this.win_h - border) y = this.win_h - border - h;
    rect.style.pointerEvents = 'none';
    rect.style.display = 'block';
    rect.style.left = x + 'px';
    rect.style.top = y + 'px';
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.backgroundPosition = (-x + this.axis.left - 1) + 'px ' + (-y + this.axis.top - 1) + 'px';
    if (this.toolBox) this.toolBox.style.display = 'none';
  }
  // 创建截图选区各个方位拉伸点
  createPoints(rect) {
    let
      lt = document.createElement('span'),
      tc = document.createElement('span'),
      rt = document.createElement('span'),
      rc = document.createElement('span'),
      rb = document.createElement('span'),
      bc = document.createElement('span'),
      lb = document.createElement('span'),
      lc = document.createElement('span');
    let c_style = 'position:absolute;width:5px;height:5px;background:#3e8ef7;';
    lt.style.cssText = c_style + 'left:-3px;top:-3px;cursor:nw-resize;';
    tc.style.cssText = c_style + 'left:50%;top:-3px;margin-left:-3px;cursor:ns-resize;';
    rt.style.cssText = c_style + 'right:-3px;top:-3px;cursor:ne-resize;';
    rc.style.cssText = c_style + 'top:50%;right:-3px;margin-top:-3px;cursor:ew-resize;';
    rb.style.cssText = c_style + 'right:-3px;bottom:-3px;cursor:nw-resize;';
    bc.style.cssText = c_style + 'left:50%;bottom:-3px;margin-left:-3px;cursor:ns-resize;';
    lb.style.cssText = c_style + 'left:-3px;bottom:-3px;cursor:ne-resize;';
    lc.style.cssText = c_style + 'top:50%;left:-3px;margin-top:-3px;cursor:ew-resize;';
    let res = {
      lt,
      tc,
      rt,
      rc,
      rb,
      bc,
      lb,
      lc
    }
    for (let k in res) {
      rect.appendChild(res[k])
    }
    res.rect = rect;
    return res;
  }
  // 生成 、移动工具
  moveToolBox() {
    let toolBox = this.toolBox;
    if (!toolBox) {
      toolBox = this.toolBox = document.createElement('div');
      toolBox.style.cssText = cssText.toolBox;
      let save = document.createElement('span'),
        cancel = document.createElement('span');
      save.innerText = '完成';
      cancel.innerText = '取消';
      save.style.cssText = cancel.style.cssText = cssText.toolBtn;
      toolBox.appendChild(cancel);
      toolBox.appendChild(save);
      this.box.appendChild(toolBox);
      this.bindToolBoxEvent(save, cancel);
    }
    toolBox.style.display = 'block';
    let border = this.border;
    let t_w = this.toolBox.offsetWidth,
      t_h = this.toolBox.offsetHeight,
      r_t = this.rect.offsetTop,
      r_h = this.rect.offsetHeight;
    let t = r_t + r_h + 10,
      l = this.rect.offsetLeft + this.rect.offsetWidth - t_w;
    if (l <= border) l = border;
    if (t >= this.win_h - border - t_h) t = r_t - t_h - 10;
    if (r_h >= this.win_h - border - t_h) {
      t = r_t + r_h - t_h - 10;
      l -= 10;
    }
    toolBox.style.top = t + 'px';
    toolBox.style.left = l + 'px';
  }
  // 绑定工具栏事件
  bindToolBoxEvent(save, cancel) {
    save.onclick = () => {
      this.success();
    }
    cancel.onclick = () => {
      this.cancel();
    }
  }
  // 绑定截图选区事件
  bindRectEvent(o) {
    o.rect.addEventListener("mousedown", (e) => {
      let border = this.border;
      let $target = e.target;
      let offsetX = e.x,
        offsetY = e.y;
      let r_w = o.rect.offsetWidth,
        r_h = o.rect.offsetHeight,
        r_l = o.rect.offsetLeft,
        r_t = o.rect.offsetTop;

      if ($target == o.rect) {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        document.onmousemove = (e) => {
          let dif_x = e.x - offsetX,
            dif_y = e.y - offsetY;
          if (dif_x <= border) dif_x = border;
          if (dif_y <= border) dif_y = border;
          if (dif_x + r_w >= this.win_w - border) dif_x = this.win_w - border - r_w;
          if (dif_y + r_h >= this.win_h - border) dif_y = this.win_h - border - r_h;
          o.rect.style.left = dif_x + 'px';
          o.rect.style.top = dif_y + 'px';
          o.rect.style.backgroundPosition = (-dif_x + this.axis.left - 1) + 'px ' + (-dif_y + this.axis.top - 1) + 'px';
          this.toolBox.style.display = 'none'
        }
      } else {
        document.onmousemove = (e) => {
          this.toolBox.style.display = 'none'
          this.transform($target, o, offsetX, offsetY, r_w, r_h, r_l, r_t, e)
        }
      }
      document.onmouseup = (e) => {
        this.moveToolBox();
        this.unbindMouseEvent();
      }
    })
  }
  // 拉伸选区
  transform($t, o, offsetX, offsetY, r_w, r_h, r_l, r_t, e) {
    let border = this.border;
    let x = e.x,
      y = e.y;
    if (x <= border) x = border;
    if (y <= border) y = border;
    if (x >= this.win_w - border) x = this.win_w - border;
    if (y >= this.win_h - border) y = this.win_h - border;
    let dif_x = x - offsetX,
      dif_y = y - offsetY;
    let min = 10;
    let left = r_l,
      top = r_t,
      width = r_w,
      height = r_h;
    if ($t == o.lt) {
      if (r_w - dif_x <= min || r_h - dif_y <= min) return false;
      left = r_l + dif_x;
      top = r_t + dif_y;
      width = r_w - dif_x;
      height = r_h - dif_y;
    } else if ($t == o.tc) {
      if (r_h - dif_y <= min) return false;
      top = r_t + dif_y;
      height = r_h - dif_y;
    } else if ($t == o.rt) {
      if (r_w + dif_x <= min || r_h - dif_y <= min) return false;
      top = r_t + dif_y;
      width = r_w + dif_x;
      height = r_h - dif_y;
    } else if ($t == o.rc) {
      if (r_w + dif_x <= min) return false;
      width = r_w + dif_x;
    } else if ($t == o.rb) {
      if (r_w + dif_x <= min || r_h + dif_y <= min) return false;
      width = r_w + dif_x;
      height = r_h + dif_y;
    } else if ($t == o.bc) {
      if (r_h + dif_y <= min) return false;
      height = r_h + dif_y;
    } else if ($t == o.lb) {
      if (r_w - dif_x <= min || r_h + dif_y <= min) return false;
      left = r_l + dif_x;
      width = r_w - dif_x;
      height = r_h + dif_y;
    } else if ($t == o.lc) {
      if (r_w - dif_x <= min) return false;
      left = r_l + dif_x;
      width = r_w - dif_x;
    }
    o.rect.style.left = left + 'px';
    o.rect.style.top = top + 'px';
    o.rect.style.width = width + 'px';
    o.rect.style.height = height + 'px';
    o.rect.style.backgroundPosition = (-left + this.axis.left - 1) + 'px ' + (-top + this.axis.top - 1) + 'px';
  }
  // 解绑事件
  unbindMouseEvent() {
    document.onmousemove = null;
    document.onmouseup = null;
  }
  // 生成base64图片
  getImagePortion(imgDom, new_w, new_h, s_x, s_y) {
    let sx = s_x - this.axis.left,
      sy = s_y - this.axis.top;
    let t_cv = document.createElement('canvas');
    let t_ct = t_cv.getContext('2d');
    t_cv.width = new_w;
    t_cv.height = new_h;

    let b_cv = document.createElement('canvas');
    let b_ct = b_cv.getContext('2d');
    b_cv.width = imgDom.width;
    b_cv.height = imgDom.height;
    b_ct.drawImage(imgDom, 0, 0);

    t_ct.drawImage(b_cv, sx, sy, new_w, new_h, 0, 0, new_w, new_h);
    let res = t_cv.toDataURL();
    return res;
  }
  // 完成
  success() {
    let imgBase64 = this.getImagePortion(this.img, this.rect.offsetWidth, this.rect.offsetHeight, this.rect.offsetLeft, this.rect.offsetTop);
    if (this.options) {
      this.options.success && this.options.success.call(this, imgBase64);
    }
    this.close();
  }
  // 取消
  cancel() {
    if (this.options) {
      this.options.fail && this.options.fail.call(this);
    }
    this.close();
  }
  // 关闭
  close() {
    if (this.options) {
      this.options.complete && this.options.complete.call(this);
    }
    this.distroy();
  }
  // 销毁
  distroy() {
    window.ClipScreen = undefined;
    this.box.remove();
  }
}
export default ClipScreen