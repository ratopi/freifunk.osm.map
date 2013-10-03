
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

	function createTooltip( props )
    {
        function createLink( link )
        {
            var imageBaseUrl = "img/";

            return ! link ? "" : '<a href="' + link + '"><img src="' + imageBaseUrl + icon + '" width="30px" style="margin-right: 15px;"></a><br/>';
        }

        // ---

        var html = '<b><a href="' + props.url + '" target="_window">'+ props.name + '</a></b><br/>';

        if (props.metacommunity) html += props.metacommunity + '<br/>';
        if (props.city) html += props.city + '<br/>';
        if (props.nodes) html += '<br/>Zug&auml;nge: ' + props.nodes + '<br/>';
        if (props.phone) html += '<br/>&#9990; ' + props.phone + '<br/>';
        html += '<br/>';

        if (props.url && !props.url.match(/^http([s]?):\/\/.*/)) {
          html += '<a href=\"http://' + props.url + '\" target=\"_window\"><img src=\"img/icon_www.png\" width="30px" style="margin-right: 15px;"/></a>';
        }
        else {
          html += '<a href=\"' + props.url + '\" target=\"_window\"><img src=\"img/icon_www.png\" width="30px" style="margin-right: 15px;"/></a>';
        }

        if (props.contact.email) html += '<a href=\"mailto:' + props.contact.email + '\"><img src=\"img/icon_email.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (props.contact.facebook) html += '<a href=\"' + props.contact.facebook + '\" target=\"_window\"><img src=\"img/icon_facebook.png\" width="30px" style="margin-right: 15px;"/></a>';

        if (props.contact.twitter) {
          if (props.contact.twitter && !props.contact.twitter.match(/^http([s]?):\/\/.*/)) {
            html += '<a href=\"https://twitter.com/' + props.contact.twitter + '\" target=\"_window\"><img src=\"img/icon_twitter.png\" width="30px" style="margin-right: 15px;" alt=\"@' + props.twitter + '\" title=\"@' + props.twitter + '\"/></a>';
          }
          else {
            html += '<a href=\"' + props.contact.twitter + '\" target=\"_window\"><img src=\"img/icon_twitter.png\" width="30px" style="margin-right: 15px;"/></a>';
          }
        }

        if (props.contact.irc) html += '<a href=\"irc:' + props.contact.irc + '\"><img src=\"img/icon_irc.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (props.contact.jabber) html += '<a href=\"xmpp:' + props.contact.jabber + '\"><img src=\"img/icon_jabber.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (props.contact.identica) html += '<a href=\"identica:' + props.contact.identicy + '\"><img src=\"img/icon_identica.png\" width="30px" style="margin-right: 15px;"/></a>';
        if (props.contact.googleplus) html += '<a href=\"' + props.contact.googleplus + '\" target=\"_window\"><img src=\"img/icon_googleplus.png\" width="30px" style="margin-right: 15px;"/></a>';

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
