
var freifunkOsmMap = function()
{
	var iconDef =
	{
		iconUrl: 'img/Freifunk-Marker-1-20.png',
		iconSize:     [ 20, 20 ],
		iconAnchor:   [ 10, 10 ],
		popupAnchor:  [ 0, 0 ]
	};

	// ---

	new Image().src = iconDef.iconUrl; // preload icon

	var ffIcon = L.icon( iconDef );

	// ---

	var map = L.map( 'map' ); // .setView( [ 51.505, -0.09 ], 13 );

	L.tileLayer(
		// 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
		{
			attribution: 'Map data and Imagery &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
			maxZoom: 18
		}
	).addTo( map );

	// ---

	function createTooltip( community )
	{
		return community.name; // for now only the name of the community
	}

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
					function( community )
					{
						var marker = L.marker(
							[ community.location.lat, community.location.lon ],
							{
								icon: ffIcon,
								riseOnHover: true,
								title: community.name
							}
						).addTo( map );

						marker.bindPopup( createTooltip( community ) );

						// center the map to the middle of all points ... ;-)
						counter++;
						latSum += community.location.lat;
						lonSum += community.location.lon;

						map.setView( [ ( latSum / counter), ( lonSum / counter) ], 6 );
					}
				);
			}
		}
	);

	return {};

}();
