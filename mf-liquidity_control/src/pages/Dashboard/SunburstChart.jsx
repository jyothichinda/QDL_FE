import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const SunburstChart = ({ data = [
  {
    name: "Fixed Costs",
    children: [
      { name: "Salaries", value: 30 },
      { name: "Rent", value: 25 },
    ],
  },
  {
    name: "Variable Costs",
    children: [
      { name: "Inventory", value: 20 },
      { name: "Marketing", value: 15 },
      { name: "Utilities", value: 10 },
    ],
  },
] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    // Wrap data in a single root object
    const wrappedData = {
      name: "Root",
      children: data,
    };

    // Clear previous SVG
    d3.select(chartRef.current).selectAll("*").remove();

    // Set reduced width and height
    const width = 300; // Reduced width
    const height = 300; // Reduced height
    const radius = Math.min(width, height) / 2;

    // Define custom colors
    const customColors = ["#00C49F", "#0088FE", "#00A6FB", "#0057D9"];
    const color = d3.scaleOrdinal(customColors);

    // Create a root hierarchy
    const root = d3.hierarchy(wrappedData).sum((d) => d.value || 0);

    // Create the partition layout
    d3.partition().size([2 * Math.PI, radius])(root);

    const arc = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create a tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Draw arcs
    svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("d", arc)
      .style("fill", (d) => color(d.data.name))
      .style("stroke", "#fff")
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.name}</strong><br/>Value: ${d.data.value || 0}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        tooltip.style("opacity", 0);
      });

    // Add labels
    svg
      .selectAll("text")
      .data(root.descendants().slice(1))
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .style("font-size", "8px") // Reduced font size for labels
      .style("fill", "#fff");
  }, [data]);

  return <div ref={chartRef} style={{ position: "relative", width: "100%", height: "100%" }} />;
};

export default SunburstChart;
