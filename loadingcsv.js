function init() {
  d3.csv("Task_2-4_data.csv").then(function(data) {
    console.log(data);
    wombatSightings = data;
    barChart(wombatSightings);
  });
  }


  function barChart(wombatSightings) {
    var w = 500;
    var h = 100;
    var barPadding = 5;
    var svg = d3.select("#chart").append("svg").attr("width",w).attr("height",h);
    svg.selectAll("rect")
    .data(wombatSightings)
    .enter()
    .append("rect")
    .attr("x", function(d,i) {
      return i * (w/wombatSightings.length);
    })
    .attr("y",function(d){
      return h - d.wombats * 4;
    })
    .attr("width", w/wombatSightings.length - barPadding)
    .attr("height", function(d) {
      return d.wombats*4;
    })
    .attr("fill", function(d) {
      if (d.wombats*4 <= 40) {
        return "#0000ff";
      } else {
        return 	"#0080ff";
      }
    });
}

window.onload = init;
