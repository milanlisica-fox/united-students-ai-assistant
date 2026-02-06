import { useEffect, useRef, useState } from "react";
import "./HERE.css";
import useHereMaps from "@/hooks/useHereMaps";
import {
	type PropertyMapMarkers,
	createMapMarkersArray,
	getInitialCenter,
	getInitialZoomLevel,
	setupMapBehavior,
} from "./mapHelpers";
import {
	type PropertyMarkerData,
	type UniversityMarkerData,
	generateMarkers,
} from "./generateMarkers";
import setMapStyle from "./setMapStyle";

const MAP_CONTAINER_ID = "mapContainer";

export type PropertyMapProps = {
	markers: PropertyMapMarkers;
	selectedPropertyId?: string | null;
	onPropertySelect?: (propertyId: string) => void;
};

const PropertyMap = ({
	markers,
	selectedPropertyId,
	onPropertySelect,
}: PropertyMapProps) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<H.Map | null>(null);
	const clusterDataProviderRef = useRef<H.clustering.Provider | null>(null);
	const apiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;

	const { platform, isMapLoading } = useHereMaps(apiKey);

	const [focusedMarker, setFocusedMarker] = useState<
		PropertyMarkerData | UniversityMarkerData | undefined
	>(undefined);

	useEffect(() => {
		if (platform && mapContainerRef.current) {
			const defaultLayers = platform.createDefaultLayers();
			const initialCenter = getInitialCenter(markers);
			const numMarkers =
				(markers?.properties?.length ?? 0) +
				(markers?.universities?.length ?? 0);

			const map = new H.Map(
				mapContainerRef.current,
				defaultLayers.vector.normal.map,
				{
					pixelRatio: window.devicePixelRatio,
					center: initialCenter,
					zoom: getInitialZoomLevel(numMarkers),
				}
			);

			setMapStyle(map);

			const mapTapHandler = () => {
				setFocusedMarker(undefined);
			};

			map.addEventListener("tap", mapTapHandler);

			const resizeHandler = () => map.getViewPort().resize();
			window.addEventListener("resize", resizeHandler);

			setupMapBehavior(map);

			const clusteringProvider = new H.clustering.Provider(
				createMapMarkersArray(markers),
				{
					clusteringOptions: {
						eps: 60,
						minWeight: 8,
					},
					theme: generateMarkers(
						focusedMarker,
						setFocusedMarker,
						onPropertySelect,
						selectedPropertyId
					),
				}
			);

			const clusteringLayer = new H.map.layer.ObjectLayer(clusteringProvider);
			map.addLayer(clusteringLayer);

			H.ui.UI.createDefault(map, defaultLayers);

			clusterDataProviderRef.current = clusteringProvider;
			mapRef.current = map;

			return () => {
				map.dispose();
				window.removeEventListener("resize", resizeHandler);
			};
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [platform]);

	// Re-render the map markers when the focused marker changes
	useEffect(() => {
		clusterDataProviderRef.current?.setTheme(
			generateMarkers(
				focusedMarker,
				setFocusedMarker,
				onPropertySelect,
				selectedPropertyId
			)
		);
	}, [focusedMarker, onPropertySelect, selectedPropertyId]);

	// Update the cluster data when the markers passed into the component change
	useEffect(() => {
		if (platform && mapRef.current) {
			clusterDataProviderRef.current?.setDataPoints(
				createMapMarkersArray(markers)
			);
		}
	}, [markers, platform]);

	return (
		<>
			{!isMapLoading && (
				<div className="relative h-full w-full">
					<div
						className="h-full w-full"
						id={MAP_CONTAINER_ID}
						ref={mapContainerRef}
					/>
				</div>
			)}
			{isMapLoading && (
				<div className="relative h-full w-full bg-[#F5F8FA]" />
			)}
		</>
	);
};

export default PropertyMap;
