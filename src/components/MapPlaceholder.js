import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

// Set the access token from environment variable
MapboxGL.setAccessToken(process.env.MAPBOX_ACCESS_TOKEN);

export default function MapView(props) {
  let cameraSettings = {
    zoomLevel: 14,
    centerCoordinate: [123.4100, 13.4470],
  };

  if (props.initialRegion) {
    cameraSettings.centerCoordinate = [props.initialRegion.longitude, props.initialRegion.latitude];
  }

  return (
    <View style={[styles.container, props.style]}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          {...cameraSettings}
          {...props.cameraProps}
        />
        {props.children}
      </MapboxGL.MapView>
    </View>
  );
}

// Export sub-components to mimic the previous API structure
export const Marker = ({ coordinate, title, children }) => (
  <MapboxGL.PointAnnotation
    id={`marker-${Math.random()}`}
    coordinate={[coordinate.longitude, coordinate.latitude]}
  >
    {/* MapboxGL requires a visual child. If raw children are passed, use them. If not, use default dot. */}
    <View>
      {children ? children : <View style={styles.marker} />}
    </View>
    {/* Callout must be separate */}
    {title && (
      <MapboxGL.Callout title={title} contentStyle={{ padding: 5, borderRadius: 5, backgroundColor: 'white' }}>
        <View style={{ padding: 5 }}><Text>{title}</Text></View>
      </MapboxGL.Callout>
    )}
  </MapboxGL.PointAnnotation>
);

export const Polyline = ({ coordinates, strokeColor = '#000', strokeWidth = 3 }) => {
  if (!coordinates || coordinates.length < 2) return null;

  // Mapbox expects [long, lat] arrays
  const lineCoordinates = coordinates.map(c => [c.longitude, c.latitude]);

  return (
    <MapboxGL.ShapeSource id={`route-${Math.random()}`} shape={{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: lineCoordinates,
      },
    }}>
      <MapboxGL.LineLayer
        id={`line-${Math.random()}`}
        style={{
          lineColor: strokeColor,
          lineWidth: strokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </MapboxGL.ShapeSource>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    borderColor: 'white',
    borderWidth: 2,
  },
});
