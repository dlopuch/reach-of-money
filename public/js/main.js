define(['jquery', 'someModule', 'xml2json'], function($, SomeModule, xml2json) {
  alert('require.js dependency management configured. \n\nLets get started.');
  //SomeModule.go();
  window.xml2json = xml2json;
});
