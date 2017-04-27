
(function() {
    var width = 1000;
    var height =700;

    var svg =d3.select("#chart").append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    //legend

    var legendData = ["1994","2002","2004","2005","2006","2009","2011","2013","2014"];
    d3.queue()
        .defer(d3.csv, "legend.csv")
        .await(legend)

    var dateLabels;

    function legend(error, datapoints) {

        var rect = svg.selectAll("rect")
            .data(datapoints)
            .enter()
            .append("rect");

        var rectAtt = rect.attr("x", function (d) {
            return 10;
        })
            .attr("y", function (d) {
                return d.id * 11 + 5;
            })
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", function (d) {
                return d.acolor;
            });


        var text = svg.selectAll("text")
                                .data(datapoints)
                                .enter()
            .append("svg:a")
            .attr("xlink:href", function(d){return "papers/" + d.url +".pdf";})
                                .append("text");


        //Add SVG Text Element Attributes
        var textLabels = text
                        .attr("x", function(d) { return 25; })
                        .attr("y", function(d) { return d.id * 11 + 12;})
                        .text( function (d) { return d.tit; })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "0.4em")
                        .attr("fill", "black")



        var dates = svg.selectAll("dates")
            .data(legendData)
            .enter()
            .append("text");


         dateLabels = dates
            .attr("x", function(d) {
                if(d ==="1994"){
                    return 0.04*width;
                }else if(d ==="2002"){
                    return 0.13*width
                }else if(d ==="2004"){
                    return 0.25*width
                }else if(d ==="2005"){
                    return 0.38*width
                }else if(d ==="2006"){
                    return 0.52*width
                }else if(d ==="2009"){
                    return 0.66*width
                }else if(d ==="2011"){
                    return 0.74*width
                }else if(d ==="2013"){
                    return 0.82*width
                }else{
                    return 0.93*width
                }

            })
            .attr("y", function(d) { return height/2 + 230})
            .text( function (d) { return d; })
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
            .attr("font-size", "15px")
            .attr("fill", "black")
             .style("opacity",0);



    }

    var radiusScale = d3.scaleSqrt().domain([1,100]).range([5,40])

    var forceXSplit = d3.forceX(function(d){
             if(d.ayear ==="1994"){
                 return 0.04*width;
             }else if(d.ayear ==="2002"){
                 return 0.13*width
             }else if(d.ayear ==="2004"){
                 return 0.25*width
             }else if(d.ayear ==="2005"){
                 return 0.38*width
             }else if(d.ayear ==="2006"){
                 return 0.52*width
             }else if(d.ayear ==="2009"){
                 return 0.66*width
             }else if(d.ayear ==="2011"){
                 return 0.74*width
             }else if(d.ayear ==="2013"){
                 return 0.82*width
             }else{
                 return 0.93*width
             }

        })
        .strength(0.20)




    var forceX =  d3.forceX( function(d){ return width/2}).strength(0.05)
    var forceY =  d3.forceY( function(d){ return height/2 }).strength(0.05)

    var forceCollide = d3.forceCollide(function(d){return radiusScale(d.kcount) +1}  )

    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", forceY)
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.csv, "test1.csv")
        .await(ready)



    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function ready(error, datapoints){



        var circles = svg.selectAll(".kcount")
            .data(datapoints)
            .enter()
            .append("svg:a")
            .attr("xlink:href", function(d){return "web/viewer.html?file=54js.pdf#search=most";})
            .append("circle")
            .attr("class", "word")
            .attr("id", function(d) { return d.id; })
            .attr("r", function(d){return radiusScale(d.kcount)})
            .attr("fill" , function(d){
              return d.acolor})
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div .html("<b>Słowo kluczowe: </b>" +d.word + "</br>"
                       + "<b>Częstość: </b>" + d.kcount + "</br>"
                       + "<b>Data publikacji: </b>" + d.ayear + "</br>"
                       + "<b>Praca: </b>" + d.tit
                    )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        var clip = svg.selectAll(".kcount")
            .data(datapoints)
            .enter().append("clipPath")
            .attr("id", function(d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.id; });




        var text = svg.selectAll("tspan").data(datapoints)
            .enter().append("text")
            .text(function(d){ return d.word })
            .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
            .attr("font-size", "0.4em")



        d3.select("#colorbutton").on("click", function(){
                simulation.force("x", forceXSplit)
                    .alphaTarget(0.5)
                    .force("y", d3.forceY( function(d){ return height/2 + 30 }).strength(0.03))
                    .restart()

                    dateLabels
                        .style("opacity",1);

            }

        )


        d3.select("#combine").on("click", function(){
            simulation.force("x",forceX)
                .alphaTarget(0.5)
                .restart()

            dateLabels
                .style("opacity",0);
            }

        )



         simulation.nodes(datapoints)
             .on("tick", ticked)

        function ticked() {

            circles
                .attr("cx", function(d){

                    return d.x
                })
                .attr("cy", function(d){
                    return d.y
                })
            text
                .attr("x", function(d){

                return d.x - radiusScale(d.kcount) + 5
            })
                .attr("y", function(d){
                    return d.y
                })
        }

        /*var label = circles.append("text").text(function(d){return d.word}).attr({"aligment-baseline" : "middle",
            "text-anchor" : "middle"})*/

    }





})();
