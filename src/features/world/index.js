import React from 'react'
import Map from '../map'
import Player from '../player'

import { tiles } from '../../maps/level_1'
import store from '../../config/store'

function World(props) {
  store.dispatch({ type: 'ADD_TILES', payload: {
    tiles: tiles,
  }})

  return (
    <div
      style={{
        position: 'relative',
        width: '800px',
        height: '480px',
        margin: '20px',
      }}
    >
      <Map />
      <Player />
    </div>
  )
}

export default World
