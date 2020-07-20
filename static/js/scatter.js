/**
 * @class Scatter
 */
class Scatter {

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = { top: 50, right: 25, bottom: 75, left: 75 };
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools

    scX = d3.scaleLinear()
        .range([0, this.gW]);
    scY = d3.scaleLinear()
        .range([this.gH, 0]);
    maximumCircleRadius = 7;
    scR = d3.scaleLinear()
        .range([0, this.maximumCircleRadius]);
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();


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

        console.log(`#${vis.target}`)


        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`)
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .style('text-anchor', 'middle')
            .text('Years of Experience');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .style('text-anchor', 'middle')
            .text('Homework Hours');

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

        // map ages
        const ageMap = vis.data.map(d => d.age);

        // map years of experience
        const expMap = vis.data.map(d => +d.experience_yr);

        // map the Homework hours
        const homeworkMap = vis.data.map(d => +d.hw1_hrs);



        // update scales
        vis.scX.domain(d3.extent(expMap));
        vis.scY.domain([0, d3.max(homeworkMap)]);
        vis.scR.domain([0, d3.max(ageMap)]);
        vis.xAxis.scale(vis.scX).ticks(8);
        vis.yAxis.scale(vis.scY);


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

        // build bars
        vis.g.selectAll('.scatterG')
            .data(vis.data)
            .join(
                // enter - adding new elements/data
                enter => enter
                    .append('g')
                    .attr('class', 'scatterG')
                    .each(function (d, i) {
                        // define this
                        const g = d3.select(this);
                        // set position for dots
                        g.style('transform', `translate(${vis.scX(+d.experience_yr)}px, ${vis.scY(+d.hw1_hrs)}px)`);

                        // create circles
                        g.append('circle')
                            .attr('r', d => vis.scR(d.age))
                            .attr('fill', 'rgba(0, 0, 128, 1)');
                    })
            );

        // update axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}