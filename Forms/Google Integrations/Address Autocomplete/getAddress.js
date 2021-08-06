function initAutocomplete() {
  index = $(this).closest("div.form-q").index() + 1;
  address1Field = document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .address input");
  postalField = document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .postal input");
  autocomplete = new google.maps.places.Autocomplete(address1Field, {
    componentRestrictions: { country: ["us", "ca"] },
    fields: ["address_components", "geometry"],
    types: ["address"],
  });
  address1Field.focus();
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  const place = autocomplete.getPlace();
  let address1 = "";
  let postcode = "";

  for (const component of place.address_components) {
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .city input").value = component.long_name;
        break;

      case "administrative_area_level_1": {
        document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .state input").value = component.short_name;
        break;
      }

    }
  }
  address1Field.value = address1;
  postalField.value = postcode;
}
