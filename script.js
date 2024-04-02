// Sample data
var nodes = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 }
  ];
  
  var links = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 5, target: 1 }
  ];
  
  // Set up the SVG element
  var svg = d3.select("#graph"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      centerX = width / 2,
      centerY = height / 2;
  
  // Create the force simulation
  var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(centerX, centerY));
  
  // Draw the links
  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
      .attr("class", "link");
  
  // Draw the nodes
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .call(drag(simulation)); // Enable dragging
  
  // Update the positions of the nodes and links on each tick
  simulation.on("tick", function() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
  
    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });