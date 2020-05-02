Vue.component('fileupload', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              obj:"",
              style:{
                light:{backgroundColor:'#efefef'},
                dark:{backgroundColor:'#333333'},
                active:{opacity:1,marginBottom:'15px'},
                passive:{opacity:0.5,marginBottom:'15px'},
                classActive:'btn btn-success square btn-block',
                classPassive:'btn btn-warning square btn-block',
              },
              filetypes:[
                {
                  id:'geojson',
                  tite:'GeoJSON',
                  img:'./src/img/graphics/geojsonBig.png'
                },
                {
                  id:'kml',
                  tite:'KML',
                  img:'./src/img/graphics/kmlkmzBig.png'
                },
                {
                  id:'mbtiles',
                  tite:'MBTiles',
                  img:'./src/img/graphics/mbtileBig.png'
                },
                {
                  id:'gpx',
                  tite:'GPX',
                  img:'./src/img/graphics/gpxBig.png'
                },
                {
                  id:'shp',
                  tite:'Shapefile',
                  img:'./src/img/graphics/shpBig.png'
                },
                {
                  id:'excel',
                  tite:'Excel',
                  img:'./src/img/graphics/xlsBig.png'
                },
                {
                  id:'ncn',
                  tite:'NCN',
                  img:'./src/img/graphics/ncnBig.png'
                },
                {
                  id:'geotiff',
                  tite:'GeoTIFF',
                  img:'./src/img/graphics/geotiffBig.png'
                }
              ]
          }
      },
      open:function(){
        GL.titresim();
        $("#modal-fileupload").modal('show');
        this.onoff = true;
        this.$forceUpdate();
      },
      close:function(e){
        GL.titresim();
        this.onoff = false;
        $("#modal-fileupload").modal('hide');
      },
      selectFile:function(item){
        this.obj=item;
        if (item!="geotiff"){
          epsg.$children[0].open();
          $("#modal-fileupload").modal('hide');
        }else{
          this.readFile();
        }
        
      },
      addToMap:function(data,id,color){
        GL.map.addSource(id, { 'type': 'geojson', 'data': data });

        GL.map.addLayer({
            'id': id+'-point',
            'type': 'circle',
            'source': id,
                'paint': {
                    'circle-radius': 4,
                    'circle-color': color
                },
                'filter': ['==', '$type', 'Point']
        });
        GL.map.addLayer({
            'id': id+'-polygon',
            'type': 'fill',
            'source': id,
                'paint': {
                    'fill-color': color,
                    'fill-opacity': 0.7
                },
                'filter': ['==', '$type', 'Polygon']
        });
        GL.map.addLayer({
            'id': id+'-line',
            'type': 'line',
            'source': id,
                'paint': {
                    'line-color': color,
                    'line-width': 2
                },
                'filter': ['==', '$type', 'LineString']
        });
        GL.loading(false);
        GL.bilgi("Başarıyla Eklendi");
      },
      readFile:function(epsgCode){
        GL.titresim();
        var that = this;
        
        // Epsg kodu seçildi
        var type=this.obj;
        epsg.$children[0].registerProjection2(function () {
          var fileElement = document.createElement('input');
          fileElement.type = 'file';
          fileElement.accept = '.' + that.obj;
          
          if (type == "shp") {
            fileElement.accept = ".zip";
          }else if(type == "geotiff"){
            fileElement.accept = ".tiff";
          }else if (type == "excel") {
            fileElement.accept = ".xls,.xlsx";
          }

          setTimeout(function () {
            fileElement.click();
          }, 100);
          fileElement.addEventListener('input', function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            var fileName = file.name.split('.')[0];
            GL.loading("Dosya yükleniyor");
            reader.addEventListener("load", function (e) {
                switch (type) {
                    case "geojson":
                        var id = "geojson" + Date.now();
                        var data=reader.result;
                        var layerCount=GL.map.getStyle().layers.length;
                        var color=GL.config.colors[layerCount%19];
                        var reader2 = new ol.format.GeoJSON();

                        if (typeof data == 'string') {
                          data = JSON.parse(data);
                        }
                          
                        if (data.length > 0) {
                            data.map(function (a) {
                              var featureArray= reader2.readFeatures(a,{
                                featureProjection: 'EPSG:4326',
                                dataProjection:'EPSG:'+epsgCode
                              });
                              var features2= new ol.format.GeoJSON().writeFeatures(featureArray,{
                                featureProjection: 'EPSG:4326'
                              })
                              if (typeof features2 == 'string') {
                                features2 = JSON.parse(features2);
                              }
                              //that.addToMap(features2,id,color);
                              var information={id:id,name:fileName,type:'geojson',layers:[id+"-point",id+"-line",id+"-polygon"]};
                              GL.addGeojsonToLayer(features2,id,color,information);
                              GL.loading(false);
                            });
                        }else{
                            var featureArray = reader2.readFeatures(data, {
                              featureProjection: 'EPSG:4326',
                              dataProjection: 'EPSG:'+epsgCode
                            });
                            var features2= new ol.format.GeoJSON().writeFeatures(featureArray,{
                              featureProjection: 'EPSG:4326',
                              dataProjection: 'EPSG:'+epsgCode
                            })
                            if (typeof features2 == 'string') {
                              features2 = JSON.parse(features2);
                            }
                            //that.addToMap(features2,id,color);
                            var information={id:id,name:fileName,type:'geojson',layers:[id+"-point",id+"-line",id+"-polygon"]};
                            GL.addGeojsonToLayer(features2,id,color,information);
                            GL.loading(false);
                        }
                    break;

                    case "kml":
                      var id = "kml" + Date.now();
                      var data=reader.result;

                      var reader2 = new ol.format.KML({
                        extractStyles: false
                      });

                      var layerCount=GL.map.getStyle().layers.length;
                      var color=GL.config.colors[layerCount%19];

                      var featureArray = reader2.readFeatures(data, {
                              "featureProjection": 'EPSG:4326',
                              "dataProjection": 'EPSG:'+epsgCode
                      });
                      var features2= new ol.format.GeoJSON().writeFeatures(featureArray,{
                              featureProjection: 'EPSG:4326'
                      })
                      if (typeof features2 == 'string') {
                              features2 = JSON.parse(features2);
                      }
                      //that.addToMap(features2,id,color);
                      var information={id:id,name:fileName,type:'kml',layers:[id+"-point",id+"-line",id+"-polygon"]};
                      GL.addGeojsonToLayer(features2,id,color,information);
                      GL.loading(false);
                    break

                    case "gpx":
                      var id = "gpx" + Date.now();
                      var data=reader.result;
                      var reader2 = new ol.format.GPX();


                      var layerCount=GL.map.getStyle().layers.length;
                      var color=GL.config.colors[layerCount%19];

                      var featureArray = reader2.readFeatures(data, {
                              "featureProjection": 'EPSG:4326',
                              "dataProjection": 'EPSG:'+epsgCode
                      });
                      var features2= new ol.format.GeoJSON().writeFeatures(featureArray,{
                              featureProjection: 'EPSG:4326'
                      })
                      if (typeof features2 == 'string') {
                              features2 = JSON.parse(features2);
                      }
                      //that.addToMap(features2,id,color);
                      var information={id:id,name:fileName,type:'gpx',layers:[id+"-point",id+"-line",id+"-polygon"]};
                      GL.addGeojsonToLayer(features2,id,color,information);
                      GL.loading(false);
                    break

                    case "shp":
                      var id = "shp" + Date.now();
                      var data=reader.result;
                      console.log(data);
                      console.log(typeof data);
                      var layerCount=GL.map.getStyle().layers.length;
                      var color=GL.config.colors[layerCount%19];
                      var reader2 = new ol.format.GeoJSON();
                      GL.loading('SHP Files Loading');
                      shp(data).then(function (geojson) {
                          GL.loading(false);
                          console.log(geojson);
                          that.addGeoJSONFile(geojson,id,epsgCode,color,fileName);
                      });
                    break

                    case "csv":
                      var id = "csv" + Date.now();

                    break

                    case "geotiff":
                      var id = "geotiff" + Date.now();
                      var data=reader.result;
                      //GL.map.loadImage('./sample.tiff');
                      var url="https://s3-us-west-2.amazonaws.com/planet-disaster-data/hurricane-harvey/SkySat_Freeport_s03_20170831T162740Z3.tif";
                      var tilesUrl = GL.createTilesUrl(url);
                      console.log(tilesUrl);

                      GL.map.addSource(id, { 'type': 'raster', 'tiles': [tilesUrl] ,'tileSize': 256});

                      GL.map.addLayer({
                        'id': id,
                        'type': 'raster',
                        'source': id,
                        'minzoom': 0,
                        'maxzoom': 22,
                        'paint': { 'raster-opacity': 0.85 }
                      });

                    break

                    case "excel":
                      GL.loading(false);
                      GL.excel.file = XLSX.read(reader.result, {
                        type: 'binary'
                      });
                      GL.excel.file.SheetNames.forEach(function (sheetName) {
                        var excelResult = XLSX.utils.sheet_to_row_object_array(GL.excel.file.Sheets[sheetName]);
                        var obj = {
                          sheetName: sheetName,
                          fields: [],
                          row: 0
                        };
                        obj.row = excelResult.length;
    
                        for (i in excelResult[0]) {
                          obj.fields.push(i);
                        }
    
                        GL.excel.sheets.push(obj);
                      }); 
                      // open excel tab
                      excelpanel.$children[0].open(epsgCode,fileName);
                      
                    break
                    case "ncn":
                      var data=reader.result;

                      var geojson = {
                        type: "FeatureCollection",
                        features: []
                      };

                      var satirlar = data.split('\n');
                      satirlar.map(function (item) {
                        var coords = item.split(' ');
                        var y = parseFloat(coords[1]);
                        var x = parseFloat(coords[2]);
                        var z = parseFloat(coords[3]) || 0;
                        var namex = coords[0];

                        if (namex !== "") {
                          var part = {
                            type: "Feature",
                            properties: {
                              name: namex,
                              elevation: z
                            },
                            geometry: {
                              type: "Point",
                              coordinates: [y, x]
                            }
                          };
                          geojson.features.push(part);
                        }
                      });

                      var reader2 = new ol.format.GeoJSON();
                      var featureArray = reader2.readFeatures(geojson, {
                        featureProjection: "EPSG:4326",
                        dataProjection: 'EPSG:'+epsgCode
                      });

                      var geojson2=reader2.writeFeatures(featureArray);
                      if (typeof geojson2=="string"){
                        geojson2=JSON.parse(geojson2);
                      }

                      var id = "ncn" + Date.now();
                      var layerCount=GL.map.getStyle().layers.length;
                      var color=GL.config.colors[layerCount%19];

                      var information={id:id,name:fileName,type:'ncn',layers:[id+"-point",id+"-line",id+"-polygon"]};
                      GL.addGeojsonToLayer(geojson2,id,color,information);
                      GL.loading(false);
                      
                    break
                }
            }, false);

            if (file) {
              if (type == "shp" || type=="geotiff") {
                console.log(file);
                reader.readAsArrayBuffer(file);
              }else if(type=="excel"){
                reader.readAsBinaryString(file);
              }else {
                reader.readAsText(file);
              }
            }
          })
        })
      },
      addGeoJSONFile: function addGeoJSONFile(data, id,epsgCode,color,fileName) {
        var reader = new ol.format.GeoJSON();
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }

        var g=[];
        if (data.length > 0) {
          data.map(function (a) {
            var featureArray = reader.readFeatures(a, {
              "featureProjection": 'EPSG:4326',
              "dataProjection": 'EPSG:'+epsgCode
            });
            GL.downloadFile('geojson',featureArray,"deneme");
            var features2= new ol.format.GeoJSON().writeFeatures(featureArray,{
              featureProjection: 'EPSG:4326'
            })
            if (typeof features2 == 'string') {
                    features2 = JSON.parse(features2);
            }
            g.push(features2);
          });
          
          var a=GL.mergeGeojsons(g);
          var information={id:id,name:fileName,type:'shp',layers:[id+"-point",id+"-line",id+"-polygon"]};
          GL.addGeojsonToLayer(a,id,color,information);
          GL.loading(false);
        } else {
          var information={id:id,name:fileName,type:'shp',layers:[id+"-point",id+"-line",id+"-polygon"]};
          GL.addGeojsonToLayer(data,id,color,information);
          GL.loading(false);
        }
      }
  },
  template:
  '<div class="modal fade modalbox" id="modal-fileupload" tabindex="-1" role="dialog">'+
    '<div class="modal-dialog" role="document">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<h5 class="modal-title">{{GL.lang.panel.fileupload.label}}</h5>'+
          '<a href="javascript:;" style="color:#8bc34a;" data-dismiss="modal">{{GL.lang.general.close}}</a>'+
        '</div>'+
        '<div class="modal-body" :style="GL.config.darkMode==true ? style.dark:style.light">'+
          '<div class="row">'+
            '<div v-for="item in filetypes" class="col-6" :style="style.active" @>'+
              '<div class="card">'+
              '<div class="card-header">{{item.tite}}</div>'+
              '<div class="card-body" style="padding: 0 !important;">'+
                '<img style="border-radius: 0px !important; width: 100%;" :src="item.img" class="card-img-top" alt="image">'+
              '</div>'+
              '<div class="card-footer" style="padding: 0 !important; border: none;">'+
                '<button @click="selectFile(item.id)" type="button" :class="style.classActive">{{GL.lang.general.add}}</button>'+
              '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+

        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });

var fileupload = new Vue({ el: '#fileupload' });