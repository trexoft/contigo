Vue.component('layerdownload', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Katman İndirme Paneli",
              close:"Kapat",
              light:{backgroundColor:'#efefef'},
              dark:{backgroundColor:'#333333'},
              search:'',
              epsglist:{selected:'4326',data:[{code:'4326',name:"Enlem-Boylam WG84"},{code:'4917',name:"ITRF96 Y(m),X(m)"},{code:'3857',name:"Y(m),X(m)"}]},
              fileType:"geojson",
              dataType:"alldata",
              obj:null,
              filename:"",
              filtered:false,
              filteredIndexes:[]
          }
      },
      open:function(obj,filter){
        $("#downloadModal").modal('show');
        this.obj=obj;
        this.dataType="alldata";
        if(filter){
            this.filtered=true;
            this.filteredIndexes=filter;
        }else{
            this.filtered=false;
            this.filteredIndexes=[];
        }

        var date = GL.getDate();
        var spl=date.split(" ");
        var day=spl[0];
        var time=spl[1];
        this.filename=obj.name+"-"+day+"-"+time;
        this.$forceUpdate();
      },
      close:function(){
        //$("#layerboxModal").modal('hide');
      },
      closee:function(){
        GL.titresim();
        $("#downloadModal").modal('hide');
        this.search='';
        //this.filtered=false;
        //this.filteredIndexes=[];
      },
      searchEPSG:function(){
        var that = this;
        var search = this.search;
        GL.EPSG.search(search,function(results){
          GL.bilgi(results.length+' '+"projeksiyon bulundu");
          that.epsglist.data = results;
          if(results.length==1){
            that.epsglist.selected=results[0].code+'';
          }
        });
      },
      download:function(){
          var that=this;
        GL.titresim();
          if(this.fileType==""){
            GL.uyari("Lütfen Dosya Türü Seçiniz");
          }else{
            this.registerProjection2(function () {
                if(that.dataType=="alldata"){
                    var source=GL.layerbox.getSource(that.obj.id);
                    if(that.fileType=='geojson'){
                        var reader = new ol.format.GeoJSON();
                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });
                        GL.downloadFile('geojson',features,that.filename);
                    }else if(that.fileType=='wkt'){
                        var reader = new ol.format.GeoJSON();
                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });
                        GL.downloadFile('wkt',features,that.filename);
                    }else if(that.fileType=='kml'){
                        var reader = new ol.format.GeoJSON();
                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });
                        GL.downloadFile('kml',features,that.filename);
                    }else if(that.fileType=='gpx'){
                        var reader = new ol.format.GeoJSON();
                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });
                        GL.downloadFile('gpx',features,that.filename);
                    }else if(that.fileType=='shp'){
                        var reader = new ol.format.GeoJSON();
                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });
                        GL.downloadFile('shp',features,that.filename);
                    }else if(that.fileType=='xls'){
                        var reader = new ol.format.GeoJSON();

                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });

                        GL.downloadFile('xls',features,that.filename);
                    }else if(that.fileType=='ncn'){
                        var reader = new ol.format.GeoJSON();

                        var features=reader.readFeatures(source.geojson,{
                            featureProjection: 'EPSG:'+that.epsglist.selected,
                            dataProjection: 'EPSG:4326'
                        });

                        GL.downloadFile('ncn',features,that.filename);
                    }
                }else if(that.dataType=="chosendata"){
                    var source=GL.layerbox.getSource(that.obj.id);
                    if(source.selectedIndex.length==0){
                        GL.uyari("Seçili Geometri Bulunamadı");
                    }else{
                        var selected=source.selectedIndex;
                        var geojson={type:'FeatureCollection',features:[]};
                        for(var i=0;i<source.geojson.features.length;i++){
                            if(selected.indexOf(source.geojson.features[i].properties.index)!=-1){
                                geojson.features.push(source.geojson.features[i]);
                            }
                        }

                        if(that.fileType=='geojson'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('geojson',features,that.filename);
                        }else if(that.fileType=='wkt'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('wkt',features,that.filename);
                        }else if(that.fileType=='kml'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('kml',features,that.filename);
                        }else if(that.fileType=='gpx'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('gpx',features,that.filename);
                        }else if(that.fileType=='shp'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('shp',features,that.filename);
                        }else if(that.fileType=='xls'){
                            var reader = new ol.format.GeoJSON();
    
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
    
                            GL.downloadFile('xls',features,that.filename);
                        }else if(that.fileType=='ncn'){
                            var reader = new ol.format.GeoJSON();
    
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
    
                            GL.downloadFile('ncn',features,that.filename);
                        }
                    }

                }else if(that.dataType=="filterdata"){
                    console.log(that.filteredIndexes);
                    if(that.filteredIndexes.length==0){
                        GL.uyari("Filtrelenen Geometri Bulunamadı");
                    }else{
                        var source=GL.layerbox.getSource(that.obj.id);
                        var geojson={type:'FeatureCollection',features:[]};
                        for(var i=0;i<source.geojson.features.length;i++){
                            if(that.filteredIndexes.indexOf(source.geojson.features[i].properties.index)!=-1){
                                geojson.features.push(source.geojson.features[i]);
                            }
                        }

                        if(that.fileType=='geojson'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('geojson',features,that.filename);
                        }else if(that.fileType=='wkt'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('wkt',features,that.filename);
                        }else if(that.fileType=='kml'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('kml',features,that.filename);
                        }else if(that.fileType=='gpx'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('gpx',features,that.filename);
                        }else if(that.fileType=='shp'){
                            var reader = new ol.format.GeoJSON();
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
                            GL.downloadFile('shp',features,that.filename);
                        }else if(that.fileType=='xls'){
                            var reader = new ol.format.GeoJSON();
    
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
    
                            GL.downloadFile('xls',features,that.filename);
                        }else if(that.fileType=='ncn'){
                            var reader = new ol.format.GeoJSON();
    
                            var features=reader.readFeatures(geojson,{
                                featureProjection: 'EPSG:'+that.epsglist.selected,
                                dataProjection: 'EPSG:4326'
                            });
    
                            GL.downloadFile('ncn',features,that.filename);
                        }
                    }
                }
                
            })  
        }
        that.closee();
      },
      registerProjection2:function(callback){
        var that = this;
        if(this.epsglist.selected!==''){
          GL.EPSG.search(this.epsglist.selected,function(resutls){
            if(resutls.length==1){
              GL.EPSG.registerProjection(resutls[0]);
              GL.EPSG.file = 'EPSG:'+resutls[0].code;
              callback();
            }else{
              GL.uyari("Hata");
            }
          })
        }
        }
  },
  template:
  '<div  class="modal fade modalbox" id="downloadModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 75px;">{{header}}</h5>'+
                        '<a @click="closee" href="javascript:;" data-dismiss="modal" style="color:#8bc34a;">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" >'+

                        '<div class="section mt-4 mb-5">'+
                            '<form>'+

                                '<div class="form-group basic">'+
                                    '<div class="input-wrapper">'+
                                        '<label class="label" for="filenamee" style="font-size:15 !important;">Dosya Adı</label>'+
                                        '<div class="form-group basic">'+
                                            '<div class="input-group mb-3">'+
                                                '<input v-model="filename" type="text" class="form-control" id="filenamee">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+   
                                '</div>'+

                                '<div class="form-group basic">'+
                                    '<div class="input-wrapper">'+
                                        '<label class="label" for="file">Dosya Tipi</label>'+
                                            '<select v-model="fileType" class="form-control custom-select" id="file">'+
                                                '<option value="geojson">Geojson</option>'+
                                                '<option value="kml">KML</option>'+
                                                '<option value="wkt">WKT</option>'+
                                                '<option value="gpx">GPX</option>'+
                                                '<option value="shp">Shapefile</option>'+
                                                '<option value="xls">Excel</option>'+
                                                '<option value="ncn">NCN</option>'+
                                            '</select>'+
                                    '</div>'+
                                '</div>'+
                                    
                                '<div class="form-group basic">'+
                                    '<div class="input-wrapper">'+
                                        '<label class="label" for="data">Veri Seçimi</label>'+
                                            '<select v-model="dataType" class="form-control custom-select" id="data">'+
                                                '<option value="alldata">Bütün geometriler </option>'+
                                                '<option value="chosendata">Seçilen geometriler</option>'+
                                                '<option v-if="filtered==true" value="filterdata">Filtrelenen geometriler</option>'+
                                            '</select>'+
                                    '</div>'+
                                '</div>'+
                                
                                '<div class="form-group basic">'+
                                    '<div class="input-wrapper">'+
                                        '<label class="label" for="epsgSearch2" style="font-size:15 !important;">Koordinat Sistemi ara</label>'+
                                            '<div class="form-group basic">'+
                                                '<div class="input-group mb-3">'+
                                                    '<input v-model="search" type="search" class="form-control" id="epsgSearch2" placeholder="EPSG Kodu">'+
                                                    '<div class="input-group-append">'+
                                                        '<button @click="searchEPSG" class="btn btn-outline-secondary" type="button">Ara</button>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                    '</div>'+   
                                '</div>'+
                                
                                '<div class="form-group basic">'+
                                    '<div class="input-wrapper">'+
                                        '<label class="label" for="epsg2">Koordiant Sistemi Listesi</label>'+
                                            '<select class="form-control custom-select" v-model="epsglist.selected" id="epsg2" required>'+
                                                    '<option v-for="item in epsglist.data" :value="item.code">{{item.name}} - EPSG:{{item.code}}</option>'+
                                            '</select>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="form-button-group" style="padding-bottom:35px;">'+
                                '<button @click="download" type="button" class="btn btn-primary btn-block">İndir</button>'+
                                '</div>'+
                            '</form>'+
                        '</div>'+

                            //'<button style="float:right; padding:10px;" type="button" class="btn btn-success mr-1 mb-1">SUCCESS</button>'+
        
                    '</div>'+

                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var layerdownload = new Vue({ el: '#layerdownload' });