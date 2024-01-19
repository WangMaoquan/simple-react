export class Fiber {
  constructor(type, props, dom) {
    this.child = null;
    this.return = null;
    this.sibling = null;
    this.type = type;
    this.dom = dom;
    this.props = props;
    this.alternate = null; // 备份的fiber
    this.effectTag = undefined;
    this.stateHook = null;
  }
}

export function createFiber({ type, props, dom }) {
  return new Fiber(type, props, dom);
}
