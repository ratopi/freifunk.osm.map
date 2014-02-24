/*
License: http://creativecommons.org/licenses/by-nc-sa/3.0/
By Ralf Th. Pietsch
See https://github.com/ratopi/freifunk.osm.map for more information
*/

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
			attribution: 'Map data and Imagery &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>; Source: <a href="https://github.com/ratopi/freifunk.osm.map">@github</a>',
			maxZoom: 18
		}
	).addTo( map );

	// ---

	function createTooltip( community )
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
		if ( community.name )
		{
			html += '<b>';
			if ( community.url ) html += '<a href="' + addIfMissingHttp( community.url ) + '" target="_blank">';
			html += community.name;
			if ( community.url ) html += "</a>";
			html += '</b><br/>';
		}

		html += createInfoLine( community.metacommunity, community.metacommunity );
		html += createInfoLine( community.city, community.city );
		html += createInfoLine( community.nodes, '<br/>Zug&auml;nge: ' + community.nodes );

		if ( community.contact )
		{
			html += createInfoLine( community.contact.phone, '<br/>&#9990; ' + community.contact.phone );

			html += '<br/>';

			// html += createIconLink( community.url, addIfMissingHttp( community.url ), 'icon_www.png' );
			html += createIconLink( community.contact.email, 'mailto:' + community.contact.email, 'icon_email.png' );
			html += createIconLink( community.contact.facebook, community.contact.facebook, 'icon_facebook.png' );
			html += createIconLink( community.contact.twitter, addIfMissingHttp( community.contact.twitter, 'https://twitter.com/' ), 'icon_twitter.png' );
			html += createIconLink( community.contact.irc, 'irc:' + community.contact.irc, 'icon_irc.png' );
			html += createIconLink( community.contact.jabber, 'xmpp:' + community.contact.jabber, 'icon_jabber.png' );
			html += createIconLink( community.contact.identica, 'identica:' + community.contact.identicy, 'icon_identica.png' );
			html += createIconLink( community.contact.googleplus, community.contact.googleplus, 'icon_googleplus.png' );
		}

		return html;
	}

	// ---

	var baseUrl = "http://freifunk-ffm.no-ip.info/freifunk/directory/";

	var counter = 0;
	var latSum = 0;
	var lonSum = 0;
	$.getJSON(
		baseUrl + "directory.json",
		function( data )
		{
			for ( var k in data )
			{
				$.getJSON(
					baseUrl + k + ".json",
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
