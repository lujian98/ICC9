export interface IccGroupHeader {
  name: string;
  title?: string;
  titleClass?: string;
  align?: 'start' | 'center' | 'end';
  dragDisabled?: boolean;
  hidden?: boolean | string;
  index?: number; // auto assigned the first grouped header column index
  width?: number;       // auto calculated width based
  colspan?: number;     // auto calculated
  sticky?: boolean;
  stickyEnd?: boolean;
  left?: string | 'auto'; //= 'auto';
  right?: string | 'auto'; //  = 'auto'; fixedWidth?: number | 'auto';
}
