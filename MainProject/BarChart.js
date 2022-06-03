const width = 800;
const height = 500;
const margin = { top: 10, right: 30, bottom: 20, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

d3.csv("data/Co2Emission.csv").then(function(data) {
    data.forEach(d => {
        d['gas'] = +d['gas'];
        d['coal'] = +d['coal'];
        d['oil'] = +d['oil'];
    });
    var groupByCountry = d3.group(data, function(d) {
        return d.Country;
    });
    console.log("Group by Country");
    console.log(groupByCountry);

    BarChart(groupByCountry,"China","gas");
});

function BarChart(groupByCountry,selectedCountry, selectedEnergy)
{
    var countryRecord = groupByCountry.get(selectedCountry); //array of countries chosen
    const svg = d3.select('#barchart')
                    .append("svg")
                    .attr('width', width)
                    .attr('height', height);
    var yValue = d => d[selectedEnergy];
    var xValue = d => d.Year;

    const xScale = d3.scaleBand()
                     .domain(countryRecord.map(xValue))
                     .range([0, innerWidth])
                     .padding(0.3);

    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(countryRecord, function(d)
                        {
                            return d[selectedEnergy];
                        })])
                    .range([innerHeight,margin.top]).nice(); 
    const g = svg.append('g')
                 .attr('transform', `translate(${margin.left},${margin.top})`);
                     
    const xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).ticks(5);
    g.append('g')
     .attr('transform', `translate(0,${innerHeight})`)
     .call(xAxis); //Draw x-axis
    g.append('g').call(yAxis); //Draw y-axis
    var bar = document.getElementsByClassName("bar");
    g.selectAll('rect')
        .data(countryRecord)
        .enter()  
        .append('rect') 
        .attr("class", "bar")            
        .attr('x', function (d,i) {
            return xScale(xValue(d));
        })             
        .attr('y', function(d)
        {
            return yScale(yValue(d));
        })           
        .transition()
        .duration(1000) //this function will implement the transition to rect when they initialize            
        .attr('height', function(d) {
            return innerHeight - yScale(yValue(d));
        })          
        .attr('width', function(d) {
            return xScale.bandwidth();
        })        
        .attr('fill', "red");
        bar = document.getElementsByClassName("bar");
    g.selectAll('rect')
      .on("mouseover", function(event, d) {
        var xPosition = parseFloat(d3.select(this).attr("x"))
        var yPosition = parseFloat(d3.select(this).attr("y"))
        d3.select(this)
            .append('title')//a window will pop out when mouseover specific rect 
            .text(function(d) {
                return "This value is " +d[selectedEnergy];
        });//title will popout whenever mouseover
        d3.selectAll(".bar")
            .attr('opacity', 0.4);
        d3.select(this)
            .transition()
            .delay(0)
            .attr('opacity', 1);
        g.append("text")
            .attr("id", "tooltip")
            .attr("x", xPosition + xScale.bandwidth()/2.5)
            .attr("y", yPosition + 10)
            .text(d[selectedEnergy]);// appending text
        })
     .on("mouseout", function(d){
        d3.select('#tooltip').remove();
        d3.selectAll(".bar")
          .attr('opacity', 1);
        });

    //Get value from radio butto
    d3.select('#getData')
        .on('click', () => {
            var countrySelected = d3.select('input[name="Country"]:checked').node().value;
            var energySelected = d3.select('input[name="Energy"]:checked').node().value;
            if (energySelected != "all") {
                DrawBar(countrySelected, energySelected);
            }
            else {
                DrawStackedBar(countrySelected);
            }
        }) 


    function DrawBar(countrySelected, energySelected)
    {
        d3.selectAll("#stack").remove();
        d3.selectAll(".bar").style("display", "block");
        console.log(countrySelected);
        var countryRecord = groupByCountry.get(countrySelected); //array of countries chosen
        var yValue = d => d[energySelected];
        yAxis = d3.axisLeft(yScale).tickSize(-innerWidth).ticks(5);
        yScale.domain([0, d3.max(countryRecord, yValue)]).rangeRound([innerHeight, margin.top])
            .nice();
        g.selectAll('rect')
        .data(countryRecord)
        .transition()
        .duration(1000)//this function will implement the transition to rect when they initialize 
        .attr("class", "bar")            
        .attr('x', function (d,i) {
            return xScale(xValue(d));
        })             
        .attr('y', function(d)
        {
            return yScale(yValue(d));
        })                      
        .attr('height', function(d) {
            return innerHeight - yScale(yValue(d));
        })          
        .attr('width', function(d) {
            return xScale.bandwidth();
        })        
        .attr('fill', "red");

        g.selectAll('rect')
            .on("mouseover", function(event, d) {
                var xPosition = parseFloat(d3.select(this).attr("x"));
                var yPosition = parseFloat(d3.select(this).attr("y"));
                d3.select(this)
                  .append('title')//a window will pop out when mouseover specific rect 
                  .text(function(d) {
                    return "This value is " +d[selectedEnergy];
                });//title will popout whenever mouseover
                d3.selectAll(".bar")
                  .attr('opacity', 0.4);
                d3.select(this)
                  .transition()
                  .delay(0)
                  .attr('opacity', 1);
                g.append("text")
                 .attr("id", "tooltip")
                 .attr("x", xPosition + xScale.bandwidth()/2.5)
                 .attr("y", yPosition + 10)
                 .text(d[selectedEnergy]);// appending text
        })
            .on("mouseout", function(d){
                d3.select('#tooltip').remove();
                d3.selectAll(".bar")
                .attr('opacity', 1);
            });
    }
    //Draw stacked bar chart
    function DrawStackedBar(countrySelected)
    {
        d3.selectAll(".bar").style("display", "none");
        d3.selectAll("#stack").remove();
        var countryRecord = groupByCountry.get(countrySelected); //array of countries chosen 
        var stack = d3.stack()
                  .keys(["gas", "coal", "oil"]); //create keys according to categories
        var series = stack(countryRecord);
        console.log(series);
        yScale.domain([0, d3.max(countryRecord, function(d) {
                            return d.gas + d.coal + d.oil; //Finding max of the total value of apples, oranges and grapes
                        })]);
        
        var color = d3.scaleOrdinal(d3.schemeCategory10); //Colour scale used by using a native scheme
        var groups = g.append("g")
                      .selectAll("g")
                      .data(series) //Bind 3 child arrays to 3 g elements
                      .enter()
                      .append("g")
                      .style("fill", function(d,i)  {
                        return color(i);
                      });
        
        var rects = groups.selectAll("rect")
                        .data(function(d) {return d;}) //For each array in series, bind its children to the rectangle elements
                        .enter()
                        .append("rect")
                        .attr('id', 'stack')
                        .attr("x", function(d,i) {
                            return xScale(xValue(d.data)); //Scale the x position of each bar based on year
                        })
                        .attr("y", function(d) {
                            return yScale(d[1]); //Scale the y position of each bar
                        })
                        .transition()
                        .duration(1000) //this function will implement the transition to rect when they initialize  
                        .attr("width", xScale.bandwidth()) //Set the width for each bar
                        .attr("height", function(d) {
                            return yScale(d[0]) - yScale(d[1]); //Set the height for each bar
                        });            
    }
}