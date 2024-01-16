export class Fiber {
  constructor(type, props, dom) {
    this.type = type;
    this.dom = dom;
    this.props = props;
    this.child = null;
    this.return = null;
    this.sibling = null;
  }
}

export function createFiber({ type, props, dom }) {
  return new Fiber(type, props, dom);
}
