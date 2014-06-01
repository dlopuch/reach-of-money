define(['jquery', 'd3', 'data/statepaths'], function($, d3, statepaths) {

  var statesMapDone = $.Deferred();

  d3.csv("js/data/datatest.csv", function(dataset) {

    console.log("dataset" + JSON.stringify(dataset));

    var g = d3.select('#statecontainer')
            .append('svg')
            .attr('width', 1000).attr('height',600).append('g').attr('transform', 'translate(30,0), scale(1)');


    var d = [],
        stateIdx = {};
    for (var k in statepaths) {
      if (!statepaths.hasOwnProperty(k)) continue;
      stateIdx[k] = {
        id: k,
        path: statepaths[k],
      };
      d.push(stateIdx[k]);
    }

    var colorScale = d3.scale.linear()
    .domain([1, 10])
    .range(['grey', 'red']);

    for (var i in dataset) {
      stateIdx[dataset[i].state].value = dataset[i].influence;
    }



    // d.push({
    //   id: 'CA',
    //   path: states['CA'],
    //   <!-- color: '#'+Math.floor(Math.random()*16777215).toString(16) -->
    //   color: 'red'
    // });

    // var p = g.selectAll('path').data(d);

    // d.push({
    //   id: 'MN',
    //   path: states['MN'],
    //   <!-- color: '#'+Math.floor(Math.random()*16777215).toString(16) -->
    //   color: 'green'
    // });

    var p = g.selectAll('path').data(d);

    p.enter().append('path')
         .attr('fill', function(d) {
            return colorScale(d.value || 1);
         })
         .attr('d', function(d) { return d.path; })
         .attr('stroke', 'rgba(255,255,255,.2)')
         .attr('opacity',0)
         .attr('transform', 'translate(1000,1000)scale(0)translate(-1000,-1000)')
         .on("mouseover", function(d) {
                    console.log("hellow, mouseover");
                    console.log("d is "+ JSON.stringify(d));
                    console.log("you have moused over " + d.id);
                    var nodeSelection = d3.select(this).style({opacity:'0.8'});

                    // nodeSelection.select("text").style({opacity:'1.0'});
                    })
          .on("mouseout", function(d) {
          console.log("hellow, mouseover");
          console.log("d is "+ JSON.stringify(d));
          console.log("you have moused over " + d.id);
          var nodeSelection = d3.select(this).style({opacity:'1.0'});
          // nodeSelection.select("text").style({opacity:'1.0'});
          });

    p.transition().duration(500)
                  .delay(function(d, i) { return i * 10; })
                  .attr('opacity', 1)
                  .attr('transform', 'translate(900,300)scale(1)translate(-900,-300)');

    statesMapDone.resolve();
  });

  return statesMapDone;
});
