function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterData=data.samples.filter(x=>x.id==sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    filter_array = filterData[0]
    console.log(filter_array);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filter_array.otu_ids;
    var otu_labels =filter_array.otu_labels;
    var sample_values =filter_array.sample_values;


    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(otu_ID=>`OTU${otu_ID}`).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      type:"bar",
      orientation: "h"
    }
     ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title:{text:"<b>Top 10 Bactaria Cultures Found</b>"},
      margin:{t:100,l:150},
      paper_bgcolor: '#c9ced1',
      plot_bgcolor: 'white',

    annotations: [{
      xref: 'paper',
      yref: 'paper',
      x: 0.4,
      xanchor: 'center',
      y: -0.25,
      yanchor: 'center',
      text: 'The bar chart displays the top 10 bacterial species (OTUs)<br>with the number of samples found in your belly button',
      showarrow: false
    }]
  };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar",barData,barLayout);
    
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData=[{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker:{
        size:sample_values,
        color:otu_ids,
        colorscale:"Rainbow"
      }
    }];
    console.log(bubbleData);
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout={
      title:"<b>Bacteria Cultures per Sample</b>",
      showlegend:false,
      xaxis:{title:"OTU ID",automargin:true},
      yaxis:{title:"Sample Values",automargin:true},
      hovermode:"closest",
      //margin:{height:1500,width:1000},
      paper_bgcolor: '#c9ced1',
      plot_bgcolor: 'white',
      w:600,
      h:800,
    
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 1.0,
        yanchor: 'center',
        text: 'The bubble chart depicts the size proportion of the bacterial species <br> with the number of samples found in your belly button',
        showarrow: false
      }]
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout,{responsive:true});

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var meta_array = metadata.filter(metaObj=>metaObj.id==sample);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var metaData = meta_array[0];

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreqs= metaData.wfreq;
    console.log(wfreqs);
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData=[{
      value:wfreqs,
      type:"indicator",
      mode:"gauge+number",
      title:{text:"<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per week"},
      gauge:{
        axis:{range:[null,10],dtick:"2"},
        bar:{color:"black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color:"yellow"},
          { range: [6, 8], color:"lightgreen"},
          { range: [8, 10], color:"green"}
        ],
        dtick:2
      }

    }];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout={
      automargin:true,
      paper_bgcolor: '#c9ced1',
      plot_bgcolor: 'white',

      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "The gauge displays your belly button <br>weekly washing frequency",
        showarrow: false
      }]
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout,{responsive:true});

  });
}
