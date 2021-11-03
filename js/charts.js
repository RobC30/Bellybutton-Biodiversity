function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("js/samples.json").then((data) => {
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
  d3.json("js/samples.json").then((data) => {
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



// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("js/samples.json").then((data) => {
    // console.log(data)
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let sampleArray = samples.filter(sampleObj => sampleObj.id == sample)

    // DEL 3.1 Create a variable that filters the metadata array for the object with the desired sample number.
    let metadataOne = data.metadata
    let metaArrayOne = metadataOne.filter(sampleObj => sampleObj.id == sample)

    //  5. Create a variable that holds the first sample in the array.
    let sampleOne = sampleArray[0]
    // console.log(sampleOne)

    // DEL 3.2 Create a variable that holds the first sample in the metadata array.
    let metaDataOne = metaArrayOne[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = sampleOne.otu_ids
    let otu_labels = sampleOne.otu_labels
    let sample_values = sampleOne.sample_values

   // DEL 3.3 Create a variable that holds the washing frequency.
    let washing = parseFloat(metaDataOne.wfreq)
    // console.log(washing)

    // // 7. Create the yticks for the bar chart.
    // // Hint: Get the the top 10 otu_ids and map them in descending order  
    // //  so the otu_ids with the most bacteria are last. 

    let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()

    // // 8. Create the trace for the bar chart. 
    let barData = [{
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels,
        type:'bar',
        orientation:'h'
    }]
    // // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
    }

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout)

    // ------------------------BUBBLE CHART------------------------

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet'
      }

    }]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title:'OTU ID'}
    }
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    
    
    // ------------------------GAUGE CHART------------------------
    // 4. Create the trace for the gauge chart.

    let gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washing,
        gauge: {
          axis: {range : [null,10], tickwidth:2, tickcolor:'black'},
          bar: {color:'gold'},
          steps: [
            { range: [0, 2], color: 'dimgray' },
            { range: [2, 4], color: 'darkgrey' },
            { range: [4, 6], color: 'lightgrey' },
            { range: [6, 8], color: 'whitesmoke' },
            { range: [8, 10], color: 'white' }]
        },
        title: { text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week' },
        type: "indicator",
        mode: "gauge+number"
      }]

    // 5. Create the layout for the gauge chart.
    let guageLayout = { width: 400, height: 400, margin: { t: 0 , b: 0 } 

    }
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData , guageLayout)
  });
}
