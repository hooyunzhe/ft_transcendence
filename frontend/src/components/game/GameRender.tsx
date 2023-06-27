import { Container } from "@mui/material";
import { AnimatedSprite, Sprite, Stage, createRoot } from "@pixi/react";
import { Asset } from "next/font/google";
import { Application, Assets, Spritesheet, Texture } from "pixi.js";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import AssetLoader from "./AssetLoader";

interface GameRenderProps {
  gameSocket: Socket;
}

export default function GameRender({gameSocket}: GameRenderProps)
{
  const [textures, setTextures] = useState<Texture[]>([]);

  useEffect(() => {
    AssetLoader();
    // const loadSpritesheet = () => {
    //   const spritesheet = Assets.get('/ball/ballsprite.json');

    //   if (spritesheet) {
    //     const loadedTextures: Texture[] = Object.keys(spritesheet.textures).map(
    //       (textureName) => spritesheet.textures[textureName]
    //     );
    //     setTextures(loadedTextures);
    //   } else {
    //     console.error('Failed to load spritesheet.');
    //   }
    // };

    // loadSpritesheet();
  }, []);
  return (
    <div>
      <Stage width={800} height={600}>
          <Sprite image={'paddle1'}></Sprite>
          {/* <AnimatedSprite isPlaying={true} animationSpeed={0.5} textures={textures}  initialFrame={0}></AnimatedSprite> */}
      </Stage>
    </div>
  );
}