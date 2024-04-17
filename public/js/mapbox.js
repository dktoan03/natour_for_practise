if (document.getElementById('map')) {
  const locations = JSON.parse(document.getElementById('map').dataset.locations)
  console.log(locations)

  mapboxgl.accessToken = 'pk.eyJ1IjoiZGt0b2FuMDMiLCJhIjoiY2x1dmo1bmozMDNqYTJqcno5eDVvaTA0OSJ9.914Bcv9kT_OpCwshFanNPg'
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dktoan03/cluvkyl8k000701qp83wmflx7',
    scrollZoom: false
    //   center: [-118.113, 34.11],
    //   zoom: 10
  })

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    const el = document.createElement('div')
    el.className = 'marker'

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map)

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    bounds.extend(loc.coordinates)
  })
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  })
}
