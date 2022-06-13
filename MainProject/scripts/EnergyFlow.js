//Referenced at: https://gist.github.com/mobidots/f86a31ce14a3227affd1c1287794d1a6
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
  .attr("width", width)//assign width
  .attr("height", 500);//assign height

const sankey_title = "Global Energy Flow in 2019"//title for the chart

//append margin for the graph
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//appending zoom function
svg.call(d3.zoom()
          .scaleExtent([1, 5])// implementing minimum and maximum scale when zooming
          .translateExtent([[-10, -50],[800, 500]])// Limit the range when panning
          .on('zoom', (event) => {
          g.attr('transform', event.transform);//transfrom g acording to the event
}));

// Set the sankey diagram properties
var sankey = d3.sankey()
              .nodeWidth(20)// node width
              .nodePadding(20)// node padduing
              .size([innerWidth, innerHeight]);// assigning sankey chart size

//passing data
d3.json("json/sankey.json").then(function(sankeydata) {
graph = sankey(sankeydata);//pocessing data by

//appeding link and assiging properties
var link = g.append("g")
            .selectAll(".link")//binding all class "link"
            .data(graph.links) //passing data
            .enter()
            .append("g")
            .attr("class", "link");

link.append("path")
    .attr("d", d3.sankeyLinkHorizontal()) //we use horizontal link in this chart
    .attr("fill", "none")
    .attr("stroke-width", function(d) {
      return d.width;
    });

//adding gradient color for links.
link.append("linearGradient")
    //assigning id for each gradient by link's index
    .attr("id", d => {
        d.GradientId = `linearGradient-${d.index}`; //assigning GradientId by link's index
        return d.GradientId;
    })
    .attr("gradientUnits", "userSpaceOnUse") //gradient properties
    //gradient would be transition from source node to target node
    .attr("x1", d => d.source.x1)
    .attr("x2", d => d.target.x0)
    .call(gradient => gradient.append("stop")
        .attr("offset", "0%")//statring offset
        .attr("stop-color", d => color(d.source.name.replace(/ .*/, "")))//start color would be the color of source node
    )
    .call(gradient => gradient.append("stop")
        .attr("offset", "100%")//stopping offset
        .attr("stop-color", d => color(d.target.name.replace(/ .*/, "")))//stop color wwould be the color of target node
    );
    link.style("stroke", (d) => {
      return `url("#${d.GradientId}")`;//implementing linear gradient for stroke
  });

// add the link titles when hovering
link.append("title").text(function(d) {
  return "Source: " + d.source.name + "\nTarget: " + d.target.name + "\nAmount of Energy Distributed: " + format(d.value) + " (" + unit + ")";
});

// implemeting node properties
var nodes = g.append("g")
            .selectAll(".node")//binding data ".node"
            .data(graph.nodes) //enter data
            .enter()
            .append("g")
            .attr("class", "node")
            //call drag function
            .call(
            d3.drag()
                .subject(function(d) {
                  return d;
                })
                .on("start", function() {
                  this.parentNode.appendChild(this);//appending dragging behaviour
                })
                .on("drag", OnDrag)// implement function OnDrag when dragging
            );

// add the rectangles and its properties
nodes.append("rect")
    .attr("x", function(d) {
      return d.x0;
    })// adjusting x position
    .attr("y", function(d) {
      return d.y0;
    })//adjusting y position
    .attr("height", function(d) {
      d.rectHeight = d.y1 - d.y0;
      return d.y1 - d.y0;
    })//adjusting height
    .attr("width", sankey.nodeWidth()) //width equal to the node width specified in diagram properties
    .style("fill", function(d) {
      return (d.color = color(d.name.replace(/ .*/, ""))); // coloring node
    })
    .attr("stroke", "#000")//appending border
    .append("title")
    .text(function(d) {
      //text appear when hovering
      return d.name + "\n" + format(d.value) + " ("+unit+")";
    });
// add in the title for the nodes
nodes.append("text")
    .attr("x", function(d) {
      return d.x0 - 6; //x-position
    })
    .attr("y", function(d) {
      return (d.y1 + d.y0) / 2; //y-position
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")//align text
    .text(function(d) {
      return d.name; //appeding name of node
    })
    .filter(function(d) {
      return d.x0 < width / 2;
    })
    .attr("x", function(d) {
      return d.x1 + 6;
    })
    .attr("text-anchor", "start");//align text

// the function for moving the nodes
function OnDrag(d) {
  //the rect will move according to mouse position
  //it will move vertically according to mouse position
  d3.select(this)
    .select("rect")
    .attr("y", function(n) {
      n.y0 = Math.max(0, Math.min(n.y0 + d.dy, height - (n.y1 - n.y0)));//cannot move node outside the graph
      n.y1 = n.y0 + n.rectHeight;

      return n.y0;
    });//only change the y position

  d3.select(this)
    .select("text")
    .attr("y", function(n) {
      return (n.y0 + n.y1) / 2;
    });//change text postion according to node position

  //update the graph after dragging
  sankey.update(graph);
  link.selectAll("path").attr("d", d3.sankeyLinkHorizontal());//update paths after dragging
}
});