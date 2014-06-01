/**
 * Module that converts an XML Object to a JSON object.
 *
 * To use:
 *   xml2json( $.parseXML('<foo><bar></bar></foo>'));
 *
 * or, if you have an endpoint that returns XML:
 *   $.get('http://some.endpoint.com/that/gets/xml')
 *   .done(function(xmlObj) {
 *     console.log( xml2json(xmlObj));
 *   });
 */
define(['jquery'], function($) {
  // gloriously copy-pasted from: http://davidwalsh.name/convert-xml-json
  return function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };
});

