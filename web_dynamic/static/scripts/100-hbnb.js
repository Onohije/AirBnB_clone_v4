$(document).ready(function () {
  // Check if API endpoint is available
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    method: 'GET',
    success: function () {
      $('div#api_status').addClass('available');
    }
  });

  // Fetch places
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (response) {
      updatePlaces(response);
    }
  });

  const aFilters = {}; // Amenities Filters
  const lFilters = {}; // Locations Filters

  // Amenities input click listeners
  $('div.amenities li input').on('click', function () {
    const data = $(this).data();

    if ($(this).is(':checked')) {
      aFilters[data.id] = data.name;
    } else {
      delete aFilters[data.id];
    }
    let text = Object.values(aFilters).sort().join(', ');
    text = text.length > 35 ? text.slice(0, 32) + '...' : text;
    $('div.amenities h4').text(text);
  });

  // Locations input click listeners
  $('div.locations li input').on('click', function () {
    const data = $(this).data();

    if ($(this).is(':checked')) {
      lFilters[data.id] = data.name;
    } else {
      delete lFilters[data.id];
    }
    let text = Object.values(lFilters).sort().join(', ');
    text = text.length > 30 ? text.slice(0, 27) + '...' : text;
    $('div.locations h4').text(text);
  });

  // Filter button click listener
  const filterButton = $('section.filters button');
  filterButton.on('click', function () {
    // Fetch places
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(aFilters),
        states: Object.keys(lFilters),
        cities: Object.keys(lFilters)
      }),
      success: function (response) {
        $('section.places').children().remove();
        updatePlaces(response);
      }
    });
  });
});

function updatePlaces (places) {
  // Updates Place section with data
  const placeSection = $('section.places');
  for (const place of places) {
    const newPlace = $('<article></article>');

    const titleBox = $('<div class="title_box"></div>')
      .append($('<h2></h2>').text(place.name))
      .append(
        $('<div class="price_by_night"></div>').text(`$${place.price_by_night}`)
      );

    const information = $('<div class="information"></div>')
      .append(
        $('<div class="max_guest"></div>').text(`${place.max_guest} Guest(s)`)
      )
      .append(
        $('<div class="number_rooms"></div>').text(
          `${place.number_rooms} Bedroom(s)`
        )
      )
      .append(
        $('<div class="number_bathrooms"></div>').text(
          `${place.number_bathrooms} Bathroom(s)`
        )
      );

    // const user = $('<div class="user"></div>').append(
    //   $(`<b>Owner:</b> place.user.first_name place.user.last_name`)
    // );

    const description = $('<div class="description"></div>').html(
      place.description
    );

    newPlace.append(titleBox, information, description);
    placeSection.append(newPlace);
  }
}
