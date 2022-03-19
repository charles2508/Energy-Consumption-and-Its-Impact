function init() { 
    d3.csv("data/energy_per_sector.csv").then(function(data) {
      data.forEach(function(d) {
        d['services sector'] = +d['services sector'];
        d['residential sector'] = +d['residential sector'];
        d['agriculture sector'] = +d['agriculture sector'];
      });
      energyPerSector = data;
      stackedBarChart(energyPerSector);
    });
}
  
function stackedBarChart(energyPerSector) {
    const width = 1200;
    const height = 700;
    const margin = { top: 60, right: 60, bottom: 88, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    var padding = 10;
    var energyTypes = energyPerSector.map(function(d) {
      return d.Name;
    });
    var sectors = ["services sector","residential sector","agriculture sector"];
    var totalUsage = energyPerSector.map(function(energy){
      var sumUsage = 0;
      sectors.forEach(function(sector) {
        sumUsage += energy[sector];
      })
      return sumUsage;
    });
    var xScale = d3.scaleBand().domain(energyTypes).rangeRound([0, width]).padding(0.1);
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(totalUsage)]).range([height,0]); //40393
    var color = d3.scaleOrdinal().domain(sectors).range(["#d62728", "#2ca02c", "#9467bd"]);

    var xAxis = d3.axisBottom().ticks(5).scale(xScale);
    //y-Axis
    var yAxis = d3.axisLeft().scale(yScale);

    var svg = d3.select('#barchart')
    .append("svg")
    .attr('id', 'stackedBar')
    .attr('width', width)
    .attr('height', height);

    svg.append("g").attr("transform","translate(0, " + (height-padding) + ")").call(xAxis);
    svg.append("g").attr("transform","translate(" + (padding) +" ,0)").call(yAxis);

    var layers = sectors.map(function(sector) {
      return energyPerSector.map(function(d) {
        return {
          "x": xScale(d.Name),
          "y": d[sector],
          "sector": sector
        };
      });
    });
    
    var stack = d3.stack();
    stack(layers);
    console.log(layers);

    var svgLayer = svg.selectAll(".layer")
    .data(layers)
    .enter()
    .append("g")
    .attr("class", "layer");


    var rect = svgLayer.selectAll("rect").data(function(d) { return d;})
    .enter()
    .append("rect")
    .attr("x", function(d) {
      console.log("d.y0 is" + d.y0);
      return d.x;
    })
    .attr("y", function(d) {
      return height - yScale(d.y + d.y0);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
      return yScale(d.y);
    })
    .style("fill", function(d,i) { 
      return color(d.sector);
    })
}
  
window.onload = init;
  