var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
var xLabel = "Poverty: ";
var yLabel = "Lacks HealthCare: ";

 // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, xLabel, yLabel, chosenYAxis, circlesGroup) {
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      //.offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
     toolTip.show(data,this);
    })
     //onmouseout event
     .on("mouseout", function(data, index) {
       toolTip.hide(data);
      });
  
    return circlesGroup;
  }

// Retrieve data from the CSV file
d3.csv("data.csv").then(function(data, error) {
    if (error) throw error;
    console.log(data);
    //  Parse Data
    data.forEach(function(data) {
        data.poverty= +data.poverty;
        data.age= + data.age;
        data.income= +data.income;
        data.healthcare= +data.healthcare;
        data.smokes= +data.smokes;
        data.obesity= +data.obesity;
      //console.log(data);
    });
   
    
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
               d3.max(data, d => d[chosenXAxis]) * 1.2
                ])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]), 
              d3.max(data, d => d[chosenYAxis])])
      .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
   
    var leftAxis = d3.axisLeft(yLinearScale);

    
    
    // Append both axes to the chart
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis= chartGroup.append("g")
        .call(leftAxis);

// Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    .attr("fill", "#89bdd3")
    .attr("stroke", "#e3e3e3")
    .attr("opacity", ".5");

    // Create state abbr labels
    var circleText = chartGroup.selectAll("circleText")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 0)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr('font-size',"11px")
    .attr("font-family","sans-serif")
    .text(data => data.abbr)

    // Create group for 3 x-axis labels
    var xLabelsGroup =chartGroup.append("g")
      .attr("transform", `translate(${width/2},${height-2})`)
      

      var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty (%)");
      
      var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
      
      var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
      
      // Create group for 3 y-axis labels
      var yLabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
      
      
      var healthcareLabel = yLabelsGroup.append("text")
      .attr("y", 40 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Health Insurance (%)");
      
      var smokesLabel = yLabelsGroup.append("text")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");
      
      var obesityLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obesity (%)");

// updates tooltips with new info
 circlesGroup = updateToolTip(chosenXAxis,xLabel, yLabel,chosenYAxis,circlesGroup);
    // x axis labels event listener
xLabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  var axis= d3.select(this).attr("x")
  console.log(axis, value, chosenXAxis);
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

     console.log(chosenXAxis)

    
    // updates x scale for new data
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

      // updates x axis with transition
      
      var bottomAxis = d3.axisBottom(xLinearScale);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

      // updates circles with new x values
      circlesGroup.transition()
                    .duration(1000)
                    .attr("cx", d => xLinearScale(d[chosenXAxis]));
                    
      circleText.transition()
                  .duration(1000)
                  .attr("x", d => xLinearScale(d[chosenXAxis]));

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active",false)
        .classed("inactive",true);
        xLabel = "Poverty: ";
    }
    else if (chosenXAxis=== "age"){
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
      .classed("active",false)
      .classed("inactive", true);
      xLabel = "Age: ";
    }
    else {
      incomeLabel
        .classed("active",true)
        .classed("inactive",false);
      povertyLabel
      .classed("active", false)
      .classed("inactive",true);
      ageLabel
      .classed("active",false)
      .classed("inactive",true);
      xLabel = "Median Income: ";
  
  }
  circlesGroup = updateToolTip(chosenXAxis,xLabel,yLabel,chosenYAxis, circlesGroup);
}
});

// y axis labels event listener

//circlesGroup = updateToolTip(chosenYAxis,yLabel, xLabel,chosenXAxis, circlesGroup);

yLabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  var axis= d3.select(this).attr("y")
  console.log(axis, value, chosenYAxis);
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    console.log(chosenYAxis)

    // updates y scale for new data
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]), d3.max(data, d => d[chosenYAxis])])
        .range([height, 0]);

      // updates y axis with transition
      var leftAxis = d3.axisLeft(yLinearScale);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

      // updates circles with new y values
      circlesGroup.transition()
                    .duration(1000)
                    .attr("cy", d => yLinearScale(d[chosenYAxis]));
      circleText.transition()
                    .duration(1000)
                    .attr("y", d => yLinearScale(d[chosenYAxis]));
    

    // changes classes to change bold text
    if (chosenYAxis === "healthcare") {
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active",false)
        .classed("inactive",true);
        yLabel = "Lacks HealthCare: ";
    }
    else if (chosenYAxis=== "smokes"){
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
      .classed("active",false)
      .classed("inactive", true);
      yLabel = "Smokes: ";
    }
    else {
      obesityLabel
        .classed("active",true)
        .classed("inactive",false);
      healthcareLabel
      .classed("active", false)
      .classed("inactive",true);
      smokesLabel
      .classed("active",false)
      .classed("inactive",true);
      yLabel = "Obesity: ";
  }
  // updates tooltips with new info
circlesGroup = updateToolTip(chosenYAxis,yLabel, xLabel,chosenXAxis, circlesGroup);
}
      
  
    })
});