/**
 * @class Bars
 */
class Donut {

    // Configs
    margin = {top: 50, right: 20, bottom: 30, left: 40};
    width = 360 - this.margin.left -this. margin.right;
    height = 360 - this.margin.top - this.margin.bottom;
    radius = Math.min(this.width, this.height) / 2

    data_bins = [];

    color = d3.scaleOrdinal(["#b32232", "#d92b2a", "#8c184d", "#e62f2d", "#660f66", "#400580"]);

    pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    path = d3.arc()
        .outerRadius(this.radius - 10)
        .innerRadius(this.radius - 70);

    label = d3.arc()
        .outerRadius(this.radius - 40)
        .innerRadius(this.radius - 40);
    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }


    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .append("g").attr("transform", "translate(" + (vis.width + vis.margin.left + vis.margin.right) / 2 + "," + ( vis.height + vis.margin.top + vis.margin.bottom) / 2 + ")")

        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;
        var langs = [...new Set(vis.data.map(function(d) {
            return d.prog_lang;
        }))];
        langs.forEach(l=>{
            var obj = {};
            var count = vis.data.filter(function(d){return d.prog_lang==l});
            obj.prog_lang = l;
            obj.count = count.length;
            vis.data_bins.push(obj);
        })
        

        // Now render
        vis.render();
    }

    /** @function wrangle()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        vis.svg.append("text")
            .attr("x", (vis.margin.top / 4 ))             
            .attr("y", 0 - (vis.height / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px")
            .text("Programming Languages");

        var arc = vis.svg.selectAll(".arc")
            .data(vis.pie(vis.data_bins))
            .enter().append("g")
            .attr("class", "arc");

            arc.on("mouseover", function(d){
              vis.svg.append('text')
                .attr('class', 'donutlabel')
                .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                .html((d.data.prog_lang)) // add text to the circle.
                .style('font-size', '.9em')
                .style('text-anchor', 'middle'); // centres text in tooltip

              vis.svg.append('text')
                .attr('class', 'donutlabel')
                .attr('dy', 10) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                .html((d.data.count)) // add text to the circle.
                .style('font-size', '1.2em')
                .style('text-anchor', 'middle'); // centres text in tooltip                
            });

            arc.on("mouseout", function(d){
                vis.svg.selectAll('.donutlabel')
                 .remove();              
              });

        arc.append("path")
            .attr("d", vis.path)
            .attr("fill", function(d) { return vis.color(d.data.prog_lang); });

        arc.append("text")
            .attr("transform", function(d) { return "translate(" + vis.label.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .text(function(d) { return d.data.prog_lang; })
            .style('font-size', '10px')
            .style('text-anchor', 'middle'); // centres text 

    }
}