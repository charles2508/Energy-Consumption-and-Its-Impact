const width = 1200;
const height = 700;
const margin = { top: 10, right: 30, bottom: 20, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
// this function will draw the Bar chart for each sector
const BarChart = function(data, sector, color) {
    const svg = d3.select('#barchart')
                    .append("svg")
                    .attr('width', width)
                    .attr('height', height);
    const yValue = d => d[sector];
    const xValue = d => d.Name;

    const yScale = d3.scaleLinear()
                    .domain([0,d3.max(data, yValue)])
                    .range([innerHeight, 0 + margin.top]);    

    const xScale = d3.scaleBand()
                    .domain(data.map(xValue))
                    .range([0, innerWidth])
                    .padding(0.3);

    const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
                 
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
    g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);
                    

                 
    g.append('g').call(yAxis);
    g.selectAll('rect').data(data)
                    .enter().append('rect')
                    .attr('x', d => xScale(xValue(d)))
                    .attr('y', d =>  yScale(yValue(d)))
                    .transition().duration(1000) //this function will implement the transition to rect when they initialize 
                    .attr('height', d => innerHeight - yScale(yValue(d)))
                    .attr('width', xScale.bandwidth())
                    .attr('fill', color);
    
    console.log(yValue(data));
                    
}

function RemoveBarChart()
{
    var a = document.getElementById("barchart");
    a.removeChild(a.lastChild);//remove chart before implementing the new one
}

d3.csv('data/energy_per_sector.csv')
    .then(data =>{
        data.forEach(d => {
            d['services sector'] = +d['services sector'];
            d['residential sector'] = +d['residential sector'];
            d['agriculture sector'] = +d['agriculture sector'];
        });
        BarChart(data,"services sector", "red"); //init the default chart
        d3.select('#servicesB')
            .on('click',() => {
                RemoveBarChart();
                BarChart(data,"services sector", "red");
            })
        d3.select('#AgricultureB')
            .on('click',() => {
                RemoveBarChart();
                BarChart(data,"agriculture sector", "blue");
            })
        d3.select('#ResidentialB')
            .on('click',() => {
                RemoveBarChart();
                BarChart(data,"residential sector", "pink");
            }) 
        console.log(data);
        
});

