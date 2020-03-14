import { IccOverlayComponentContent, IccOverlayComponentRef } from './overlay-component-ref';

export interface IccOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  shouldCloseOnBackdropClick?: boolean;
}

export interface IccOverlayParams<T> {
  origin: HTMLElement;
  content: IccOverlayComponentContent<T>;
  data?: T;
  width?: string | number;
  height?: string | number;
}

