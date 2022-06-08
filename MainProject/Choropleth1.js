
    d3.csv("data/energy.csv").then(function(data) {
      //
        var groupByCountry = d3.group(data, function(d) {
            return d.Country;
        });
        var groupByYear2019 = [];
        var byYear = groupByCountry.forEach(function(country) {
            country.map(function(countryByYear) {
                if (countryByYear.Year == 2019) {
                    groupByYear2019.push(countryByYear);
                }
            })  
        });

        console.log(groupByYear2019);
        console.log("Group by Country");
        console.log(groupByCountry);
        regionalEnergyConsumption(groupByYear2019, groupByCountry);
    });

  
  function regionalEnergyConsumption(groupByYear2019, groupByCountry) {
    var projection = d3.geoMercator() //Specify type of projection
                       //.center([145, -36.5]) //Make the map appears at the center of the svg canvas
                       //.translate([w/2, h/2]) //Translate the map to left with w/2 units and to the top with h/2 units
                       .scale(100); //Scale the size of the map 
  
    var path = d3.geoPath() //Initializes the path
                 .projection(projection); //Assign the projection to the path
      
    var color = d3.scaleQuantize()
                  .range(["#9e9bb0","#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
    
    var w = 800;
    var h = 600;
    var svg = d3.select("#Choropleth")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "#e9e6fa");

    color.domain([0, d3.max(groupByYear2019, function(d) {
      return d["Primary energy consumption (TWh)"];
    })]);

    d3.json("countries.json").then(function(json) {
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

        console.log(json);

        svg.selectAll("path")
         .data(json.features) //Bind the data read from the json file into the path
         .enter()
         .append("path") 
         .attr("d", path)
         .attr("class", function(d) {
             return "country";
         })         
         .style("fill", function(d) {
            return color(d.properties.value);
         })
        .on("mouseover", function(event,d) {
             //----------FIRST HIGHLIGHT THE COUNTRY--------------------------------
             d3.selectAll(".country")
                .transition()
                .duration(200)
                .style("opacity", .5)//fade other countries
                .style("stroke","black");//stroke color
        

             d3.select(this) //highlight this country
               .transition()
               .duration(200)
               .style("opacity", 1)
               .style("stroke", "red");
             mouseOverMap(d);
         })//mouse over trigger
        .on("mouseleave", function(event,d) {
             mouseLeaveMap(d);
         })//mouse out trigger
         ;
    });

    var mouseOverMap = function(d) {
        DisplayDetail();
        //DRAW LINE CHART FOR EACH PATH
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
        ];
        //Parse the year in string into Date data type
        var parseTime = d3.timeParse("%Y");
        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 50, bottom: 70, left: 50},
        w = 500 - margin.left - margin.right,
        h = 300 - margin.top - margin.bottom;

        document.getElementById("Country").innerHTML = d.properties.name;
        var svg1 = d3.select("#detailed_info")
                     .append("svg")
                     .attr("width", 400)
                     .attr("height", 300)
                     .attr("fill", "none");
        
        var xScale = d3.scaleTime()//scale time for the x axis
                       .domain([
                            d3.min(dataset, function(d) { return parseTime(d[0]);}),
                            d3.max(dataset, function(d) { return parseTime(d[0]);})
                      ])
                       .range([margin.left,w - margin.right])
     
 
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
                      .scale(yScale).ticks(5);
        
        svg1.append("g")
           .attr("class","xaxis")
           .attr("transform", "translate("+0+", "+h+")")//add some padding
           .call(xAxis);

        svg1.append("g")
           .attr("class","yaxis")
           .attr("transform", "translate("+margin.left+", 0)")//add some padding
           .call(yAxis);

    };

    //mouseOut function
    var mouseLeaveMap = function(d) {
        d3.selectAll(".country")
            .transition()
            .duration(200)
            .style("stroke","black")//stroke color
            .style("stroke-width",0.8)
            .style("opacity", 0.8)//opacity
        HideDetail();
    };
    function DisplayDetail()
  {
    var chart = document.getElementById("choropleth_detailed_info");
    chart.style.display = "block";
  };
  function HideDetail()
  {
      var chart = document.getElementById("choropleth_detailed_info");
      chart.style.display = "none";
  };
  }
