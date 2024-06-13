import React, { SyntheticEvent, useState } from 'react';
import {
  Layer,
  LayerProps,
  Source
} from '../node_modules/react-map-gl/dist/es5/exports-maplibre';
import { MapImage } from './MapImage';
import { countryID } from './countries';

export function WeatherComponent(props: {
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  clicked: boolean;
}) {
  let [weather, setWeather] = useState({
    country: 'Unknown Country',
    prevTime: 0,
    latitude: 0,
    longitude: 0,
    temperature: '30°C',
    humidity: '47%',
    clouds: '04d'
  });

  if (
    Date.now() / 1000 - weather.prevTime > 60 ||
    props.latitude != weather.latitude ||
    props.longitude != weather.longitude
  ) {
    fetch(
      'https://api.openweathermap.org/data/2.5/weather?lat=' +
        props.latitude +
        '&lon=' +
        props.longitude +
        '&exclude=current' +
        '&units=metric' +
        '&appid=8b11f907f3cdc38aaafc8877ac6c1211' //8114b871e2d97cc61fcf4c14a3e5e8e8
    ).then((data) => {
      if (data == undefined || !data) return;
      data.text().then((text) => {
        if (text == undefined || !text) return;
        const result = JSON.parse(text);
        // console.log(result);
        let c: keyof typeof countryID = result.sys.country;

        if (c == undefined) c = '???';

        setWeather({
          country: countryID[c],
          prevTime: Date.now() / 1000,
          latitude: props.latitude,
          longitude: props.longitude,
          temperature: result.main.temp.toFixed(0) + '°C',
          humidity: result.main.humidity + '%',
          clouds: result.weather[0].icon
        });
      });
    });
  }

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [props.longitude, props.latitude]
        }
      }
    ]
  };

  const layerClouds: LayerProps = {
    type: 'symbol',
    layout: {
      'icon-anchor': 'bottom',
      'icon-image': weather.clouds,
      'icon-allow-overlap': true,
      'icon-offset': [45, -160],
      'icon-size': 0.8
    }
  };

  const layerTab: LayerProps = {
    type: 'symbol',
    layout: {
      'icon-anchor': 'bottom',
      'icon-image': 'tab',
      'icon-size': 0.5,
      'icon-allow-overlap': true,
      'text-anchor': 'bottom',
      'text-size': 20,
      'text-allow-overlap': true,
      'text-field': weather.temperature,
      'text-offset': [(-1 * 5) / 4, (-6 * 5) / 4]
    },
    paint: {
      'text-color': 'rgb(102, 204, 255)'
    }
  };

  const layerTab1: LayerProps = {
    type: 'symbol',
    layout: {
      'text-anchor': 'bottom',
      'text-size': 20,
      'text-allow-overlap': true,
      'text-field': 'Humidity: ' + weather.humidity,
      'text-offset': [(-0 * 5) / 4, (-3.5 * 5) / 4]
    },
    paint: {
      // 'text-color': 'rgb(0, 51, 153)'
      'text-color': 'rgb(102, 204, 255)'
    }
  };

  const layerTab2: LayerProps = {
    type: 'symbol',
    layout: {
      'text-anchor': 'bottom',
      'text-size': 20,
      'text-allow-overlap': true,
      'text-field': weather.country,
      'text-offset': [(-0 * 5) / 4, (-0.5 * 5) / 4],
      'text-max-width': 5
    },
    paint: {
      // 'text-color': 'rgb(0, 51, 153)'
      'text-color': 'rgb(102, 204, 255)'
    }
  };

  function displayWeatherTab() {
    return (
      <div>
        <MapImage
          imageName={
            'https://openweathermap.org/img/wn/' + weather.clouds + '@2x.png'
          }
          imageID={weather.clouds}
        ></MapImage>
        <MapImage imageName="../bin/weather.png" imageID="tab"></MapImage>
        <Source type="geojson" data={geojson}>
          <Layer {...layerTab} />
        </Source>
        <Source type="geojson" data={geojson}>
          <Layer {...layerClouds} />
        </Source>
        <Source type="geojson" data={geojson}>
          <Layer {...layerTab1} />
        </Source>
        <Source type="geojson" data={geojson}>
          <Layer {...layerTab2} />
        </Source>
      </div>
    );
  }

  return props.clicked ? displayWeatherTab() : <></>;
}
