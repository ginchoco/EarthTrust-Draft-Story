const svg = d3.select("svg")

const width = + svg.attr("width")
const height = + svg.attr("height")

const margin = {top: 20, right: 10, bottom: 20, left: 5}
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

// Change this to load which years are included in the data
// In real documents we can probably figure this out from the data we are loaded
// const years = ["Ht03", "Ht04", "Ht05", "Ht06", "Ht07", "Ht08"]

const settings1 = {
    years: ["22/4/04", "29/04/04", "06/05/04", "13/05/04"],
    file: "../data/CleanBWP2.csv",
    width: 800
}

// const settings2 = {
//     years: ["Ht08"],
//     file: "./CleanBWP1.csv",
//     width: 240
// }

const settings = settings1

let year = 0

// Change this string to change which data is loaded!
d3.csv(settings.file).then(data => {
    data.forEach(d => {
        settings.years.forEach(y => {
            d[y] = + d[y] // +d[y] parses the attribute as an integer
        })
    })

    const xScale = d3.scaleBand()
          .domain(data.map(d => d.Index))
          .range([0, innerWidth])

    const colorScale = d3.scaleOrdinal(d3.schemePaired.slice(0,10))
          .domain(data.map(d => d.Provenance))

    // var names = data.map(d => d.Provenance);
    // var uniqueNames = [];
    // $.each(names, function(i, el){
    //     if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    // });

    // // Add one dot in the legend for each name.
    // svg.selectAll("mydots")
    //     .data(uniqueNames)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", 100)
    //     .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    //     .attr("r", 7)
    //     .style("fill", function(d){ return colorScale(d)})

    // // Add one dot in the legend for each name.
    // svg.selectAll("mylabels")
    //     .data(uniqueNames)
    //     .enter()
    //     .append("text")
    //     .attr("x", 120)
    //     .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    //     .style("fill", function(d){ return colorScale(d)})
    //     .text(function(d){ return d})
    //     .attr("text-anchor", "right")
    //     .style("alignment-baseline", "right")

        
    let max = 0
    settings.years.forEach(y => {
        max = Math.max(max, d3.max(data, d => d[y]))
    })
    const yScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, innerHeight])

    const g = svg.append("g")
          .attr("transform", `translate(${margin.right}, ${margin.top})`)

    g.append("g").call(d3.axisRight(yScale))
        .attr("transform", `translate(600, 0)`)


    const render = () => {
        const rects = g.selectAll("rect").data(data)

        rects.enter().append("rect")
            .attr("class", "bar")
            .attr("width", d => xScale.bandwidth())
            .attr("x", d => xScale(d.Index))
            .attr("fill", d => colorScale(d.Provenance))
          .merge(rects)
            .transition().duration(1000)
            .attr("height", d => yScale(d[settings.years[year]]))
            .attr("transform", "translate(600, 0) rotate(90)");
    };

    render()

    document.getElementById("nextYear").addEventListener("click", () => {
        year = (year + 1) % settings.years.length
        render()
    });
})
