//https://gist.github.com/mobidots/f86a31ce14a3227affd1c1287794d1a6
const unit = "pJ"
// re format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
format = function(d) {
  return formatNumber(d);
},
color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page
var svg = d3
  .select("#sankey")
  .append("svg")
  .attr("width", width)
  .attr("height", 500);

const sankey_title = "Global Energy Flow in 2019"


var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.call(d3.zoom().scaleExtent([1, 5]).translateExtent([[-10, -50],[800, 500]]).on('zoom', (event) => {
    console.log('zoom');
    g.attr('transform', event.transform);
}));

// Set the sankey diagram properties
var sankey = d3.sankey()
              .nodeWidth(20)
              .nodePadding(20)
              .size([innerWidth, innerHeight]);

d3.json("json/sankey.json").then(function(sankeydata) {
graph = sankey(sankeydata);
console.log(graph.links);
console.log(graph.nodes);
console.log(graph);
// add in the links




// var links = g
//   .append("g")
//   .selectAll("link")
//   .data(graph.links)
//   .enter()
//   .append("path")
//   .attr("class", "link")
//   .attr("d", d3.sankeyLinkHorizontal())
//   .style("stroke", function(d) {
//   // const defs = g.append("defs");

//   // const gradient = defs.append("linearGradient")
//   //                   .attr("id", d.source.name + "_" + d.target.name)
//   //                   .attr("x1", "0%")
//   //                   .attr("x2", "0%")
//   //                   .attr("y1", "0%")
//   //                   .attr("y2", "100%");
//   //                   x1 = `${color(d.source.name.replace(/ .*/, ""))}`;
//   //                   x2 = `${color(d.target.name.replace(/ .*/, ""))}`;
//   //                   console.log(x1);
//   //                   console.log(x2);
//   //                   gradient.append("stop")
//   //                   .attr('class', 'start')
//   //                   .attr("offset", "0%")
//   //                   .style("stop-color", x1)
//   //                   .style("stop-opacity", 1);

//   //                   gradient.append("stop")
//   //                   .attr('class', 'end')
//   //                   .attr("offset", "100%")
//   //                   .style("stop-color", x2)
//   //                   .style("stop-opacity", 1);
//   //                   return   `url(#${d.source.name + "_" + d.target.name})`;
//                     return color(d.source.name.replace(/ .*/, ""))
//                     })
//   .style("opacity", 12 )
//   .attr("stroke-width", function(d) {
//     return d.width;
//   });

var link = g.append("g")
            .selectAll(".link")
            .data(graph.links)
            .enter()
            .append("g")
            .attr("class", "link");
link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("fill", "none")
    .attr("stroke-width", function(d) {
      return d.width;
    });

//adding gradient color for links.
link.append("linearGradient")
    .attr("id", d => {
        d.linearGradientId = `linearGradient-${d.index}`;
        return d.linearGradientId;
    })
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", d => d.source.x1)
    .attr("x2", d => d.target.x0)
    .call(gradient => gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source.name.replace(/ .*/, "")))
    )
    .call(gradient => gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target.name.replace(/ .*/, "")))
    );
    link.style("stroke", (d) => {
      return `url("#${d.linearGradientId}")`;
  });

// add the link titles
link.append("title").text(function(d) {
  return "Source: " + d.source.name + "\nTarget: " + d.target.name + "\nAmount of Energy Distributed: " + format(d.value) + " (" + unit + ")";
});

// add in the nodes
var nodes = g.append("g")
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
                .on("drag", OnDrag)
            );

// add the rectangles for the nodes
nodes.append("rect")
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
link.selectAll('path').style('opacity', 1);
// add in the title for the nodes
nodes.append("text")
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
function OnDrag(d) {
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
  // d3.select(this)
  //   .select("rect")
  //   .attr("x", function(n) {
  //     n.x0 = Math.max(0, Math.min(n.x0 + d.dx, width - (n.x1 - n.x0)));
  //     n.x1 = n.x0 + 20;

  //     return n.x0;
  //   });
  //   d3.select(this)
  //   .select("text")
  //   .attr("x", function(n) {
  //     return n.x1 + 20;
  //   });

  sankey.update(graph);
  link.selectAll("path").attr("d", d3.sankeyLinkHorizontal());
}
});