var GeolocationService = require('service/GeolocationService');

function MarcoWindow() {
	var self = Ti.UI.createWindow({
		title: 'Marco',
		backgroundColor: '#fff',
		barColor: '#8C001a'
	});

	var mapview = Titanium.Map.createView({
		mapType: Titanium.Map.STANDARD_TYPE,
		animate: true,
		regionFit: true,
		userLocation: true
	});

	self.addEventListener('open', function() {
		var geo = GeolocationService.findMe();

		Cloud.Places.search({
			// No params to get everyone
		}, function(e) {
			if (e.success) {
				var annotations = [];
				for (var i = 0; i < e.places.length; i++) {
					var place = e.places[i];

					annotations.push(Titanium.Map.createAnnotation({
						latitude: place.latitude,
						longitude: place.longitude,
						title: place.name,
						pincolor: Titanium.Map.ANNOTATION_RED,
						animate: true,
					}));
					Ti.API.debug('id: ' + place.id + '  name: ' + place.name + '  longitude: ' + place.longitude + '  latitude: ' + place.latitude);
				}

				mapview.setAnnotations(annotations);
			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});

		mapview.setRegion({
			latitude: geo.latitude,
			longitude: geo.longitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01
		});
	});

	self.add(mapview);

	return self;
}

module.exports = MarcoWindow;