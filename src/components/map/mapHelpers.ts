import type { PropertyMarkerData, UniversityMarkerData } from "./generateMarkers";

export type StartCoordinates = {
	lat: number;
	lng: number;
};

export type PropertyMapMarkers = {
	properties?: PropertyMarkerData[];
	universities?: UniversityMarkerData[];
};

// Sheffield center coordinates
const SHEFFIELD_CENTER: StartCoordinates = { lat: 53.38, lng: -1.47 };

export const getInitialCenter = (
	markers?: PropertyMapMarkers
): StartCoordinates => {
	if (markers?.properties && markers.properties.length > 0) {
		return {
			lat: markers.properties[0].latitude,
			lng: markers.properties[0].longitude,
		};
	}

	if (markers?.universities && markers.universities.length > 0) {
		return {
			lat: markers.universities[0].latitude,
			lng: markers.universities[0].longitude,
		};
	}

	return SHEFFIELD_CENTER;
};

export const getInitialZoomLevel = (numMarkers?: number): number => {
	if (numMarkers && numMarkers > 30) return 12;
	return 14;
};

export const createMapMarkersArray = (mapData: PropertyMapMarkers) => {
	const propertyMarkers =
		mapData?.properties?.map(
			(property) =>
				new H.clustering.DataPoint(
					property.latitude,
					property.longitude,
					undefined,
					{ property }
				)
		) ?? [];

	const uniMarkers =
		mapData?.universities?.map(
			(university) =>
				new H.clustering.DataPoint(
					university.latitude,
					university.longitude,
					undefined,
					{ university }
				)
		) ?? [];

	return uniMarkers.concat(propertyMarkers);
};

export const setupMapBehavior = (
	map: H.Map
): H.mapevents.Behavior => {
	const mapEvents = new H.mapevents.MapEvents(map);
	const behavior = new H.mapevents.Behavior(mapEvents);
	return behavior;
};
