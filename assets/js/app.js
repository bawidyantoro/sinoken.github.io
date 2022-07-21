var map, featureList, distrikSearch = [], pendidikanSearch = [], kesehatanSearch = [];

/* Fungsi resize control layer */
$(window).resize(function () {
  sizeLayerControl();
});

/* Fungsi Highlight */
$(document).on("click", ".feature-row", function (e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
});

if (!("ontouchstart" in window)) {
  $(document).on("mouseover", ".feature-row", function (e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

/* Fungsi tombol untuk about-btn */
$("#about-btn").click(function () {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/* Fungsi tombol untuk full-extent-btn */
$("#full-extent-btn").click(function () {
  map.fitBounds(distrik.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/* Fungsi tombol untuk legend-btn */
$("#legend-btn").click(function () {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/* Fungsi tombol untuk nav-btn */
$("#nav-btn").click(function () {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

/* Fungsi size control layer */
function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

/* Fungsi clear highlight */
function clearHighlight() {
  highlight.clearLayers();
}

/* Basemap */
var basemap1 = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  attribution: 'Google Streets'
});
var basemap2 = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  attribution: 'Google Satellite'
});
var basemap3 = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  attribution: 'Google Terrain'
});
var basemap4 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: 'Open Street Map'
});

/* Overlay Layers Highlight */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

/* Layer Kepadatan Penduduk */
var distrik = L.geoJson(null, {
  style: function (feature) {                             //Fungsi Style Graduated
    if (feature.properties.kepadatan_penduduk <= 10) {		//Kelas kepadatan penduduk kurang dari sama dengan 10
      return {
        opacity: 1,				   //Transparansi garis tepi
        color: 'white',			 //Warna garis tepi
        weight: 2,				   //Tebal garis tepi
        fillOpacity: 0.7,		 //Transparansi fill polygon
        dashArray: '3',      //Garis putus-putus
        fillColor: '#ffeda0' //Warna fill polygon
      }
    }
    if (feature.properties.kepadatan_penduduk > 10 && feature.properties.kepadatan_penduduk <= 20) { 	//Kelas kepadatan penduduk antara 10-20
      return {
        opacity: 1,				   //Transparansi garis tepi
        color: 'white',			 //Warna garis tepi
        weight: 2,				   //Tebal garis tepi
        fillOpacity: 0.7,		 //Transparansi fill polygon
        dashArray: '3',      //Garis putus-putus
        fillColor: '#feb24c' //Warna fill polygon
      }
    }
    if (feature.properties.kepadatan_penduduk > 20) {			//Kelas kepadatan penduduk lebih dari 20
      return {
        opacity: 1,				   //Transparansi garis tepi
        color: 'white',			 //Warna garis tepi
        weight: 2,				   //Tebal garis tepi
        fillOpacity: 0.7,		 //Transparansi fill polygon
        dashArray: '3',      //Garis putus-putus
        fillColor: '#f03b20' //Warna fill polygon
      }
    }
  },
  onEachFeature: function (feature, layer) {
    distrikSearch.push({			                             //Search
      primaryname: layer.feature.properties.distrik,			 //Nama utama
      secondaryname: layer.feature.properties.kabupaten,	 //Nama kedua
      source: "Distrik",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
    layer.on({
      mouseover: function (e) {		                         //Highlight kursor mouse
        var layer = e.target;
        layer.setStyle({
          fillColor: "#00FFFF",		                         //Warna highlight
          fillOpacity: 0.7			                           //Transparansi highlight
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        distrik.resetStyle(e.target);		                   //Kembali ke warna awal ketika kursor keluar dari feature
      }
    });
    if (feature.properties) {				                       //Popup
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Nama Kabupaten</th><td>" + feature.properties.kabupaten + "</td></tr>" + "<tr><th>Nama Distrik</th><td>" + feature.properties.distrik + "</td></tr>" + "<tr><th>Luas Wilayah</th><td>" + feature.properties.luas + " Km<sup>2</sup></td></tr>" + "<tr><th>Jumlah Penduduk</th><td>" + feature.properties.jumlah_penduduk + " Jiwa</td></tr>" + "<tr><th>Kepadatan Penduduk</th><td>" + feature.properties.kepadatan_penduduk + " Jiwa/Km<sup>2</sup></td></tr>" + "<tr><th>Kelas Kepadatan Penduduk</th><td>" + feature.properties.keterangan + "</td></tr>" + "</table>"; //Memanggil data atribut untuk ditampilkan pada popup modal
      layer.on({
        click: function (e) {
          $("#feature-title").html("Distrik " + feature.properties.distrik);		//Judul pada popup modal
          $("#feature-info").html(content);										                  //Isi pada popup modal
          $("#featureModal").modal("show");										                  //featureModal ditampilkan
        }
      });
    }
  }
});
$.getJSON("data/geojson/kabupaten_lanny_jaya.geojson", function (data) {		    //Lokasi data geojson
  distrik.addData(data);
});

/* Layer Sungai */
var sungaiColors = { "Sungai": "lightblue" };
var sungai = L.geoJson(null, {
  style: function (feature) {	                                                  //Fungsi Style
    return {
      fillColor: sungaiColors[feature.properties.keterangan],
      fillOpacity: 0.7,
      color: "blue",
      weight: 0.5,
      opacity: 1,
      smoothFactor: 0,
      clickable: false			                                                    //Klik non-aktif pada feature layer
    };
  }
});
$.getJSON("data/geojson/sungai.geojson", function (data) {
  sungai.addData(data);
});

/* Layer Jalan */
var jalanFungsi = { "Jalan Arteri": 3, "Jalan Lokal": 1 };
var jalan = L.geoJson(null, {
  style: function (feature) {	                                                  //Fungsi Style
    return {
      color: "red",
      weight: jalanFungsi[feature.properties.fungsi_jalan],
      opacity: 1,
      clickable: false			                                                    //Klik non-aktif pada feature layer
    };
  }
});
$.getJSON("data/geojson/jalan.geojson", function (data) {
  jalan.addData(data);
});

/* Marker cluster pendidikan layer point */
var pendidikanClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 15
});

/* Marker cluster kesehatan layer point */
var kesehatanClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 15
});

/* Layer Pendidikan */
var pendidikan = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {	        //Fungsi pointToLayer
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/marker/marker_pendidikan.png",		//Lokasi gambar untuk icon titik
        iconSize: [35, 35],							//Ukuran icon pada peta
        iconAnchor: [14, 28],						//Letak highlight pada icon
        popupAnchor: [0, -25]						//Letak popup pada icon
      }),
      title: feature.properties.distrik,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) { 	        //Fungsi Popup
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>NSPN</th><td>" + feature.properties.kode_nspn + "</td></tr>" + "<tr><th>Nama Sekolah</th><td>" + feature.properties.nama_sekolah + "</td></tr>" + "<tr><th>Kepala Sekolah</th><td>" + feature.properties.kepala_sekolah + "</td></tr>" + "<tr><th>Status Akreditasi</th><td>" + feature.properties.status_akreditasi + "</td></tr>" + "<tr><th>Tahun Akreditasi</th><td>" + feature.properties.tahun_akreditasi + "</td></tr>" + "<tr><th>Total Tenaga Pengajar</th><td>" + feature.properties.total_tenaga_pengajar + "</td></tr>" + "<tr><th>Jumlah Guru PNS</th><td>" + feature.properties.jumlah_guru_pns + "</td></tr>" + "<tr><th>Jumlah Guru Non PNS</th><td>" + feature.properties.jumlah_guru_non_pns + "</td></tr>" + "<tr><th>Total Staf</th><td>" + feature.properties.total_staf + "</td></tr>" + "<tr><th>Jumlah Peserta Didik</th><td>" + feature.properties.jumlah_peserta_didik + "</td></tr>" + "<tr><th>Foto</th><td><img src='" + feature.properties.foto + "' width=170 /></td></tr>" + "</table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Distrik " + feature.properties.distrik);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      pendidikanSearch.push({			                    //Search
        primaryname: layer.feature.properties.nama_sekolah,
        secondaryname: layer.feature.properties.distrik,
        source: "Pendidikan",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/geojson/pendidikan.geojson", function (data) {		//Lokasi data geojson
  pendidikan.addData(data);
  pendidikanClusters.addLayer(pendidikan);
});

/* Layer Kesehatan */
var kesehatan = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {	                //Fungsi pointToLayer
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/marker/marker_kesehatan.png",		//Lokasi gambar untuk icon titik
        iconSize: [35, 35],							//Ukuran icon pada peta
        iconAnchor: [14, 28],						//Letak highlight pada icon
        popupAnchor: [0, -25]						//Letak popup pada icon
      }),
      title: feature.properties.distrik,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) { 	                //Fungsi Popup
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Kode ID</th><td>" + feature.properties.kode_id + "</td></tr>" + "<tr><th>Nama Fasilitas Kesehatan</th><td>" + feature.properties.nama + "</td></tr>" + "<tr><th>Kriteria</th><td>" + feature.properties.kriteria + "</td></tr>" + "<tr><th>Alamat</th><td>" + feature.properties.alamat + "</td></tr>" + "<tr><th>Status Akreditasi</th><td>" + feature.properties.status_akreditasi + "</td></tr>" + "<tr><th>Status</th><td>" + feature.properties.status + "</td></tr>" + "<tr><th>Total Tenaga Kesehatan</th><td>" + feature.properties.total_tenaga_kesehatan + "</td></tr>" + "<tr><th>Total Staf</th><td>" + feature.properties.total_staf + "</td></tr>" + "<tr><th>Jumlah Bangunan</th><td>" + feature.properties.jumlah_bangunan + "</td></tr>" + "<tr><th>Kondisi Bangunan</th><td>" + feature.properties.kondisi_bangunan + "</td></tr>" + "<tr><th>Foto</th><td><img src='" + feature.properties.foto + "' width=170 /></td></tr>" + "</table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Distrik " + feature.properties.distrik);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      kesehatanSearch.push({			                            //Search
        primaryname: layer.feature.properties.nama,
        secondaryname: layer.feature.properties.distrik,
        source: "Kesehatan",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/geojson/kesehatan.geojson", function (data) {	//Lokasi data geojson
  kesehatan.addData(data);
  kesehatanClusters.addLayer(kesehatan);
});

/* Map Extent */
map = L.map("map", {
  zoom: 10,															      //Zoom peta
  center: [-3.97, 138.23],										//Titik tengah pada peta
  layers: [basemap4, distrik, highlight],			//Layer yang dimunculkan di awal kali ketika peta ditampilkan
  zoomControl: false,
  attributionControl: true
});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
  highlight.clearLayers();
});

/* Attribution control */
map.attributionControl.addAttribution('Designed by <a href="mailto:ranakaryaglobal@gmail.com" target="_blank">PT Rana Karya Global</a>');

/* zoom control */
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: true,
  strings: {
    title: "Lokasi saya",
    popup: "Anda berada dalam radius {distance} {unit} dari titik ini",
    outsideMapBoundsMsg: "Tampaknya Anda berada di luar batas-batas peta"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

/* Control Layers */
var baseLayers = {				//Basemap layer
  "Open Street Map": basemap4,
  "Google Terrain": basemap3,
  "Google Imagery": basemap2,
  "Google Street": basemap1
};

var groupedOverlays = {			//Layer grup
  "Fasilitas": {
    "Pendidikan": pendidikanClusters,
    "Kesehatan": kesehatanClusters
  },
  "Administrasi": {
    "Jalan": jalan,
    "Sungai": sungai,
    "Kepadatan Penduduk": distrik
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to kecamatan bounds */
  map.fitBounds(distrik.getBounds());

  var distrikBH = new Bloodhound({
    primaryname: "Distrik",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.primaryname);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: distrikSearch,
    limit: 10
  });

  var pendidikanBH = new Bloodhound({
    primaryname: "Pendidikan",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.primaryname);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: pendidikanSearch,
    limit: 15
  });

  var kesehatanBH = new Bloodhound({
    primaryname: "Kesehatan",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.primaryname);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: kesehatanSearch,
    limit: 15
  });

  distrikBH.initialize();
  pendidikanBH.initialize();
  kesehatanBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({			//Search Box Navbar
    minLength: 2,						      //Panjang minimal karakter pada search untuk memunculkan daftar pencarian
    highlight: true,					    //Highlight pada daftar pencarian aktif
    hint: false							      //Menampilkan petunjuk pencarian dan minimal karakter
  }, {
    primaryname: "Distrik",			  //Field yang digunakan sebagai dasar pencarian pada layer kecamatan
    displayKey: "primaryname",
    source: distrikBH.ttAdapter(),
    templates: {						      //Susunan kata yang dimunculkan pada daftar pencarian
      header: "<h4 class='typeahead-header'><img src='assets/img/marker/marker_place.png' width='24' height='24'>&nbsp;Distrik</h4>",
      suggestion: Handlebars.compile(["{{primaryname}}<br>&nbsp;<small>{{secondaryname}}</small>"].join(""))
    }
  }, {
    primaryname: "Pendidikan",	  //Field yang digunakan sebagai dasar pencarian pada layer pendidikan
    displayKey: "primaryname",
    source: pendidikanBH.ttAdapter(),
    templates: {						      //Susunan kata yang dimunculkan pada daftar pencarian
      header: "<h4 class='typeahead-header'><img src='assets/img/marker/marker_pendidikan.png' width='24' height='24'>&nbsp;Pendidikan</h4>"
    }
  }, {
    primaryname: "Kesehatan",			//Field yang digunakan sebagai dasar pencarian pada layer kesehatan
    displayKey: "primaryname",
    source: kesehatanBH.ttAdapter(),
    templates: {						      //Susunan kata yang dimunculkan pada daftar pencarian
      header: "<h4 class='typeahead-header'><img src='assets/img/marker/marker_kesehatan.png' width='24' height='24'>&nbsp;Kesehatan</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Distrik") {
      map.fitBounds(datum.bounds);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Pendidikan") {
      map.setView([datum.lat, datum.lng], 15);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Kesehatan") {
      map.setView([datum.lat, datum.lng], 15);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

/* Leaflet patch to make layer control scrollable on touch browsers */
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
    .disableClickPropagation(container)
    .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

/* Print to file */
L.easyPrint({
  title: 'Print',
  position: 'bottomright',
}).addTo(map);

/* ScaleBar */
L.control.betterscale({
  metric: true,
  imperial: false
}).addTo(map);

/* Watermark */
L.Control.Watermark = L.Control.extend({
  onAdd: function (map) {
    var img = L.DomUtil.create('img');
    img.src = 'assets/img/logo/kabupaten_lanny_jaya.png';
    img.style.width = '70px';
    return img;
  },
  onRemove: function (map) {
    // Nothing to do here
  }
});
L.control.watermark = function (opts) {
  return new L.Control.Watermark(opts);
}
L.control.watermark({ position: 'bottomleft' }).addTo(map);