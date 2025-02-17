import { CandlestickSeries, createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
import type { CandlestickData, Time } from "lightweight-charts";

interface OHLCVData {
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	time: number;
}

export const ChartComponent = (props: {
	data: OHLCVData[];
	colors: {
		backgroundColor?: string;
		lineColor?: string;
		textColor?: string;
		areaTopColor?: string;
		areaBottomColor?: string;
	};
}) => {
	const {
		data,
		colors: {
			backgroundColor = "white",
			lineColor = "#2962FF",
			textColor = "black",
			areaTopColor = "#2962FF",
			areaBottomColor = "rgba(41, 98, 255, 0.28)",
		} = {},
	} = props;

	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleResize = () => {
			if (chartContainerRef.current) {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth });
			}
		};

		if (!chartContainerRef.current) return;

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: backgroundColor },
				textColor,
			},
			width: chartContainerRef.current.clientWidth,
			height: 450,
			grid: {
				vertLines: {
					color: "#525252",
					style: 2,
				},
				horzLines: {
					color: "#525252",
					style: 2,
				},
			},
		});
		chart.timeScale().fitContent();

		const candlestickSeries = chart.addSeries(CandlestickSeries, {
			upColor: "#26a69a",
			downColor: "#ef5350",
			borderVisible: false,
			wickUpColor: "#26a69a",
			wickDownColor: "#ef5350",
		});

		if (!data) return;

		const validData = data.filter(
			(item) =>
				item.time !== undefined &&
				item.open !== undefined &&
				item.high !== undefined &&
				item.low !== undefined &&
				item.close !== undefined &&
				!Number.isNaN(item.open) &&
				!Number.isNaN(item.high) &&
				!Number.isNaN(item.low) &&
				!Number.isNaN(item.close),
		);

		const sortedData = validData.sort((a, b) => a.time - b.time);

		const seenTimes = new Set<number>();

		const uniqueData = sortedData.filter((item) => {
			if (seenTimes.has(item.time)) {
				return false;
			}
			seenTimes.add(item.time);
			return true;
		});

		const formattedData: CandlestickData<Time>[] = uniqueData.map((item) => ({
			open: item.open,
			high: item.high,
			low: item.low,
			close: item.close,
			time: (item.time ? (item.time as Time) : "1970-01-01") as Time,
		}));

		candlestickSeries.setData(formattedData);

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			chart.remove();
		};
	}, [data, backgroundColor, textColor]);

	return <div className="flex flex-col h-full" ref={chartContainerRef} />;
};

export default ChartComponent;
