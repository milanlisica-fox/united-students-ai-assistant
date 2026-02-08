function setMapStyle(map: H.Map) {
	const provider = map.getBaseLayer()?.getProvider();

	const roadStyle = provider?.getStyleInternal();
	const changeListener = () => {
		if (roadStyle?.getState() === H.map.Style.State.READY) {
			roadStyle.removeEventListener("change", changeListener);
			// @ts-expect-error - TS doesn't know about the extractConfig method
			const roadConfig = roadStyle.extractConfig(["roads"]);
			roadConfig.layers.roads.highway.draw.lines.color = "rgb(255,255,255)";
			roadConfig.layers.roads.highway.bridge.draw.bridge.color =
				"rgb(255,255,255)";
			// major roads
			roadConfig.layers.roads.major_road.draw.lines.color = "rgb(255,255,255)";
			roadConfig.layers.roads.major_road.bridge.draw.bridge.color =
				"rgb(255,255,255)";
			roadConfig.layers.roads.major_road.secondary.draw.lines.color =
				"rgb(255,255,255)";
			roadConfig.layers.roads.major_road.tertiary.draw.lines.color =
				"rgb(255,255,255)";
			roadConfig.layers.roads.major_road.tunnel.draw.lines.color =
				"rgb(255,255,255)";
			roadConfig.layers.roads.major_road.link.draw.lines.color =
				"rgb(255,255,255)";
			// minor roads
			roadConfig.layers.roads.minor_road.unpaved.draw.lines.color =
				"rgb(255,255,255)";
			roadConfig.layers.roads.minor_road.service.draw.lines.color =
				"rgb(255,255,255)";
			roadConfig.layers.roads.minor_road.residential.draw.lines.color =
				"rgb(255,255,255)";
			// @ts-expect-error - TS doesn't know about the mergeConfig method
			roadStyle.mergeConfig(roadConfig);
		}
	};
	roadStyle?.addEventListener("change", changeListener);
}

export default setMapStyle;
