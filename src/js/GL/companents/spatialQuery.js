Vue.component('spatialquery', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Konumsal Sorgular",
              close:"Kapat",
              sourceId:"",
              islemler:{selected:'',data:[
                {value:'==', text:"Bir değere eşit (=)"},
                {value:'>', text:"Bir değerden büyük (>)"},
                {value:'>=', text:"Bir değere eşit veya büyük (>=)"},
                {value:'<', text:"Bir değerden küçük (<)"},
                {value:'<=', text:"Bir değere eşit veya küçük (<=)"},
              ]},
              query:{selected:'',data:[
                {method:'value', value:'length', text:"Uzunluk"},
                {method:'value', value:'area', text:"Alan"},
                {method:'map', value:'intersect', text:"Kesişim Geometrilerini Bul (intersect)"},
                {method:'map', value:'within', text:"İçinde Olan Geometrileri Bul (within)"},
                {method:'map', value:'contains', text:"Geometri İçerisinde Kalanları Bul (contains)"},
                {method:'map', value:'overlap', text:"Örtüşen Geometrileri Bul (overlap)"},
                {method:'map', value:'disjoint', text:"Kesişmeyen Geometrileri Bul (disjoint)"},
              ]},
              inputVal:"",
              method:"",
              value:"",
              mapInput:"",
              mapGeojson:"",
              distanceUnit:"meters"
          }
      },
      open:function(sourceId){
        $("#spatialqueryModal").modal('show');
        this.sourceId=sourceId;
      },
      close:function(e){
        $("#spatialqueryModal").modal('hide');
      },
      close2:function(){
        $("#spatialqueryModal").modal('hide');
        GL.config.gettingInformation=true;
        GL.selectFeatureOnMap=false;
        this.inputVal="";
        this.method="";
        this.value="";
        this.mapInput="";
        this.mapGeojson="";
        this.distanceUnit="meters";
        this.sourceId="";
        this.islemler.selected="";
        this.query.selected="";
        GL.selectFeatureOnMapGeojson=[];
        GL.selectMethod="";
      },
      querySelected:function(){
          var that=this;
        var val = this.query.data.find(function(p){
            if(p.value==that.query.selected){
              return p;
            }
        });
        this.method=val;
      },
      runQuery:function(){
          // Value
          console.log(this.method);
        if(this.method.method=="value"){
            if(this.islemler.selected==""){
                GL.uyari("Lütfen bir işlem seçiniz");
            }else if(this.value==""){
                GL.uyari("Lütfen bir değer giriniz");
            }else{
                    // geojson54534, value, length, ==, 50
                var result=GL.spatialQuery(this.sourceId,this.method.method,this.method.value,this.islemler.selected,this.value,this.distanceUnit);
                if(result==false){
                    GL.uyari("Geometri Bulunamadı");
                }else{
                    GL.bilgi("İşlem Başarılı");

                    datatable.$children[0].table.clearFilter();
                    datatable.$children[0].table.clearFilter(true);
                    datatable.$children[0].table.clearHeaderFilter();
                    datatable.$children[0].table.setFilter([{
                    field: "index",
                    type: "in",
                    value: result
                    }]);

                    datatable.$children[0].setPage("tab2");
                    this.close2();
                }
            }
        }else if(this.method.method=="map"){
            if(this.mapGeojson==""){
                GL.uyari("Geometri belirlenmedi");
            }else{
                var result=GL.spatialQuery(this.sourceId,this.method.method,this.method.value,this.islemler.selected,this.mapGeojson);
                if(result==false){
                    GL.uyari("Geometri Bulunamadı");
                }else{
                    GL.bilgi("İşlem Başarılı");


                    datatable.$children[0].table.clearFilter();
                    datatable.$children[0].table.clearFilter(true);
                    datatable.$children[0].table.clearHeaderFilter();
                    datatable.$children[0].table.setFilter([{
                        field: "index",
                        type: "in",
                        value: result
                    }]);

                    datatable.$children[0].setPage("tab2");
                    this.close2();
                }
            }
        }
      },
      drawNewFeature:function(){
        var that = this;
        GL.config.gettingInformation=false;
        $("#spatialqueryModal").modal('hide');
        datatable.$children[0].setPage("tab1");
        if(this.method.value=="intersect"){
            GL.draw.start("LineString","newfeature",function(geojson,layerId){
                GL.draw.deleteAll();
                GL.config.gettingInformation=true;
                that.mapGeojson=geojson;
                $("#spatialqueryModal").modal('show');
                that.mapInput="Yeni çizim yapıldı";
            });
        }else if(this.method.value=="within" || this.method.value=="overlap"){
            GL.draw.start("Polygon","newfeature",function(geojson,layerId){
                GL.draw.deleteAll();
                GL.config.gettingInformation=true;
                that.mapGeojson=geojson;
                $("#spatialqueryModal").modal('show');
                that.mapInput="Yeni çizim yapıldı";
            });
        }else if(this.method.value=="contains"){
            GL.draw.start("Point2","newfeature",function(geojson,layerId){
                GL.draw.deleteAll();
                GL.config.gettingInformation=true;
                that.mapGeojson=geojson;
                $("#spatialqueryModal").modal('show');
                that.mapInput="Yeni çizim yapıldı";
            });
        }else if(this.method.value=="disjoint"){
            var buttons=[
                {id:'point',title:'Nokta',callback:function(a){
                    GL.draw.start("Point2","newfeature",function(geojson,layerId){
                        GL.draw.deleteAll();
                        GL.config.gettingInformation=true;
                        that.mapGeojson=geojson;
                        $("#spatialqueryModal").modal('show');
                        that.mapInput="Yeni çizim yapıldı";
                    });
                }},
                {id:'linestring',title:'Çizgi',callback:function(a){
                  GL.draw.start("LineString","newfeature",function(geojson,layerId){
                      GL.draw.deleteAll();
                      GL.config.gettingInformation=true;
                      that.mapGeojson=geojson;
                      $("#spatialqueryModal").modal('show');
                      that.mapInput="Yeni çizim yapıldı";
                  });
                }},
                {id:'polygon',title:'Poligon',callback:function(a){
                    GL.draw.start("Polygon","newfeature",function(geojson,layerId){
                        GL.draw.deleteAll();
                        GL.config.gettingInformation=true;
                        that.mapGeojson=geojson;
                        $("#spatialqueryModal").modal('show');
                        that.mapInput="Yeni çizim yapıldı";
                    });
                }}
            ];
            mydialog.$children[0].open({
                header:'Çizim Türü',
                content:'Hangi geometri tipinde çizim yapmak istiyorsunuz?',
                buttons:buttons
            });   
        }
        
      },
      selectFeature:function(){
        GL.selectMethod=this.method.value;
        GL.selectFeatureOnMap=true;
        $("#spatialqueryModal").modal('hide');
        datatable.$children[0].setPage("tab1");
        GL.config.gettingInformation=false;
      },
      getSelectedFeature:function(){
        GL.selectFeatureOnMap=false;
        if(GL.selectFeatureOnMapGeojson==[]){
            console.log("Geometri Seçilemedi");
        }else{
            this.mapInput="Geometri Seçildi";
            var geom=GL.selectFeatureOnMapGeojson;
            var layerid=geom[0].layer.source;

            var layerr=GL.layerbox.getSource(layerid);
            for(var i=0;i<layerr.geojson.features.length;i++){
                if(geom[0].properties.index==layerr.geojson.features[i].properties.index){
                    this.mapGeojson=layerr.geojson.features[i];
                    break
                }
            }
            console.log(this.mapGeojson);
        }
      }
  },
  template:
  '<div  class="modal fade modalbox" id="spatialqueryModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                            // select Query
                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Uygulanacak Sorgu</label>'+
                                    '<select @change="querySelected" class="form-control custom-select" v-model="query.selected">'+
                                    '<option v-for="item in query.data" :value="item.value">{{item.text}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            // Select second query 
                            '<div v-if="method.method==\'value\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Uygulanacak Metod</label>'+
                                    '<select class="form-control custom-select" v-model="islemler.selected">'+
                                    '<option v-for="item in islemler.data" :value="item.value">{{item.text}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            // Input Value
                            '<div  v-if="method.method==\'value\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Değer</label>'+
                                    '<input type="number" class="form-control" v-model="value" placeholder="">'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            // Unit
                            '<div  v-if="method.method==\'value\' && method.value==\'length\'" class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="distanceunit">Birim</label>'+
                                    '<select v-model="distanceUnit" class="form-control custom-select" id="distanceunit">'+
                                        '<option value="meters">Metre</option>'+
                                        '<option value="kilometers">Kilometre</option>'+
                                        '<option value="miles">Mil</option>'+
                                        '<option value="degrees">Derece</option>'+
                                        '<option value="radian">Radyan</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            // Method Map
                            '<div v-if="method.method==\'map\'" class="form-group basic" style="padding-left:55px;">'+
                                '<button @click="drawNewFeature" type="button" class="btn btn-primary">Yeni Çizim</button>'+
                                '<button @click="selectFeature" type="button" class="btn btn-primary">Geometri Seç</button>'+
                            '</div>'+

                            // Map Input Info
                            '<div  v-if="method.method==\'map\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Geometri</label>'+
                                    '<input type="text" class="form-control" v-model="mapInput" placeholder="Geometri Belirleyin" readonly>'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            // Button
                            '<div class="form-button-group">'+
                                '<button @click="runQuery" type="button" class="btn btn-primary btn-block">Uygula</button>'+
                            '</div>'+
        
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var spatialquery = new Vue({ el: '#spatialquery' });