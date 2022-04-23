
    d3.csv("data/energy_per_sector.csv").then(function(data) {
      data.forEach(function(d) {
        d['services sector'] = +d['services sector'];
        d['residential sector'] = +d['residential sector'];
        d['agriculture sector'] = +d['agriculture sector'];
      });
      energyPerSector = data;
      // console.log(energyPerSector);
      DisplayBarchart();
      stackedBarChart(energyPerSector);
    });

  
function stackedBarChart(energyPerSector) {
  d3.select('#TotalB')
            .on('click',() => {
                DisplayStackedBarchart();
            }) 
    var energyTypes = energyPerSector.map(function(d) {
      return d.Name;
    });
    // console.log(energyTypes);
    var sectors = ["services sector","residential sector","agriculture sector"];
    var totalUsage = energyPerSector.map(function(energy){
      var sumUsage = 0;
      sectors.forEach(function(sector) {
        sumUsage += energy[sector];
      })
      return sumUsage;
    });
    // console.log(totalUsage)
    const xValue = d => d.Name;
    const xScale = d3.scaleBand()
                      .domain(energyPerSector.map(xValue))
                      .range([0, innerWidth])
                      .padding(0.3);
    // console.log(energyPerSector.map(xValue));
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(totalUsage)])
                    .range([innerHeight,margin.top]); //40393
    var color = d3.scaleOrdinal()
                    .domain(sectors)
                    .range(["#d62728", "#2ca02c", "#9467bd"]);

    var svg = d3.select('#stackedBarChart')
                .append("svg")
                .attr('id', 'stackedBar')
                .attr('width', width)
                .attr('height', height);

    const g = svg.append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`);
        
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append('g').call(d3.axisLeft(yScale)
                .tickSize(-innerWidth));

    //Stack data
    var stack = d3.stack()
                  .keys(sectors)
                  .order(d3.stackOrderDescending);
    var stacked = stack(energyPerSector);
    // console.log(stacked);
    // console.log(stacked[1]);

    g.append("circle").attr("cx",innerWidth - 110).attr("cy",150).attr("r", 6).style("fill", "#d62728");
    g.append("circle").attr("cx",innerWidth - 110).attr("cy",180).attr("r", 6).style("fill", "#2ca02c");
    g.append("circle").attr("cx",innerWidth - 110).attr("cy",210).attr("r", 6).style("fill", "#9467bd");
    g.append("text").attr("x", innerWidth - 100).attr("y", 150).text("services sector").style("font-size", "15px").attr("alignment-baseline","middle");
    g.append("text").attr("x", innerWidth - 100).attr("y", 180).text("residential sector").style("font-size", "15px").attr("alignment-baseline","middle");
    g.append("text").attr("x", innerWidth - 100).attr("y", 210).text("agriculture sector").style("font-size", "15px").attr("alignment-baseline","middle");

    g.append('g')
      .selectAll('g')
      .data(stacked)// First loop that loop through all 3 key attributes
      .join('g')// this will implment 3 g;
      .attr('fill', (d) => color(d.key))//each g will have their specific color
      .selectAll('rect')
      .data((d) => d)// Second loop that loop through all data of key attributes
      .join('rect')// each g will be implemented 7 rect correspond to 7 attributes
      .attr('x', (d) => xScale(d.data.Name))
      .attr('y', (d) => yScale(d[1]))
      .transition().duration(1000)
      .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());
    
  }

  function DisplayStackedBarchart()
  {
      var chart = document.getElementById("barchart");
      var stackedBarChart = document.getElementById("stackedBarChart");
      chart.style.display = "none";
      stackedBarChart.style.display = "block";
  };