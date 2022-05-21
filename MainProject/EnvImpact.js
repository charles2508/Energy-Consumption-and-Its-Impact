function EnvImpact(data)
{
    const svg = d3.select('#LineChart')
                    .append("svg")
                    .attr('width', width)
                    .attr('height', height);
    
    const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
    var type = "oil"
    var xValue = d => d.Year;
    var yValue = d => d[type];
    // console.log(selectedType)
    
    var yScale = d3.scaleLinear()
                    .domain(d3.extent(data, yValue))
                    .range([innerHeight, margin.top])
                    .nice();   

    const xScale = d3.scaleBand()
                    .domain(data.map(xValue))
                    .range([0, innerWidth]) 
                    .padding(0.1);
    
    const xAxis = d3.axisBottom(xScale);

    var yAxis = d3.axisLeft(yScale)
                    .tickSize(-innerWidth)
                    .ticks(5);

    var line = d3.line()
                .x(function(d){return xScale(xValue(d)) + xScale.bandwidth()/2;})
                .y(function(d){return yScale(yValue(d));}).curve(d3.curveLinear);
                    
    //this function will return a map that has key correspond to the country name
    var group = d3.group(data, d => d.Country);

    console.log(group);
    
    var color = d3.scaleOrdinal()
                    .domain(["China", "Japan", "Germany", "United States"])
                    .range(["red", "blue", "green", "blueviolet"]);
    console.log(color("China"));

    g.selectAll("#Line")
        .data(group.values())
        .enter()
        .append("path")
        .attr("id", "Line")
        .attr("class", d => d[0].Country + "Line")
        .attr("d", d=> line(d))
        .attr("stroke", d => color(d[0].Country))
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .on("mouseover", function(event,d) {
            d3.selectAll("#Line")
                .style("opacity", 0.4);
            d3.select(this)
                .attr("stroke-width", 10)
                .style("opacity", 1);
            DrawCircle();
        })
        .on("mouseout", function(event) {
            d3.selectAll("#Line")
                .style("opacity", 1)
                .attr("stroke-width", 5);
            d3.selectAll("#point").remove();
        });
    console.log(group);
    g.append('g')
        .attr('transform', `translate( ${margin.left} ,${innerHeight})`)
        .call(xAxis);         
    g.append('g') 
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis);

    //Changing attributes after clicking button
    d3.select('#coal')
        .on('click',() => {
            type = "coal";
            DrawLine();
        }) 
    d3.select('#gas')
        .on('click',() => {
            type = "gas";
            DrawLine();
        }) 
    d3.select('#oil')
        .on('click',() => {
            type = "oil";
            DrawLine();
        }) 
    
    d3.selectAll("#Line").attr('transform', `translate(${margin.left},0)`);

    function DrawCircle()
    {
        g.selectAll("#circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("id", "point")
            .attr("class", d => d.Country + "Point")
            .attr('r', 4)
            .attr('cx', function(d){return xScale(xValue(d))+ xScale.bandwidth()/2 ;})
            .attr('cy', function(d){return yScale(yValue(d));})
            .attr('transform', `translate( ${margin.left} ,0)`);
    }
    function DrawLine() 
    {

        yScale = d3.scaleLinear()
                    .domain(d3.extent(data, yValue))
                    .range([innerHeight, margin.top])
                    .nice();   
        yAxis = d3.axisLeft(yScale)
                    .tickSize(-innerWidth)
                    .ticks(5);
        g.selectAll("#Line")
            .attr("id", "Line")
            .data(group.values())
            .transition(2000)
            .delay(0)
            .duration(500)
            .ease(d3.easeCircleIn)
            .attr("class", d => d[0].Country)
            .attr("d", d=> line(d))
            .attr("stroke", d => color(d[0].Country))
        
    }
}


d3.csv("data/Co2Emission.csv").then(
    data => {
        data.forEach(d => {
            d.gas = +d.gas;
            d.coal = +d.coal;
            d.oil = +d.oil;
            
        });
        EnvImpact(data);
        console.log(data);
    }
)