var data;
d3.json("/rawdata", function(error, json) {
    if (error) return console.warn(error);
    data = json;
    plotGraph(error, data);
  });


function formatDate(dateValue) {
    var date = new Date(dateValue), locale='en-us';
    var day = date.getDate();
    var month = date.toLocaleString(locale, { month: "short" });
    var year = date.getFullYear();
    return day + '-' + month + '-' + year; 
}

function plotGraph(error, followerData) {
    var h=200;
    var w=1000;
    var s=3;
    var padding = 40; 

    var max = d3.max(followerData, function(d) { return d.count; } );
    var min = d3.min(followerData, function(d) { return d.count; } );

    var maxDate = formatDate(d3.max(followerData, function(d) { return d.date; } ));
    var minDate = formatDate(d3.min(followerData, function(d) { return d.date; } ));

   d3.select("body").append("h5")
        .text("Followers over Time");


    d3.select("body").append("h6")
        .text(minDate + " to " + maxDate);

    var tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);        

    var yScale = d3.scale
        .linear()
        .domain([min,max + 10])
        .range([h-padding, 10])
        .nice();

        var xScale = d3.scale
        .linear()
        .domain([0, followerData.length-1])
        .range([5, w]);

    
    var drawLine = d3.svg.line()
        .x(function(d,i){ return xScale(i);})
        .y(function (d){ return yScale(d.count); })
        .interpolate("monotone");

    var svg = d3.select("body")
        .append("svg")        
        .attr({
            width: w,
            height: h
       });

    var path = svg.append("path")
        .attr({
            d: drawLine(followerData),
            "stroke": "green",
            "stroke-width": 3,
            "fill": "none"});

    var totalLength = path.node().getTotalLength(); 
    console.log(totalLength);


    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
        
    svg.selectAll("circle")
        .data(followerData)
        .enter()
        .append("circle")
        .attr("r", 5)	    
        .attr("cx", function(d, i) { return xScale(i); })		 
        .attr("cy", function(d) { return yScale(d.count); })
        .style("opacity", .5)
        .attr({"fill" : function(d, i){
            if(d.count==min || d.count ==max)
                return "red";
            else
                return "transparent";
        }})
        .on("mouseover", function (d){
            tooltip.transition()		
                .duration(500)		
                .style("opacity", .9);	
            tooltip.html(formatDate(d.date) + "<br/>"  + d.count)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);
        });	        	            

    //labels
    svg.selectAll("text")
        .data(followerData)
        .enter()    
        .append("text")
        .text(function(d){ return d.count;})
        .attr({
           x: function(d, i){ 
               if(i==followerData.length-1)
               {
                return xScale(i) - 25;
               }
               return xScale(i);
            },
           y: function (d){ return yScale(d.count) - 15; },           
            "font-size":"10px",
            "fill": "#000000",
            "text-anchor": "start",
            "dy": "0.35em",
            "display": function(d,i){
            console.log(i);
            if(d.count==min || d.count==max || i==0 || i==followerData.length-1) 
            {
                return "inline";
            }
            else
                return "none";                
            }
        });

        
}



    

 


