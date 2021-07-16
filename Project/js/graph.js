var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins


var height = 1000
var width = 1600


var color = d3.scaleOrdinal(d3.schemeCategory20);


var svg = d3.select("body").append("svg")
    .attr("width", width)     
    .attr("height", height);

//Create marker arrows

const edgeTypes = ["parent", "parentOf", "marriedTo", "collegueOf", "affair", "isSibling", "killedBy", "samePersonOf"]


for (const elem of edgeTypes){
	var marker = svg
          .append("svg:defs")
          .selectAll("marker")
          .data(["end"])
          .enter()
          .append("svg:marker")
          .attr("id", elem)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 22)
          .attr("refY", 0)
          .attr("markerWidth", 3)
          .attr("markerHeight", 4)
          .attr("orient", "auto")
          .attr("fill", getEdgeColorFromType(elem))
          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");
}


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id;}).distance(120).strength(2))
    .force("charge", d3.forceManyBody().strength(-150))
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
      .attr('marker-end',function(d) { return "url(#" + d.type + ")	"});


  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 20)
      .attr("fill", function(d) { return color(d.family); })
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

  
  
  function ticked() {
    link
        .attr("d", function(d) { return "M"+d.source.x+","+d.source.y+" S"
        	+ d.source.x+ "," + d.target.y
        	+", "+d.target.x+" "+d.target.y;});

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
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

