import { TemplateRef, Type } from '@angular/core';

export type IccOverlayComponentContent<T> = string | TemplateRef<T> | Type<T>;

export interface IccOverlayConfig {
  width?: string | number;
  height?: string | number;
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  shouldCloseOnBackdropClick?: boolean;
}

export interface IccOverlayContent<T> {
  content?: IccOverlayComponentContent<T>;
  data?: T;
}

export interface IccOverlayComponentCloseEvent<T = any> {
  type: 'backdropClick' | 'close';
  data: T;
}

