import { TemplateRef, Type } from '@angular/core';

// export type IccOverlayComponentContent<T> = string | TemplateRef<T> | Type<T>;

export interface IccOverlayConfig {
  width?: string | number;
  height?: string | number;
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  shouldCloseOnBackdropClick?: boolean;
  position?: string;
}

export const DEFAULT_CONFIG: IccOverlayConfig = {
  panelClass: 'icc-overlay',
  hasBackdrop: false,
  backdropClass: 'icc-overlay-backdrop',
  shouldCloseOnBackdropClick: true
};

export interface IccOverlayComponentCloseEvent<T = any> {
  type: 'backdropClick' | 'close';
  context?: {};
}

