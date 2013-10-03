var iconDef =
{
	iconUrl: 'img/Freifunk-Marker-1-20.png',
	iconSize:     [ 20, 20 ], // size of the icon
	iconAnchor:   [ 10, 10 ], // point of the icon which will correspond to marker's location
	popupAnchor:  [ 0, 0 ] // point from which the popup should open relative to the iconAnchor
};

// ---

new Image().src = iconDef.iconUrl; // preload image

var ffIcon = L.icon( iconDef );

// ---

var map = L.map( 'map' ); // .setView( [ 51.505, -0.09 ], 13 );

L.tileLayer(
	// 'http://{s}.tile.cloudmade.com/3249f584dd674d399238a99850abcbae/997/256/{z}/{x}/{y}.png',
	// 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
	{
		attribution: 'Map data and Imagery &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
		maxZoom: 18
	}
).addTo( map );

// ---

var counter = 0;
var latSum = 0;
var lonSum = 0;
$.getJSON(
	"data/directory.json",
	function( data )
	{
		for ( var k in data )
		{
			$.getJSON(
				"data/" + k + ".json",
				function( x )
				{
					var marker = L.marker(
						[ x.location.lat, x.location.lon ],
						{
							icon: ffIcon,
							riseOnHover: true,
							title: x.name
						}
					).addTo( map );

					marker.bindPopup( x.name );

					// center the map to the middle of all points ... ;-)
					counter++;
					latSum += x.location.lat;
					lonSum += x.location.lon;

					map.setView( [ ( latSum / counter), ( lonSum / counter) ], 6 );
				}
			);
		}
	}
);


