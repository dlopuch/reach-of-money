define(['jquery', 'd3', 'data/statepaths', 'models/ContributionsService'],
function($, d3, statepaths, ContributionsService) {

ContributionsService.getReadyPromise().done(function() {
  console.log(ContributionsService.getContributionsByState('CA'));
});

  var statesMapDone = $.Deferred();

  var onStateHover = function(d) {
    // TODO call contributionsService to get list of states to select.
    console.log("d is "+ JSON.stringify(d));
    console.log("you have moused over " + d.id);
    var nodeSelection = d3.select(this).style({opacity:'0.8'});
    ContributionsService.getReadyPromise().done(function() {
      console.log(ContributionsService.getContributionsByState(d.id));
      otherStates = ContributionsService.getContributionsByState(d.id);
    });
    otherStatesSelection = d3.selectAll('#statecontainer svg > g > path')
      .data(otherStates.contributions, function(d,i) { return d.id; });
    console.log('otherStatesSelection = ' + otherStatesSelection);
    otherStatesSelection.attr('fill','red');
  };

  var onStateHoverOff = function(d) {
    // TODO call contributionsService to get list of states to select.
          // console.log("hellow, mouseover");
          // console.log("d is "+ JSON.stringify(d));
          // console.log("you have moused over " + d.id);
    var nodeSelection = d3.select(this).style({opacity:'1.0'});
    ContributionsService.getReadyPromise().done(function() {
      console.log(ContributionsService.getContributionsByState(d.id));
      otherStates = ContributionsService.getContributionsByState(d.id);
    });
    otherStatesSelection = d3.selectAll('#statecontainer svg > g > path')
      .data(otherStates.contributions, function(d,i) { return d.id; });
    console.log('otherStatesSelection = ' + otherStatesSelection);
    otherStatesSelection.attr('fill','grey');
  };

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


    var p = g.selectAll('path').data(d);

    p.enter().append('path')
         .attr('fill', function(d) {
            return colorScale(d.value || 1);
         })
         .attr('d', function(d) { return d.path; })
         .attr('stroke', 'rgba(255,255,255,.2)')
         .attr('opacity',0)
         .attr('transform', 'translate(1000,1000)scale(0)translate(-1000,-1000)')
         .on("mouseover", onStateHover)
         .on("mouseout", onStateHoverOff)

    p.transition().duration(500)
                  .delay(function(d, i) { return i * 10; })
                  .attr('opacity', 1)
                  .attr('transform', 'translate(900,300)scale(1)translate(-900,-300)');

    statesMapDone.resolve();
  });

  return statesMapDone;
});
