//passing data
d3.csv("data/energy.csv").then(function(data) {
    //group data by country
    var groupByCountry = d3.group(data, function(d) {
        return d.Country;
    });
    //creating variable for data of 2019
    var groupByYear2019 = [];
    //pushing data in 2019 to the new variable
    groupByCountry.forEach(function(country) {
        country.map(function(countryByYear) {
            if (countryByYear.Year == 2019) {

                groupByYear2019.push(countryByYear);//pushing data of 2019
            }
        })  
    });
    regionalEnergyConsumption(groupByYear2019, groupByCountry);//Draw the choropleth
});
  
    
function regionalEnergyConsumption(groupByYear2019, groupByCountry) {
    var projection = d3.geoMercator() //Specify type of projection
                    //.center([145, -36.5]) //Make the map appears at the center of the svg canvas
                         //.translate([w/2, h/2]) //Translate the map to left with w/2 units and to the top with h/2 units
                        .scale(150); //Scale the size of the map 
    
    var path = d3.geoPath() //Initializes the path
                .projection(projection); //Assign the projection to the path
        
    //color legend for choropleth
    //we using red saturation
    var color = d3.scaleQuantize()
                    .domain([0, 14400])//color will be scale in the domain from 0 to 14400
                    //each range would be assigned to corresponding color
                    .range(["#FFEBEB", "#F7D1D1","#EEB7B7","#DD8383","#D56868", "#CC4E4E", "#C43434", "#BB1A1A" ,"#B30000"]);
    
    

    //specify the size of choropleth
    var choropleth_w = 900;
    var choro_pleth_h = 700;

    //appdeing svg for choropleth
    var svg = d3.select("#Choropleth")
                .append("svg")
                .attr("width", choropleth_w)
                .attr("height", choro_pleth_h);


    //apending the color legend
    
    var g = svg.append('g')
                .attr("transform", `translate(0,${20})`);



    //zoom function
    svg.call(d3.zoom()
            .scaleExtent([1, 5])//adjust maximum and minimum scale when zooming
            .translateExtent([[10, -100],[900, 630]])//limit the range when panning
            .on('zoom', (event) => {
                g.attr('transform', event.transform);// transform g according to event
            }))
                      
//passing data from json file to draw the choropleth
//Json file found at: https://github.com/johan/world.geo.json/blob/master/countries.geo.json
d3.json("json/countries.json").then(function(json) {
          //Merge energy consumption data with map data
          //Loop through each consumption data
          for (var i = 0; i < groupByYear2019.length; i++) {
              var dataCountry = groupByYear2019[i].Country; //Get the countries in the data
              var dataEnergyConsumption = parseFloat(groupByYear2019[i]["Primary energy consumption (TWh)"]); //Get the energy consumption in the data
              for (var j = 0; j < json.features.length; j++) {
                  var jsonCountry = json.features[j].properties.name; //Get the country name in json file
                  if (dataCountry == jsonCountry) {
                      var properties = json.features[j].properties;
                      properties.value = dataEnergyConsumption; //Assign the data energy consumption to json file
                      groupByCountry.get(dataCountry).map(function(countryByYear) {
                          if (countryByYear.Year == 2010) {
                              properties.year2010 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2011) {
                              properties.year2011 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2012) {
                              properties.year2012 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2013) {
                              properties.year2013 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2014) {
                              properties.year2014 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2015) {
                              properties.year2015 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2016) {
                              properties.year2016 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2017) {
                              properties.year2017 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2018) {
                              properties.year2018 = countryByYear["Primary energy consumption (TWh)"];
                          } else if (countryByYear.Year == 2019) {
                              properties.year2019 = countryByYear["Primary energy consumption (TWh)"];
                          }
                      });
                      break;
                  }
              }
          }
          //appending path correspond to each country
          g.selectAll("path")
           .data(json.features) //Bind the data read from the json file into the path
           .enter()
           .append("path") 
           .attr("d", path)
           .attr("class", function(d) {
               return "country";
           })     
           .attr("id", "map")    
           .style("fill", function(d) {
                if(d.properties.value < 14400 && !isNaN(d.properties.value))
                {
                    return color(d.properties.value); //adjusting color for each path
                }
                else if(d.properties.value > 14400)
                {
                    return "#800000"; //color for value above 14400
                }
                else
                {
                    return "grey"; //color for missing data
                }
           })
           .style("stroke", "black")//adding border for each country
           .style("stroke-width", 0.5)//specified border width

          .on("mouseover", function(event,d) {
               //----------FIRST HIGHLIGHT THE COUNTRY--------------------------------
                d3.selectAll("#map")
                    .transition()
                    .duration(200)
                    .style("opacity", .3)//fade other countries
                    .style("stroke","black");//stroke color
            
    
                d3.select(this) //highlight this country
                    //transition effect
                    .transition()
                    .duration(200)
                    .style("opacity", 1)

                d3.select(this)
                    .style("opacity", 1)
                    .append('title')
                    .text(function(d){
                        if(!isNaN(d.properties.value))//check if properties is valid or not
                        {
                            //text when country has valid properties
                            return "Country Name: " + d.properties.name + "\nEnergy consumption: " +d.properties.value + " (TWh) \nYear: 2019";
                        }
                        else
                        {
                            //text when country do not have valid properties
                            return "Country Name: " + d.properties.name + "\nEnergy consumption: Missing data" + "\nYear: 2019";
                        }
                        
                    })
               mouseOverMap(d);// function when hovering
           })//mouse over trigger
          .on("mouseleave", function(event,d) {
               mouseLeaveMap(d);//function when not hovering
           })//mouse out trigger
           ;
           g.attr("transform", `translate(0,${100})`);//adjusting the position of g
      });
    //appending g for legend linear
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(30,300)");

    //apending note for color legend
    svg.append('text')
        .attr('y', 290)
        .attr('x', 30)
        .text('Unit: TWh')
        .style('font-family', 'Helvetica')
        .style('fill', "black");    
        
    // adding color legend
    const legendLinear = d3.legendColor()
                        .shapeWidth(30)// width of legend
                        .orient('vertical')// legend should be displayed horizontally
                        .scale(color);// scale according to color function

    svg.select(".legendLinear")// adding linear legend for svg
        .call(legendLinear)
        .attr("id", d => {return color})
        //style the text of legend
        .style('font-family', 'Helvetica')
        .style('fill', "black")
        .style('font-size', 12);
    //adding legend for above 14400(TWh) country           
    svg.append('rect')
        .attr('x', 30)
        .attr('y', 0)
        .attr('width', 30)
        .attr('height', 15)
        .style('fill', "#800000")//color for value above 14400
        .attr("class", "cell")
        .attr("transform", "translate(0, 473)"); //adjusting position 
    svg.append('text')
        .attr('y', 487)
        .attr('x', 70)
        .text('Above 14400')
        .style('font-family', 'Helvetica')//edit text style
        .attr('font-size', 12)
        .style('fill', "black");                   
    //adding legend for no data
    svg.append('rect')
        .attr('x', 30)
        .attr('y', 0)
        .attr('width', 30)
        .attr('height', 15)
        .style('fill', 'grey')//color for missing data
        .attr("class", "cell")
        .attr("transform", "translate(0, 492)");//adjusting position
    //adding text for no data lengend
    svg.append('text')
        .attr('y', 505)
        .attr('x', 70)
        .text('Missing data')
        .style('font-family', 'Helvetica')//edit text style
        .attr('font-size', 12)
        .style('fill', "black");
    
    //implement border for rectangles
    svg.selectAll('rect').style('stroke', 'black');

    
      var mouseOverMap = function(d) {
          DisplayDetail();
          //DRAW LINE CHART FOR EACH PATH
          if(!isNaN(d.properties.value))
          {
            d3.selectAll("#detailed_info > *").remove();//clear the svg
          var dataset = [
              ["2010", d.properties.year2010],
              ["2011", d.properties.year2011],
              ["2012", d.properties.year2012],
              ["2013", d.properties.year2013],
              ["2014", d.properties.year2014],
              ["2015", d.properties.year2015],
              ["2016", d.properties.year2016],
              ["2017", d.properties.year2017],
              ["2018", d.properties.year2018],
              ["2019", d.properties.year2019],
          ];//create new dataset for line chart
          const yAxisLabel = "Energy Consumption (TWh)";
          const xAxisLabel = "Year";
          //Parse the year in string into Date data type
          var parseTime = d3.timeParse("%Y");
          // set the dimensions and margins of the graph
          var margin = {top: 0, right: 0, bottom: 70, left: 60},
          w = 350 - margin.left - margin.right, //inner width
          h = 250 - margin.top - margin.bottom; //inner height
          //adding properties for line chart
          var svg1 = d3.select("#detailed_info")
                       .append("svg")
                       .attr("width", 350)
                       .attr("height", 250)
                       .attr("fill", "none");
          var title = d.properties.name; // title for line chart
          var xScale = d3.scaleTime()//scale time for the x axis
                         .domain([
                              d3.min(dataset, function(d) { return parseTime(d[0]);}),
                              d3.max(dataset, function(d) { return parseTime(d[0]);})
                        ])//scale from 2010 to 2019
                         .range([margin.left,w - margin.right])//specify range
       
   
          var yScale = d3.scaleLinear()
                   .domain([
                       0,//min value = 0
                       d3.max(dataset, function(d) { return parseFloat(d[1])}) //maximum value
                   ])
                   .range([h, margin.left]).nice();//range of the domain
  
          var line = d3.line()
                       .x(function(d) { return xScale(parseTime(d[0])); }) //Specify the x axis for the data (in this case refers to the year attribute)
                       .y(function(d) { return yScale(d[1]); }); // Specify the y axis for the data (in this case refers to the data value attribute for each year)
  
  
          svg1.append("path")
              .datum(dataset) //bind each single data in the dataset to a path element
              .attr("class", "line") //Create attribute class for a path element
              .attr("d", line)
              .style("stroke", "#382b06")
              .style("stroke-width", "3px");
          
          var area = d3.area()
                   .x(function(d) { return xScale(parseTime(d[0]));}) //Return the value of each Date attribute
                   .y0(function() { return yScale.range()[0];}) //Return the min value of the yScale, in this case is 0
                   .y1(function(d) {return yScale(d[1]);}); // Return the value of each Number attribute 
  
          svg1.append("path")
             .datum(dataset) //bind each single data in the dataset to a path element
             .attr("class", "area") //Create attribute class for a path element
             .attr("d", area)
             .style("fill", "#d9ae38");
  
          //add xAxis
          var xAxis = d3.axisBottom()
                         .scale(xScale);
  
          //add yAxis
          var yAxis = d3.axisLeft()
                        .scale(yScale)
                        .ticks(5);//changing number of ticks
          
        //adding x axis to svg
          svg1.append("g")
             .attr("class","xAxis")
             .attr("transform", "translate("+0+", "+h+")")//add some padding
             .call(xAxis);
          
  
        //adding y axis to svg
          svg1.append("g")
             .attr("class","yAxis")
             .attr("transform", "translate("+margin.left+", 0)")//add some padding
             .call(yAxis);
        //adding y axis label
          d3.select(".yAxis").append('text')
             .attr('y', -45)
             .attr('x', -120)
             .attr('fill', 'black')//coloring
             .attr('transform', `rotate(-90)`) //rotate the label
             .attr('text-anchor', 'middle')//align middle
             .text(yAxisLabel);
        //adding x axis label
          d3.select(".xAxis").append('text')
              .attr('x', 170)
              .attr('y', 30)
              .attr('fill', 'black')//coloring
              .attr('text-anchor', 'middle')//align middle
              .text(xAxisLabel);
         
          ChangeTitle_AreaChart(d.properties.name)//changing title according to country name
          }
        else
        {
            HideDetail();//hide side chart
        }
      };
  
      //mouseOut function
      var mouseLeaveMap = function(d) {
          d3.selectAll(".country")
                //transition effect
              .transition()
              .duration(200)
              .style("stroke","black")//stroke color
              .style("stroke-width",0.5)//stroke width
              .style("opacity", 0.8)//opacity
          HideDetail();//Hide side chart
      };
      function DisplayDetail() //Display the additional graph
    {
      var chart = document.getElementById("choropleth_detailed_info");//get graph
      chart.style.display = "block";//display additional graph
    };
    function HideDetail() //Hide the additional graph
    {
        var chart = document.getElementById("choropleth_detailed_info");//get graph
        chart.style.display = "none";//hiding additional graph
    };
    function ChangeTitle_AreaChart(new_title)//Change the title for the detailed chart
      {
          var label = d3.select(".xAxis").append('text')
          .attr('x', 170)
          .attr('y', -120)
          .attr('class', 'title_areachart')
          .attr('fill', 'black')//color of text
          .attr('text-anchor', 'middle')
          .style("font-size", 20)//font size
          .text(new_title);//appending new text
      }
    }