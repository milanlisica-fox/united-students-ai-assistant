import { cn } from "@/lib/utils";
import MapChip from "./MapChip";

type PropertyPriceMarkerProps = {
	name: string;
	lowestPrice?: number | null;
	soldOut: boolean;
	isFocused?: boolean;
	centered?: boolean;
	className?: string;
};

const formatPrice = (price: number) =>
	`\u00A3${Math.round(price).toLocaleString()}`;

const PropertyPriceMarker = ({
	name,
	lowestPrice,
	soldOut,
	isFocused,
	centered,
	className,
}: PropertyPriceMarkerProps) => {
	const renderMarkerContents = () => {
		if (isFocused) {
			return name;
		}

		if (lowestPrice) {
			return formatPrice(lowestPrice);
		}

		if (soldOut) {
			return "Sold Out";
		}

		return name;
	};

	return (
		<div className={cn({ "h-1 w-1": centered }, className)}>
			<MapChip
				centered={centered}
				className={cn({
					"bg-[#00B4B4]": isFocused,
					"bg-[#B0B0B0]": soldOut,
				})}
			>
				{renderMarkerContents()}
			</MapChip>
		</div>
	);
};

export default PropertyPriceMarker;
