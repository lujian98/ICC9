import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ResizeInfo } from './model';

@Directive({
  selector: '[iccResize]'
})
export class IccResizeDirective implements OnInit, OnDestroy {
  @Input() direction: string;
  @Input() elementKey: string;

  private resizableMousedown: () => void;
  private resizableMousemove: () => void;
  private resizableMouseup: () => void;

  private isResizing = false;
  private resizeInfo: ResizeInfo;

  @Output() iccResizeEvent: EventEmitter<ResizeInfo> = new EventEmitter<ResizeInfo>();

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  ngOnInit(): void {
    // if (this.direction === 'leftRight') {
      // console.log(' 0000000000000 this.el.nativeElement =', this.el, ' this.direction=', this.direction);
    // }
    this.resizableMousedown = this.renderer.listen(document, 'mousedown', (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const el = document.elementFromPoint(event.x, event.y);
      const direction = el.getAttribute('direction');
      const elementKey = el.getAttribute('ng-reflect-element-key');
      if (!this.isResizing && elementKey === this.elementKey && direction === this.direction) {
        this.isResizing = true;
        this.setElementResize(event);
      }
    });
  }

  private setElementResize(e: MouseEvent) {
    // console.log(' ddddd dddd333333 this.el.nativeElement =', this.el, ' this.direction=', this.direction)
    let el = this.el.nativeElement.parentNode;
    if (this.direction === 'leftRight' || this.direction === 'topBottom') {
      el = this.el.nativeElement.previousElementSibling;
    } else if (this.direction === 'rightLeft' || this.direction === 'bottomTop') {
      el = this.el.nativeElement.nextElementSibling;
    }
    // console.log('ddddddddddddddddddd resize el =', el);

    const box = el.getBoundingClientRect();
    this.resizeInfo = {
      direction: this.direction,
      element: el,
      isResized: false,
      origin: null,
      width: box.width,
      height: box.height,
      dx: 0,
      dy: 0,
      scaleX: 1,
      scaleY: 1,
      signX: Math.abs(box.right - e.pageX) < 10 ? 1 : -1,
      signY: Math.abs(box.bottom - e.pageY) < 10 ? 1 : -1
    };
    this.resizableMousemove = this.renderer.listen(document, 'mousemove', (event: MouseEvent) => {
      if (this.isResizing && e && box) {
        this.resizeInfo.dx = event.pageX - e.pageX;
        this.resizeInfo.dy = event.pageY - e.pageY;
        this.resizeInfo.scaleX = (box.width + this.resizeInfo.signX * this.resizeInfo.dx) / box.width;
        this.resizeInfo.scaleY = (box.height + this.resizeInfo.signY * this.resizeInfo.dy) / box.height;
        this.elementTransform();
        if (this.resizeInfo.origin) {
          this.iccResizeEvent.emit(this.resizeInfo);
          if (this.direction === 'leftRight' || this.direction === 'rightLeft') {
            const width = this.resizeInfo.width * this.resizeInfo.scaleX;
            el.style.flex = `0 0 ${width}px`;
          } else if (this.direction === 'topBottom' || this.direction === 'bottomTop') {
            const height = this.resizeInfo.height * this.resizeInfo.scaleY;
            el.style.height = `${height}px`; // TODO test case
          } else {
            el.style['transform-origin'] = this.resizeInfo.origin;
            el.style.transform = `scale(${this.resizeInfo.scaleX}, ${this.resizeInfo.scaleY})`;
          }
        }
      }
    });
    this.resizableMouseup = this.renderer.listen(document, 'mouseup', (event: MouseEvent) => {
      if (this.isResizing && this.resizeInfo.origin) {
        el.style['transform-origin'] = '';
        el.style.transform = '';
        this.resizeInfo.isResized = true;
        this.iccResizeEvent.emit(this.resizeInfo);
        this.resizeInfo = null;
      }
      this.isResizing = false;
      event.preventDefault();
      event.stopPropagation();
      this.resizableMousemove();
      this.resizableMouseup();
    });
  }

  private elementTransform() {
    this.resizeInfo.origin = null;
    switch (this.direction) {
      case 'top':
      case 'topBottom':
        this.resizeInfo.origin = 'bottom';
        this.resizeInfo.scaleX = 1;
        break;
      case 'right':
      case 'leftRight':
        this.resizeInfo.origin = 'left';
        this.resizeInfo.scaleY = 1;
        break;
      case 'bottom':
      case 'bottomTop':
        this.resizeInfo.origin = 'top';
        this.resizeInfo.scaleX = 1;
        break;
      case 'left':
      case 'rightLeft':
        this.resizeInfo.origin = 'right';
        this.resizeInfo.scaleY = 1;
        break;
      case 'topLeft':
        this.resizeInfo.origin = 'bottom right';
        break;
      case 'topRight':
        this.resizeInfo.origin = 'bottom left';
        break;
      case 'bottomRight':
        this.resizeInfo.origin = 'top left';
        break;
      case 'bottomLeft':
        this.resizeInfo.origin = 'top right';
        break;
    }
  }

  ngOnDestroy() {
    this.resizableMousedown();
  }
}

