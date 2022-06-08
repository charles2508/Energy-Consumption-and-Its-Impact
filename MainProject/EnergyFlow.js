
const unit = "Pj"
// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
format = function(d) {
  return formatNumber(d);
},
color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page
var svg = d3
.select("#sankey")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3
.sankey()
.nodeWidth(36)
.nodePadding(40)
.size([innerWidth, innerHeight]);

d3.json("sankey.json").then(function(sankeydata) {
graph = sankey(sankeydata);
console.log(graph.links);
console.log(graph.nodes);
// add in the links
var link = svg
  .append("g")
  .selectAll("link")
  .data(graph.links)
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", d3.sankeyLinkHorizontal())
  .style("stroke", function(d) {
    return (d.color = color(d.source.name.replace(/ .*/, "")));
  })
  .style("opacity", 0.8 )
  .attr("stroke-width", function(d) {
    return d.width;
  });

// add the link titles
link.append("title").text(function(d) {
  return d.source.name + " → " + d.target.name + "\n" + format(d.value) + unit;
});

// add in the nodes
var node = svg
  .append("g")
  .selectAll(".node")
  .data(graph.nodes)
  .enter()
  .append("g")
  .attr("class", "node")
  .call(
    d3
      .drag()
      .subject(function(d) {
        return d;
      })
      .on("start", function() {
        this.parentNode.appendChild(this);
      })
      .on("drag", dragmove)
  );

// add the rectangles for the nodes
node
  .append("rect")
  .attr("x", function(d) {
    return d.x0;
  })
  .attr("y", function(d) {
    return d.y0;
  })
  .attr("height", function(d) {
    d.rectHeight = d.y1 - d.y0;
    return d.y1 - d.y0;
  })
  .attr("width", sankey.nodeWidth())
  .style("fill", function(d) {
    return (d.color = color(d.name.replace(/ .*/, "")));
  })
  .attr("stroke", "#000")
  .append("title")
  .text(function(d) {
    return d.name + "\n" + format(d.value);
  });

// add in the title for the nodes
node
  .append("text")
  .attr("x", function(d) {
    return d.x0 - 6;
  })
  .attr("y", function(d) {
    return (d.y1 + d.y0) / 2;
  })
  .attr("dy", "0.35em")
  .attr("text-anchor", "end")
  .text(function(d) {
    return d.name;
  })
  .filter(function(d) {
    return d.x0 < width / 2;
  })
  .attr("x", function(d) {
    return d.x1 + 6;
  })
  .attr("text-anchor", "start");

// the function for moving the nodes
function dragmove(d) {
  d3.select(this)
    .select("rect")
    .attr("y", function(n) {
      n.y0 = Math.max(0, Math.min(n.y0 + d.dy, height - (n.y1 - n.y0)));
      n.y1 = n.y0 + n.rectHeight;

      return n.y0;
    });

  d3.select(this)
    .select("text")
    .attr("y", function(n) {
      return (n.y0 + n.y1) / 2;
    });

  sankey.update(graph);
  link.attr("d", d3.sankeyLinkHorizontal());
}
});