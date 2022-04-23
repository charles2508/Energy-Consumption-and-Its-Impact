function EnvImpact(data)
{
    const svg = d3.select('#LineChart')
                    .append("svg")
                    .attr('width', width)
                    .attr('height', height);
    
    const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
    
    var xValue = d => d.Year;
    var yValue = d => d.coal;
    // console.log(selectedType)
    
    var yScale = d3.scaleLinear()
                    .domain([0,d3.max(data, yValue)])
                    .range([innerHeight, margin.top]);   

    const xScale = d3.scaleBand()
                    .domain(data.map(xValue))
                    .range([margin.left, innerWidth]) 
                    .padding(0.3);
    
    const xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale)
                    .tickSize(-innerWidth);

    var line = d3.line()
                .x(function(d){return xScale(xValue(d)) + xScale.bandwidth()/2;})
                .y(function(d){return yScale(yValue(d));});
                    
    //this function will return a map that has key correspond to the country name
    var group = d3.group(data, d => d.Country);

    console.log(group.values());
    
    var color = d3.scaleOrdinal()
                    .domain(["China", "Japan", "Germany", "United States"])
                    .range(["red", "blue", "green", "yellow"]);
    console.log(color("China"));

    g.selectAll("path")
        .data(group.values())
        .enter()
        .append("path")
        .attr("id", "Line")
        .attr("class", d => d[0].Country)
        .attr("d", d=> line(d))
        .attr("stroke", d => color(d[0].Country))
        .attr("stroke-width", 10)
        .on("mouseover", function() {
            d3.selectAll("#Line")
                .style("opacity", 0.1);
            d3.select(this)
                .attr("stroke-width", 15)
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.selectAll("#Line")
                .style("opacity", 1)
                .attr("stroke-width", 10);
        });
    g.append('g')
    .attr('transform', `translate(${margin.top},${innerHeight})`)
    .call(xAxis);         
    g.append('g') 
    .call(yAxis);
}


d3.csv("data/Co2Emission.csv").then(
    data => {
        data.forEach(d => {
            d.gas = +d.gas;
            d.coal = +d.coal;
            
        });
        EnvImpact(data);
        console.log(data);
    }
)