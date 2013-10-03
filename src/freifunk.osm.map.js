
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
        function createLink( link )
        {
            var imageBaseUrl = "img/";

            return ! link ? "" : '<a href="' + link + '"><img src="' + imageBaseUrl + icon + '" width="30px" style="margin-right: 15px;"></a><br/>';
        }

        // ---

        var html = '<b><a href="' + community.url + '" target="_window">'+ community.name + '</a></b><br/>';

        if (community.metacommunity) html += community.metacommunity + '<br/>';
        if (community.city) html += community.city + '<br/>';
        if (community.nodes) html += '<br/>Zug&auml;nge: ' + community.nodes + '<br/>';
        if (community.phone) html += '<br/>&#9990; ' + community.phone + '<br/>';
        html += '<br/>';

        if (community.url && !community.url.match(/^http([s]?):\/\/.*/)) {
          html += '<a href=\"http://' + community.url + '\" target=\"_window\"><img src=\"img/icon_www.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        else {
          html += '<a href=\"' + community.url + '\" target=\"_window\"><img src=\"img/icon_www.png\" width="30px" style="margin-right: 15px;"/></a>';
        }

        if (community.contact.email) html += '<a href=\"mailto:' + community.contact.email + '\"><img src=\"img/icon_email.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (community.contact.facebook) html += '<a href=\"' + community.contact.facebook + '\" target=\"_window\"><img src=\"img/icon_facebook.png\" width="30px" style="margin-right: 15px;"/></a>';

        if (community.contact.twitter) {
          if (community.contact.twitter && !community.contact.twitter.match(/^http([s]?):\/\/.*/)) {
            html += '<a href=\"https://twitter.com/' + community.contact.twitter + '\" target=\"_window\"><img src=\"img/icon_twitter.png\" width="30px" style="margin-right: 15px;" alt=\"@' + community.twitter + '\" title=\"@' + community.twitter + '\"/></a>';
          }
          else {
            html += '<a href=\"' + community.contact.twitter + '\" target=\"_window\"><img src=\"img/icon_twitter.png\" width="30px" style="margin-right: 15px;"/></a>';
          }
        }

        if (community.contact.irc) html += '<a href=\"irc:' + community.contact.irc + '\"><img src=\"img/icon_irc.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (community.contact.jabber) html += '<a href=\"xmpp:' + community.contact.jabber + '\"><img src=\"img/icon_jabber.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (community.contact.identica) html += '<a href=\"identica:' + community.contact.identicy + '\"><img src=\"img/icon_identica.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (community.contact.googleplus) html += '<a href=\"' + community.contact.googleplus + '\" target=\"_window\"><img src=\"img/icon_googleplus.png\" width="30px" style="margin-right: 15px;"/></a>';

        return html;
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
