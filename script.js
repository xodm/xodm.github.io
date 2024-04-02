function drag(simulation) {
  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);
}
function makeGraph(nodes, links) {
  // Set up the SVG element
  var svg = d3.select("#graph")
    .style("width", "100%")
    .style("height", "100%");
  svg.selectAll(".link").remove();
  svg.selectAll(".node").remove();
  // Create the force simulation
  function resize() {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    svg.attr("width", width).attr("height", height/1.3);
    var centerX = width / 2;
    var centerY = height / 3;
    // Update the force simulation
    simulation.force("center", d3.forceCenter(centerX, centerY));
    simulation.restart();
  }
  var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(function (d) { return d.id; }).distance(230)) // Adjust the distance between nodes here
    .force("charge", d3.forceManyBody().strength(-200)) // Adjust the repulsion strength between nodes here
    .force("center", d3.forceCenter(svg.attr("width") / 2, svg.attr("height") / 2))
    .force("collide", d3.forceCollide().radius(28)); // Prevent nodes from overlapping

  // Draw the links
  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke", "black")
    .style("stroke-width", 8); // Adjust the stroke width here

  // Draw the nodes
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .style("fill", "#FF0000")
    .style("stroke", "black") // Set the stroke color of the nodes
    .style("stroke-width", 4) // Set
    .attr("r", 28) // Adjust the node size here
    .call(drag(simulation)); // Enable dragging

  // Update the positions of the nodes and links on each tick
  simulation.on("tick", function () {
    // Keep the nodes within the boundaries of the screen
    node.attr("cx", function (d) { return d.x = Math.max(28, Math.min(svg.attr("width") - 28, d.x)); })
        .attr("cy", function (d) { return d.y = Math.max(28, Math.min(svg.attr("height") - 28, d.y)); });

    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });
  });

  // Resize the graph when the window size changes
  window.addEventListener("resize", resize);
  resize();
}
// Sample data
var nodes = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 }
];

var links = [
  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 2, target: 4 },
  { source: 2, target: 5 },
  { source: 3, target: 6 },
  { source: 3, target: 7 },
  { source: 4, target: 8 },
  { source: 4, target: 9 },
  { source: 5, target: 10 },
  { source: 5, target: 11 },
  { source: 6, target: 12 },
  { source: 6, target: 13 },
  { source: 7, target: 14 },
  { source: 7, target: 15 }
];
var myGamePiece;
var myObstacles = [];
var myScore=0;
function changeText() {
  myScore++
  var displayElement = document.getElementById("displayText"); // Get the element to display the text
  displayElement.textContent = myScore // Update the text content of the element
}

makeGraph(nodes, links)
function clearPageforNewGraph(params) {
  var nodes = [
    { id: 1 },
    { id: 2 }
  ];
  var links = [
    { source: 1, target: 2 },
  ];
  makeGraph(nodes, links)
}