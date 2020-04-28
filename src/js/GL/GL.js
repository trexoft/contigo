var GL = {};

GL.config = {
  mapboxglAccessToken : 'pk.eyJ1IjoiYWxpa2lsaWNoYXJpdGEiLCJhIjoiY2prcGpwajY4MnpqMDNxbXpmcnlrbWdneCJ9.0NaE-BID7eX38MDSY40-Qg',
  mapboxStlyes:{
    streetsV11:'mapbox://styles/mapbox/streets-v11'
  },
  darkMode:false,
  mapStyle:'mapbox://styles/mapbox/streets-v11',
  zoom:0,
  center:[0,0],
  pitch:0,
  rotate:0,
  colors:['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b']

};



GL.lang = lang;
GL.devicePixelRatio = JSON.parse(JSON.stringify(window.devicePixelRatio));
GL.dpi = GL.devicePixelRatio*96;

if(localStorage.getItem("hippoDarkModeActive")!==null){
  var status = localStorage.getItem("hippoDarkModeActive");
  if(status=="1"){
    GL.config.darkMode = true;
    GL.config.mapStyle = 'mapbox://styles/mapbox/dark-v10';
  }else{
    GL.config.darkMode = false;
    GL.config.mapStyle = 'mapbox://styles/mapbox/streets-v11';
  }
  
  
}

if(localStorage.getItem("currentBaseap")!==null){
  var currentBaseap = localStorage.getItem("currentBaseap");
  GL.config.mapStyle = 'mapbox://styles/mapbox/'+currentBaseap;
}

if(localStorage.getItem("maphash")!==null){
  var hashinfo = localStorage.getItem("maphash").split('/');
  GL.config.zoom = hashinfo[0];
  GL.config.center[1] = hashinfo[1];
  GL.config.center[0] = hashinfo[2];
  if(hashinfo.length>3){
    GL.config.rotate = hashinfo[3];
    GL.config.pitch = hashinfo[4];
  }
}

mapboxgl.accessToken = GL.config.mapboxglAccessToken;
GL.map = new mapboxgl.Map({
  container: 'map',
  hash:true,
  style: GL.config.mapStyle,
  antialias: true,
  pitchWithRotate:true,
  clickTolerance:5,
  preserveDrawingBuffer:true,
  zoom:GL.config.zoom,
  center:GL.config.center,
  pitch:GL.config.pitch,
  rotate:GL.config.rotate
});

GL.map.on('moveend',function(res){
  var hash = window.location.hash.substr(1);
  localStorage.setItem("maphash",hash);
  GL.step.add({type:'map',url:hash});
});

GL.geolocation = new mapboxgl.GeolocateControl({
  positionOptions: {
      enableHighAccuracy: true,
      timeout:6000,

  },
  trackUserLocation: true
});
GL.geolocation.onAdd(function(e){
});
GL.map.addControl(GL.geolocation);

GL.geocoder = new MapboxGeocoder({
  accessToken: GL.config.mapboxglAccessToken,
  mapboxgl: mapboxgl,
  language:'tr',
  marker: {
    color: '#4caf50'
  },
  placeholder:'Ara...'
});

GL.titresim = function(sure){
  var titresimSuresi = parseInt(sure,10) || 50;
  navigator.vibrate([titresimSuresi]);
}

GL.openLocation = function(){
  GL.titresim(); 
  GL.geolocation.trigger();
}

GL.createVirtualCanvas = function(dpi){
  Object.defineProperty(window, 'devicePixelRatio', {
    get: function() {return dpi / 96}
  });

  var orjinalCanvas = GL.map.getCanvas();
  var width = orjinalCanvas.width/GL.devicePixelRatio;
  var height = orjinalCanvas.height/GL.devicePixelRatio;

  var hidden = document.createElement('div');
  hidden.id = 'printMap'
  hidden.style.visibility="hide";
  document.body.appendChild(hidden);
  var container = document.createElement('div');
  container.style.width = width+'px';
  container.style.height = height+'px';
  container.style.position = 'absolute';
  hidden.appendChild(container);

  var zoom = GL.map.getZoom();
  var center = GL.map.getCenter();
  var bearing = GL.map.getBearing();
  var pitch = GL.map.getPitch();
  var style = GL.map.getStyle();

  var renderMap = new mapboxgl.Map({
    container: container,
    center: center,
    zoom: zoom,
    style: style,
    bearing: bearing,
    pitch: pitch,
    interactive: false,
    preserveDrawingBuffer: true,
    fadeDuration: 0,
    attributionControl: false
  });
  return renderMap;
}

GL.downloadCanvas = function(canvas,name){
  canvas.once('idle', function() {
    canvas.getCanvas().toBlob(function(blob) {
        GL.backRealRatio();
        document.getElementById('printMap').remove();
        download(blob,name+'.png','image/png');
    });
  });
}

GL.backRealRatio=function(){
  Object.defineProperty(window, 'devicePixelRatio', {
    get: function() {return GL.dpi / 96}
  });
}

GL.printMap = function(dpi,fileName){
  dpi = dpi || 96;
  dpi = parseInt(dpi,10);
  fileName = fileName || 'GISLayer-'+Date.now()+'.png';
  var renderMap = GL.createVirtualCanvas(dpi);
  GL.downloadCanvas(renderMap,fileName);
}

GL.clipboardText = function (text) {
  function selectElementText(element) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }

  var element = document.createElement('DIV');
  element.textContent = text;
  document.body.appendChild(element);
  selectElementText(element);
  document.execCommand('copy');
  element.remove();
};

GL.uyari = function (text) {
  toast.$children[0].showMessage({type:'warning',text:text,time:"auto"});
};
GL.onay = function (text) {
  toast.$children[0].showMessage({type:'success',text:text,time:"auto"});
};
GL.hata = function (text) {
  toast.$children[0].showMessage({type:'alert',text:text,time:"auto"});
};
GL.bilgi = function (text) {
  toast.$children[0].showMessage({type:'info',text:text,time:"auto"});
};

GL.bildirim = function(type,text,callback){
  var obj = {
    type:'info',
    text:text
  };
  if(typeof callback!=="undefined"){
    obj["callback"]=callback;
  }
  var types = ["success","warning","danger","alert","info"];
  if(types.indexOf(type)!==-1){
    obj.type = type;
  }
  notification.$children[0].showNotification(obj);
}

// Drawings
GL.draw = {
  draw:null,
  layerId:'',
  callback:null,
  redraw:false,
  features:{},
  selectedFeatureId:'',
  init:function(){
    this.draw = new MapboxDraw({
      displayControlsDefault: false
    });;
    GL.map.addControl(this.draw );
    GL.map.on('draw.create', this.update);
    GL.map.on('draw.delete', this.update);
    GL.map.on('draw.update', this.update);
    GL.map.on('draw.selectionchange', this.update);
  },
  start:function(type,layerId,callback){
    debugger;
    this.layerId = layerId;
    var cizimTip = "";
    switch(type){
      case 'Point':{
        GL.draw.redraw=true;
        this.draw.changeMode("draw_point");
        cizimTip = "Nokta Atmaya";
        break;
      }
      case 'LineString':{
        GL.draw.redraw=false;
        this.draw.changeMode("draw_line_string");
        cizimTip = "Çizgi Çizmeye";
        break;
      }
      case 'Polygon':{
        GL.draw.redraw=false;
        this.draw.changeMode("draw_polygon");
        cizimTip = "Kapalı Alan Çizmeye";
        break;
      }
      case 'Point2':{
        GL.draw.redraw=false;
        this.draw.changeMode("draw_point");2
        cizimTip = "Nokta Atmaya";
        break;
      }
    }

    if(typeof callback!=="undefined"){
      GL.draw.callback=callback;
      GL.bilgi("Şimdi "+cizimTip+" başlayabilirsiniz");
    }
  },
  update:function(data){
    var antiFeatures = ["draw.render","draw.actionable","draw.modechange"];
    if(antiFeatures.indexOf(data.type)==-1){
      if(data.features.length>0){
        data.features.map(function(feature){
          var id = feature.id;
          if(data.type=="draw.create"){
            feature["layerId"] = GL.draw.layerId;
            if(typeof GL.draw.features[GL.draw.layerId]=="undefined"){
              GL.draw.features[GL.draw.layerId]={};
            }
            GL.draw.features[GL.draw.layerId][id]=feature;
            if(GL.draw.callback!==null){
              GL.draw.callback(GL.draw.features[GL.draw.layerId][data.features[0].id],GL.draw.layerId);
            }
          }
          if(GL.draw.redraw){
            GL.draw.start("Point",GL.draw.layerId)
          }
        });
      }
      if(data.type=="draw.selectionchange"){
        if(data.features.length>0){
          GL.draw.selectedFeatureId = data.features[0].id;
        }else{
          GL.draw.selectedFeatureId = '';
        }
      }    
    }
    if(data.type=="draw.update"){
      if(GL.draw.callback!==null){
        GL.draw.callback(data.features[0],GL.draw.layerId);
      }
    }
  },
  deleteSelected:function(){
    if(this.selectedFeatureId!==""){
      this.draw.delete(this.selectedFeatureId);
      delete this.features[GL.draw.layerId][featureID];
      GL.onay("Seçili geometri silindi");
    }else{
      GL.uyari("Seçili herangi bir geometri bulunmamaktadır");
    }
  },
  deleteById:function(featureID){
    if(featureID!==""){
      this.draw.delete(featureID);
      delete this.features[GL.draw.layerId][featureID];
      GL.onay("Belirtilen geometri silindi");
    }else{
      GL.uyari("Belirtilen geometri bulunmamaktadır");
    }
  },
  deleteAll:function(){
    this.draw.deleteAll();
    this.features = {};
  },
  getSelected:function(){
    return this.draw.getSelected();
  },
  getSelectedIdList:function(){
    return this.draw.getSelectedIds();
  },
  stop:function(){
    this.selectedFeatureId='';
    this.layerId='';
  }
};
GL.draw.init();

// Measurements
GL.distance=function(line,secim){
  var unit;
  if (secim=="Metre"){
    unit="meters"
  }else if(secim=="Inch"){
    unit="meters"
  }else if(secim=="Derece"){
    unit="degrees"
  }
  var length = turf.length(line, {units: unit});
  measurement.$children[0].showMeasurement({type:"uzunluk",result:length.toFixed(3),unit:secim,id:line.id,geometry:line});
}

GL.area=function(polygon){
  var area = turf.area(polygon);
  measurement.$children[0].showMeasurement({type:"alan",result:area.toFixed(3),id:polygon.id,geometry:polygon});
}

GL.collectPoint=function(point){
  var coord=point.geometry.coordinates;
  measurement.$children[0].showMeasurement({type:"nokta",result:coord,id:point.id,geometry:point});
}

GL.zoomFeature=function(feature){
  if(feature.geometry.type=="Point"){
    center={lng:feature.geometry.coordinates[0],lat:feature.geometry.coordinates[1]};
    GL.map.flyTo({
      center: [
      center.lng,
      center.lat
      ],
      essential: true,
      zoom: 19
    });
  }else if(feature.geometry.type=="LineString"){
    var line = turf.lineString(feature.geometry.coordinates);
    var bbox = turf.bbox(line);
    GL.map.fitBounds([[bbox[0],bbox[1]],[bbox[2],bbox[3]]]);
  }else if(feature.geometry.type=="Polygon"){
    var polygon = turf.polygon(feature.geometry.coordinates);
    var bbox = turf.bbox(polygon);
    GL.map.fitBounds([[bbox[0],bbox[1]],[bbox[2],bbox[3]]]);
  }
  //GL.map.setPaintProperty(
  //  feature.layerId, 
  //  'fill-color', 
  //  ['match', ['get', 'id'], feature.id, "red"]
  //);
}

GL.latLong2tile = function (coord, zoom) {
  var xtile = Math.floor((coord[0] + 180) / 360 * Math.pow(2, zoom));
  var ytile = Math.floor((1 - Math.log(Math.tan(coord[1] * Math.PI / 180) + 1 / Math.cos(coord[1] * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  return {
    x: xtile,
    y: ytile,
    z: zoom
  };
};

GL.tile2LatLong = function (x, y, z) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  var lng = x / Math.pow(2, z) * 360 - 180;
  var lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lng, lat];
};

GL.elevation = {
  zoom:15,
  tileIndex:[],
  tiles:{},
  geojson:{type:'FeatureCollection',features:[]},
  url:"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
  clear:function(){
    var that = this;
    this.zoom=15;
    this.tileIndex.map(function(tileName){
      that.tiles[tileName].features = [];
    });
    this.geojson = {type:'FeatureCollection',features:[]};
  },
  getTilePixel:function(tile,coord){
    var x1=tile.x;
    var y1=tile.y;
    var z=tile.z;
    var x2=x1+1;
    var y2=y1+1;
    var latlng1 = GL.tile2LatLong(x1,y1,z);
    var latlng2 = GL.tile2LatLong(x2,y2,z);
    var lngFark = Math.abs(latlng2[0]-latlng1[0]);
    var latFark = Math.abs(latlng2[1]-latlng1[1]);
    var ortLngFark = Math.abs(coord[0]-latlng1[0]);
    var ortLatFark = Math.abs(coord[1]-latlng1[1]);
    var x = (256*ortLngFark)/lngFark;
    var y = (256*ortLatFark)/latFark;
    return [x,y]
  },
  rgbToElevation: function (rgb) {
    return rgb[0] * 256 + rgb[1] + rgb[2] / 256 - 32768;
  },
  getElevation:function(coords,callback){
    var geojson1 = { "type": "FeatureCollection", "features": [ { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": coords } } ] };
    GL.elevation.getElevationFromGeoJSON(geojson1,function(geojson){
      callback(geojson);
      GL.elevation.clear();
    });
  },
  getElevationFromGeoJSON:function(pointsJSON,callback){
    GL.elevation.tileIndex=[];
    GL.elevation.tiles={};
    pointsJSON.features.map(function(feature,i){
      feature["id"]=i;
      feature.properties["elevation"] = -1;
      var tileinfo = GL.latLong2tile(feature.geometry.coordinates,GL.elevation.zoom);
      var tilename = "X"+tileinfo.x+'Y'+tileinfo.y+'Z'+tileinfo.z;
      if(GL.elevation.tileIndex.indexOf(tilename)==-1){
        GL.elevation.tileIndex.push(tilename);
        GL.elevation.tiles[tilename] = {
          status:false,
          x:tileinfo.x,
          y:tileinfo.y,
          z:tileinfo.z,
          features:[feature],
          canvas:false
        };
      }else{
        GL.elevation.tiles[tilename].features.push(feature);
      }
    });

    GL.elevation.geojson.features = pointsJSON.features;

    function roverTiles(i,dizi){
      if(i<dizi.length){
        var tilename = dizi[i];
        var tile = GL.elevation.tiles[tilename];
        if(tile.status){
          var canvas = tile.canvas;
          var ctx = canvas.getContext('2d');
          var features = tile.features;
          features.map(function(feature){
            var id = feature.id;
            var coord = feature.geometry.coordinates;
            var pixel = GL.elevation.getTilePixel(tile,coord);
            var rgb = ctx.getImageData(pixel[0], pixel[1], 1,1).data;
            var elevation = GL.elevation.rgbToElevation(rgb);
            elevation=turf.round(elevation,3);
            feature.properties.elevation=elevation;
            GL.elevation.geojson.features[id].properties.elevation=elevation;
          });
          i++;
          roverTiles(i,dizi);
        }else{
          i++;
          roverTiles(i,dizi);
        }
      }else{
        callback(GL.elevation.geojson);
        GL.elevation.clear();
      }
    }

    function getImage(i,dizi){
      if(i<dizi.length){
        var tilename = dizi[i];
        var tile = GL.elevation.tiles[tilename];
        if(tile.status){
          i++;
          getImage(i,dizi);
        }else{
          var url = GL.elevation.url;
          url = url.replace('{z}',tile.z); 
          url = url.replace('{x}',tile.x); 
          url = url.replace('{y}',tile.y);
          fetch(url)
          .then(function(response){
            return response.blob();
          })
          .then(
            function(images){
              outside = URL.createObjectURL(images)
              GL.elevation.tiles[tilename].canvas = document.createElement('canvas');
              GL.elevation.tiles[tilename].canvas.width=256;
              GL.elevation.tiles[tilename].canvas.height=256;
              var ctx = GL.elevation.tiles[tilename].canvas.getContext('2d');
              var imageObj = new Image();
              imageObj.onload = function() {
                ctx.drawImage(this, 0, 0);
                setTimeout(function(){
                  tile.status=true;
                  i++;
                  getImage(i,dizi);
                },50);
              };
              imageObj.src = outside;
            }).catch(function(error){
              i++;
              getImage(i,dizi);
            });
        }
      }else{
        roverTiles(0,dizi);
      }
    }
    getImage(0,GL.elevation.tileIndex);
  }
};

GL.loading = function(text){
  if(text==false){
    $("#loader").hide();
    $("#loadingText").html(GL.lang.general.loading);
  }else{
    var newText = text || GL.lang.general.loading;
    $("#loadingText").html(newText);
    $("#loader").show();
  }
}

// Load Files 

GL.EPSG = {
  default: 'EPSG:3857',
  current: 'EPSG:4326',
  file: 'EPSG:4326',
  result: {},
  search: function search(text, callback) {
    var url = 'https://epsg.io/?format=json&q=' + text;
    fetch(url).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.number_result > 0) {
        GL.EPSG.result = result.results[0];
        callback(result.results);
      } else {
        GL.EPSG.result = {};
        GL.uyari("hata");
      }
    });
  },
  registerProjection: function registerProjection(result) {
    var code = result['code'];
    var proj4def = result['proj4'];
    var newProjCode = 'EPSG:' + code;
    proj4.defs(newProjCode, proj4def); //ol.proj.proj4.register(proj4);

    ol.proj.proj4.register(proj4);
  }
};

// Create tile URL
GL.createTilesUrl=function(url){
  return  "https://tiles.rdnt.io/tiles/{z}/{x}/{y}?url=" + url;
}


GL.addGeojsonToLayer=function(geojson,layerid,color,info){
  GL.map.addSource(layerid, { 'type': 'geojson', 'data': geojson });

  var inf={id:layerid,name:info.name,type:info.type,layers:[layerid+"-point",layerid+"-line",layerid+"-polygon"],geojson:geojson}
  GL.layerbox.sources.push(inf);

  GL.map.addLayer({
      'id': layerid+'-point',
      'type': 'circle',
      'source': layerid,
          'paint': {
              'circle-radius': 4,
              'circle-color': color
          },
          'filter': ['==', '$type', 'Point']
  });
  GL.map.addLayer({
      'id': layerid+'-polygon',
      'type': 'fill',
      'source': layerid,
          'paint': {
              'fill-color': color,
              'fill-opacity': 0.7
          },
          'filter': ['==', '$type', 'Polygon']
  });
  GL.map.addLayer({
      'id': layerid+'-line',
      'type': 'line',
      'source': layerid,
          'paint': {
              'line-color': color,
              'line-width': 2
          },
          'filter': ['==', '$type', 'LineString']
  });

  setTimeout(function(){
    var features=GL.layerbox.getLayerFeature(layerid,layerid+'-point');
    var features2=GL.layerbox.getLayerFeature(layerid,layerid+'-line');
    var features3=GL.layerbox.getLayerFeature(layerid,layerid+'-polygon');

    var infLayer1={id:layerid+"-point",source:layerid,type:info.type,features:features,color:color};
    var infLayer2={id:layerid+"-line",source:layerid,type:info.type,features:features2,color:color};
    var infLayer3={id:layerid+"-polygon",source:layerid,type:info.type,features:features3,color:color};
    GL.layerbox.layers.push(infLayer1);
    GL.layerbox.layers.push(infLayer2);
    GL.layerbox.layers.push(infLayer3);

  },100)

  //GL.loading(false);
  //GL.bilgi("Başarıyla Eklendi");
}


GL.step = {
  i:0,
  now:0,
  steps:[],
  add:function(obj){
    this.i++;
    this.steps.push(obj);
  },
  back:function(){
    
    if(this.i>1){
      debugger;
    }else{
      if(this.i==1){
        GL.uyari("Geri Gidemezsiniz");
      }
    }
  }
}

GL.getDate=function(){
  var date = new Date(); //date
  var day=date.getDate(); //day
  if(day<10){day="0"+day;}
  var month=date.getMonth()+1; //month
  if(month<10){month="0"+month;}
  var year=date.getFullYear(); //year

  var hours=date.getHours(); //hours
  if(hours<10){hours="0"+hours;}
  var min=date.getMinutes(); //min
  if(min<10){min="0"+min;}
  var sec=date.getSeconds(); //sec
  if(sec<10){sec="0"+sec;}

  var fulldate=day+'.'+month+'.'+year+' '+hours+':'+min+':'+sec;
  return(fulldate)
  
}

GL.touch = {
  startX:0,
  startY:0,
  endX:0,
  endy:0,
  startTime:0,
  endTime:0,
  on:function(div,callback){
    var element = $(div);
    element.on({ 'touchstart' :function(event) {
      GL.touch.startX = event.touches[0].screenX;
      GL.touch.startY = event.touches[0].screenY;
      GL.touch.startTime = Date.now();
    }});
    element.on({ 'touchend':function(event) {
      GL.touch.endX = event.changedTouches[0].screenX;
      GL.touch.endy = event.changedTouches[0].screenY;
      GL.touch.endTime = Date.now();
      GL.touch.handle(event,callback);
    }});
  },
  handle:function(event,callback){
    if (GL.touch.endX < GL.touch.startX) {
      var fark = Math.abs(GL.touch.endX-GL.touch.startX);
      if(fark>50){
        callback(event,'left');
      }
    }

    if (GL.touch.endX > GL.touch.startX) {
      var fark = Math.abs(GL.touch.endX-GL.touch.startX);
      if(fark>50){
        callback(event,'right');
      }
    }
  },
  off:function(div){
    var element = $(div);
    GL.touch.startX=0;
    GL.touch.startY=0;
    GL.touch.endX=0;
    GL.touch.endy=0;
    GL.touch.startTime=0;
    GL.touch.endTime=0;
    element.off();
    element.off();
  }
}

GL.downloadFile=function(fileType,features,fileName){
  switch (fileType) {
    case "gpx":
      var reader = new ol.format.GPX({
        extractStyles: false
      });

      var kml = reader.writeFeatures(features, {});
      download(kml, fileName + ".gpx", "text/gpx");
    break;
    case "geojson":
      var reader = new ol.format.GeoJSON({
        extractStyles: false
      });

      var geojson = reader.writeFeatures(features, {});
      download(geojson, fileName + ".geojson", "text/plain");

    break;
    case "kml":
      var reader = new ol.format.KML({
        extractStyles: false
      });
      var kml = reader.writeFeatures(features, {});
      download(kml, fileName + ".kml", "text/xml");
    break;
    case "wkt":
      var reader = new ol.format.WKT();
      var wkt = reader.writeFeatures(features, {});
      download(wkt, fileName + ".wkt", "text/wkt");
    break;
    case "shp":
      var reader = new ol.format.GeoJSON();
      var geojson = reader.writeFeatures(features, {});
      geojson = JSON.parse(geojson);
      var options = {
          folder: 'gislayerdata',
          types: {
            point: fileName,
            polygon: fileName,
            line: fileName
          }
      };
      shpwrite.download(geojson, options);
    break;
    case "xls":
      var readerwkt = new ol.format.WKT();
      var excelJSON = [];

      features.map(function (feature) {
        var wkt = readerwkt.writeFeature(feature, {});
        var obj = {
          wkt: wkt
        };
        var props = feature.getProperties();
                  
        if (feature.getGeometry() !== null) {
          var geotype = feature.getGeometry().getType();
                  
          if (geotype == "Point") {
            if (typeof props["elevation"] !== "undefined") {
              var a = wkt.replace('POINT(', '');
              var b = a.replace(')', '');
              var c = b.split(' ');
              props["longitude"] = c[0];
              props["latitude"] = c[1];
              }
          }
                  
          for (var i in props) {
            if (i !== "geometry") {
              obj[i] = props[i] || "";
            }
          }
                  
          excelJSON.push(obj);
        }
      });
      GL.jsonToExcel(excelJSON, fileName);
    break;
  }
}

GL.removeLayerByID=function(layerID){
  if(GL.map.getSource(layerID)){
    GL.map.removeLayer(layerID+'-point');
    GL.map.removeLayer(layerID+'-polygon');
    GL.map.removeLayer(layerID+'-line');
    GL.map.removeSource(layerID)
    
    for (var j=0;j<GL.layerbox.layers.length;j++){
      if(GL.layerbox.layers[j].source==layerID){
        GL.layerbox.layers.splice(j,1);
        j--
      }
    }
    
    for (var i=0;i<GL.layerbox.sources.length;i++){
      if(GL.layerbox.sources[i].id==layerID){
        GL.layerbox.sources.splice(i,1);
      }
    }
    
    
  }else{
    return false
  }
}

GL.layerbox = {
  geoTypes:["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon"],
  fileTypes:[
    {id:'gpx',extention:'gpx',name :'GPX', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/gpx.png'},
    {id:'wms',extention:false,name :'WMS Servisi', epsg:'EPSG:4326', type:'RASTER', img:'./src/img/graphics/wms.png'},
    {id:'xyz',extention:false,name :'XYZ Tile', epsg:false, type:'RASTER', img:'./src/img/graphics/xyz.png'},
    {id:'collection',extention:false,name :'Collection', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/collection.png'},
    {id:'dxf',extention:'dxf',name :'DXF', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/dxf.png'},
    {id:'geojson',extention:'geojson',name :'Geojson File', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/geojson.png'},
    {id:'kml',extention:'kml',name :'KML File', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/kml.png'},
    {id:'kmz',extention:'kmz',name :'KMZ File', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/kmz.png'},
    {id:'linestring',extention:false,name :'LineString', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/linestring.png'},
    {id:'point',extention:false,name :'Point', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/point.png'},
    {id:'polygon',extention:false,name :'Polygon', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/polygon.png'},
    {id:'mbtile',extention:false,name :'MB Tile', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/mbtile.png'},
    {id:'wfs',extention:false,name :'WFS', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/wfs.png'},
    {id:'wkt',extention:false,name :'WKT', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/wkt.png'},
    {id:'wmts',extention:false,name :'WMTS', epsg:false, type:'RASTER', img:'./src/img/graphics/wmts.png'},
    {id:'osm',extention:false,name :'Open Street Map', epsg:false, type:'RASTER', img:'./src/img/graphics/osm.png'},
    {id:'ncn',extention:'ncn',name :'NCN File', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/ncn.png'},
    {id:'xls',extention:'xls',name :'XLS File', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/xls.png'},
    {id:'shp',extention:false,name :'Shape File', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/shp.png'},
    {id:'heatmap',extention:false,name :'HeatMap', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/heatmap.png'},
    {id:'mongodb',extention:false,name :'MongoDB', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/mongodb.png'},
    {id:'mysql',extention:false,name :'MySQL', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/mysql.png'},
    {id:'oracle',extention:false,name :'Oracle', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/oracle.png'},
    {id:'postgres',extention:false,name :'Postgre SQL', epsg:'EPSG:4326', type:'VECTOR', img:'./src/img/graphics/postgresql.png'},
    {id:'satellite',extention:false,name :'Satellite', epsg:false, type:'RASTER', img:'./src/img/graphics/satellite.png'},
  ],
  sources:[
    /*
    {
      id:'nokta',
      name:'Kapı Noktaları',
      type:'gpx',
      layers:['nokta1','nokta2'],
      geojson:''
    },
    */
  ],
  layers:[
    /*
    {
      id:'nokta-point',
      source:'nokta',
      type:'postgres',
      features:['geojson burda olabilir'],
      color:"#FF0000"
    }
    */
  ],
  getExtention : function(){
    var arr = [];
    this.fileTypes.map(function(type){
      if(type.extention!==false){
        arr.push(type.extention);
      }
    });
    return arr;
  },
  isAcceptExtention:function(extentionType){
    var status = false;
    var allExtentions = this.getExtention();
    for(var i=0;i<allExtentions.length;i++){
      var ext = allExtentions[i];
      if(extentionType==ext){
        status=true;
        break;
      }
    }
    return status;
  },
  getLayerById:function(layerId){
    var result = this.layers.find(function(layer){if(layer.id==layerId){return true;}});
    return result;
  },
  getSource:function(sourceId){
    var result = this.sources.find(function(source){if(source.id==sourceId){return true;}});
    return result;
  },
  getFeaturesByLayerId:function(layerId){
    var result = this.layers.find(function(layer){if(layer.id==layerId){return true;}});
    return result.features;
  },
  getNewColor:function(){
    var sourceLength = this.sources.length;
    var color = GL.config.colors[sourceLength%19];
    return color;
  },
  getLayerFeature:function(id,layerid){
    //var features = GL.map.queryRenderedFeatures({ layers: [id] });
    var features = GL.map.querySourceFeatures(id, {
      sourceLayer: layerid
    });
    return features
  }
};

GL.changeLayerColor=function(source,color){
  console.log(source);
  GL.map.setPaintProperty(source.layers[0], 'circle-color', color); //point
  GL.map.setPaintProperty(source.layers[1], 'line-color', color);   //line
  GL.map.setPaintProperty(source.layers[2], 'fill-color', color);   // Polygon

  // point
  var c1=GL.layerbox.getLayerById(source.layers[0]);
  c1.color=color;
  // line
  var c2=GL.layerbox.getLayerById(source.layers[1]);
  c2.color=color;
  //polygon
  var c3=GL.layerbox.getLayerById(source.layers[2]);
  c3.color=color;

  GL.bilgi(source.name+ " katmanının rengi Başarı ile değiştirildi");
}


GL.ZoomLayer=function(bbox){
  GL.map.fitBounds([[bbox[0],bbox[1]],[bbox[2],bbox[3]]],{
    padding: 25,
  });
}

GL.mergeGeojsons=function(data){
  var geojson={type:'FeatureCollection','features':[]};
  if (data.length>1){
    for(var i=0;i<data.length;i++){
      data[i].features.map(function(point){
        geojson.features.push(point);
      });
    };
  };
  return geojson
}

GL.excel = {
  fileName: "",
  file: {},
  sheets: []
};

GL.jsonToExcel = function (json, fileName, fn) {
  var excelExport = XLSX.utils.json_to_sheet(json);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, excelExport, "gislayer sayfa 1");
  XLSX.writeFile(wb, fileName + '.xlsx');
};

GL.getUserLocation=function(callback){
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = turf.round(position.coords.latitude,5);
      var lon = turf.round(position.coords.longitude,5);
      var acc = parseInt(position.coords.accuracy,10);
      var currentPos = position;
      callback(currentPos)
    }, function error(err) {
      callback(console.log('ERROR(' + err.code + '): ' + err.message));
    });
} else {
    GL.uyari("Konum bilgisine ulaşılamadı");
}
}

GL.savelocalstorage=function(storagename,data){
  var data=JSON.stringify(data)
  window.localStorage.setItem(storagename, data);
}

GL.renkAl = function(callback){
  var inputColor = document.createElement('input');
  inputColor.type="color"
  inputColor.click();
  inputColor.addEventListener('change',function(e){
    callback(e.target.value);
  });
}


GL.datatable = {
  getFields:function(souceId){
    var source = GL.layerbox.getSource(souceId);
    if(source.fields==undefined){
      var props = [];
      var geojson = source.geojson.features[0];
      var properties = geojson.properties;
      for(var i in properties){
        var propName = i;
        var type = typeof properties[i];
        switch(type){
          case 'number':{
            var deger = properties[i];
            var tam = parseInt(deger);
            if(deger>tam){
              type='double';
            }else{
              type='integer';
            }
            break;
          }
        }
        props.push({name:i,type:type});
      }
      return props;
    }else{
      return source.fields;
    }
  },
  readyColumns:function(fields){
    var columns = [];
    fields.map(function(a){
      var name = a.name;
      var type = a.type;
      switch(type){
        case 'string':{
          columns.push({title:name, field:name, editor:"input"});
          break;
        }
        case 'boolean':{
          columns.push({title:name, field:name, hozAlign:"center", formatter:"tickCross", sorter:"boolean", editor:true});
          break;
        }
        case 'integer':{
          columns.push({title:name, field:name, editor:"input"});
          break;
        }
        case 'double':{
          columns.push({title:name, field:name, editor:"input"});
          break;
        }
        case 'date':{
          columns.push({title:name, field:name, editor:"input", sorter:"date"});
          break;
        }
      }
    });
    return columns;
  },
  getData:function(geojson){
    var data = [];
    geojson.features.map(function(d){
      data.push(d.properties);
    });
    return data;
  }
};


GL.createVectorLayer=function(data){
  var source={
      'type': 'FeatureCollection',
      'features': []
  }

  var layerid=Date.now().toString();
  console.log(data);
  GL.map.addSource(layerid, {'type': 'geojson', 'data':source});

  var inf={id:layerid,fields:data.fields,name:data.name,type:data.type.selected,layers:[layerid+"-point",layerid+"-line",layerid+"-polygon"],geojson:source};
  GL.layerbox.sources.push(inf);

  //visibility
  if(data.paint.circle.visibility==true){
    var pointvisibility="visible"
  }else{
    var pointvisibility="none"
  }

  if(data.paint.fill.visibility==true){
    var polygonvisibility="visible"
  }else{
    var polygonvisibility="none"
  }

  if(data.paint.line.visibility==true){
    var linevisibility="visible"
  }else{
    var linevisibility="none"
  }

  if(data.paint.status==false){
    if(data.type.selected=="collection"){
      GL.map.addLayer({
        'id': layerid+'-point',
        'type': 'circle',
        'source': layerid,
            'layout': {
              // make layer visible by default
              'visibility': pointvisibility
            },
            'paint': {
                'circle-radius': Number(data.paint.circle.radius),
                'circle-color': data.paint.circle.color,
                'circle-opacity':data.paint.circle.opacity,
                'circle-stroke-color':data.paint.circle.outlineColor,
                'circle-stroke-opacity':data.paint.circle.outlineOpacity,
                'circle-stroke-width':Number(data.paint.circle.outlineWidth)
            },
            'filter': ['==', '$type', 'Point']
      });
      GL.map.addLayer({
          'id': layerid+'-polygon',
          'type': 'fill',
          'source': layerid,
          'layout': {
            // make layer visible by default
            'visibility': polygonvisibility
          },
              'paint': {
                  'fill-color': data.paint.fill.color,
                  'fill-opacity': Number(data.paint.fill.opacity),
                  'fill-outline-color': data.paint.fill.outlineColor
              },
              'filter': ['==', '$type', 'Polygon']
      });
      GL.map.addLayer({
          'id': layerid+'-line',
          'type': 'line',
          'source': layerid,
          'layout': {
            'visibility': linevisibility
          },
              'paint': {
                  'line-color': data.paint.line.color,
                  'line-width': Number(data.paint.line.width),
                  //'line-dasharray': data.paint.line.dasharray,
                  'line-opacity': Number(data.paint.line.opacity)
              },
              'filter': ['==', '$type', 'LineString']
      });
    
      setTimeout(function(){
        var features=GL.layerbox.getLayerFeature(layerid,layerid+'-point');
        var features2=GL.layerbox.getLayerFeature(layerid,layerid+'-line');
        var features3=GL.layerbox.getLayerFeature(layerid,layerid+'-polygon');
    
        var infLayer1={id:layerid+"-point",source:layerid,type:inf.type,features:features,color:data.paint.circle.color};
        var infLayer2={id:layerid+"-line",source:layerid,type:inf.type,features:features2,color:data.paint.line.color};
        var infLayer3={id:layerid+"-polygon",source:layerid,type:inf.type,features:features3,color:data.paint.fill.color};
        GL.layerbox.layers.push(infLayer1);
        GL.layerbox.layers.push(infLayer2);
        GL.layerbox.layers.push(infLayer3);
    
      },100)
    }else if(data.type.selected=="point"){
      GL.map.addLayer({
        'id': layerid+'-point',
        'type': 'circle',
        'source': layerid,
            'layout': {
              // make layer visible by default
              'visibility': pointvisibility
            },
            'paint': {
                'circle-radius': Number(data.paint.circle.radius),
                'circle-color': data.paint.circle.color,
                'circle-opacity':data.paint.circle.opacity,
                'circle-stroke-color':data.paint.circle.outlineColor,
                'circle-stroke-opacity':data.paint.circle.outlineOpacity,
                'circle-stroke-width':Number(data.paint.circle.outlineWidth)
            },
            'filter': ['==', '$type', 'Point']
      });
      setTimeout(function(){
        var features=GL.layerbox.getLayerFeature(layerid,layerid+'-point');
    
        var infLayer1={id:layerid+"-point",source:layerid,type:inf.type,features:features,color:data.paint.circle.color};
        GL.layerbox.layers.push(infLayer1);
    
      },100)
    }else if(data.type.selected=="linestring"){
      GL.map.addLayer({
        'id': layerid+'-line',
        'type': 'line',
        'source': layerid,
        'layout': {
          // make layer visible by default
          'visibility': linevisibility
        },
            'paint': {
                'line-color': data.paint.line.color,
                'line-width': Number(data.paint.line.width),
                //'line-dasharray': data.paint.line.dasharray,
                'line-opacity': Number(data.paint.line.opacity)
            },
            'filter': ['==', '$type', 'LineString']
      });

      setTimeout(function(){
        var features2=GL.layerbox.getLayerFeature(layerid,layerid+'-line');
    
        var infLayer2={id:layerid+"-line",source:layerid,type:inf.type,features:features2,color:data.paint.line.color};
        
        GL.layerbox.layers.push(infLayer2);
      },100)
    }else if(data.type.selected=="polygon"){

      GL.map.addLayer({
        'id': layerid+'-polygon',
        'type': 'fill',
        'source': layerid,
        'layout': {
          // make layer visible by default
          'visibility': polygonvisibility
        },
            'paint': {
                'fill-color': data.paint.fill.color,
                'fill-opacity': Number(data.paint.fill.opacity),
                'fill-outline-color': data.paint.fill.outlineColor
            },
            'filter': ['==', '$type', 'Polygon']
      });
      setTimeout(function(){
        var features3=GL.layerbox.getLayerFeature(layerid,layerid+'-polygon');
    
        var infLayer3={id:layerid+"-polygon",source:layerid,type:inf.type,features:features3,color:data.paint.fill.color};
        GL.layerbox.layers.push(infLayer3);
    
      },100)
    }
    
  }else if(data.paint.status==true){
    if(data.type.selected=="collection"){
      GL.map.addLayer({
        'id': layerid+'-point',
        'type': 'circle',
        'source': layerid,
        'layout': {
          'visibility': pointvisibility
        },
            'paint': {
                'circle-radius': Number(data.paint.circle.radius),
                'circle-color': data.paint.color,
                'circle-opacity':Number(data.paint.circle.opacity),
                'circle-stroke-color':data.paint.circle.outlineColor,
                'circle-stroke-opacity':data.paint.circle.outlineOpacity,
                'circle-stroke-width':Number(data.paint.circle.outlineWidth)
            },
            'filter': ['==', '$type', 'Point']
      });
      GL.map.addLayer({
          'id': layerid+'-polygon',
          'type': 'fill',
          'source': layerid,
          'layout': {
            'visibility': polygonvisibility
          },
              'paint': {
                  'fill-color': data.paint.color,
                  'fill-opacity': Number(data.paint.fill.opacity),
                  'fill-outline-color': data.paint.fill.outlineColor
              },
              'filter': ['==', '$type', 'Polygon']
      });
      GL.map.addLayer({
          'id': layerid+'-line',
          'type': 'line',
          'source': layerid,
          'layout': {
            'visibility': linevisibility
          },
              'paint': {
                  'line-color': data.paint.color,
                  'line-width': Number(data.paint.line.width),
                  //'line-dasharray': data.paint.line.dasharray,
                  'line-opacity': Number(data.paint.line.opacity)
              },
              'filter': ['==', '$type', 'LineString']
      });
    
      setTimeout(function(){
        var features=GL.layerbox.getLayerFeature(layerid,layerid+'-point');
        var features2=GL.layerbox.getLayerFeature(layerid,layerid+'-line');
        var features3=GL.layerbox.getLayerFeature(layerid,layerid+'-polygon');
    
        var infLayer1={id:layerid+"-point",source:layerid,type:inf.type,features:features,color:data.paint.color};
        var infLayer2={id:layerid+"-line",source:layerid,type:inf.type,features:features2,color:data.paint.color};
        var infLayer3={id:layerid+"-polygon",source:layerid,type:inf.type,features:features3,color:data.paint.color};
        GL.layerbox.layers.push(infLayer1);
        GL.layerbox.layers.push(infLayer2);
        GL.layerbox.layers.push(infLayer3);
    
      },100)
    }else if(data.type.selected=="point"){
      GL.map.addLayer({
        'id': layerid+'-point',
        'type': 'circle',
        'source': layerid,
        'layout': {
          'visibility': pointvisibility
        },
            'paint': {
                'circle-radius': Number(data.paint.circle.radius),
                'circle-color': data.paint.color,
                'circle-opacity':Number(data.paint.circle.opacity),
                'circle-stroke-color':data.paint.circle.outlineColor,
                'circle-stroke-opacity':Number(data.paint.circle.outlineOpacity),
                'circle-stroke-width':Number(data.paint.circle.outlineWidth)
            },
            'filter': ['==', '$type', 'Point']
      });
      setTimeout(function(){
        var features=GL.layerbox.getLayerFeature(layerid,layerid+'-point');
    
        var infLayer1={id:layerid+"-point",source:layerid,type:inf.type,features:features,color:data.paint.color};
        GL.layerbox.layers.push(infLayer1);
    
      },100)
    }else if(data.type.selected=="linestring"){
      GL.map.addLayer({
        'id': layerid+'-line',
        'type': 'line',
        'source': layerid,
        'layout': {
          'visibility': linevisibility
        },
            'paint': {
                'line-color': Number(data.paint.color),
                'line-width': Number(data.paint.line.width),
                //'line-dasharray': data.paint.line.dasharray,
                'line-opacity': Number(data.paint.line.opacity)
            },
            'filter': ['==', '$type', 'LineString']
      });
      setTimeout(function(){
        var features2=GL.layerbox.getLayerFeature(layerid,layerid+'-line');
        debugger;
        var infLayer2={id:layerid+"-line",source:layerid,type:inf.type,features:features2,color:data.paint.color};
        GL.layerbox.layers.push(infLayer2);
      },100)
    }else if(data.type.selected=="polygon"){
      GL.map.addLayer({
        'id': layerid+'-polygon',
        'type': 'fill',
        'source': layerid,
        'layout': {
          'visibility': polygonvisibility
        },
            'paint': {
                'fill-color': data.paint.color,
                'fill-opacity': Number(data.paint.fill.opacity),
                'fill-outline-color': data.paint.fill.outlineColor
            },
            'filter': ['==', '$type', 'Polygon']
      });

      setTimeout(function(){
        var features3=GL.layerbox.getLayerFeature(layerid,layerid+'-polygon');

        var infLayer3={id:layerid+"-polygon",source:layerid,type:inf.type,features:features3,color:data.paint.color};
        GL.layerbox.layers.push(infLayer3);
    
      },100)
    }
    
  }

}