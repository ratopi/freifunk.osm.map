
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
		var iconBaseUrl = "img/";

		// ---

		function createInfoLine( test, text )
		{
			return test ? text + '</br>' : '';
		}

		function createIconLink( test, url, icon, text )
		{
			text = text ? text : '';

			return ! test ? '' : '<a href="' + url + '" target="_blank"><img src="' + iconBaseUrl + icon + '" width="30px" style="margin-right: 15px;"/>' + text + '</a>';
		}

		function addIfMissingHttp( url, addThis )
		{
			addThis = addThis ? addThis : 'http://';

            return ! url ? null : ( url.match( /^http([s]?):\/\/.*/ ) ? "" : addThis ) + url;
		}

		// ---

		var html = '';
		if ( props.name )
		{
			html += '<b>';
			if ( props.url ) html += '<a href="' + addIfMissingHttp( props.url ) + '" target="_window">';
			html += props.name;
			if ( props.url ) html += "</a>";
			html += '</b><br/>';
		}

		html += createInfoLine( props.metacommunity, props.metacommunity );
		html += createInfoLine( props.city, props.city );
		html += createInfoLine( props.nodes, '<br/>Zug&auml;nge: ' + props.nodes );
		html += createInfoLine( props.contact.phone, '<br/>&#9990; ' + props.contact.phone );

		html += '<br/>';

		html += createIconLink( props.url, props.url, 'icon_www.png' );

		html += createIconLink( props.contact.email, 'mailto:' + props.contact.email, 'icon_email.png' );
		html += createIconLink( props.contact.facebook, props.contact.facebook, 'icon_facebook.png' );
		html += createIconLink( props.contact.twitter, addIfMissingHttp( props.contact.twitter, 'https://twitter.com/' ), 'icon_twitter.png' );
		html += createIconLink( props.contact.irc, 'irc:' + props.contact.irc, 'icon_irc.png' );
		html += createIconLink( props.contact.jabber, 'xmpp:' + props.contact.jabber, 'icon_jabber.png' );
		html += createIconLink( props.contact.identica, 'identica:' + props.contact.identicy, 'icon_identica.png' );
		html += createIconLink( props.contact.googleplus, props.contact.googleplus, 'icon_googleplus.png' );

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
