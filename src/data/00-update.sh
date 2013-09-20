#!/bin/bash

# location of "master"
directoryURL="https://raw.github.com/freifunk/api.freifunk.net/master/directory/directory.json"

# go to "my" directory
cd "$( dirname "$0" )"

# load "master"
wget -O directory.json. "$directoryURL"  &&  mv directory.json. directory.json

# create local directory.json

# load state jsons
grep ':' directory.json | sed -e 's:" *,::' -e 's:"::g' -e 's+:+ +' | sort | while read id url; do

	wget -O "$id.json." "$url"  &&  mv "$id.json." "$id.json"

done

