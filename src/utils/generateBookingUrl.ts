type BookingUrlParams = {
	cityId: string;
	cityCode: string;
	cityName: string;
	buildingCode: string;
	roomClass: string;
	roomType: string;
	tenancyType: string;
	academicYear: string;
	checkinDate: string;
	checkoutDate: string;
	buildingName: string;
	beds?: string;
	roomId?: string;
	canTrackAbandonedCheckout?: string;
	isSecure?: boolean;
};

const generateBookingUrl = (params: BookingUrlParams) => {
	const {
		cityId,
		cityCode,
		cityName,
		buildingCode,
		roomClass,
		roomType,
		roomId,
		tenancyType,
		academicYear,
		checkinDate,
		checkoutDate,
		buildingName,
		beds,
		canTrackAbandonedCheckout,
		isSecure
	} = params;
	const queryParams = new URLSearchParams({
		academicYear,
		buildingCode,
		buildingName,
		checkinDate,
		checkoutDate,
		cityId,
		cityCode,
		cityName,
		roomClass,
		roomType,
		tenancyType
	});
	if (beds) {
		queryParams.append("beds", beds);
	}
	if (roomId) {
		queryParams.append("roomId", roomId);
	}
	if (canTrackAbandonedCheckout) {
		queryParams.append("canTrackAbandonedCheckout", canTrackAbandonedCheckout);
	}
	if (isSecure) {
		queryParams.append("rebooker", isSecure.toString());
	}

	const basePath = isSecure ? `/secure/book` : `/booking/details`;

	return `${basePath}?${queryParams.toString()}`;
};

export default generateBookingUrl;
