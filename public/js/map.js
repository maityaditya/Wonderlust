mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
        .addTo(map);

map.on('load', () => {
    // Load an image from an external URL.
    map.loadImage(
        'https://img.icons8.com/ios_filled/200w/FA5252/compass--v3.png',
        (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage('custom-icon', image); 

            // Add a data source containing one point feature.
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': listing.geometry.coordinates,
                            }
                        }
                    ]
                }
            });

            // Add a layer to use the image to represent the data.
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point', 
                'layout': {
                    'icon-image': 'custom-icon', 
                    'icon-size': 0.25
                }
            });
        }
    );
});