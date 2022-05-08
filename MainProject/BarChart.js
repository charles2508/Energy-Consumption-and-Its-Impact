const width = 1200;
const height = 700;
const margin = { top: 10, right: 30, bottom: 20, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
// this function will draw the Bar chart for each sector
const BarChart = function(data, color) {
    const svg = d3.select('#barchart')
                    .append("svg")
                    .attr('width', width)
                    .attr('height', height);
    sector = "services sector";
    var yValue = d => d[sector];
    const xValue = d => d.Name;

    var yScale = d3.scaleLinear()
                    .domain([0,d3.max(data, yValue)])
                    .range([innerHeight, margin.top]);    

    const xScale = d3.scaleBand()
                    .domain(data.map(xValue))
                    .range([0, innerWidth]) 
                    .padding(0.3);

    const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
                 
    const xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
    g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);
                    

                 
    g.append('g').call(yAxis);
    g.selectAll('rect').data(data)
                    .enter().append('rect')
                    .attr("class", "bar")
                    .attr('x', d => xScale(xValue(d)))
                    .attr('y', d =>  yScale(yValue(d)))
                    .transition().duration(1000) //this function will implement the transition to rect when they initialize 
                    .attr('height', d => innerHeight -yScale(yValue(d)))
                    .attr('width', xScale.bandwidth())
                    .attr('fill', color);
    
    // console.log(yValue(data));
    d3.select('#servicesB')
            .on('click',() => {
                DisplayBarchart();
                sector = "services sector";
                DrawRect();
            })
    d3.select('#AgricultureB')
            .on('click',() => {
                DisplayBarchart();
                sector = "agriculture sector";
                DrawRect(); 
            })
    d3.select('#ResidentialB')
            .on('click',() => {
                DisplayBarchart();
                sector = "residential sector";
                DrawRect();
            }) 
     g.selectAll('rect')
            .on("mouseover", function(event, d) {
    
                var xPosition = parseFloat(d3.select(this).attr("x"))
                var yPosition = parseFloat(d3.select(this).attr("y"))
                d3.select(this)
                    .append('title')//a window will pop out when mouseover specific rect 
                    .text(function(d) {
                        return "This value is " +d[sector];
                });//title will popout whenever mouseover
                d3.selectAll(".bar")
                    .attr('opacity', 0.4);
                d3.select(this)
                    .transition()
                    .delay(0)
                    .attr('opacity', 1);
                g.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition+ xScale.bandwidth()/4)
                    .attr("y", yPosition +10)
                    .text(d[sector]);// appending text
            })
            .on("mouseout", function(d){
                d3.select('#tooltip').remove();
                d3.selectAll(".bar")
                    .attr('opacity', 1);
            });
        function DrawRect()
        {
            yValue = d => d[sector];
                yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
                g.selectAll("rect")
                    .data(data)
                    .transition(2000)
                    .delay(0)
                    .duration(500)
                    .ease(d3.easeCircleIn)
                    .attr('y', d =>  yScale(yValue(d)))
                    .ease(d3.easeCircleOut) //this function will implement the transition to rect when they initialize 
                    .attr('height', d => innerHeight - yScale(yValue(d)))
                    .attr('fill', color);
        }
                    
}

d3.csv('data/energy_per_sector.csv')
    .then(data =>{
        data.forEach(d => {
            d['services sector'] = +d['services sector'];
            d['residential sector'] = +d['residential sector'];
            d['agriculture sector'] = +d['agriculture sector'];
        });
        console.log(data);
        BarChart(data, "red"); //init the default chart
        // console.log(data);
        
});

function DisplayBarchart()
{
    var chart = document.getElementById("barchart");
    var stackedBarChart = document.getElementById("stackedBarChart");
    chart.style.display = "block";
    stackedBarChart.style.display = "none";
};
