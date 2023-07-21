import './App.css';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

import texture1 from './assets/texture 1.png';
import texture2 from './assets/texture 2.png';
import texture3 from './assets/texture 3.png';
import texture4 from './assets/texture 4.png';
import texture5 from './assets/texture 5.png';
import texture6 from './assets/texture 6.png';
import texture7 from './assets/texture 7.png';

// const textures = {
//   0: {
//     id: 0,
//     texturePath: texture7,
//     up: [0,1,3,6],
//     down: [0,1,4,5],
//     left: [0,2,5,6],
//     right: [0,2,3,4],
//   },
//   1: {
//     id: 1,
//     texturePath: texture1,
//     up: [0,1,4,5],
//     down: [0,1,4,5],
//     left: [1, 3, 4],
//     right: [1, 5, 6],
//   },
//   2: {
//     id: 2,
//     texturePath: texture2,
//     up: [2,4,5],
//     down: [2,3,6],
//     left: [0,2,5,6],
//     right: [0,2,3,4],
//   },
//   3: {
//     id: 3,
//     texturePath: texture3,
//     up: [2, 4, 5],
//     down: [0, 1, 4, 5],
//     left: [0, 2, 5, 6],
//     right: [1, 5, 6],
//   },
//   4: {
//     id: 4,
//     texturePath: texture4,
//     up: [0,1,3,6],
//     down: [2, 3, 6],
//     left: [0, 2, 5, 6],
//     right: [1, 5, 6],
//   },
//   5: {
//     id: 5,
//     texturePath: texture5,
//     up: [0,1,3,6],
//     down: [2, 3, 6],
//     left: [1, 3, 4],
//     right: [0,2,3,4],
//   },
//   6: {
//     id: 6,
//     texturePath: texture6,
//     up: [2, 4, 5],
//     down: [0,1,4,5],
//     left: [1, 3, 4],
//     right: [0,2,3,4],
//   },
//   7: {
//     id: 7,
//     texturePath: null,
//     up: [0,1,2, 3,4, 5,6],
//     down: [0,1,2, 3,4, 5,6],
//     left: [0,1,2, 3,4, 5,6],
//     right: [0,1,2, 3,4, 5,6],
//   }
// }

const textures = {
    1: {
      id: 1,
      texturePath: texture7,
      up: [1, 2, 4, 7],
      down: [1, 2, 5, 6],
      left: [1, 3, 6, 7],
      right: [1, 3, 4, 5]
    },
    2: {
      id: 2,
      texturePath: texture1,
      up: [1, 2, 4, 7],
      down: [1, 2, 5, 6],
      left: [2, 4, 5],
      right: [2, 6, 7]
    },
    3: {
      id: 3,
      texturePath: texture2,
      up: [3, 5, 6],
      down: [3, 4, 7],
      left: [1, 3, 6, 7],
      right: [1, 3, 4, 5]
    },
    4: {
      id: 4,
      texturePath: texture3,
      up: [3, 5, 6],
      down: [1, 2, 5, 6],
      left: [1, 3, 6, 7],
      right: [2, 6, 7]
    },
    5: {
      id: 5,
      texturePath: texture4,
      up: [1, 2, 4, 7],
      down: [3, 4, 7],
      left: [1, 3, 6, 7],
      right: [2, 6, 7]
    },
    6: {
      id: 6,
      texturePath: texture5,
      up: [1, 2, 4, 7],
      down: [3, 4, 7],
      left: [2, 4, 5],
      right: [1, 3, 4, 5]
    },
    7: {
      id: 7,
      texturePath: texture6,
      up: [3, 5, 6],
      down: [1, 2, 5, 6],
      left: [2, 4, 5],
      right: [1, 3, 4, 5]
    },
    8: {
      id: 8,
      texturePath: null,
      up: [1, 2, 3, 4, 5, 6, 7],
      down: [1, 2, 3, 4, 5, 6, 7],
      left: [1, 2, 3, 4, 5, 6, 7],
      right: [1, 2, 3, 4, 5, 6, 7]
    }
  }


const defaultScale = 10
const defaultCamera = {
  fov: 75,
  position: [0, 0, 100],
}

const generateBoard = (width, height) => {
  const tiles = []
  // generate a 2D array of tiles
  
  const getTextureSequence = (width, height) => {
    const textureSequence = []
    for(let h = 0; h < width; h++) {
      const rows = []
      for(let w = 0; w < height; w++) {
        rows.push({
          possibleTextures: [0,1,2,3,4,5,6],
          textureId: null,
          texturePath: null,
          pos: [w, h]
        })
      }
      textureSequence.push(rows)
    }

    const getTexturePossibilities = (x,y) => {

      const textureUp = y > 0 ? (textureSequence[y - 1][x].textureId || 8) : 8;
      const textureDown = y < height - 1? (textureSequence[y + 1][x].textureId || 8) : 8;
      const textureLeft = x > 0 ? (textureSequence[y][x - 1].textureId || 8) : 8;
      const textureRight = x < width - 1 ? (textureSequence[y][x + 1].textureId || 8) : 8;

      const hashMap = {}
      
      const sequenceSet = [
        textures[textureUp].down,
        textures[textureDown].up,
        textures[textureLeft].right,
        textures[textureRight].left,
      ]

      sequenceSet.forEach(seq => {
        seq.forEach(n => {
  
          if(!hashMap[n]) {
            hashMap[n] = 0 
          }
          hashMap[n] ++
        })
      }) 

     return Object.entries(hashMap).filter(([key,value]) => value === 4).map(([key, value]) => key)
    }

    const initX = Math.floor(Math.random() * width)
    const initY = Math.floor(Math.random() * height)
    
    textureSequence[0][0] = {
      possibleTextures: [],
      textureId: 1,
      texturePath: textures[1].texturePath,
      pos: [0,0]
    }

    while(true) {
      const[currentTile] = textureSequence.flat().sort((a,b) => a.possibleTextures.length - b.possibleTextures.length).filter(tile => !tile.textureId && !tile.texturePath).slice(0,1)
      if(!currentTile) {
        break;
      }
      const [x,y] = currentTile.pos
      const compatibleTiles = getTexturePossibilities(x,y)
      
      if(compatibleTiles.length === 0) {
        currentTile.textureId = 1
        currentTile.texturePath = textures[1].texturePath
        currentTile.possibleTextures = [] 
      } else {
        const randomTileId = compatibleTiles[Math.floor(Math.random() * compatibleTiles.length)][0]
        currentTile.textureId = textures[randomTileId].id
        currentTile.texturePath = textures[randomTileId].texturePath
        currentTile.possibleTextures = []
        
        if(y > 0) textureSequence[y - 1][x].possibleTextures = getTexturePossibilities(x, y - 1)
        if(y < height - 1) textureSequence[y + 1][x].possibleTextures = getTexturePossibilities(x, y + 1)
        if(x > 0) textureSequence[y][x - 1].possibleTextures = getTexturePossibilities(x - 1, y)
        if(x < width - 1) textureSequence[y][x + 1].possibleTextures = getTexturePossibilities(x + 1, y)
      }
    }
    return textureSequence
  }

  const textureSequence = getTextureSequence(width, height)
  
  for(let h = 0; h < width; h++) {
    const rows = []
    for(let w = 0; w < height; w++) {
      const {texturePath, textureId} = textureSequence[h][w]
      rows.push({
        scale: defaultScale,
        getScale: () => [defaultScale, defaultScale],
        texturePath,
        textureId,
        position: [w * defaultScale, width * defaultScale - h * defaultScale, 0]
      })
    }
    tiles.push(rows)
  }

  return tiles
}

//     const hashMap = {}
//     const [x, y] = coord

//     const textureUp = y > 0 ? (tiles[y - 1][x].textureId || 0) : 0;
//     const textureDown = y < height - 1? (tiles[y + 1][x].textureId || 0) : 0;
//     const textureLeft = x > 0 ? (tiles[y][x - 1].textureId || 0) : 0;
//     const textureRight = x < width - 1 ? (tiles[y][x + 1].textureId || 0) : 0;

//     const sequenceSet = [
//       textures[textureUp].down,
//       textures[textureDown].up,
//       textures[textureLeft].right,
//       textures[textureRight].left,
//     ]

//     sequenceSet.forEach(seq => {
//       seq.forEach(n => {

//         if(!hashMap[n]) {
//           hashMap[n] = 0 
//         }
//         hashMap[n] ++
//       })
//     }) 

//     const compatibleTiles = Object.entries(hashMap).filter(([key,value]) => value === 4)
//     if(compatibleTiles.length === 0) {
//       return textures[0]
//     }
//     const randomTileId = compatibleTiles[Math.floor(Math.random() * compatibleTiles.length)][0]
//     return textures[randomTileId]

//   }

//   const initX = Math.floor(Math.random() * width)
//   const initY = Math.floor(Math.random() * height)
//   // const initX = 0
//   // const initY = 0
//   const stack = [[initX, initY]]
//   while(stack.length > 0) {
//     const coord = stack.pop()
//     const [x, y] = coord
//     const compatibleTexture = getTexture(coord)
//     tiles[y][x].texturePath = compatibleTexture.texturePath 
//     tiles[y][x].textureId = compatibleTexture.id
//     if(x > 0 && !tiles[y][x-1].texturePath) {
//       stack.push([x-1, y])
//     }
//     if(x < width - 1 && !tiles[y][x+1].texturePath) {
//       stack.push([x+1, y])
//     }
//     if(y > 0 && !tiles[y-1][x].texturePath) {
//       stack.push([x, y-1])
//     }
//     if(y < height - 1 && !tiles[y+1][x].texturePath) {
//       stack.push([x, y+1])
//     }
//   }

//   return tiles
// }

const getTransform = ({width, height, scale}) => {
  return [-width * scale / 2, -height * scale / 2, 0]
}

const Board = ({ width, height}) => {
  
  const [tiles, setTiles] = useState([])

  useEffect(() => {
    const tiles = generateBoard(width, height).flat()
    setTiles(tiles)
  }, [])
  console.log(tiles)
  return (<group position={getTransform({width, height, scale: defaultScale})}>
          {tiles.map((tileProps, index) => <Tile key={index} {...tileProps}/>)}
        </group>)
}

const Tile = ({texturePath, getScale, position}) => {
  const texture = useLoader(THREE.TextureLoader, texturePath);
  return (
    <mesh position={position}>
      <planeBufferGeometry attach="geometry" args={getScale()} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }}>

    <Canvas
      camera={defaultCamera}
    >
      <directionalLight intensity={0.5} />
      <OrbitControls/>
      <ambientLight intensity={0.5} />
        <Board width={30} height={30}/>
    </Canvas>
  </div>
  );
}

export default App;
