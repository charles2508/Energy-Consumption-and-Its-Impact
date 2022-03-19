const width = 1200;
const height = 700;
const margin = { top: 60, right: 60, bottom: 88, left: 90 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
// this function will draw the Bar chart for each sector
const BarChart = function(data, sector) {
    const svg = d3.select('#barchart')
                    .append("svg")
                    .attr('id', sector + ' Chart')
                    .attr('width', width)
                    .attr('height', height);
    const yValue = d => d[sector];
    const xValue = d => d.Name;
                    
    const yScale = d3.scaleLinear()
                    .domain(d3.extent(data, yValue))
                    .range([innerHeight, 0 - margin.top]);
                    
    const xScale = d3.scaleBand()
                    .domain(data.map(xValue))
                    .range([0, innerWidth])
                    .padding(0.2);

                    
    const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
                    
    g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));
                    
    const yAxis = d3.axisLeft(yScale)
                    .tickSize(-innerWidth);
                
                    
    g.append('g').call(yAxis);
    g.selectAll('rect').data(data)
                    .enter().append('rect')
                    .attr('x', d => xScale(xValue(d)))
                    .attr('y', d =>  yScale(yValue(d)))
                    .transition().duration(1500)
                    .delay((d, i) => i * 5)
                    .attr('height', d => innerHeight - yScale(yValue(d)))
                    .attr('width', xScale.bandwidth());
                    
                    
}
d3.csv('data/energy_per_sector.csv')
    .then(data =>{
        data.forEach(d => {
            d['services sector'] = +d['services sector'];
        });
        BarChart(data,"services sector");
        BarChart(data,"residential sector");
        BarChart(data,"agriculture sector");
            var a = document.getElementById("services sector Chart");
                a.style.display = "block";
                var a = document.getElementById("agriculture sector Chart");
                a.style.display = "none";
                var a = document.getElementById("residential sector Chart");
                a.style.display = "none";
        d3.select('#servicesB')
            .on('click',() => {
                var a = document.getElementById("services sector Chart");
                a.style.display = "block";
                var a = document.getElementById("agriculture sector Chart");
                a.style.display = "none";
                var a = document.getElementById("residential sector Chart");
                a.style.display = "none";
            })
        d3.select('#AgricultureB')
            .on('click',() => {
                var a = document.getElementById("agriculture sector Chart");
                a.style.display = "block";
                var a = document.getElementById("services sector Chart");
                a.style.display = "none";
                var a = document.getElementById("residential sector Chart");
                a.style.display = "none";
            })
        d3.select('#ResidentialB')
            .on('click',() => {
                var a = document.getElementById("residential sector Chart");
                a.style.display = "block";
                var a = document.getElementById("agriculture sector Chart");
                a.style.display = "none";
                var a = document.getElementById("services sector Chart");
                a.style.display = "none";
            }) 
        console.log(data)
        
});

