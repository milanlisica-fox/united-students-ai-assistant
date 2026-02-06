import { renderToStaticMarkup } from "react-dom/server";
import { cn } from "@/lib/utils";
import PropertyPriceMarker from "./PropertyPriceMarker";
import UniversityMarker from "./UniversityMarker";

export type PropertyMarkerData = {
	propertyId: string;
	name: string;
	latitude: number;
	longitude: number;
	soldOut: boolean;
	lowestPrice: number | null;
};

export type UniversityMarkerData = {
	name: string;
	campus?: string;
	latitude: number;
	longitude: number;
};

const getMarkerElement = (
	property: PropertyMarkerData | null,
	university: UniversityMarkerData,
	isFocusedMarker: boolean
) => {
	if (!property) {
		return <UniversityMarker {...university} isFocused={isFocusedMarker} />;
	}

	return (
		<PropertyPriceMarker
			{...property}
			isFocused={isFocusedMarker}
			centered
		/>
	);
};

const calculateZIndex = (
	university: UniversityMarkerData | undefined,
	property: PropertyMarkerData | undefined,
	isFocusedMarker: boolean
): number => {
	if (isFocusedMarker) return 10;
	if (university) return 0;
	if (property?.soldOut) return -2;
	return 1;
};

export const generateMarkers = (
	focusedMarker: PropertyMarkerData | UniversityMarkerData | undefined,
	setFocusedMarker: (
		marker: PropertyMarkerData | UniversityMarkerData
	) => void,
	onPropertySelect?: (propertyId: string) => void,
	selectedPropertyId?: string | null
) => ({
	getClusterPresentation: (cluster: H.clustering.ICluster) => {
		const listOfDps: string[] = [];
		cluster.forEachDataPoint((dp) => {
			const data = dp.getData();
			if (data.university) {
				listOfDps.push("university");
			} else if (data.property) {
				listOfDps.push("property");
			}
		});
		const isOnlyProperty = listOfDps.every((dp) => dp === "property");
		const isOnlyUniversity = listOfDps.every((dp) => dp === "university");
		const isMixed = !isOnlyProperty && !isOnlyUniversity;

		const icon = new H.map.DomIcon(
			renderToStaticMarkup(
				<button
					type="button"
					className={cn(
						"-ml-5 -mt-5 h-10 w-10 rounded-full border-2 border-white text-sm font-semibold text-gray-900",
						{
							"h-12 w-12": cluster.getWeight() >= 5,
							"bg-[#ffc105]": isOnlyProperty,
							"bg-[#9747FF]": isOnlyUniversity,
							"border-[5px] border-[#9747FF] bg-[#ffc105] ring-2 ring-white":
								isMixed,
							"border-8": isMixed && cluster.getWeight() >= 5,
						}
					)}
				>
					{cluster.getWeight()}
				</button>
			)
		);

		return new H.map.DomMarker(cluster.getPosition(), {
			icon,
			min: cluster.getMinZoom(),
			max: cluster.getMaxZoom(),
			data: {},
		});
	},

	getNoisePresentation: (noisePoint: H.clustering.INoisePoint) => {
		const marker = noisePoint.getData();
		const property = marker?.property as PropertyMarkerData;
		const university = marker?.university as UniversityMarkerData;

		const isPropertyMarkerFocused =
			property &&
			property.propertyId ===
				(selectedPropertyId ??
					(focusedMarker as PropertyMarkerData)?.propertyId);

		const isUniversityMarkerFocused =
			university &&
			university.name === focusedMarker?.name &&
			university.campus === (focusedMarker as UniversityMarkerData)?.campus;

		const isFocusedMarker =
			isPropertyMarkerFocused || isUniversityMarkerFocused;

		const markerElement = getMarkerElement(
			property,
			university,
			isFocusedMarker
		);

		const onMarkerClickCallback = () => {
			if (property && onPropertySelect) {
				onPropertySelect(property.propertyId);
			}
			setFocusedMarker(property || university);
		};

		const icon = new H.map.DomIcon(renderToStaticMarkup(markerElement), {
			onAttach: (clonedElement) => {
				clonedElement.addEventListener("pointerup", onMarkerClickCallback);
			},
			onDetach: (clonedElement) => {
				clonedElement.removeEventListener("pointerup", onMarkerClickCallback);
			},
		});

		return new H.map.DomMarker(noisePoint.getPosition(), {
			min: noisePoint.getMinZoom(),
			icon,
			zIndex: calculateZIndex(university, property, isFocusedMarker),
			data: marker,
		});
	},
});
