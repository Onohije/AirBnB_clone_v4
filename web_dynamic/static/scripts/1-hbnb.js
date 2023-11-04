$(document).ready(function () {
  const aFilters = {}; // Amenities Filters

  $('li input').on('click', function () {
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
});
