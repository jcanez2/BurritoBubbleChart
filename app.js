let svgWidth = 1100
let svgHeight = 1100

renderBubbles();

function renderBubbles(){
  let graphic = d3.select("#mainGraphic")
    .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)

  d3.csv("./book1.csv", function(data) {
    let priceColor = d3.scaleOrdinal()
      .domain([0,4, 5, 6, 7, 8, 9, 10, 11, 25])
      .range(['#ffffff','#ff33cc' ,'#1827f2', '#18f2d1', '#1ff218', '#f2ef18', '#f7a63b', '#9c3636', '#e61212', 'black']);
    let hungerColor = d3.scaleOrdinal()
      .domain([0,1, 2, 3, 4, 5])
      .range(['#42f560','#b6f542' ,'#f5f242', '#f5c242', '#f58d42', '#f54242']);
    let calculateSize = d3.scaleLinear()
      .domain([0, 9])
      .range([1,35]) 
    let Popup = d3.select("#mainGraphic")
      .append("div")
      .style("opacity", 1)
      .style("background-color", "#2EC2A0")
      .style("border", "solid")
      .style("border-width", "4px")
      .style("border-radius", "8px")
      .style("padding", "8px")
    let onDotHover = function(d) {
      Popup
        .html('<u>' +"Price of Burrito: $" + 
        d.Cost + '</u>' + "<br>"+"Overall Score: "+ d.Rating + 
        "<br>" + "Location : " + d.Location+" /  Burritos: " + d.Name);
    }
    let bubble = graphic.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "burritoSpot")
        .attr("r", function(d){ return calculateSize(d.Rating)})
        .style("fill", function(d){ return priceColor(d.Price)})
        .style("fill-opacity", 0.8)
        .attr("stroke", (d) => hungerColor(d.Hunger))
        .style("stroke-width", 2)
        .on("mousemove", onDotHover)
        .call(d3.drag()
            .on("start", startOfDrag)
            .on("drag", duringDrag)
            .on("end", endOfDrag));
    let movement = d3.forceSimulation()
        .force("center", d3.forceCenter().x(svgWidth/2).y(svgHeight/1.95)) 
        .force("charge", d3.forceManyBody().strength(.1)) 
        .force("collide", d3.forceCollide().strength(.2)
        .radius(function(d){ return (calculateSize(d.Rating)+4) }).iterations(1))
    movement
        .nodes(data)
        .on("tick", function(d){
          bubble
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });
    function startOfDrag(d) {
      if (!d3.event.active) movement.alphaTarget(.1).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function duringDrag(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function endOfDrag(d) {
      if (!d3.event.active) movement.alphaTarget(.1);
      d.fx = null;
      d.fy = null;
    }
  })
}