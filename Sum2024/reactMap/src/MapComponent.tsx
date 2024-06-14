import React, { useState } from 'react';
import Map, {
  Marker,
  Source,
  ViewStateChangeEvent
} from '../node_modules/react-map-gl/dist/es5/exports-maplibre.js';
import {
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  MapLibreEvent
} from '../node_modules/maplibre-gl/dist/maplibre-gl.js';
import maplibregl from '../node_modules/maplibre-gl/dist/maplibre-gl.js';
import { WeatherComponent } from './WeatherComponent.js';

export function MapComponent() {
  const [mouseState, setMouseState] = useState({
    x: 0,
    y: 0,
    latitude: 0,
    longitude: 0,
    clicked: false
  });

  function setMouseDblClick(e: MapLayerMouseEvent) {
    setMouseState({
      x: e.point.x,
      y: e.point.y,
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
      clicked: true
    });

    e.preventDefault();
  }

  function setMouseTouch(e: MapLayerTouchEvent) {
    setMouseState({
      x: e.point.x,
      y: e.point.y,
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
      clicked: true
    });

    e.preventDefault();
  }

  return (
    <div>
      <Map
        id="map"
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1
        }}
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0'
        }}
        mapStyle="https://api.maptiler.com/maps/basic-v2-dark/style.json?key=082QfNOqotVNQRsJIjnj" //https://demotiles.maplibre.org/style.json
        onDblClick={setMouseDblClick}
        onTouchCancel={setMouseTouch}
      >
        <WeatherComponent
          x={mouseState.x}
          y={mouseState.y}
          latitude={mouseState.latitude}
          longitude={mouseState.longitude}
          clicked={mouseState.clicked}
        ></WeatherComponent>
      </Map>
    </div>
  );
}
