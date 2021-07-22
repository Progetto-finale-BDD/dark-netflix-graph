var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins


var height = 1000;
var width = 1400;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg = d3.select("body").append("svg")
    .attr("width", width)     
    .attr("height", height);




// Draw legend
var colors = ["blue","green","red","pink","yellow","black","orange","purple","grey"];
// create a list of keys
var edgeTypes = ["parent", "parentOf", "killedBy", "marriedTo", "isSibling","samePersonOf","affair","collegueOf","isLookingFor"];


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
          .enter().append("svg:marker")
          .attr("id", elem)

          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 35)
          .attr("refY", -3)
          .attr("markerWidth", 4)
          .attr("markerHeight", 4)
          .attr("orient", "auto")
          .attr("fill", getEdgeColorFromType(elem))

          .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");
          
}


for (i=1; i<=36; i++){
	if(i == 21){
		continue; 
	}
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


var graph, node, link, links;
var nodes,edges;
var newNodes,newEdges;
var types = new Set(edgeTypes);

d3.json("data/graph.json", function(error, g) {
  if (error) throw error;
  graph = g; 
  intializeGraph();    
  addEventListenerOnButtons(); 
});


var linkGroup, nodeGroup; 



function intializeGraph(){
    
    newNodes = graph.nodes;
    newEdges = graph.edges;

	linkGroup = svg.append("g").attr("class", "links"); 

	var links = linkGroup.selectAll("path").data(newEdges); 

	links.exit().remove(); 

	link = links.enter().append("path")
				  .attr("fill", "transparent")
				  .attr("stroke", function(d) { return getEdgeColor(d);})
				  .attr("stroke-width", 5)
				  .attr('marker-end',function(d) { return "url(#" + d.type + ")"});



    nodeGroup = svg.append("g").attr("class", "nodes"); 
	var nodes = nodeGroup.selectAll("circle").data(newNodes); 

    nodes.exit().remove(); 

	node = nodes.enter().append("circle")
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
}

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



function filterNodes(year){
    newNodes = graph.nodes.filter( function(n) { 
		return n["years"].includes(year); 
   }); 
   
}

function filterEdges(){
	var nodeIds = newNodes.map(function(n) {
		return n.id; 
	});

	 newEdges = graph.edges.filter( function(e) {
		return (nodeIds.includes(e.source.id) && nodeIds.includes(e.target.id) && types.has(e.type)); 
    }); 
	 
}


function redraw(year){

	filterNodes(year); 

	console.log(newNodes); 

	filterEdges(); 

	console.log(newEdges); 


    links = linkGroup.selectAll("path").data(newEdges, function(e){return e.id;}); 

	links.exit().remove(); 

    links.enter().append("path")
				  .attr("fill", "transparent")
				  .attr("stroke", function(d) { return getEdgeColor(d);})
				  .attr("stroke-width", 5)
				  .attr('marker-end',function(d) { return "url(#" + d.type + ")"});

    


	nodes = nodeGroup.selectAll("circle").data(newNodes, function(n){return n.id;}) ;

    nodes.exit().remove();


	nodes.enter().append("circle")
      .attr("r", 50)
      .attr("fill", function(d) { return "url(#" + d.id + ")" })
      .attr("stroke", "black")
      .attr("stroke-width", "2px")

      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    

	nodes.append("title")
	   .text(function(d) { return d.name;});

function tick() {
    links
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
    nodes
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
}

	//node.merge(newNode); 

	simulation.nodes(newNodes)
	   .on("tick", tick);

	simulation.force("link")
	    .links(newEdges);

	simulation.alpha(1).restart(); 


}



function addEventListenerOnButtons(){
	var button = d3.select(".filter-btn-1953");
	button.on("click", function(d){
		redraw(1953); 
		redraw(1953);
    });
    button = d3.select(".filter-btn-1986");
	button.on("click", function(d){
		redraw(1986);
		redraw(1986);

    });
    button = d3.select(".filter-btn-2019");
	button.on("click", function(d){
		redraw(2019);
		redraw(2019);
    });
    button = d3.select(".filter-btn-2052");
	button.on("click", function(d){
		redraw(2052);
		redraw(2052);

    });
}


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
	if(d.type == "isLookingFor"){
		return "grey"; 
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
	if(type == "isLookingFor"){
		return "grey"; 
	}
}

d3.selectAll("input").each(function(d){ 
  if(d3.select(this).attr("type") == "checkbox") 
    d3.select(this).node().checked = true;
});


 function updateEdges(){


     types = new Set();




    if(d3.select("#parentType").property("checked")){
    	types.add("parent");    	
    }
    if(d3.select("#parentOfType").property("checked")){
    	types.add("parentOf");    	
    }
    if(d3.select("#killedByType").property("checked")){
    	types.add("killedBy");
    }
    if(d3.select("#marriedToType").property("checked")){
    	types.add("marriedTo");
    }
    if(d3.select("#isSiblingType").property("checked")){
    	types.add("isSibling");
    }
    if(d3.select("#samePersonOfType").property("checked")){
    	types.add("samePersonOf");
    }
    if(d3.select("#affairType").property("checked")){
    	types.add("affair");
    }
        if(d3.select("#collegueOfType").property("checked")){
    	types.add("collegueOf");
    }
        if(d3.select("#isLookingForType").property("checked")){
    	types.add("isLookingFor");
    }
    console.log(types);
    filterEdgesType(types)
    redraw2();
    redraw2();
}


d3.selectAll(".houseCheck").on("change",updateEdges);



function filterEdgesType(types){
	var nodeIds = newNodes.map(function(n) {
		return n.id; 
	});

	 newEdges = graph.edges.filter( function(e) {
		return (nodeIds.includes(e.source.id) && nodeIds.includes(e.target.id))  && types.has(e.type); 
    });  
}

		














function redraw2(){
	

    links = linkGroup.selectAll("path").data(newEdges, function(e){return e.id;}); 

	links.exit().remove(); 

    links.enter().append("path")
				  .attr("fill", "transparent")
				  .attr("stroke", function(d) { return getEdgeColor(d);})
				  .attr("stroke-width", 5)
				  .attr('marker-end',function(d) { return "url(#" + d.type + ")"});

    


	nodes = nodeGroup.selectAll("circle").data(newNodes, function(n){return n.id;}) ;

    nodes.exit().remove();


	nodes.enter().append("circle")
      .attr("r", 50)
      .attr("fill", function(d) { return "url(#" + d.id + ")" })
      .attr("stroke", "black")
      .attr("stroke-width", "2px")

      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    

	nodes.append("title")
	   .text(function(d) { return d.name;});

function tick() {
    links
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
    nodes
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
}

	//node.merge(newNode); 

	simulation.nodes(newNodes)
	   .on("tick", tick);

	simulation.force("link")
	    .links(newEdges);

	simulation.alpha(1).restart(); 


}




  function isConnected(a, b) {
          var edgeList = newEdges.filter( function(d){
          	if(d.source.id == a.id && d.target.id==b.id)
          		return true;
          	if(d.target.id == a.id && d.soruce.id==b.id)
          		return true;
          });

         return edgeList.length != 0;  
    
  }

  newNodes.on('mouseover',function (d) {
      newNodes.style('stroke-opacity', function (o) {
        var thisOpacity = 0;
        if(isConnected(d, o)){
          thisOpacity = 1;
        } else{
          thisOpacity = 0.3;
        }
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
        
      });
       newEdges.style('opacity', function(l) {
      if (d === l.source || d === l.target){
        return 1;
      }

       else{
        return 0.2;
      }
      });
    
      newEdges.style('stroke-width', function(l) {
      if (d === l.source || d === l.target){
        return 5;
      }else{
        return 3;
      }
      });

    var xpos =d.x;
    var ypos = d.y;
    var tgrp = svg.append("g")
        .attr("id", "tooltip")
        .attr("transform", (d, i) => `translate(${xpos+10},${ypos})`);
      tgrp.append("rect")
        .attr("width", "140px")
        .attr("height", "24px")
        .attr("fill", "gray")
      tgrp.append("text")
        .attr("x", 5)
        .attr("y", 14)
        .attr("text-anchor", "left")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .text(`${d.name}`);
  });
  
  node.on('mouseout',function (d) {
      node.style('stroke-opacity', function (o) {
        this.setAttribute('fill-opacity', 1);
        return 1;
        
      });
    newEdges.style('opacity',1);
    newEdges.style('stroke-width',3);
    d3.select("#tooltip").remove();
  });