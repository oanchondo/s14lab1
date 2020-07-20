'use strict';

// initialize vars

let data = [];
let bars = null;
let scatter = null;
let donut = null;

d3.json('/load_data').then(d => {		// d: standard in js for data

	// Redefine
	data = d.users;

	// Print user count
	d3.select('#users').append('span')
		.text(data.length);


	// Insantiate
	bars = new Bars(data, 'vis1');
	donut = new Donut(data, 'vis2');		// needs to be donut
	scatter = new Scatter(data, 'vis3');		// needs to be scatter  reference: https://observablehq.com/search?query=scatterplot


}).catch(err => console.log(err));