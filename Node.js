function Node(pos) {
    this.position = pos;
    this.f = 0;
    this.g = 0;
    this.closed = false;
    this.parent = null;
    this.open = false;
}