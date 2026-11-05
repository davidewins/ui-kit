/**
 * GeoJSON type helpers for PostGIS geography columns.
 *
 * PostGIS geography(Point, 4326) columns are returned by Supabase as
 * GeoJSON geometry objects. These types give us type-safety instead of
 * `unknown` or `any` for those columns.
 *
 * Mirrors the GeoPoint definition in one-app/VENDORS/src/types/simple.ts.
 */

// ============================================
// GeoJSON Geometry Types
// ============================================

/**
 * A GeoJSON Point - the shape PostGIS geography(Point, 4326) returns
 * when queried through Supabase's JS client.
 */
export interface GeoPoint {
  type: "Point";
  /** [longitude, latitude] - GeoJSON standard order (lng first) */
  coordinates: [longitude: number, latitude: number];
  crs?: {
    type: "name";
    properties: { name: "urn:ogc:def:crs:EPSG::4326" };
  };
}

/**
 * A GeoJSON Polygon - used for delivery zones and service areas.
 * Returned by ST_AsGeoJSON on PostGIS geography(Polygon, 4326) columns.
 */
export interface GeoPolygon {
  type: "Polygon";
  /** Array of linear rings. First ring is the outer boundary; subsequent rings are holes. */
  coordinates: [longitude: number, latitude: number][][];
}

/** Union of all GeoJSON geometry types used in the app. */
export type GeoGeometry = GeoPoint | GeoPolygon;

// ============================================
// App-level coordinate type
// ============================================

/**
 * Simple lat/lng pair used throughout the app for map pins, distance
 * calculations, and anything that isn't a raw PostGIS column.
 *
 * Uses `latitude`/`longitude` naming to match React Native MapView
 * and Expo Location conventions.
 */
export interface LatLng {
  latitude: number;
  longitude: number;
}

// ============================================
// Conversion utilities
// ============================================

/**
 * Convert a GeoJSON Point to the app-level { latitude, longitude } format.
 * Returns null if the input is null/undefined.
 */
export function geoPointToLatLng(point: GeoPoint | null | undefined): LatLng | null {
  if (!point?.coordinates) return null;
  const [lng, lat] = point.coordinates;
  return { latitude: lat, longitude: lng };
}

/**
 * Build a GeoJSON Point from a { latitude, longitude } object.
 * Useful when writing back to PostGIS geography columns via RPC.
 */
export function latLngToGeoPoint(latLng: LatLng): GeoPoint {
  return {
    type: "Point",
    coordinates: [latLng.longitude, latLng.latitude],
  };
}

/**
 * Convert a GeoJSON Point to the compact { lat, lng } format used by
 * the rider tracking system and Mapbox directions API.
 */
export function geoPointToLatLngShort(
  point: GeoPoint | null | undefined,
): { lat: number; lng: number } | null {
  if (!point?.coordinates) return null;
  const [lng, lat] = point.coordinates;
  return { lat, lng };
}
