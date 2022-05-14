function init() {
    d3.csv("data/energy.csv").then(function(data) {
      //console.log(data);
      var groupByYear = d3.group(data, function(d) {
        return d.Year;
      });
      console.log(groupByYear);
      regionalEnergyConsumption(groupByYear)
    });
  }
  
  function regionalEnergyConsumption(groupByYear) {
    var yearChosen = "2016";
    var projection = d3.geoMercator() //Specify type of projection
                       //.center([145, -36.5]) //Make the map appears at the center of the svg canvas
                       //.translate([w/2, h/2]) //Translate the map to left with w/2 units and to the top with h/2 units
                       .scale(100); //Scale the size of the map 
  
    var path = d3.geoPath() //Initializes the path
                 .projection(projection); //Assign the projection to the path
      
    var color = d3.scaleQuantize()
                  .range(["white","#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
  
    var svg = d3.select("#Choropleth")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "grey");
    var regionalEnergyByYear = groupByYear.get(yearChosen); //get the regional energy consumption by year chosen
    console.log(regionalEnergyByYear);
    color.domain([0, d3.max(regionalEnergyByYear, function(d) {
      return d["Primary energy consumption (TWh)"];
    })]);
    var jsonData;
    d3.json("countries.json").then(function(json) {
        console.log(json);
        //Merge energy consumption data with map data
        //Loop through each consumption data
        for (var i = 0; i < regionalEnergyByYear.length; i++) {
            var dataCountry = regionalEnergyByYear[i].Country; //Get the countries in the data
            var dataEnergyConsumption = parseFloat(regionalEnergyByYear[i]["Primary energy consumption (TWh)"]); //Get the energy consumption in the data
            for (var j = 0; j < json.features.length; j++) {
            var jsonCountry = json.features[j].properties.name; //Get the country name in json file
            if (dataCountry == jsonCountry) {
                json.features[j].properties.value = dataEnergyConsumption; //Assign the data energy consumption to json file
                break;
            }
        }
      }
      jsonData = json
      svg.selectAll("path")
         .data(json.features) //Bind the data read from the json file into the path
         .enter()
         .append("path") 
         .attr("d", path)         
         .style("fill", function(d) {
            return color(d.properties.value);
         });
    });
    
    function ChangingYear(year)
    {
      yearChosen = year;
      regionalEnergyByYear = groupByYear.get(yearChosen); //get the regional energy consumption by year chosen
      console.log(regionalEnergyByYear);
      color.domain([0, d3.max(regionalEnergyByYear, function(d) {
        return d["Primary energy consumption (TWh)"];
      })]);
      var jsonData;
      d3.json("countries.json").then(function(json) {
          console.log(json);
          //Merge energy consumption data with map data
          //Loop through each consumption data
          for (var i = 0; i < regionalEnergyByYear.length; i++) {
              var dataCountry = regionalEnergyByYear[i].Country; //Get the countries in the data
              var dataEnergyConsumption = parseFloat(regionalEnergyByYear[i]["Primary energy consumption (TWh)"]); //Get the energy consumption in the data
              for (var j = 0; j < json.features.length; j++) {
              var jsonCountry = json.features[j].properties.name; //Get the country name in json file
              if (dataCountry == jsonCountry) {
                  json.features[j].properties.value = dataEnergyConsumption; //Assign the data energy consumption to json file
                  break;
              }
          }
        }
        jsonData = json
        svg.selectAll("path")
           .data(json.features) //Bind the data read from the json file into the path
           .transition()
           .attr("d", path)         
           .style("fill", function(d) {
              return color(d.properties.value);
           });
      });
    }

    d3.select("#year2017")
        .on("click", function()
        {
          ChangingYear("2017");
        })
    d3.select("#year2016")
        .on("click", function()
        {
          ChangingYear("2016");
        })
    d3.select("#year2018")
        .on("click", function()
        {
          ChangingYear("2018");
        })
  }
  window.onload = init;