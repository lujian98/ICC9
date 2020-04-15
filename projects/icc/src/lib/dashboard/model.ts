
import { IccPortalContent } from '../portal/model';

export interface Tile <T> {
  name: string;
  title?: string;
  index?: number;
  header?: string;
  rowStart?: number;
  colStart?: number;
  rowHeight?: number;
  colWidth?: number;
  color?: string;
  gridColumn?: string;
  gridRow?: string;
  content?: IccPortalContent<T>;
  context?: {};
}

export interface TileInfo {
  rowStart: number;
  colStart: number;
  rowHeight: number;
  colWidth: number;
}

export interface ResizeInfo {
  direction: string;
  element: HTMLDivElement;
  isResized: boolean;
  origin: string;
  width: number;
  height: number;
  dx: number;
  dy: number;
  scaleX: number;
  scaleY: number;
  signX: number;
  signY: number;
}

export interface ResizeMap {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  colChange: number;
  rowChange: number;
}

export interface DxyPosition {
  dx: number;
  dy: number;
}

