export interface ItemNode {
  nodeId?: string; // unique node id assigned by system
  name: string;
  level?: number;
  expandable?: boolean;
  isExpanded?: boolean;
  children?: ItemNode[];
  status?: string;
}

export interface FlatTreeNode {
  nodeId?: string; // unique node id assigned by system
  name: string;
  level: number;
  expandable: boolean;
  isExpanded?: boolean;
}

export interface DropInfo {
  targetId: string;
  position?: string;
}