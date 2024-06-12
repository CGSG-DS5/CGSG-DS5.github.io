import React from 'react';
import { useMap } from '../node_modules/react-map-gl/dist/es5/exports-maplibre';

export function MapImage(props: { imageName: string; imageID: string }) {
  const { current: map } = useMap();

  if (!map) return <></>;

  if (!map.hasImage(props.imageID)) {
    const image = new Image();
    image.src = props.imageName;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      map.addImage(props.imageID, image);
    };
  }

  return <></>;
}
