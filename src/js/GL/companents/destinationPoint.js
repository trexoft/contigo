Vue.component('destinationpoint', {
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
              header:"Nokta Üretme",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Nokta',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Liste',active:false,class:"tab-pane"}],
              search:'',
              epsglist:{selected:'4326',data:[{code:'4326',name:"Enlem-Boylam WG84"},{code:'4917',name:"ITRF96 Y(m),X(m)"},{code:'3857',name:"Y(m),X(m)"}]},
              search2:'',
              epsglist2:{selected:'4326',data:[{code:'4326',name:"Enlem-Boylam WG84"},{code:'4917',name:"ITRF96 Y(m),X(m)"},{code:'3857',name:"Y(m),X(m)"}]},
              degree:"",
              units:{selected:"meters",data:[{name:"Metre",value:"meters"},{name:"Kilometre",value:"kilometers"},{name:"Mil",value:"miles"},{name:"Derece",value:"degrees"}]},
              distance:"",
              geojson:null,
              result:"",
              selectedPoint:null,
              pointInfo:"Nokta henüz seçilmedi",
              point1ID:"",
              geocoder:null,
              manual:false,
              data:[],
              manualLat:"",
              manualLon:"",
              GeneralGeojson:{type:'FeatureCollection',features:[]},
              selectedId:"",
              origin:null,
              center:[]
          }
      },
      open:function(){
        var that=this;
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#destinationpoint',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });

        if(localStorage.getItem('destinationcenter')!=null){
          var data2=localStorage.getItem('destinationcenter');
          if(data2.length>1){
              this.center=JSON.parse(data2);
          }else{
              this.center.push(JSON.parse(data2));
          }
        }

        if(localStorage.getItem('destinationdata')!=null){
            var dataa=localStorage.getItem('destinationdata');
            if(dataa.length>1){
                this.data=JSON.parse(dataa);
            }else{
                this.data.push(JSON.parse(dataa));
            }
        }

        if(localStorage.getItem('destinationjson')!=null){
            var datajson=localStorage.getItem('destinationjson');
            this.GeneralGeojson.features=JSON.parse(datajson);
            var color=GL.config.colors[10];
            var information={id:"destinationPoint",name:"Nokta Üretimi",type:'point',layers:["destinationPoint-point","destinationPoint-line","destinationPoint-polygon"]};
            GL.addGeojsonToLayer(that.GeneralGeojson,information.id,color,information);
            setTimeout(function(){
                var q=GL.layerbox.getLayerFeature("destinationPoint","destinationPoint-point");
                GL.map.setPaintProperty("destinationPoint-point", "circle-color",
                ["case",
                    ["==", ['number',"get","properties",["get","source"]],0],
                    "#04ff00",
                    "#ff0000"]);
            },100)  
        }

      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#destinationpoint');
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
        this.geojson=null;
        this.result="";
        this.manualLat="";
        this.manualLon="";
        this.method="";
        this.data=[];
        this.search="";
        this.distance="";
        this.degree="";
        this.epsglist.selected="4326";
        GL.draw.deleteAll();

        var source=GL.map.getSource('destinationPoint');
        if (source!=undefined){
          GL.removeLayerByID('destinationPoint');
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
            break;
          }
          case 'tab2':{
            $("#map").hide();
            break;
          }
          case 'tab3':{
            $("#map").hide();
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
    getPoints:function(buttonid){
        var that=this;
          if(buttonid==1){
              this.manual=false;
              this.method="location"
              GL.getUserLocation(function(callback){
                  var lat = turf.round(callback.coords.latitude,5);
                  var lon = turf.round(callback.coords.longitude,5);
                  var point = turf.point([lon,lat]);
                  that.geojson=point;

                  GL.bilgi("Durulan Nokta Ataması Yapıldı");
                  that.pointInfo=that.geojson.geometry.coordinates[1]+" "+that.geojson.geometry.coordinates[0];

                  //that.pointInfo="Konum Bilgisi Alındı";
              });
          }else if(buttonid==2){
            this.result="";
            this.method="map"
            this.manual=false;
            this.setPage('tab1');
            GL.draw.start("Point2","destinationPoint",function(geojson,layerId){
                that.setPage('tab2');
                if(that.point1ID!=""){
                    GL.draw.deleteById(that.point1ID);
                }

                that.geojson=geojson;
                that.point1ID=geojson.id;
                //that.pointInfo="Haritadan nokta alındı"
                that.pointInfo=that.geojson.geometry.coordinates[1].toFixed(5)+" "+that.geojson.geometry.coordinates[0].toFixed(5);
                GL.bilgi("Durulan Nokta Ataması Yapıldı");
            });
        }else if(buttonid==3){
            this.result="";
            this.manual=false;
            this.method="search"

            that.searchget();

            
        }else if(buttonid==4){
            this.result="";
            this.manual=true;
            this.method="manual"

            that.manualGet();
        }
    },
    calculatePoint:function(){
        var that=this;
        var point=this.geojson;
        if(point==null && this.method!="manual"){
            GL.uyari("Lütfen Durulan Noktayı Belirleyiniz");
        }else if(this.degree=="" || this.distance==""){
            GL.uyari("Lütfen Yatay Açı ve Uzaklık Değerlerini Giriniz");
        }else{
            var epsg=this.epsglist.selected;
            var distance = this.distance;
            var bearing = this.degree;
            var options = {units: this.units.selected};
            
            if(that.method=="manual"){
                if(this.manualLat !="" && this.manualLon!=""){
                    this.manual=false;
                    var epsg2=this.epsglist2.selected;
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
                        var id=Date.now();
                        var destination = turf.destination(result2.features[0], distance, bearing, options);
                        destination.properties.id=id;
                        destination.properties.source=0;

                        result2.features[0].properties={source:1};
                        that.origin=result2.features[0];

                        that.selectedId=id;
                        that.selectedPoint=destination;
      
                        if(that.epsglist.selected=="4326"){
                            that.result=parseFloat(destination.geometry.coordinates[0]).toFixed(5)+", "+parseFloat(destination.geometry.coordinates[1]).toFixed(5 );
                          }else {
                            that.result=parseFloat(destination.geometry.coordinates[0]).toFixed(3)+", "+parseFloat(destination.geometry.coordinates[1]).toFixed(3);
                          }
                    })
                }else{
                    GL.uyari("Koordinatları Giriniz");
                }
            }else{
                var destination = turf.destination(point, distance, bearing, options);
    
                this.registerProjection(function () {
                    var reader = new ol.format.GeoJSON();
                    var features = reader.readFeatures(destination,{
                            featureProjection: 'EPSG:'+epsg,
                            dataProjection: 'EPSG:4326'
                    });
        
                    var geojson2 = reader.writeFeatures(features);
                    var r=JSON.parse(geojson2);

                    var id=Date.now();
                    destination.properties.id=id;
                    destination.properties.source=0;
                    that.selectedId=id;
                    that.selectedPoint=destination;

                    point.properties.source=1;
                    that.origin=point;
                    
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
        if(that.geojson==null && this.method!="manual"){
            GL.uyari("Lütfen Durulan Nokta Belirleyiniz");
        }else if(that.selectedPoint==null){
            this.calculatePoint();
            this.getLayerName();
            setTimeout(function(){
                that.GeneralGeojson.features.push(that.selectedPoint);
                that.GeneralGeojson.features.push(that.origin);
                GL.savelocalstorage("destinationjson",that.GeneralGeojson.features);

                var source=GL.map.getSource('destinationPoint');
                if (source!=undefined){
                    GL.removeLayerByID('destinationPoint');
                    var color=GL.config.colors[10];
                    var information={id:"destinationPoint",name:"Nokta Üretimi",type:'point',layers:["destinationPoint-point","destinationPoint-line","destinationPoint-polygon"]};
                    GL.addGeojsonToLayer(that.GeneralGeojson,information.id,color,information);
                    setTimeout(function(){
                        GL.map.setPaintProperty("destinationPoint-point", "circle-color",
                        ["case",
                            ["==", ['number',"get","properties",["get","source"]],0],
                            "#04ff00",
                            "#ff0000"]);
                    },100)  
                    
                }else{
                    var color=GL.config.colors[10];
                    var information={id:"destinationPoint",name:"Nokta Üretimi",type:'point',layers:["destinationPoint-point","destinationPoint-line","destinationPoint-polygon"]};
                    GL.addGeojsonToLayer(that.GeneralGeojson,information.id,color,information);
                    setTimeout(function(){
                        GL.map.setPaintProperty("destinationPoint-point", "circle-color",
                        ["case",
                            ["==", ['number',"get","properties",["get","source"]],0],
                            "#04ff00",
                            "#ff0000"]);
                    },100)  
                }
            },100)
            
        }else{
            this.getLayerName();
            this.GeneralGeojson.features.push(this.selectedPoint);
            this.GeneralGeojson.features.push(this.origin);

            GL.savelocalstorage("destinationjson",this.GeneralGeojson.features);

            var source=GL.map.getSource('destinationPoint');
            if (source!=undefined){
                GL.removeLayerByID('destinationPoint');
                var color=GL.config.colors[10];
                var information={id:"destinationPoint",name:"Nokta Üretimi",type:'point',layers:["destinationPoint-point","destinationPoint-line","destinationPoint-polygon"]};
                GL.addGeojsonToLayer(this.GeneralGeojson,information.id,color,information);
                setTimeout(function(){
                    GL.map.setPaintProperty("destinationPoint-point", "circle-color",
                    ["case",
                        ["==", ['number',"get","properties",["get","source"]],0],
                        "#04ff00",
                        "#ff0000"]);
                },100)  
            }else{
                var color=GL.config.colors[10];
                var information={id:"destinationPoint",name:"Nokta Üretimi",type:'point',layers:["destinationPoint-point","destinationPoint-line","destinationPoint-polygon"]};
                GL.addGeojsonToLayer(this.GeneralGeojson,information.id,color,information);
                setTimeout(function(){
                    GL.map.setPaintProperty("destinationPoint-point", "circle-color",
                    ["case",
                        ["==", ['number',"get","properties",["get","source"]],0],
                        "#04ff00",
                        "#ff0000"]);
                },100)  
            }
        }
        
    },
    getLayerName:function(){
        var that=this;
        var name="Nokta-"+(this.data.length+1);
        mydialoginputs.$children[0].open({
            header:'Kayıt Bilgisi',
            inputs:[
              {id:'layername',type:'text',title:'Kayıt Adı',getvalue:name},
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
                    
                    if(that.center.length==0){
                      that.center.push(that.method);
                    }else if(that.center[that.center.length-1]!=that.method){
                      that.center.push(that.method);
                    }
                    GL.savelocalstorage("destinationcenter",that.center);
                    var p="merkez-"+that.center.length;

                    var save={id:that.selectedId ,pointt:p,name:layername, geometry:that.selectedPoint,coords:that.result,epsg:that.epsglist.selected};
                    that.data.push(save);

                    var reader = new ol.format.GeoJSON();
                    that.registerProjection2(function () {
                      for(var k=0;k<that.data.length;k++){
                        that.epsglist2.selected=that.data[k].epsg;
                          var features = reader.readFeatures(that.data[k].geometry,{
                                  featureProjection: 'EPSG:'+that.epsglist.selected,
                                  dataProjection: 'EPSG:'+that.data[k].epsg
                          });
                          var geojsonLast = reader.writeFeatures(features);
                          var r=JSON.parse(geojsonLast);

                          if(that.epsglist.selected=="4326"){
                            that.data[k].coords=r.features[0].geometry.coordinates[0].toFixed(5)+", "+r.features[0].geometry.coordinates[1].toFixed(5);
                          }else {
                            that.data[k].coords=r.features[0].geometry.coordinates[0].toFixed(3)+", "+r.features[0].geometry.coordinates[1].toFixed(3);
                          }   
                    }
                  })

                    GL.savelocalstorage("destinationdata",that.data);
                    //that.setPage('tab3');
                    that.clearSome();
                    GL.bilgi("Başarıyla Kayıt Edildi");
                  }
              }
              
        }});
    },
    showFeat:function(geojson){
        GL.zoomFeature(geojson);
        this.setPage('tab1');
    },
    deleteItem:function(item,val){
        var that=this;
        mydialog.$children[0].open({
            header:'Kayıt Silme',
            content:'Kaydı Silmek İstediğinize Emin Misiniz?',
            buttons:[
              {id:'evet',title:'Evet',callback:function(a){
                that.data.splice (val,1);
                for(var i=0;i<that.GeneralGeojson.features.length;i++){
                    if(that.GeneralGeojson.features[i].properties.id==item.id){
                        that.GeneralGeojson.features.splice(i,2);

                        GL.removeLayerByID("destinationPoint");
                        var color=GL.config.colors[10];
                        var information={id:"destinationPoint",name:"Nokta Üretimi",type:'point',layers:["destinationPoint-point","destinationPoint-line","destinationPoint-polygon"]};
                        GL.addGeojsonToLayer(that.GeneralGeojson,information.id,color,information);
                        setTimeout(function(){
                            var q=GL.layerbox.getLayerFeature("destinationPoint","destinationPoint-point");
                            GL.map.setPaintProperty("destinationPoint-point", "circle-color",
                            ["case",
                                ["==", ['number',"get","properties",["get","source"]],0],
                                "#04ff00",
                                "#ff0000"]);
                        },100) 
                        localStorage.removeItem('destinationjson');
                        GL.savelocalstorage("destinationjson",that.GeneralGeojson.features);
                    }
                }
                localStorage.removeItem('destinationdata');
                GL.savelocalstorage("destinationdata",that.data);
                GL.bilgi("Kayıt Silindi.");
              }}
            ],
            callback:function(a){
              GL.bilgi("Kayıt Silme İşlemi İptal Edilmiştir.");
          }});

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
    CreatePoi:function(){
        if(this.manualLon!="" && this.manualLat!=""){
            this.pointInfo="Nokta El İle Girildi";
        }
    },
    clearAll:function(){
        this.manual=false;
        this.selectedPoint=null;
        this.pointInfo="Nokta henüz seçilmedi";
        this.point1ID="";
        //this.geocoder=null;
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
        this.distance="";
        this.degree="";
    },
    clearSome:function(){
        this.manual=false;
        this.selectedPoint=null;
        this.pointInfo="Nokta henüz seçilmedi";
        this.point1ID="";
        this.geojson=null;
        this.result="";
        this.manualLat="";
        this.manualLon="";
        this.method="";
        this.search="";
        this.search2="";
        //this.epsglist.selected="4326";
        //this.epsglist2.selected="4326";
        this.distance="";
        this.degree="";
    },
    Download:function(){
        var layer=GL.layerbox.getSource("destinationPoint");
        layerdownload.$children[0].open(layer);
    },
    clearData:function(){
      var that=this;
        mydialog.$children[0].open({
            header:'Tablo Temizleme',
            content:'Bütün Verileri Silmek İstediğinizden Emin Misiniz?',
            buttons:[
              {id:'evet',title:'Evet',callback:function(a){
                that.data=[];
                GL.removeLayerByID("destinationPoint");
                localStorage.removeItem('destinationjson');
                localStorage.removeItem('destinationdata');
                localStorage.removeItem('destinationcenter');
                GL.bilgi("Veriler Temizlendi.");
              }}
            ],
            callback:function(a){
              GL.bilgi("İşlem İptal Edildi.");
          }});
    },
    manualGet:function(id){
      var that=this;
      setTimeout(function(){
        mydialoginputs.$children[0].open({
            header:'Koordinatlar',
            inputs:[
              {id:'lat',type:'number',title:'Enlem',getvalue:''},
              {id:'lon',type:'number',title:'boylam',getvalue:''}
            ],
            callback:function(a){
              if(a.type=="close"){
                GL.bilgi("İşlem İptal Edildi");
              }else if(a.type=="ok"){
                  mydialoginputs.$children[0].geocoder=null;
                  mydialoginputs.$children[0].modals=[];

                  that.manualLat=Number(a.values[0].getvalue).toFixed(5);
                  that.manualLon=Number(a.values[1].getvalue).toFixed(5);

                  that.pointInfo=that.manualLat+" "+that.manualLon;
                    
                  //that.coords1=Number(a.values[0].getvalue).toFixed(5)+", "+Number(a.values[1].getvalue).toFixed(5);
                  //that.shownGeom1=Number(a.values[0].getvalue).toFixed(5)+", "+Number(a.values[1].getvalue).toFixed(5);
              }
                
          }});
      },300)
    },
    searchget:function(id){
      var that=this;
      mydialoginputs.$children[0].open({
        header:'Konum Arama',
        inputs:[
          {id:'searching',type:'search',title:'Konum',getvalue:''},
        ],
        callback:function(a){
          if(a.type=="close"){
            GL.bilgi("İşlem İptal Edildi");
          }else if(a.type=="ok"){
              mydialoginputs.$children[0].modals=[];
              var result=a.values[0]; // geojson

              console.log(result);
              that.geojson= result.getvalue;
              console.log(that.geojson);
              that.pointInfo=that.geojson.place_name;
              //that.coords1=Number(result.getvalue.geometry.coordinates[1]).toFixed(5)+", "+Number(result.getvalue.geometry.coordinates[0]).toFixed(5);
              //that.shownGeom1=result.getvalue.text;
          }
          
      }});
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
                    // EPSG
                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="Epsgs" style="font-size:15 !important; padding-top:30px;">Kullanılacak Koordinat Sistemi Arama</label>'+
                            '<div class="form-group basic">'+
                                '<div class="input-group">'+
                                    '<input v-model="search" type="search" class="form-control" id="Epsgs" placeholder="EPSG Kodu">'+
                                    '<div class="input-group-append">'+
                                        '<button @click="searchEPSG" class="btn btn-outline-secondary" type="button">Ara</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="epsg1">Kullanılacak Koordinat Sistemini Seçiniz</label>'+
                            '<select class="form-control custom-select" v-model="epsglist.selected" id="epsg1" required>'+
                                '<option v-for="item in epsglist.data" :value="item.code">{{item.name}} - EPSG:{{item.code}}</option>'+
                            '</select>'+
                        '</div>'+
                    '</div>'+
                     // divider
                     '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    // Input point method

                    '<label class="label" for="methods">Durulan Nokta Girme Yöntemi</label>'+
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

                    // Manual

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


                    // Search
                    //'<div class="form-group boxed" id="searchLocation">'+
                    //    '<div class="input-group" id="geocoder4" style="border-style: solid; border-width: 2px; margin-top:10px;">'+
                    //    '</div>'+
                    //'</div>'+

                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<input type="text" class="form-control" id="destinfo" v-bind:value="pointInfo" readonly>'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    // divider
                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    // Inputs 
                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="destBearing">Yatay Açı Değeri</label>'+
                            '<input type="number" class="form-control" id="destBearing" v-model="degree" placeholder="Bakılan noktaya olan açı değeri">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="unitselection">Birim</label>'+
                            '<select v-model="units.selected" class="form-control custom-select" id="unitselection">'+
                                '<option v-for="unit in units.data" :value="unit.value">{{unit.name}}</option>'+
                            '</select>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="distancee">Mesafe</label>'+
                            '<input type="number" class="form-control" id="distancee" v-model="distance" placeholder="Bakılan noktaya olan mesafe">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    // divider
                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    // REsult
                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="destresult">Dönüştürülen Noktanın Sonucu</label>'+
                            '<input type="text" class="form-control" id="destresult" placeholder="Lütfen Nokta Oluştura Basınız" v-bind:value="result" readonly>'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    // Buttons
                    '<div class="form-group boxed" style="padding-left:15px;">'+
                        '<button type="button" @click="close" class="btn btn-secondary shadowed mr-1 mb-1" style="width:90px;">Temizle</button>'+
                        '<button type="button" @click="calculatePoint" class="btn btn-success shadowed mr-1 mb-1" style="width:90px;">Nokta Oluştur</button>'+
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

                    '<button @click="Download" type="button" class="btn btn-primary btn-block">İndir</button>'+
                    '<button @click="clearData" type="button" class="btn btn-primary btn-block">Verileri Temizle</button>'+
  
                    '<table class="table">' +
                        '<thead>' +
                            '<tr>' +
                                //'<th scope="col">#</th>' +
                                '<th scope="col">Adı</th>' +
                                '<th scope="col">Durulan Nokta</th>' +
                                '<th scope="col">koordinatlar</th>' +
                                //'<th scope="col">Göster</th>' +
                                '<th scope="col">Sil</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody v-for="(val,i) in data">' +
                            '<tr>' +
                                //'<td scope="row">{{i+1}}</td>'+
                                '<td>{{val.name}}</td>' +
                                '<td>{{val.pointt}}</td>' +
                                '<td @click="showFeat(val.geometry)">{{val.coords}}</td>' +
                                //'<td @click="showOnMap(val.geometry)">Göster</td>' +
                                '<td @click="deleteItem(val,i)">Sil</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>' +
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var destinationpoint = new Vue({ el: '#destinationpoint' });