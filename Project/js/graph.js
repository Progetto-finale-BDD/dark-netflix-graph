var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins


// var width = 1700 - margin.left - margin.right; 100%
var height = 1200 - margin.top - margin.bottom;

var dr = 4,             // default point radius
    off = 15,           // cluster hull offset
    expand = {},        // expanded clusters
    data, net, force, force2, hullg, hull, linkg, helper_linkg, link, hlink, nodeg, helper_nodeg, node, hnode,
    debug = 2; // 0: disable, 1: all, 2: only force2




var svg = d3.select("body").append("svg")
    .attr("width", "100%")     
    .attr("height", height + margin.top + margin.bottom);

