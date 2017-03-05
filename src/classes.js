export class Entity {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

export class Player extends Entity {}
export class Target extends Entity {}
export class Box extends Entity {}
export class Wall extends Entity {}