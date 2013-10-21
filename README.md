Inspiriert von FFMap aus dem api.freifunk.net-Projekt hab' ich eine kleine Map-App auf Basis von
Leaflet zusammengestrickt.

Das ganze ist momentan vorwiegend ein "proof of concept".

Im Gegensatz zur cmap, findet die Konvertierung von "Community-JSONs" in Kartendaten nicht durch ein Server-Side-Script
sondern im Browser statt.  Der Server liefert lediglich die rohen JSONs und das JavaScript baut daraus die einzelnen
Einträge auf der Karte zusammen.

Der aktuelle Entwicklungsstand ist unter
http://ratopi.github.io/freifunk.osm.map/src/leaflet.html
zu sehen.
