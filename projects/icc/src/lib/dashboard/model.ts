
import { IccPortalContent } from '../components/portal/model';

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

