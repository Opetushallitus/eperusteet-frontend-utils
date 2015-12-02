#!/bin/sh
# Inkscape täytyy olla ympäristömuuttujissa
# Kuvat skaalataan leveyden mukaan

IKONIT="ikoni-eperusteet ikoni-eperusteet-valkoinen ikoni-haku ikoni-nuoli-alas ikoni-nuoli-oikealle ikoni-paikallinen ikoni-peruste"

function render {
        inkscape --file="$1.svg" --export-png="../png/$2/$1.png" --export-area-page --export-width=$3
}

for KUVA in $IKONIT; do
    echo processing icon: ${FILE}.svg
    render $KUVA "xs" 32
    render $KUVA "sm" 64
    render $KUVA "md" 128
    render $KUVA "lg" 256
done