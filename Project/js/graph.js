var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins


var height = 1200;
var width = 1800;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg = d3.select("body").append("svg")
    .attr("width", width)     
    .attr("height", height);

// Draw legend
var colors = ["blue","green","red","pink","yellow","black","orange","purple"];
// create a list of keys
var edgeTypes = ["parent", "parentOf", "killedBy", "marriedTo", "isSibling","samePersonOf","affair","collegueOf"];


// Usually you have a color scale in your chart already
var colorScale = d3.scaleOrdinal()
  .domain(edgeTypes)
  .range(colors);

// Add one dot in the legend for each name.
var size = 40;


//Create marker arrows

for (const elem of edgeTypes){
	var marker = svg
          .append("svg:defs")
          .selectAll("marker")
          .data(["end"])
          .enter()
          .append("svg:marker")
          .attr("id", elem)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 33)
          .attr("refY", -3)
          .attr("markerWidth", 4)
          .attr("markerHeight", 4)
          .attr("orient", "auto")
          .attr("fill", getEdgeColorFromType(elem))
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");
}


for (i=1; i<=36; i++){
	var defs = svg.append("defs");

	defs.append('pattern')
		.attr("id", i)
		.attr("width", 1)
		.attr("height", 1)
		.append("svg:image")
		.attr("xlink:href", "image_resized/" + i + ".jpg")
		.attr("width", 100)
		.attr("height", 100)
		.attr("y", 0)
		.attr("x", 0);

}



svg.selectAll("mydots")
  .data(edgeTypes)
  .enter()
  .append("line")
  .attr("x1", 50)
  .attr("x2", 110)
  .attr("y1", function(d,i){ return 100 + i*(size+5);}) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("y2", function(d,i){ return 100 + i*(size+5);}) // 100 is where the first dot appears. 25 is the distance between dots
  .style("stroke", function(d){ return colorScale(d);})
  .attr("stroke-width", 5)
  .attr('marker-end', "url(#Mark)");


// Add one dot in the legend for each name.
svg.selectAll("mylabels")
  .data(edgeTypes)
  .enter()
  .append("text")
  .attr("x", 100 + size*1.2)
  .attr("y", function(d,i){ return 100 + i*(size+5);}) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", "black")
  .text(function(d){ return d})
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  .attr("font-size", 20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id;}).distance(200).strength(2))
    .force("charge", d3.forceManyBody().strength(-180))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(80));

d3.json("data/graph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(graph.edges)
      .enter().append("path")
      .attr("fill", "transparent")
      .attr("stroke", function(d) { return getEdgeColor(d);})
      .attr("stroke-width", 5)
      .attr('marker-end',function(d) { return "url(#" + d.type + ")"});


  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 50)
      .attr("fill", function(d) { return "url(#" + d.id + ")" })
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name;});


  simulation.nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.edges);

  var radius = 50; 
  
  function ticked() {
    link
        .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });
    node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
  }


});


/*
function bezierPoint(source, target) {
  diff = Math.abs(target - source); 
  diff = diff / 2; 
  return diff; 
}
*/




function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


function getEdgeColor(d){
	if(d.type == "parent"){
		return "blue"
	}
	if(d.type == "parentOf"){
		return "green"; 
	}
	if(d.type == "killedBy"){
		return "red"; 
	}
	if(d.type == "marriedTo"){
		return "pink"; 
	}
	if(d.type == "isSibling"){
		return "yellow"; 
	}
	if(d.type == "samePersonOf"){
		return "black"; 
	}
	if(d.type == "affair"){
		return "orange"; 
	}
	if(d.type == "collegueOf"){
		return "purple"; 
	}
}


function getEdgeColorFromType(type){
	if(type == "parent"){
		return "blue"
	}
	if(type == "parentOf"){
		return "green"; 
	}
	if(type == "killedBy"){
		return "red"; 
	}
	if(type == "marriedTo"){
		return "pink"; 
	}
	if(type == "isSibling"){
		return "yellow"; 
	}
	if(type == "samePersonOf"){
		return "black"; 
	}
	if(type == "affair"){
		return "orange"; 
	}
	if(type == "collegueOf"){
		return "purple"; 
	}
}

