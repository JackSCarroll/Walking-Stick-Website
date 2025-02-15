var socket;
socket = io.connect();

socket.on("coords", getCoords)

let latitude;
let longitude;
let longitudeS;
let latitudeS;
let address;

function getCoords(data) {
    latitude = data.lat;
    longitude = data.long;
    longitudeS = longitude.toString();
    latitudeS = latitude.toString();
    //console.log(latitude);
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYXBhcG91dHNpcyIsImEiOiJja3NzZ2Q0bmgwd2tkMm5wdWtteHVvd3M5In0.YfOjhqgCT00v9ggsxACvfA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [145.187, -37.925],
    zoom: 10
});

const size = 200;

const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    // Call once before every frame where the icon will be used.
    render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
    }
};

map.on('load', () => {
    let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + longitudeS + "," + latitudeS + ".json?access_token=pk.eyJ1IjoiYXBhcG91dHNpcyIsImEiOiJja3NzZ2Q0bmgwd2tkMm5wdWtteHVvd3M5In0.YfOjhqgCT00v9ggsxACvfA";
    console.log(url)
    fetch(url)
        .then(response => response.json())
        .then(data => {
            address = data.features[0].place_name
            console.log(address);
            document.getElementById("location").innerHTML = address;
        });

    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    map.addSource('dot-point', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [longitude, latitude] // icon position [lng, lat]
                    }
                }
            ]
        }
    });
    map.addLayer({
        'id': 'layer-with-pulsing-dot',
        'type': 'symbol',
        'source': 'dot-point',
        'layout': {
            'icon-image': 'pulsing-dot'
        }
    });
});
function TTS()
    {
        if ('speechSynthesis' in window) {
            // Speech Synthesis supported 🎉
           }else{
             // Speech Synthesis Not Supported 😣
             alert("Sorry, your browser doesn't support text to speech!");
           }
           var msg = new SpeechSynthesisUtterance();
        msg.text = address.toString();
        window.speechSynthesis.speak(msg);
    }