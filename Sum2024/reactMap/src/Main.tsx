import React from 'react';
import { createRoot } from 'react-dom/client';
import { MapComponent } from './MapComponent';
import { Map } from '../node_modules/maplibre-gl/dist/maplibre-gl';

async function onLoad() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const root = createRoot(rootElement);

  root.render(
    <div>
      <MapComponent></MapComponent>
    </div>
  );
}

window.onload = onLoad;
