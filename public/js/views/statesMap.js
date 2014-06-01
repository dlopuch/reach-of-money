define(['jquery', 'd3', 'data/statepaths', 'models/ContributionsService'],
function($, d3, statepaths, ContributionsService) {

ContributionsService.getReadyPromise().done(function() {
  console.log(ContributionsService.getContributionsByState('CA'));
});

  var statesMapDone = $.Deferred();

  var onStateHover = function(d) {
    makeHighlightCirclePing.call(this, d, true);
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


    otherStatesColor = ContributionsService.getContributionsScaleStub().range(['white', 'green']);

    console.log('d = ' + JSON.stringify(d));
    console.log('otherStates.contributions =' + JSON.stringify(otherStates.contributions));

    // otherStatesSelection.attr('fill','red');

    otherStatesSelection.attr('fill',function(d) {
      //debugger;
            return otherStatesColor(d.amount_usd);
         });

    otherStatesSelection.exit()
    .attr('fill', 'lightgrey');



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
    // foo = ContributionsService.getContributionsScaleStub();
    // foo.range(['grey', 'red']);
    console.log('otherStatesSelection = ' + otherStatesSelection);
    otherStatesSelection.attr('fill','grey');
  };

  var highlightCircleG, highlightCirclePath;

  /**
   * d3 onmouseover handler for a state path.  Draws and animates a circle ping around that state.
   * Must be executed with 'this' context being the highlighted element.
   * @param {Object} d Data bound to the elemend
   * @param {boolean} isOutgoingPing true to make ping outgoing
   */
  var makeHighlightCirclePing = function(d, isOutgoingPing) {
    var selectedStatePath = d3.select(this),
        bbox = selectedStatePath.node().getBBox();

    console.log('resetting transition!');
    highlightCirclePath
    .transition().duration(0) //interrupt any ongoing transitions (ie cancel previous ping to start new one)
    .attr('cx', bbox.x + bbox.width/2)
    .attr('cy', bbox.y + bbox.height/2)
    .attr('r', isOutgoingPing ? 1 : 600)
    .attr('opacity', 1)

    .transition().duration(2000).ease('exp-out')
    .attr('r', isOutgoingPing ? 600 : 1)
    .attr('opacity', 0);

  };

  d3.csv("js/data/datatest.csv", function(dataset) {

    console.log("dataset" + JSON.stringify(dataset));

    var svg = d3.select('#statecontainer')
              .append('svg')
                .attr('width', 1000).attr('height',600),
        g = svg
            .append('g')
              .attr('id', 'state_paths')
              .attr('transform', 'translate(30,0), scale(1)');


    highlightCircleG = svg.append('g')
                       .attr('id', 'highlight_circle')
                       .attr('transform', 'translate(30,0), scale(1)');

    highlightCirclePath = highlightCircleG.append('circle')
                          .attr('opacity', 0)
                          .attr('fill', 'none')
                          .attr('stroke', 'green')
                          .attr('stroke-width', 5);

    // Will duplicate state paths, but will make them invisible and stay on top so highlightCircle won't override them.
    var stateHoverMaskG = svg.append('g')
                          .attr('transform', 'translate(30,0), scale(1)');


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
         .attr('id', function(d) {return 'US_' + d.id;})
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
