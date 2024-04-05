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
    .force("link", d3.forceLink(links).id(function (d) { return d.id; }).distance(240)) // Adjust the distance between nodes here
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


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createCycleGraph(numVertices = "c") {
  if (numVertices == "c") {
    numVertices = getRandomInt(4, 12)
  }
  const nodes = [];
  const links = [];

  for (let i = 1; i <= numVertices; i++) {
    nodes.push({ id: i });
  }

  for (let i = 0; i < numVertices - 1; i++) {
    links.push({ source: nodes[i].id, target: nodes[i + 1].id });
  }

  // Adding the last edge to close the cycle
  links.push({ source: nodes[numVertices - 1].id, target: nodes[0].id });

  return { nodes, links, metricDimension:2 };
}
function createPathGraph() {
  let numVertices = getRandomInt(4, 8)
  const nodes = [];
  const links = [];

  for (let i = 1; i <= numVertices; i++) {
    nodes.push({ id: i });
  }

  for (let i = 0; i < numVertices - 1; i++) {
    links.push({ source: nodes[i].id, target: nodes[i + 1].id });
  }

  return { nodes, links, metricDimension: 1 };
}
function createCompleteGraph() {
  let numVertices = getRandomInt(4, 9)
  const nodes = [];
  const links = [];

  for (let i = 1; i <= numVertices; i++) {
    nodes.push({ id: i });
  }

  for (let i = 0; i < numVertices - 1; i++) {
    for (let j = i + 1; j < numVertices; j++) {
      links.push({ source: nodes[i].id, target: nodes[j].id });
    }
  }

  return { nodes, links, metricDimension: nodes.length-1 };
}
function createGeneralizedPetersenGraph(n=5) {
  const nodes = []
  const links = []
  for (let index = 0; index < 2*n; index++) {
    nodes.push({id:index+1})
  }
  let j = 1
  for (let index = 0; index < n; index++) {
    let r = j + 2
    if(r > 5){
      r -=5
    }
    links.push({source: j, target: r})
    j += 2 
    if(j > 5){
      j -=5
    }
  }
  for (let index = 0; index < n; index++) {
      links.push({ source: index+1, target: index+1+n })
  }
  for (let index = n; index < 2*n; index++) {
    links.push({ source: index+1, target: index+2>10?6:index+2 })
  }



  return { nodes, links, metricDimension:3 };
}
function createTree(numVertices) {
  const nodes = [{ id: 1 }];
  const links = [];
  let leaves  = []
  var metricDimension = 0
  let majorleaf1 = getRandomInt(2, 5)
  metricDimension+=majorleaf1
  for (let i = 0; i < majorleaf1; i++) {
    nodes.push({ id: i+2 });
    leaves.push(i+2)
  }
  for (let i = 0; i < majorleaf1; i++) {
    links.push({ source: 1, target:  i+2 });
  }
  let pathfrom1 = getRandomInt(3, 5)
  let begin = 1
  for (let i = 0; i < pathfrom1; i++) {
    nodes.push({ id: (i+ 2 + majorleaf1) });
  }
  for (let i = 0; i < pathfrom1; i++) {
    let x = majorleaf1+ 2+ i
    links.push({ source: begin, target: x });
    begin = x
  }
  let pathfrom = getRandomInt(1, 4) + majorleaf1
  let majorleaf = getRandomInt(2, 5)
  metricDimension+=majorleaf
  for (let i = 0; i < majorleaf; i++) {
    let x = majorleaf1+ 2+ i + pathfrom1
    nodes.push({ id: x });
    leaves.push(x)
  }
  for (let i = 0; i < majorleaf; i++) {
    let x = majorleaf1+ 2+ i + pathfrom1
    links.push({ source: pathfrom, target:  x });
  }
  let majorleaf2 = getRandomInt(2, 5)
  metricDimension+=majorleaf2
  for (let i = 0; i < majorleaf2; i++) {
    let x = 20 + i
    nodes.push({ id: x });
    leaves.push(x)
  }
  for (let i = 0; i < majorleaf2; i++) {
    let x = 20 + i
    links.push({ source: majorleaf1+ 1 + pathfrom1, target:  x });
  }
  let mix = getRandomInt(2, 8)
  function switchNumber(first, second, array) {
    let temp = []
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element === first){
          temp.push(second)
        } else{
           temp.push(array[index])
        }
      }
      return temp
  }
  for (let index = 0; index < mix; index++) {
      let randomLeaves = getRandomInt(0, leaves.length-1)
      nodes.push({ id: index+30 });
      links.push({ source: leaves[randomLeaves], target:  index+30 });
      let temp = switchNumber(leaves[randomLeaves], index+30, leaves)
      leaves = temp
  }
  return { nodes, links, metricDimension:metricDimension-3 };
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
var buttons = document.querySelectorAll(".bubble-button");

// Function to change the text on the buttons
function changeButtonText(arr) {
  let index = 0
  buttons.forEach(function(button) {
    button.textContent = arr[index].num;
    index++
  });
}
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return 
}
function giveAnswers(num) {
  let arr = [num]
  while (arr.length < 5) {
      let nums = getRandomInt(1, 5)
      let signs = [-1, 1]
      let ran = getRandomInt(0, 1)
      let answer = signs[ran]*nums + num
      if (answer < 1) {
         continue
      }
      if (arr.indexOf(answer) > 0) {
        continue
      }
      arr.push(answer)
  }
  for (let index = 0; index < arr.length; index++) {
    if (index == 0) {
      arr[index] = {num:num, answer:true};
    } else {
      arr[index] = {num:arr[index], answer:false};
    }
  }
  shuffle(arr)
  return arr
}
let functions = [
  createCycleGraph, createPathGraph, createCompleteGraph, createGeneralizedPetersenGraph, 
  createTree
]
let y = getRandomInt(0, functions.length-1)
let x = functions[y]()
let answers = giveAnswers(x.metricDimension)
changeButtonText(answers)
makeGraph(x.nodes, x.links)
function handleClick(i) {
  let data = answers[i]
  if (data.answer == false) {
    disableAllButtons()
  } else {
    myScore ++
    correct(i)
  }
}
function correct(i) {
  var buttons = document.getElementsByClassName("bubble-button");
var Box = document.getElementsByClassName("noteBoxes");
Box[0].textContent = "Find the Metric Dimension of the Graph\nTotal Points: " + myScore;

for (var j = 0; j < buttons.length; j++) {
  buttons[j].disabled = true;
  buttons[j].style.pointerEvents = "none";
}

buttons[i].style.backgroundColor = "#AEFCA1";

// Blinking effect
var blinkInterval = setInterval(function() {
  buttons[i].style.backgroundColor = buttons[i].style.backgroundColor === "wheat" ? "#AEFCA1" : "wheat";
}, 400);

// Wait for 3 seconds and then enable the button and remove the blinking effect
setTimeout(function() {
  clearInterval(blinkInterval);
  buttons[i].style.backgroundColor = "wheat";

  for (var k = 0; k < buttons.length; k++) {
    buttons[k].disabled = false;
    buttons[k].style.pointerEvents = "auto";
  }
  buttons[i].addEventListener("mouseenter", function() {
    this.style.backgroundColor = "white";
  });

  buttons[i].addEventListener("mouseleave", function() {
    this.style.backgroundColor = "wheat";
  });

  // Continue with the next action
  proceed();
}, 2700);
  
}
function disableAllButtons() {
  var buttons = document.getElementsByClassName("bubble-button");
  var Box = document.getElementsByClassName("noteBoxes");
  Box[0].textContent = "You lost, refreash the page to try again\nTotal Points: "+myScore
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    buttons[i].style.pointerEvents = "none";
    let color = "#FA8383"
    if(answers[i].answer == true){
      color = "#AEFCA1"
    }
    buttons[i].style.backgroundColor = color
  }
}
function clearPageforNewGraph(params) {
  y = getRandomInt(0, functions.length-1)
  x = functions[y]()
  answers = giveAnswers(x.metricDimension)
  changeButtonText(answers)
  makeGraph(x.nodes, x.links)
}
function proceed(params) {
  clearPageforNewGraph()
}