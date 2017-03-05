import { observable, toJS } from "mobx";
import { groupTypes, physicalTypes, entitySchemas } from "./constants";
import ice from "icepick";

export class LevelStore {
  constructor(entities) {
    this.entityStates = observable([entities]);
    window.t = o=> console.table(toJS(this.entityStates))
  }

  get entities() {
    return this.entityStates[this.entityStates.length - 1];
  }

  get playerIndex() {
    return this.entities.findIndex(ent => ent.isPlayer);
  }

  get player() {
    return this.entities[this.playerIndex];

    for (const entity of this.entities) {
      if (entity.isPlayer) {
        return entity;
      }
    }
  }

  tryMove(axis, step) {
    const playerPos = this.player.position;
    console.log(playerPos.x, playerPos.y);
    const positionToTry = {
      ...playerPos,
      [axis]: playerPos[axis] + step
    };

    const entities = this.entities;
    const entityThereIndex = entities.findIndex(
      ent =>
        ent.physicalType &&
          ent.position.x === positionToTry.x &&
          ent.position.y === positionToTry.y
    );
    const entityThere = entities[entityThereIndex];
    if (entityThere) {
      if (entityThere.physicalType === physicalTypes.obstacle) {
        return;
      }

      if (entityThere.physicalType === physicalTypes.pushable) {
        const nextPositionOver = {
          ...playerPos,
          [axis]: playerPos[axis] + step * 2
        };
        const nextEntityOver = entities.find(
          ent =>
            ent.position.x === nextPositionOver.x &&
              ent.position.y === nextPositionOver.y
        );

        if (nextEntityOver && nextEntityOver.physicalType) {
          return;
        }
        //console.log("st");
        this.entityStates.push(
          ice
            .chain(entities.peek())
            .setIn(
              [entityThereIndex, "position", axis],
              entityThere.position[axis] + step
            )
            .setIn([this.playerIndex, "position", axis], playerPos[axis] + step)
            .value()
        );
        //entityThere.position[axis] += step;

        return;
      }
    }

    this.entityStates.push(
      (
        ice.setIn(
          entities.peek(),
          [this.playerIndex, "position", axis],
          playerPos[axis] + step
        ) 
      )
    );
    console.log("after", this.player.position.x, this.player.position.y);
    //this.player.position[axis] += step;
  }
}
