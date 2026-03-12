var brewDisplay = $(".brewery-template");

// city look up function to create out api field values
const cityLookup = async (event) => {
  event.preventDefault();

  const searchCity = document.getElementById("searchText").value;

  if (searchCity) {
    document.location.replace(`/citySearch/${searchCity}`);
  } else {
    alert("Please enter a city to search.");
  }
};

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    cityLookup(event);
  }
});

document.querySelector("#searchButton").addEventListener("click", cityLookup);

let refid = "";
let brewname = "";
let address = "";
let city = "";
let State = "";
let zipcode = "";
let phone = "";
let website = "";
let latitude = "";
let longitude = "";
let remark = "";
let comments = "";

function saveBrewery() {
  var brewid = $(this).attr("data-index");
  //alert(brewid);

  var breurl = `https://api.openbrewerydb.org/v1/breweries?by_ids=${brewid}`;

  fetch(breurl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let refid = data[0].id;
      let brewname = data[0].name;
      let address = data[0].address_1;
      let city = data[0].city;
      let state = data[0].state;
      let zipcode = data[0].postal_code;
      let phone = data[0].phone;
      let website = data[0].website_url;
      let latitude = data[0].latitude;
      let longitude = data[0].longitude;
      let remark = data[0].brewery_type;
      let comment = "";

      // console.log(refid);
      // console.log(brewname);
      // console.log(address);
      // console.log(city);
      // console.log(state);
      // console.log(zipcode);
      // console.log(phone);
      // console.log(website);
      // console.log(latitude);
      // console.log(longitude);
      // console.log(remark);
      // console.log(comment);

      const currentDate = new Date().toDateString();

      if (latitude == null) {
        latitude = "";
      }
      if (longitude == null) {
        longitude = "";
      }

      if (phone == null) {
        phone = "";
      }
      if (website == null) {
        website = "";
      }

      if (refid && brewname) {
        const response = fetch("/api/breweries/addbrewery", {
          method: "POST",
          body: JSON.stringify({
            refid,
            brewname,
            address,
            city,
            state,
            zipcode,
            phone,
            website,
            latitude,
            longitude,
            remark,
            comment,
            currentDate,
          }),
          headers: { "Content-Type": "application/json" },
        });
        return response;
      }
    })
    .then(function (response) {
      if (response.ok) {
        alert("Brewery saved, click mypubs to view");
      } else {
        alert("Failed to save");
      }
    });
}

var map;

// function to pass brewery lat long data to leaflet map
function mapBrewery() {
  var brewid = $(this).attr("data-index");
  //alert(brewid);

  var breurl = `https://api.openbrewerydb.org/v1/breweries?by_ids=${brewid}`;

  fetch(breurl)
    .then(function (response) {
      return response.json();
    })
    // creaing variables to pass into our map function
    .then(function (data) {
      let brewname = data[0].name;
      let latitude = data[0].latitude;
      let longitude = data[0].longitude;
      // alert(brewname);
      // check if map is already initialized so we dont error with container in use
      if (map) {
        // clear existing layers to create new map click search
        map.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });
        // initial view on map with a zoom index of 13 and our api values passed
        map.setView([latitude, longitude], 13);
      } else {
        map = L.map("map").setView([latitude, longitude], 13);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
      }
      //marker to let the user know where the brewery is based on exact cords passed from json data
      var marker = L.marker([latitude, longitude]).addTo(map);

      marker.bindPopup(brewname).openPopup();

      // the following is for a cusotm prompt when the user clicks the map
      var popup = L.popup();

      function onMapClick(e) {
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
      }

      map.on("click", onMapClick);
      map.on("click", onMapClick);
    })
    .catch(function (error) {
      console.error("Error fetching brewery data:", error);
    });
}

brewDisplay.on("click", ".btn-save-brewery", saveBrewery);
brewDisplay.on("click", ".btn-map-brewery", mapBrewery);
