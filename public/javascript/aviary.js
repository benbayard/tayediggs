var featherEditor = new Aviary.Feather({
  apiKey: '1234567',
  apiVersion: 2,
  tools: ['enhance', 'focus', 'brightness', 'warmth'],
  minimumStyling: false,
  maxSize: 300,
  onSave: function(imageID, newURL) {
    var img = document.getElementById(imageID);
    img.src = newURL;
  },
  postUrl: 'http://example.com/featherposturl'
});

function launchEditor(id, src) {
  window.scrollTo(0,1);
  featherEditor.launch({
    image: id,
    url: src
  });
  return false;
}