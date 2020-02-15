export class IccRowGroup {
  level = 0;
  parent: IccRowGroup;
  expanded = true;
  field = '';
  value = '';
  totalCounts = 0;
  isDisplayed = false;
  displayedCounts = 0;

  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }

  isSameGroup(group: IccRowGroup): boolean {
    if (this.isSameParent(group, this)) {
      return this.field === group.field && this[this.field] === group[group.field];
    }
  }

  isSameParent(group: IccRowGroup, myGroup: IccRowGroup): boolean {
    if (myGroup.level === group.level) {
      if (myGroup.level === 0) {
        return true;
      } else {
        if (group.parent[group.parent.field] === myGroup.parent[myGroup.parent.field]) {
          return this.isSameParent(group.parent, myGroup.parent);
        }
      }
    }
  }
}
