import { observable } from 'mobx';

const blockTypes = {
  obstacle: "lol nope",
  pushable: "You can pus me!"
};


@observable
class Entity {
  constructor({ position }) {
    this.position = position;
  }

  get isObstacle() {
    return this.blockType === blockTypes.obstacle;
  }

  get isPushable() {
    return this.blockType === blockTypes.pushable;
  }

  get isPhysical() {
    return this.isObstacle || this.isPushable;
  }
}

export Entity;

@observable
export class Player extends Entity {
  blockType = blockTypes.obstacle;
}

@observable
export class Target extends Entity {}

@observable
export class Box extends Entity {
  blockType = blockTypes.pushable;
}

@observable
export class Wall extends Entity {
  blockType = blockTypes.obstacle;
}
