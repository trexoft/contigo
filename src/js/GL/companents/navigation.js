Vue.component('findnavigation', {
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
              header:"Navigasyon",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Güzergah',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Geçmiş',active:false,class:"tab-pane"}],
              geojson1:null,
              geojson2:null,
              coords1:"",
              coords2:"",
              shownGeom1:"",
              shownGeom2:"",
              waypoints:[{id:"w1",value:"",number:1,showvalue:""}],
              method:"driving"
          }
      },
      open:function(){
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#findnavigation',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#findnavigation');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        $("#map").show();
        this.coords1="";
        this.coords2="";
        this.shownGeom1="";
        this.shownGeom2="";
        this.waypoints=[{id:"w1",value:"",number:1,showvalue:""}];
        this.method="driving";
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
      getLocation:function(id){
          var that=this
        mydialog.$children[0].open({
            header:'Yer Seçim Yöntemi',
            content:'Yer seçim metodunu seçiniz',
            buttons:[
              {id:'location',title:'Konum Al',callback:function(a){
                GL.getUserLocation(function(callback){
                    var lat = turf.round(callback.coords.latitude,5);
                    var lon = turf.round(callback.coords.longitude,5);
                    //var point = turf.point([lon,lat]);
  
                    if(id==1){
                        that.coords1=lat+", "+lon;
                        that.shownGeom1=lat+", "+lon;
                    }else if(id==2){
                        that.coords2=lat+", "+lon;
                        that.shownGeom2=lat+", "+lon;
                    }else{
                        for(var i=0;i<that.waypoints.length;i++){
                            if(that.waypoints[i].id==id){
                                  that.waypoints[i].value=lat+", "+lon;
                                  that.waypoints[i].showvalue=lat+", "+lon;
                            }
                        }
                    }
                });
              }},
              {id:'map',title:'Haritadan nokta al',callback:function(a){
                that.setPage("tab1");
                that.fromMap(id);
              }},
              {id:'manual',title:'El ile nokta gir',callback:function(a){
                  console.log(a);
                  mydialog.$children[0].modals=[];
                  that.manual(id);
              }},
              {id:'search',title:'Yer ara',callback:function(a){
                  console.log(a);
                  mydialog.$children[0].modals=[];
                  that.search(id);
              }}
            ]
        });  
      },
      fromMap:function(id){
          var that=this;
        GL.draw.start("Point2","destinationPointt",function(geojson,layerId){
            that.setPage("tab2");
            if(id==1){
              that.coords1=geojson.geometry.coordinates[1].toFixed(5)+", "+geojson.geometry.coordinates[0].toFixed(5);
              that.shownGeom1=geojson.geometry.coordinates[1].toFixed(5)+", "+geojson.geometry.coordinates[0].toFixed(5);
            }else if(id==2){
              that.coords2=geojson.geometry.coordinates[1].toFixed(5)+", "+geojson.geometry.coordinates[0].toFixed(5);
              that.shownGeom2=geojson.geometry.coordinates[1].toFixed(5)+", "+geojson.geometry.coordinates[0].toFixed(5);
            }else{
                for(var i=0;i<that.waypoints.length;i++){
                    if(that.waypoints[i].id==id){
                        that.waypoints[i].value=geojson.geometry.coordinates[0].toFixed(5)+", "+geojson.geometry.coordinates[1].toFixed(5);
                        that.waypoints[i].showvalue=geojson.geometry.coordinates[0].toFixed(5)+", "+geojson.geometry.coordinates[1].toFixed(5);
                    }
                }
            }
            
        });
      },
      manual:function(id){
          var that=this;
        setTimeout(function(){
            mydialoginputs.$children[0].open({
                header:'Deneme1',
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
                      if(id==1){
                        that.coords1=Number(a.values[0].getvalue).toFixed(5)+", "+Number(a.values[1].getvalue).toFixed(5);
                        that.shownGeom1=Number(a.values[0].getvalue).toFixed(5)+", "+Number(a.values[1].getvalue).toFixed(5);  
                    }else if(id==2){
                        that.coords2=Number(a.values[0].getvalue).toFixed(5)+", "+Number(a.values[1].getvalue).toFixed(5);
                        that.shownGeom2=Number(a.values[0].getvalue).toFixed(5)+", "+Number(a.values[1].getvalue).toFixed(5);
                    }else{
                        for(var i=0;i<that.waypoints.length;i++){
                            if(that.waypoints[i].id==id){
                                that.waypoints[i].value=Number(a.values[1].getvalue).toFixed(5)+", "+Number(a.values[0].getvalue).toFixed(5);
                                that.waypoints[i].showvalue=Number(a.values[1].getvalue).toFixed(5)+", "+Number(a.values[0].getvalue).toFixed(5);
                            }
                        }
                    }
                  }
                  
            }});
        },300)
        
      },
      search:function(id){
          var that=this;
        mydialoginputs.$children[0].open({
            header:'Yer Arama',
            inputs:[
              {id:'searching',type:'search',title:'Konum',getvalue:''},
            ],
            callback:function(a){
              if(a.type=="close"){
                GL.bilgi("İşlem İptal Edildi");
              }else if(a.type=="ok"){
                  mydialoginputs.$children[0].modals=[];
                  var result=a.values[0]; // geojson

                  if(id==1){
                    that.coords1=Number(result.getvalue.geometry.coordinates[1]).toFixed(5)+", "+Number(result.getvalue.geometry.coordinates[0]).toFixed(5);
                    that.shownGeom1=result.getvalue.text;
                  }else if(id==2){
                    that.coords2=Number(result.getvalue.geometry.coordinates[1]).toFixed(5)+", "+Number(result.getvalue.geometry.coordinates[0]).toFixed(5);
                    that.shownGeom2=result.getvalue.text;
                  }else{
                    for(var i=0;i<that.waypoints.length;i++){
                        if(that.waypoints[i].id==id){
                            that.waypoints[i].value=Number(result.getvalue.geometry.coordinates[0]).toFixed(5)+", "+Number(result.getvalue.geometry.coordinates[1]).toFixed(5);
                            that.waypoints[i].showvalue=result.getvalue.text;
                        }
                    }
                }
              }
              
        }});
      },
      sendRequest:function(){
          var that=this;
          if(this.coords1=="" || this.coords2==""){
            GL.uyari("Konumları belirleyiniz");
          }else{
            var loc_a=this.coords1.split(",");
            var loc_b=this.coords2.split(",");
            var cor1_lat=loc_a[1]; // lon
            var cor1_lon=loc_a[0];  //lat
            var cor2_lat=loc_b[1];
            var cor2_lon=loc_b[0];
            var ways="";
            for(var j=0;j<this.waypoints.length;j++){
                if(this.waypoints[j].value!=""){
                    ways=ways+this.waypoints[j].value+";";
                }
            }
            var methodd=this.method;
            if(ways!=";"){
                var url="https://api.mapbox.com/directions/v5/mapbox/"+methodd+"/"+cor1_lat+","+cor1_lon+";"+ways+cor2_lat+","+cor2_lon+".json?geometries=polyline&steps=true&overview=full&language=tr&access_token="+GL.config.mapboxglAccessToken;
            }else{
                var url="https://api.mapbox.com/directions/v5/mapbox/"+methodd+"/"+cor1_lat+","+cor1_lon+";"+cor2_lat+","+cor2_lon+".json?geometries=polyline&steps=true&overview=full&language=tr&access_token="+GL.config.mapboxglAccessToken;
            }
            
            $.get(url, function(data, status){
              console.log(data);
              that.setPage("tab1");
            });
          }
          
      },
      addwaypoint:function(){
          this.waypoints.push({id:"w"+this.waypoints.length+1,value:"",number:this.waypoints.length});
      },
      removewaypoint:function(i){
        //this.waypoints.splice(i,1);
        this.waypoints.splice(-1,1);
      },
      changeMethod:function(method){
        this.method=method;
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

                    
                    '<div class="form-group boxed">'+
                        '<div style="font-size: 17px; font-weight:600; padding-left:90px;">Başlangıç Noktası</div>'+
                        '<div class="input-group mb-3">'+
                            '<div class="input-group-prepend">'+
                            '<span class="btn btn-icon btn-primary mr-1 mb-1">A</span>'+
                            '</div>'+
                                '<input v-model="shownGeom1" id="input1" type="text" class="form-control" readonly>'+
                                '<div class="input-group-append">'+
                                '<button type="button" @click="getLocation(1)" class="btn btn-icon btn-info mr-1 mb-1"><ion-icon name="search-outline"></ion-icon></button>'+
                                '</div>'+
                        '</div>'+
                    '</div>'+

                    // waypoints
                    '<div class="form-group boxed">'+
                    '<div style="font-size: 17px; font-weight:600; padding-left:90px;">Ara Noktalar</div>'+
                        '<div v-for="(item,i) in waypoints" class="input-group mb-3" style="width:90%; float:right;">'+
                            '<div class="input-group-prepend">'+
                            '<span v-if="item.id==\'w1\'" class="btn btn-icon btn-primary mr-1 mb-1">W</span>'+
                            '<span v-if="item.id!=\'w1\'" class="btn btn-icon btn-primary mr-1 mb-1">{{item.number}}</span>'+
                            '</div>'+
                            
                            '<input v-model="item.showvalue" type="text" class="form-control" readonly>'+
                            '<div class="input-group-append">'+
                            '<button v-if="item.id==\'w1\'" type="button" @click="addwaypoint" class="btn btn-icon btn-success mr-1 mb-1"><ion-icon name="add-outline"></ion-icon></button>'+
                            '<button v-if="item.id!=\'w1\'" type="button" @click="removewaypoint(i)" class="btn btn-icon btn-warning mr-1 mb-1"><ion-icon name="remove-outline"></ion-icon></button>'+
                            '</div>'+
                            '<div class="input-group-append">'+
                            '<button type="button" @click="getLocation(item.id)" class="btn btn-icon btn-info mr-1 mb-1"><ion-icon name="search-outline"></ion-icon></button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+

                    /////
                    '<div class="form-group boxed">'+
                    '<div style="font-size: 17px; font-weight:600; padding-left:90px;">Bitiş Noktası</div>'+
                        '<div class="input-group mb-3">'+
                            '<div class="input-group-prepend">'+
                            '<span class="btn btn-icon btn-primary mr-1 mb-1">B</span>'+
                            '</div>'+
                            
                            '<input v-model="shownGeom2" type="text" class="form-control" readonly>'+
                            '<div class="input-group-append">'+
                            '<button type="button" @click="getLocation(2)" class="btn btn-icon btn-info mr-1 mb-1"><ion-icon name="search-outline"></ion-icon></button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+

                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+
 
                    // MEthod
                    '<div class="form-group boxed">'+
                        '<div style="font-size: 17px; font-weight:600; padding-left:80px;">Navigasyon Metodu</div><br>'+
                        '<div class="btn-group btn-group-toggle" data-toggle="buttons" style="padding-left:50px;">'+
                            '<label class="btn btn-outline-primary active">'+
                                '<input type="radio" name="options" id="option1" @click="changeMethod(\'driving\')">Araba'+
                            '</label>'+
                            '<label class="btn btn-outline-primary">'+
                                '<input type="radio" name="options" id="option2" @click="changeMethod(\'walking\')"> Yürüyüş'+
                            '</label>'+
                            '<label class="btn btn-outline-primary">'+
                                '<input type="radio" name="options" id="option3" @click="changeMethod(\'cycling\')"> Bisiklet'+
                            '</label>'+
                        '</div>'+
                    '</div>'+
                    ////////////////
                    '<div class="form-group boxed">'+
                        '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+
                        '<div class="btn-group" style="padding-left:20px;">'+
                            '<button type="button" @click="sendRequest" class="btn btn-primary">Güzergah Bul</button>'+
                            '<button type="button" class="btn btn-primary">Navigasyonu Başlat</button>'+
                        '</div>'+
                    '</div>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="section-title">Tab 3</div>'+
                '<div class="wide-block pt-2 pb-2">'+
  
                  'tab3'+
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var findnavigation = new Vue({ el: '#findnavigation' });