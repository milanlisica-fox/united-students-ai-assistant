import { useEffect, useMemo, useState } from "react";
import loadExternalScripts from "@/utils/loadExternalScripts";

const HERE_MAPS_BASE_URL = "https://js.api.here.com/v3/3.1/";

const mapScripts = [
	`${HERE_MAPS_BASE_URL}mapsjs-core.js`,
	`${HERE_MAPS_BASE_URL}mapsjs-service.js`,
	`${HERE_MAPS_BASE_URL}mapsjs-mapevents.js`,
	`${HERE_MAPS_BASE_URL}mapsjs-clustering.js`,
	`${HERE_MAPS_BASE_URL}mapsjs-ui.js`,
];

type UseHereMapsReturn = {
	platform: H.service.Platform | null;
	isMapLoading: boolean;
};

const useHereMaps = (apiKey: string | undefined): UseHereMapsReturn => {
	const [isMapLoading, setIsMapLoading] = useState(true);

	useEffect(() => {
		const coreMapScript = mapScripts[0];

		loadExternalScripts(coreMapScript).then(() => {
			const additionalScripts = mapScripts.slice(1);
			loadExternalScripts(additionalScripts).then(() => {
				setIsMapLoading(false);
			});
		});

		return () => {
			mapScripts.forEach((scriptSrc) => {
				const scriptElement = document.querySelector(
					`script[src="${scriptSrc}"]`
				);
				if (scriptElement) {
					scriptElement.remove();
				}
			});
		};
	}, []);

	const platform = useMemo(() => {
		if (isMapLoading || !globalThis.H) return null;

		return new H.service.Platform({ apikey: apiKey ?? "" });
	}, [isMapLoading, apiKey]);

	return { platform, isMapLoading };
};

export default useHereMaps;
