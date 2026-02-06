const loadExternalScripts = (srcs: string | string[]) => {
	const scriptSrc = Array.isArray(srcs) ? srcs : [srcs];

	return Promise.all(
		scriptSrc.map(
			(src) =>
				new Promise((resolve, reject) => {
					const existing = document.querySelector(`script[src="${src}"]`);
					if (existing) {
						resolve(`Script with src "${src}" already loaded`);
						return;
					}

					const scriptElement = document.createElement("script");
					scriptElement.src = src;
					scriptElement.async = true;
					scriptElement.crossOrigin = "anonymous";
					scriptElement.onload = () =>
						resolve(`Script with src "${src}" loaded successfully`);
					scriptElement.onerror = () =>
						reject(new Error(`Script with src "${src}" failed to load`));

					document.body.appendChild(scriptElement);
				})
		)
	);
};

export default loadExternalScripts;
