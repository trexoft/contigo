Vue.component('coordinatetransform', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:false,
              tab1class:"",
              tab2class:"",
              tab3class:"",
              header:"Koordinat Dönüşümü",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Nokta',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Liste',active:false,class:"tab-pane"}],
              search:'',
              epsglist:{selected:'4326',data:[{code:'4326',name:"Enlem-Boylam WG84"},{code:'4917',name:"ITRF96 Y(m),X(m)"},{code:'3857',name:"Y(m),X(m)"}]},
              search2:'',
              epsglist2:{selected:'4326',data:[{code:'4326',name:"Enlem-Boylam WG84"},{code:'4917',name:"ITRF96 Y(m),X(m)"},{code:'3857',name:"Y(m),X(m)"}]},
              manual:false,
              selectedPoint:null,
              pointInfo:"Nokta henüz seçilmedi",
              point1ID:"",
              geocoder:null,
              searchJson:null,
              geojson:null,
              result:"",
              manualLat:"",
              manualLon:"",
              method:"",
              data:[]
          }
      },
      open:function(){
        var that=this;
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#coordinatetransform',function(event,direction){
          that.setPageDirection(direction);
        });

        if(localStorage.getItem('transform')!=null){
            var dataa=localStorage.getItem('transform');
            if(data.length>1){
                this.data=JSON.parse(dataa);
            }else{
                this.data.push(JSON.parse(dataa));
            }
        }

        this.geocoder = new MapboxGeocoder({
            accessToken: GL.config.mapboxglAccessToken,
            mapboxgl: mapboxgl,
            language:'tr',
            marker: {
              color: '#4caf50'
            },
            placeholder:'Ara...',
            clearOnBlur:true
          });

        setTimeout(function(){
            document.getElementById('geocoder3').appendChild(that.geocoder.onAdd(GL.map));
            var a=$("#geocoder3").find('div')[1];
            $('#searchLocation').hide();
        }, 100);
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#coordinatetransform');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        $("#map").show();

        this.manual=false;
        this.selectedPoint=null;
        this.pointInfo="Nokta henüz seçilmedi";
        this.point1ID="";
        this.geocoder=null;
        this.searchJson=null;
        this.geojson=null;
        this.result="";
        this.manualLat="";
        this.manualLon="";
        this.method="";
        this.data=[];
        this.search="";
        this.search2="";
        this.epsglist.selected="4326";
        this.epsglist2.selected="4326";

        $("#geocoder3").removeClass("show");
        var source=GL.map.getSource('coordinatetransform');
        if (source!=undefined){
          GL.removeLayerByID('coordinatetransform');
        }
      },
      setPage:function(pageId){
        var that = this;
        var activePage = this.pages.find(function(p){
          if(p.active==true){
            return p;
          }
        });

        var newPage = this.pages.find(function(p){
          if(p.id==pageId){
            return p;
          }
        });

        if(typeof activePage!=="undefined"){
          if(activePage.id==newPage.id){
            return false;
          }else{

            var activePageClass = "fadeOutRight";
            var newPageClass = "fadeInLeft";
            if(newPage.i>activePage.i){
              activePageClass="fadeOutLeft";
              newPageClass="fadeInRight";
            }

            this.pages[activePage.i].active=false;
            this.pages[newPage.i].active=true;
            this.pages[activePage.i].class="tab-pane animated3 "+activePageClass+" active";
            setTimeout(function(){
              that.pages[activePage.i].class="tab-pane";
              that.pages[newPage.i].class="tab-pane animated3 "+newPageClass+" active";
              that.doIt(newPage.id);
            },200);
          }
        }else{
          $("#map").hide();
          this.pages[newPage.i].active=true;
          this.pages[newPage.i].class="tab-pane animated3 fadeIn active"
        }
      },
      setPageDirection:function(direction){
        var activePage = this.pages.find(function (p) {
          if (p.active == true) {
            return p;
          }
        });
        var min = 0;
        var max = this.pages.length-1;
        var now = activePage.i;
        var artis = 0;
        if(direction=="right"){
          artis=-1;
        }else{
          artis=1;
        }
        var newnow = now+artis;
        if(newnow<min){
          newnow = min;
        }
        if(newnow>max){
          newnow = max;
        }
        var newPage = this.pages.find(function (p) {
          if (p.i == newnow) {
            return p;
          }
        });
        this.setPage(newPage.id);
  
      },
      doIt:function(tabId){
        switch(tabId){
          case 'tab1':{
            $("#map").show();
            $('#searchLocation').hide()
            break;
          }
          case 'tab2':{
            $("#map").hide();
            break;
          }
          case 'tab3':{
            $("#map").hide();
            $('#searchLocation').hide()
            break;
          }
        }
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
      searchEPSG2:function(){
        var that = this;
        var search = this.search2;
        GL.EPSG.search(search,function(results){
          GL.bilgi(results.length+' '+"projeksiyon bulundu");
          that.epsglist2.data = results;
          if(results.length==1){
            that.epsglist2.selected=results[0].code+'';
          }
        });
      },
      registerProjection:function(callback){
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
      },
      registerProjection2:function(callback){
        var that = this;
        if(this.epsglist.selected!=='' && this.epsglist2.selected!==''){
          GL.EPSG.search(this.epsglist.selected,function(resutls){
            if(resutls.length==1){
              GL.EPSG.registerProjection(resutls[0]);
              GL.EPSG.file = 'EPSG:'+resutls[0].code;
              GL.EPSG.search(that.epsglist2.selected,function(resutls2){
                if(resutls2.length==1){
                  GL.EPSG.registerProjection(resutls2[0]);
                  GL.EPSG.file = 'EPSG:'+resutls[0].code;
                  callback();
                }else{
                  GL.uyari("Hata");
                }
              })
            }else{
              GL.uyari("Hata");
            }
          })
        }
      },
      getPoints:function(buttonid){
        var that=this;
          if(buttonid==1){
              this.result="";
              $('#searchLocation').hide();
              this.manual=false;
              this.method=""
              GL.getUserLocation(function(callback){
                  var lat = turf.round(callback.coords.latitude,5);
                  var lon = turf.round(callback.coords.longitude,5);
                  var point = turf.point([lon,lat]);

                  that.geojson=point;
                  that.pointInfo="Konum Bilgisi alındı"

                  GL.bilgi("Nokta Ataması Yapılmıştır");
              });
          }else if(buttonid==2){
              this.result="";
              this.method=""
              $('#searchLocation').hide();
              this.manual=false;
              this.setPage('tab1');
              GL.draw.start("Point2","coordinatetransform",function(geojson,layerId){
                  that.setPage('tab2');
                  if(that.point1ID!=""){
                          GL.draw.deleteById(that.point1ID);
                  }

                  that.geojson=geojson;
                  that.point1ID=geojson.id;
                  that.pointInfo="Haritadan nokta alındı"
                  GL.bilgi("Nokta Ataması Yapılmıştır");
              });
          }else if(buttonid==3){
              this.result="";
              this.manual=false;
              this.method=""
              $('#searchLocation').show()

              this.geocoder.on('result', function(ev) {
                that.geojson= ev.result;
                that.pointInfo="Arama noktası alındı"  
                GL.bilgi("Nokta Ataması Yapılmıştır");
              });
              
          }else if(buttonid==4){
              this.result="";
              $('#searchLocation').hide()
              this.manual=true;
              this.method="manual"
          }
    },
    calculateTransform:function(){
        if(this.geojson==null && this.method!="manual"){
            GL.uyari("Lütfen Nokta Seçiniz");
        }else{

            var geojson=this.geojson;
            var epsg=this.epsglist.selected;
            var epsg2=this.epsglist2.selected;
            var that=this;
            if(this.method=="manual"){
              if(this.manualLat !="" && this.manualLon!=""){
                this.manual=false;
                var lat=this.manualLat;
                var lon=this.manualLon;
                var point = turf.point([lon,lat]);
                that.geojson=point;
                that.pointInfo="Nokta El İle Girildi"
                that.registerProjection2(function () {
                  var reader = new ol.format.GeoJSON();
                  var features = reader.readFeatures(that.geojson,{
                          featureProjection: 'EPSG:'+epsg,
                          dataProjection: 'EPSG:'+epsg2
                  });
      
                  var geojson2 = reader.writeFeatures(features);
                  var r=JSON.parse(geojson2);
                  // 4326
                  var features2 = reader.readFeatures(that.geojson,{
                      featureProjection: 'EPSG:4326',
                      dataProjection: 'EPSG:'+epsg
                  });

                  var geojson3 = reader.writeFeatures(features2);
                  var result2=JSON.parse(geojson3);
                  that.selectedPoint=result2;

                  if(that.epsglist.selected=="4326"){
                    that.result=parseFloat(r.features[0].geometry.coordinates[0]).toFixed(5)+", "+parseFloat(r.features[0].geometry.coordinates[1]).toFixed(5 );
                  }else {
                    that.result=parseFloat(r.features[0].geometry.coordinates[0]).toFixed(3)+", "+parseFloat(r.features[0].geometry.coordinates[1]).toFixed(3);
                  }
                })
              }else{
                  GL.uyari("Koordinatları Giriniz");
              }
            }else{
                this.registerProjection(function () {
                    var reader = new ol.format.GeoJSON();
                    var features = reader.readFeatures(geojson,{
                            featureProjection: 'EPSG:'+epsg,
                            dataProjection: 'EPSG:4326'
                    });
        
                    var geojson2 = reader.writeFeatures(features);
                    var r=JSON.parse(geojson2);

                    that.selectedPoint=that.geojson;
                    if(that.epsglist.selected=="4326"){
                      that.result=r.features[0].geometry.coordinates[0].toFixed(5)+", "+r.features[0].geometry.coordinates[1].toFixed(5);
                    }else {
                      that.result=r.features[0].geometry.coordinates[0].toFixed(3)+", "+r.features[0].geometry.coordinates[1].toFixed(3);
                    }
                    
                })
            }
        }
        
    },
    saveValue:function(){
        var that=this;

        if(that.geojson==null){
            GL.uyari("Lütfen Nokta Seçiniz");
        }else if(that.selectedPoint==null){
            this.calculateTransform();
            this.getLayerName();
        }else{
            this.getLayerName();
        }
        
    },
    getLayerName:function(){
        var that=this;
        mydialoginputs.$children[0].open({
            header:'Kayıt Bilgisi',
            inputs:[
              {id:'layername',type:'text',title:'Kayıt Adı',getvalue:''},
              //{id:'check1',type:'checkbox',title:'Deneme Sütuu',getvalue:''},
            ],
            callback:function(a){
              if(a.type=="close"){
                GL.bilgi("İşlem İptal Edildi");
              }else if(a.type=="ok"){
                  var layername=a.values[0].getvalue;
                  if (layername==""){
                    GL.uyari("Lütfen Kayıt Adını Giriniz");
                  }else{
                    GL.bilgi("Başarı İle Kayıt Edildi");
                    var save={name:layername, geometry:that.selectedPoint,coords:that.result,epsg:that.epsglist.selected};
                    that.data.push(save);
                    GL.savelocalstorage("transform",that.data);
                    that.setPage('tab3');
                  }
              }
              
        }});
    },
    deleteItem:function(val){
        var that=this;
        mydialog.$children[0].open({
            header:'Kayıt Silme',
            content:'Kaydı Silmek İstediğinize Emin Misiniz?',
            buttons:[
              {id:'evet',title:'Evet',callback:function(a){
                that.data.splice (val,1);
                localStorage.removeItem('transform');
                GL.savelocalstorage("transform",that.data);
                GL.bilgi("Kayıt Silindi.");
              }}
            ],
            callback:function(a){
              GL.bilgi("Kayıt Silme İşlemi İptal Edilmiştir.");
          }});

    },
    showOnMap:function(geojson){
        GL.loading("Geometri yükleniyor");
        var source=GL.map.getSource('coordinatetransform');
        if (source!=undefined){
          GL.removeLayerByID('coordinatetransform');
        }

        var bbox = turf.bbox(geojson);
        GL.ZoomLayer(bbox);

        GL.draw.deleteAll();

        var color=GL.config.colors[10];
        var information={id:"coordinatetransform",name:"Koordinat Dönüşümü",type:'point',layers:["coordinatetransform-point","coordinatetransform-line","coordinatetransform-polygon"]};
        GL.addGeojsonToLayer(geojson,"coordinatetransform",color,information);

        this.setPage('tab1');

        GL.loading(false);
        
    },
    clearAll:function(){
        this.manual=false;
        this.selectedPoint=null;
        this.pointInfo="Nokta henüz seçilmedi";
        this.point1ID="";
        this.geocoder=null;
        this.searchJson=null;
        this.geojson=null;
        this.result="";
        this.manualLat="";
        this.manualLon="";
        this.method="";
        this.data=[];
        this.search="";
        this.search2="";
        this.epsglist.selected="4326";
        this.epsglist2.selected="4326";
      }
  },
  template:
  '<div v-if="onoff">'+

      '<div class="appHeader bg-primary text-light">'+
      '<div class="left">'+
          '<a href="javascript:;" class="headerButton goBack" @click="close">'+
              '<ion-icon name="chevron-back-outline"></ion-icon>'+
          '</a>'+
      '</div>'+
        '<div class="pageTitle">{{header}}</div>'+
        '<div class="right"></div>'+
      '</div>'+


        //header
      '<div class="extraHeader p-0">'+
          '<ul class="nav nav-tabs lined" role="tablist">'+
          '<li class="nav-item" v-for="(item,i) in pages">'+
                  '<a :class="item.active==true?\'nav-link active\':\'nav-link\'" @click="setPage(item.id)" href="#">'+
                      '{{item.title}}'+
                  '</a>'+
              '</li>'+
          '</ul>'+
      '</div>'+
    
          '<div id="appCapsule" class="extra-header-active" style="padding-top: 50px !important;">'+

            '<div class="tab-content mt-1">'+

            // tab2
            '<div :class="pages[1].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+
                    '<form>'+

                            '<label class="label" for="methods">Nokta Seçme Yöntemi</label>'+
                            '<div class="btn-group btn-group-toggle" data-toggle="buttons" id="methods" style="width:90%;">'+
                                
                                '<label class="btn btn-outline-primary">'+
                                '<input type="radio" name="options" @click="getPoints(1)"> Konum'+
                                '</label>'+

                                '<label class="btn btn-outline-primary">'+
                                '<input type="radio" name="options" @click="getPoints(2)"> Haritadan'+
                                '</label>'+

                                '<label class="btn btn-outline-primary">'+
                                '<input type="radio" name="options" @click="getPoints(3)"> Arama'+
                                '</label>'+

                                '<label class="btn btn-outline-primary">'+
                                '<input type="radio" name="options" @click="getPoints(4)"> Yazarak'+
                                '</label>'+
                            '</div>'+

                            // Search location

                            '<div class="form-group boxed" id="searchLocation">'+
                                '<div class="input-group" id="geocoder3" style="border-style: solid; border-width: 2px; margin-top:10px;">'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<input type="text" class="form-control" id="Info" v-bind:value="pointInfo" readonly>'+
                                    '<i class="clear-input">'+
                                        '<ion-icon name="close-circle"></ion-icon>'+
                                    '</i>'+
                                '</div>'+
                            '</div>'+

                            '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                            '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                            '<label class="label" for="epsgSearch1" style="font-size:15 !important;">Dönüştürülcek Koordinat Sistemi Arama</label>'+
                            '<div class="form-group basic">'+
                                '<div class="input-group">'+
                                    '<input v-model="search" type="search" class="form-control" id="epsgSearch1" placeholder="EPSG Kodu">'+
                                    '<div class="input-group-append">'+
                                        '<button @click="searchEPSG" class="btn btn-outline-secondary" type="button">Ara</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+

                            '<div class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="epsg1">Dönüştürülcek Koordiant Sistemini Seçiniz</label>'+
                                    '<select class="form-control custom-select" v-model="epsglist.selected" id="epsg1" required>'+
                                        '<option v-for="item in epsglist.data" :value="item.code">{{item.name}} - EPSG:{{item.code}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+
                            
                            // Search list 2

                            '<div v-if="manual" class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="epsgSearch2" style="font-size:15 !important;">Koordinat Sistemi ara</label>'+
                                    '<div class="form-group basic">'+
                                        '<div class="input-group">'+
                                            '<input v-model="search2" type="search" class="form-control" id="epsgSearch2" placeholder="EPSG Kodu">'+
                                            '<div class="input-group-append">'+
                                                '<button @click="searchEPSG2" class="btn btn-outline-secondary" type="button">Ara</button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            

                            '<div v-if="manual" class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="epsg1">Koordiant Sistemi Listesi</label>'+
                                    '<select class="form-control custom-select" v-model="epsglist2.selected" id="epsg1" required>'+
                                        '<option v-for="item in epsglist2.data" :value="item.code">{{item.name}} - EPSG:{{item.code}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div v-if="manual" class="form-group boxed">'+
                                '<div class="input-wrapper" style="margin-bottom:10px;">'+
                                    '<label class="label" for="latitude">Enlem</label>'+
                                    '<div class="input-group">'+
                                        '<input type="number" v-model="manualLat" class="form-control" id="latitude" placeholder="Enlem veya Y değerini giriniz">'+
                                        '<i class="clear-input">'+
                                            '<ion-icon name="close-circle"></ion-icon>'+
                                        '</i>'+
                                    '</div>'+
                                '</div>'+
                                //INPUTS
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="longitude">Boylam</label>'+
                                    '<div class="input-group">'+
                                    '<input type="number" v-model="manualLon" class="form-control" id="longitude" placeholder="Boylam veya X değerini giriniz">'+
                                    '<i class="clear-input">'+
                                        '<ion-icon name="close-circle"></ion-icon>'+
                                    '</i>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="result">Dönüştürülen Noktanın Sonucu</label>'+
                                    '<input type="text" class="form-control" id="result" placeholder="Lütfen Dönüştüre Basınız" v-bind:value="result" readonly>'+
                                    '<i class="clear-input">'+
                                        '<ion-icon name="close-circle"></ion-icon>'+
                                    '</i>'+
                                '</div>'+
                            '</div>'+

                            '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                            '<div class="form-group boxed" style="padding-left:15px;">'+
                                    '<button type="button" @click="clearAll" class="btn btn-secondary shadowed mr-1 mb-1" style="width:90px;">Temizle</button>'+
                                    '<button type="button" @click="calculateTransform" class="btn btn-success shadowed mr-1 mb-1" style="width:90px;">Dönüştür</button>'+
                                    '<button type="button" @click="saveValue" class="btn btn-primary shadowed mr-1 mb-1" style="width:90px;">Kayıt</button>'+
                            '</div>'+

                            
                        '</form>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+
  
                    '<table class="table">' +
                        '<thead>' +
                            '<tr>' +
                                //'<th scope="col">#</th>' +
                                '<th scope="col">Adı</th>' +
                                '<th scope="col">koordinatlar</th>' +
                                '<th scope="col">Epsg</th>' +
                                //'<th scope="col">Göster</th>' +
                                '<th scope="col">Sil</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody v-for="(val,i) in data">' +
                            '<tr>' +
                                //'<td scope="row">{{i+1}}</td>'+
                                '<td>{{val.name}}</td>' +
                                '<td @click="showOnMap(val.geometry)">{{val.coords}}</td>' +
                                '<td>{{val.epsg}}</td>' +
                                //'<td @click="showOnMap(val.geometry)">Göster</td>' +
                                '<td @click="deleteItem(i)">Sil</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var coordinatetransform = new Vue({ el: '#coordinatetransform' });