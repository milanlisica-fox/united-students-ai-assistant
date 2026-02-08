import { cn } from "@/lib/utils";
import React from "react";

type MapChipProps = {
	children?: React.ReactNode | React.ReactNode[];
	className?: string;
	centered?: boolean;
};

const MapChip = ({ children, className, centered }: MapChipProps) => (
	<span
		className={cn(
			"pointer-events-auto flex min-w-max max-w-[150px] cursor-pointer gap-0.5 self-center rounded-[30px] border-2 border-white shadow-md",
			"px-2 py-[6px] text-[10px] font-bold leading-3 text-gray-900",
			"bg-[#ffc105]",
			{ "absolute -translate-x-1/2 -translate-y-1/2": centered },
			className
		)}
	>
		{children}
	</span>
);

export default MapChip;
