var map, marker, circle;

function buildMap(lat, lng, title) {
    var loc = { lat: lat, lng: lng };
    map = new google.maps.Map(document.getElementById("map"), {
        center: loc,
        zoom: 7
    });
    
    marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: title
    });

    circle = new google.maps.Circle({
        map: map,
        radius: 8046, // 5 Miles
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
    });
    circle.bindTo('center', marker, 'position');
}

function findTarget(target) {
    // Build lookup url.
    var url = "/lookup/";
    if (typeof target != 'undefined' && target != "") {
        url += "?target=" + target;
    };

    // Make request to lookup endpoint.
    $.get(url, function (data) {
        if (data["status"] === "fail") {
            // Show error messages.
            $(".message").html("<span>ERROR:</span> " + data["message"]).show();
        } else {
            $(".message").hide();
            // Update table
            $("td.value").html("<span>---</span>"); // Clear table
            for (var key in data) {
                $("." + key + " td.value").html(data[key]);
            };
            // Build map
            if (data.hasOwnProperty("lat") && data.hasOwnProperty("lon")) {
                buildMap(data["lat"], data["lon"], data["query"]);
            } else {
                // Missing required fields. Clear map div.
                $("#map").html("");
            }
        };
    });
}

$(".search").on("click", function () {
    findTarget($(".ipform input").val());
});

$('.ipform input').keypress(function (e) {
    if (e.which == 13) {
        findTarget($(".ipform input").val());
    }
});