Vue.component('distancecalculate', {
	data:function(){
		return this.setDefault();
    },
  methods:{
      setDefault:function(){
          return {
              onoff:false,
              closebutton:false,
              tab1class:"",
              tab2class:"",
              tab3class:"",
              header:"Semt ve Uzunluk Hesaplama",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Noktalar',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Ölçümler',active:false,class:"tab-pane"}],
              selectedPoint:"",
              manual:false,
              point1:null,
              point2:null,
              point1Name:"1.nokta seçilmedi",
              point2Name:"2.nokta seçilmedi",
              point1ID:"",
              point2ID:"",
              manualLat:"",
              manualLon:"",
              saveName:"",
              distanceUnit:"meters",
              data:[],
              distanceResult:"",
              angleResult:"",
              searchJson:null,
              geocoder:null
          }
      },
      open:function(){
        var that=this;
        this.onoff = true;
        this.selectedPoint=""
        this.data=[];
        this.setPage('tab2');
        GL.touch.on('#distancecalculate',function(event,direction){
          that.setPageDirection(direction);
        });
        if(localStorage.getItem('distance')!=null){
            var dataa=localStorage.getItem('distance');
            if(data.length>1){
                this.data=JSON.parse(dataa);
            }else{
                this.data.push(JSON.parse(dataa));
            }
        }
        
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#distancecalculate');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });

        this.data=[];
        this.point1=null;
        this.point2=null;
        this.point1ID="";
        this.point2ID="";
        this.manualLat="";
        this.manualLon="";
        this.point1Name="1.nokta seçilmedi";
        this.point2Name="2.nokta seçilmedi";
        this.manual=false;
        this.selectedPoint="";
        this.saveName="";
        this.distanceResult="";
        GL.draw.deleteAll();
        $("#map").show();

        var source=GL.map.getSource('calculateDistance');
        if (source!=undefined){
          GL.removeLayerByID('calculateDistance');
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
      getPoints:function(buttonid){
          var that=this;
          if(this.selectedPoint==""){
              GL.uyari("Lütfen nokta seçiniz!");
          }else{
            if(buttonid==1){
                this.manual=false;
                GL.getUserLocation(function(callback){
                    var lat = turf.round(callback.coords.latitude,5);
                    var lon = turf.round(callback.coords.longitude,5);
                    var point = turf.point([lon,lat]);
                    if(that.selectedPoint=="point1"){
                        that.point1=point;
                        //that.point1Name="Konum bilgisi alındı"
                        that.point1Name=that.point1.geometry.coordinates[1]+" "+that.point1.geometry.coordinates[0];
                    }else if(that.selectedPoint=="point2"){
                        that.point2=point;
                        //that.point2Name="Konum bilgisi alındı"
                        that.point2Name=that.point2.geometry.coordinates[1]+" "+that.point2.geometry.coordinates[0];
                    }
                });
            }else if(buttonid==2){
                this.manual=false;
                this.setPage('tab1');
                GL.draw.start("Point2","distancecalculate2",function(geojson,layerId){
                    that.setPage('tab2');
                    if(that.selectedPoint=="point1"){
                        if(that.point1ID!=""){
                            GL.draw.deleteById(that.point1ID);
                        }
                        that.point1=geojson;
                        that.point1ID=geojson.id;
                        //that.point1Name="Haritadan nokta seçildi"
                        that.point1Name=that.point1.geometry.coordinates[1].toFixed(5)+" "+that.point1.geometry.coordinates[0].toFixed(5);
                    }else if(that.selectedPoint=="point2"){
                        if(that.point2ID!=""){
                            GL.draw.deleteById(that.point2ID);
                        }
                        that.point2=geojson;
                        that.point2ID=geojson.id;
                        //that.point2Name="Haritadan nokta seçildi"
                        that.point2Name=that.point2.geometry.coordinates[1].toFixed(5)+" "+that.point2.geometry.coordinates[0].toFixed(5);
                    }
                });
            }else if(buttonid==3){
                this.manual=false;
                this.searchget();
                
            }else if(buttonid==4){
                this.manual=true;
                this.manualGet();
            }
          }
        
      },
      manualchange:function(){
          var that=this;
          if(this.manualLat !="" && this.manualLon!=""){
            this.manual=false;
            var lat=this.manualLat;
            var lon=this.manualLon;
            var point = turf.point([lon,lat]);
            if(that.selectedPoint=="point1"){
                that.point1=point;
                //that.point1Name="Nokta el ile atıldı"
                console.log(point);
                that.point1Name=Number(that.point1.geometry.coordinates[1]).toFixed(5)+" "+Number(that.point1.geometry.coordinates[0]).toFixed(5);
            }else if(that.selectedPoint=="point2"){
                that.point2=point;
                //that.point2Name="Nokta el ile atıldı"
                that.point2Name=Number(that.point2.geometry.coordinates[1]).toFixed(5)+" "+Number(that.point2.geometry.coordinates[0]).toFixed(5);
            }
          }else{
              GL.uyari("Enlem ve Boylam Giriniz");
          }
      },
      calculateDistance:function(){
        if(this.point1==null || this.point2==null){
            GL.uyari("Lütfen Noktaları Belirleyin");
        }else{
            var from=this.point1;
            var to=this.point2;
            var options = {units: this.distanceUnit};
            var distance = turf.distance(from, to, options).toFixed(3);
            var bearing = turf.bearing(from, to);

            var coords1=this.point1.geometry.coordinates;
            var coords2=this.point2.geometry.coordinates;
            var line = turf.lineString([coords1,coords2]);

            if(this.distanceUnit=="meters"){
                var unit="m"
            }else if(this.distanceUnit=="kilometers"){
                var unit="km"
            }else if(this.distanceUnit=="degrees"){
                var unit="dg"
            }else if(this.distanceUnit=="miles"){
                var unit="mil"
            }else if(this.distanceUnit=="radians"){
                var unit="rd"
            }

            if(this.distanceUnit=="meters" && distance>999){
                distance=(distance/1000).toFixed(3);
                unit ="km"
            }

            this.distanceResult=distance+" "+unit;
            this.angleResult=bearing.toFixed(3)+" derece";
        }
      },
      saveDistance:function(){
        var control=this.saveControl();
        if (control==true){
            GL.uyari("Aynı İsimde Başka Kayıt Mevcut");
        }else if(this.point1==null || this.point2==null){
            GL.uyari("Lütfen Noktaları Belirleyin");
        }else if(this.saveName==""){
            GL.uyari("Lütfen Kayıt Adını Giriniz");
        }else{
            var from=this.point1;
            var to=this.point2;
            var options = {units: this.distanceUnit};
            var distance = turf.distance(from, to, options).toFixed(3);
            var bearing = turf.bearing(from, to);

            var coords1=this.point1.geometry.coordinates;
            var coords2=this.point2.geometry.coordinates;
            var line = turf.lineString([coords1,coords2]);

            if(this.distanceUnit=="meters"){
                var unit="m"
            }else if(this.distanceUnit=="kilometers"){
                var unit="km"
            }else if(this.distanceUnit=="degrees"){
                var unit="dg"
            }else if(this.distanceUnit=="miles"){
                var unit="mil"
            }else if(this.distanceUnit=="radians"){
                var unit="rd"
            }

            if(this.distanceUnit=="meters" && distance>999){
                distance=(distance/1000).toFixed(3);
                unit ="km"
            }

            var angle=bearing.toFixed(3)+"<sup>o</sup>";

            var d={name:this.saveName, geometry:line, geometry2:this.point1,geometry3:this.point2 ,bearing:angle,distance:distance, unit:unit};
            this.data.push(d);
            GL.savelocalstorage("distance",this.data);

            this.setPage('tab3');
            GL.bilgi("Başarıyla Eklendi");
        }
      },
      showOnMap:function(geojson,geojson2,geojson3){
        GL.loading("Geometri yükleniyor");
        var source=GL.map.getSource('calculateDistance');
        if (source!=undefined){
          GL.removeLayerByID('calculateDistance');
        }

        var bbox = turf.bbox(geojson);
        GL.zoomToBbox(bbox);

        geojson2.id=1;
        geojson3.id=2;

        GL.draw.deleteAll();
        var newgeojson={type:'FeatureCollection','features':[]};
        newgeojson.features.push(geojson);
        newgeojson.features.push(geojson2);
        newgeojson.features.push(geojson3);

        var color=GL.config.colors[10];
        var information={id:"calculateDistance",name:"Uzaklık Hesabı",type:'collection',layers:["calculateDistance-point","calculateDistance-line","calculateDistance-polygon"]};
        GL.addGeojsonToLayer(newgeojson,"calculateDistance",color,information);

        this.setPage('tab1');

        setTimeout(function(){
            GL.map.setPaintProperty('calculateDistance-line','line-color',"#353fb5");
            GL.map.setPaintProperty("calculateDistance-point", "circle-color",
            ["case",
                ["==", ["id"], 1],
                "#04ff00",
                "#ff0000"]);
            GL.loading(false);
        },100)  
        
      },
      deleteItem:function(val){
        this.data.splice (val,1);
        localStorage.removeItem('distance');
        GL.savelocalstorage("distance",this.data);
      },
      clearAll:function(){
        this.data=[];
        this.point1=null;
        this.point2=null;
        this.point1ID="";
        this.point2ID="";
        this.manualLat="";
        this.manualLon="";
        this.point1Name="1.nokta seçilmedi";
        this.point2Name="2.nokta seçilmedi";
        this.manual=false;
        this.selectedPoint="";
        this.saveName="";
        this.distanceResult="";
        GL.draw.deleteAll();
      },
      saveControl:function(){
        for(var i=0; i<this.data.length;i++){
            if(this.data[i].name==this.saveName){
                return true
            }
        }
      },
      addSearchLoc:function(){
          var that=this;
          if(this.searchJson==null){
            GL.uyari("Öncelikle Konum Seçiniz");
          }else{
            if(that.selectedPoint=="point1"){
                that.point1=this.searchJson;
                //that.point1Name="Konum araması yapıldı"
                console.log(that.point1);
                that.point1Name=that.point1.place_name;
            }else if(that.selectedPoint=="point2"){
                that.point2=this.searchJson;
                //that.point2Name="Konum araması yapıldı"
                that.point2Name=that.point2.place_name;
            }
          }
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
                    that.manualchange();
                    //that.pointInfo=that.manualLat+" "+that.manualLon;
                      
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
                that.searchJson= result.getvalue;
                
                that.addSearchLoc();
                //that.pointInfo=that.geojson.geometry.coordinates[1]+" "+that.geojson.geometry.coordinates[0];
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

                    '<label class="label" style="padding-top:30px;" for="methods">Nokta Seçme Yöntemi</label>'+
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

                    '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="point1">Nokta 1</label>'+
                                '<div class="custom-control custom-radio">'+
                                    '<input type="radio" @click="selectedPoint=\'point1\';" id="option1" name="customRadioList" class="custom-control-input">'+
                                    '<label class="custom-control-label" for="option1">{{point1Name}}</label>'+
                                '</div>'+
                            '</div>'+
                    '</div>'+

                    '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="point2">Nokta 2</label>'+
                                '<div class="custom-control custom-radio">'+
                                    '<input type="radio" @click="selectedPoint=\'point2\';" id="option2" name="customRadioList" class="custom-control-input">'+
                                    '<label class="custom-control-label" for="option2">{{point2Name}}</label>'+
                                '</div>'+
                            '</div>'+
                    '</div>'+

                    // divider
                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    '<div class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="distanceunit">Ölçüm Birimi</label>'+
                            '<select v-model="distanceUnit" class="form-control custom-select" id="distanceunit">'+
                                '<option value="meters">Metre</option>'+
                                '<option value="kilometers">Kilometre</option>'+
                                '<option value="miles">Mil</option>'+
                                '<option value="degrees">Derece</option>'+
                                '<option value="radians">Radyan</option>'+
                            '</select>'+
                        '</div>'+
                    '</div>'+
                        
                        // uzunluk hesap sonucu

                        '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="distanceresult">Uzunluk Sonucu</label>'+
                                '<input type="text" class="form-control" id="distanceresult" v-bind:value="distanceResult" placeholder="Hesapla Tuşuna Basınız" readonly>'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
                        // açı hesap sonucu

                        '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="distanceresult">Semt Açısı</label>'+
                                '<input type="text" class="form-control" id="distanceresult" v-bind:value="angleResult" placeholder="Hesapla Tuşuna Basınız" readonly>'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed">'+
                          '<div class="input-wrapper">'+
                            '<label class="label" for="namee">Kayıt Adı</label>'+
                            '<input type="text" v-model="saveName" class="form-control" id="namee" placeholder="Kayıt adını giriniz">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                          '</div>'+
                        '</div>'+

                        // divider
                        '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+
                        // buttons
                        '<div class="form-group boxed" style="padding-left:15px;">'+
                            '<button type="button" @click="clearAll" class="btn btn-secondary shadowed mr-1 mb-1" style="width:90px;">Temizle</button>'+
                            '<button type="button" @click="calculateDistance" class="btn btn-success shadowed mr-1 mb-1" style="width:90px;">Hesapla</button>'+
                            '<button type="button" @click="saveDistance" class="btn btn-primary shadowed mr-1 mb-1" style="width:90px;">Kayıt</button>'+
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
                                '<th scope="col">#</th>' +
                                '<th scope="col">Adı</th>' +
                                '<th scope="col">Uzunluk</th>' +
                                '<th scope="col">Semt Açısı</th>' +
                                '<th scope="col">Sil</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody v-for="(val,i) in data">' +
                            '<tr>' +
                                '<td scope="row">{{i+1}}</td>'+
                                '<td @click="showOnMap(val.geometry,val.geometry2,val.geometry3)">{{val.name}}</td>' +
                                '<td>{{val.distance}} {{val.unit}}</td>' +
                                '<td v-html="val.bearing">{{val.bearing}}</td>' +
                                //'<td @click="showOnMap(val.geometry,val.geometry2,val.geometry3)">Göster</td>' +
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

var distancecalculate = new Vue({ el: '#distancecalculate' });