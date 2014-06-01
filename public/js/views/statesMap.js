define(['jquery', 'underscore', 'd3', 'data/statepaths', 'models/ContributionsService'],
function($, _, d3, statepaths, ContributionsService) {

  var statesMapDone = $.Deferred();

  var contributionColorScale,
      outgoingContribsByState,
      incomingContribsByState,
      totalContribsColorScale;

  ContributionsService.getReadyPromise().done(function() {

    contributionColorScale = ContributionsService.getContributionsScaleStub().range(['lightgrey', "#cfc"]);
    outgoingContribsByState = ContributionsService.getStateTotalContributions(true);
    incomingContribsByState = ContributionsService.getStateTotalContributions(false);
    totalContribsColorScale = ContributionsService.getTotalContributionsScaleStub().range(['lightgrey', 'red']);
  });


  var onStateHover = function(d) {
    if (!contributionColorScale) {
      console.warn('[statesMap] data not yet loaded, please wait');
      return;
    }

    makeHighlightCirclePing.call(this, d, ContributionsService.isOutgoingMode());

    console.log("you have moused over " + d.id);

    var otherStates = ContributionsService.getContributionsByState(d.id);

    d3.selectAll('#statecontainer svg > g > path')
    .data(otherStates.contributions, function(d,i) { return d.id; })
      // UPDATE selection:
      // Color states with contributions according to scale
      .attr('fill',function(d) {
        return contributionColorScale(d.amount_usd);
      })
    .exit()
      // Color all other states default color
      .attr('fill', 'lightgrey');

    // Color current state red
    d3.select(this).attr('fill','red');

  };

  window.onStateHoverOff = function() {
    var data;
    if (ContributionsService.isOutgoingMode()) {
      data = outgoingContribsByState;
    } else {
      data = incomingContribsByState;
    }

    // Color all states default color
    d3.selectAll('#statecontainer svg > g > path')
    .data(data, function(d, i) { return d.id; })
    .attr('fill', function(d) {
      return totalContribsColorScale(d.sumContributions < 1 ? 1 : d.sumContributions);
    });
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
  _.forOwn(statepaths, function(path, stateKey) {
    stateIdx[stateKey] = {
      id: stateKey,
      path: path
    };
    d.push(stateIdx[stateKey]);
  });

  ContributionsService.getReadyPromise().done(function() {

    var p = g.selectAll('path').data(d);

    p.enter().append('path')
      .attr('id', function(d) {return 'US_' + d.id;})
      .attr('fill', 'lightgrey')
      .attr('d', function(d) { return d.path; })
      .attr('stroke', 'rgba(0,0,0,1)')
      .attr('opacity',1)
      .attr('transform', 'translate(1000,1000)scale(0)translate(-1000,-1000)')
      .on("mouseover", onStateHover)
      .on("mouseout", onStateHoverOff);

    onStateHoverOff();

    p.transition().duration(500)
                  .delay(function(d, i) { return i * 10; })
                  .attr('opacity', 1)
                  .attr('transform', 'translate(900,300)scale(1)translate(-900,-300)');

    statesMapDone.resolve();
  });

  return statesMapDone;
});
