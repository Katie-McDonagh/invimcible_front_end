import store from "../../config/store";
import { SPRITE_SIZE, MAP_WIDTH, MAP_HEIGHT, SCRIPT_1 } from "../../config/constants";
import makeRequest from "../../components/API"

export default function handleMovement(player) {

  let canMove = true
  let doneP1 = false
  let doneP2 = false
  let doneP3 = false

  function getTiles() {
    return store.getState().map.tiles
  }

  function getNewPosition(oldPos, direction) {
    switch (direction) {
      case "WEST":
        return [oldPos[0] - SPRITE_SIZE, oldPos[1]];
      case "EAST":
        return [oldPos[0] + SPRITE_SIZE, oldPos[1]];
      case "NORTH":
        return [oldPos[0], oldPos[1] - SPRITE_SIZE];
      case "SOUTH":
        return [oldPos[0], oldPos[1] + SPRITE_SIZE];
      default:
    }
  }

  function getNewJumpPosition(oldPos, direction) {
    switch (direction) {
      case "EAST":
        return [oldPos[0] + (SPRITE_SIZE * 2), oldPos[1]];
      default:
    }
  }

  function getSpriteLocation(direction, walkIndex) {
    switch (direction) {
      case "SOUTH":
        return `${SPRITE_SIZE * walkIndex}px ${SPRITE_SIZE * 0}px`;
      case "EAST":
        return `${SPRITE_SIZE * walkIndex}px ${SPRITE_SIZE * 2}px`;
      case "WEST":
        return `${SPRITE_SIZE * walkIndex}px ${SPRITE_SIZE * 3}px`;
      case "NORTH":
        return `${SPRITE_SIZE * walkIndex}px ${SPRITE_SIZE * 1}px`;
      default:
    }
  }

  function getWalkIndex() {
    const walkIndex = store.getState().player.walkIndex;
    return walkIndex >= 2 ? 0 : walkIndex + 1;
  }

  function observeBoundaries(oldPos, newPos) {
    console.log(newPos)
    return (
      newPos[0] >= 0 &&
      newPos[0] <= MAP_WIDTH - SPRITE_SIZE &&
      newPos[1] >= 0 &&
      newPos[1] <= MAP_HEIGHT - SPRITE_SIZE
    );
  }

  function observeImpassable(oldPos, newPos) {
    const y = newPos[1] / SPRITE_SIZE;
    const x = newPos[0] / SPRITE_SIZE;
    const nextTile = getTiles()[y][x];
    return nextTile.blocked === false;
  }

  function dispatchMove(direction, newPos) {
    const walkIndex = getWalkIndex();
    store.dispatch({
      type: "UPDATE_PLAYER_STORE",
      payload: {
        position: newPos,
        direction: direction,
        walkIndex: walkIndex,
        spriteLocation: getSpriteLocation(direction, walkIndex),
      },
    });
    checkPositionEnd(newPos)
  }

  function checkPositionEnd(location) {
    const level = store.getState().map.level
    const y = location[1] / SPRITE_SIZE;
    const x = location[0] / SPRITE_SIZE;
    if (getTiles()[y][x].value === "E") {
      loadLevel(level + 1)
    }
  }

  function checkPothole(oldPos, newPos) { // why oldPos??
      const y = newPos[1] / SPRITE_SIZE;
      const x = newPos[0] / SPRITE_SIZE;
      const nextTile = getTiles()[y][x];
      if (nextTile.value === "BB") {
        return true
      }
    }

  function loadLevel(number) {
    makeRequest(number)
  }

  function VimCantMove() {
    canMove = false;
  }

  function VimMoves() {
    canMove = true;
  }

  function checkInteraction(newPos) {
    const y = newPos[1] / SPRITE_SIZE;
    const x = newPos[0] / SPRITE_SIZE;
    const nextTile = getTiles()[y][x];
    switch(nextTile.value) {
      case 'P1':
        if (doneP1 === false) {
          doneP1 = true
          return store.dispatch({ type: "ADD_SCRIPT", payload: SCRIPT_1.P1})
        } else { return }
      case 'P2':
        if (doneP2 === false) {
          doneP2 = true
          return store.dispatch({ type: "ADD_SCRIPT", payload: SCRIPT_1.P2})
        } else { return }
      case 'P3':
        if (doneP3 === false) {
          doneP3 = true
          return store.dispatch({ type: "ADD_SCRIPT", payload: SCRIPT_1.P3})
        } else { return }
    }
  }

  function attemptMove(direction) {
    const oldPos = store.getState().player.position;
    const newPos = getNewPosition(oldPos, direction);
    const loaded = store.getState().map.loaded;
    if (loaded) {
      if (
        observeBoundaries(oldPos, newPos) &&
        observeImpassable(oldPos, newPos) &&
        canMove
      ) {
        dispatchMove(direction, newPos);
      } else if (observeBoundaries(oldPos, newPos) && canMove){
        checkInteraction(newPos)
      } else if (canMove) {
        dispatchMove(direction, oldPos)
      }
    }
  }
      
  function attemptJump(direction){
    const oldPos = store.getState().player.position;
    const newPos = getNewJumpPosition(oldPos, direction);
    const potholePos = getNewPosition(oldPos, direction);
       
    if (
      checkPothole(oldPos, potholePos) &&
      canMove
    ) {
      dispatchMove(direction, newPos);
    }
    else {
      dispatchMove(direction, oldPos)
    }
  }
  

  function handleKeyDown(e) {
    if (canMove == true) e.preventDefault();

    switch (e.key) {
      case "h":
        return attemptMove("WEST");
      case "k":
        return attemptMove("NORTH");
      case "l":
        return attemptMove("EAST");
      case "j":
        return attemptMove("SOUTH");
      case "Backspace":
        if (store.getState().vimCommand.length === 1) {
          return VimMoves();
        } else { return }
      case ":":
        return VimCantMove();
      case "w":
        return attemptJump("EAST");
      default:
        return;
    }
  }

  window.addEventListener("keydown", (e) => {
    handleKeyDown(e);
  });

  return player;
}
