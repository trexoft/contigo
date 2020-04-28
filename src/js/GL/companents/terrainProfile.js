Vue.component('terrainprofile', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:false,
              geojson:null,
              data:[],
              style:{
                light:{backgroundColor:'#efefef'},
                dark:{backgroundColor:'#333333'},
                active:{opacity:1,marginBottom:'15px'},
                passive:{opacity:0.5,marginBottom:'15px'},
                classActive:'btn btn-success square btn-block',
                classPassive:'btn btn-warning square btn-block',
              },
              grafikclass:"",
              tableclass:"",
              heights:null,
              features:[],
              piece:null,
              pages:{selected:'',data:['tab_profil_harita','tab_profil_grafik','tab_profil_liste']},
              drawingMode:false
          }
      },
      open:function(){
        this.onoff = true;
        this.setPage('tab_profil_harita');
        var source=GL.map.getSource('terrainprofile');
        if (source!=undefined){
          GL.removeLayerByID('terrainprofile');
          GL.draw.deleteAll();
        }
        this.drawline();
        
      },
      close:function(e){
        GL.titresim();
        var that=this;
        this.onoff = false;
        $("#map").show();
        var source=GL.map.getSource('terrainprofile');
        if (source!=undefined){
          GL.removeLayerByID('terrainprofile');
          that.pages.selected='tab_profil_harita';
          that.features = [];
          that.data = [];
          GL.draw.deleteAll();
        }
      },
      drawline:function(){
        var that=this;
        this.drawingMode=true;
        GL.draw.start("LineString","terrainprofile",function(geojson,layerId){
          that.drawingMode=false;
          that.geojson=geojson;
          that.CalculatePoints();
          
        });
      },
      CalculatePoints:function(){
        var that=this;
        if(this.geojson!==null){
          this.distance = turf.round(turf.length(this.geojson,{units:'meters'}),3);
          this.piece = parseInt(this.distance/100);
          var range=this.piece; 
          
            var start=0;
            var points = [];
            var i=0;
            while(start<=this.distance){
              var pnt = turf.along(this.geojson, start, {units: 'meters'});
              pnt.properties['elevation']=0;
              pnt.properties['start']=start;
              pnt.properties['id']=i;
              i++;
              points.push(pnt);
              start=start+parseInt(range,10);
            }
            var lastPoint = turf.point(this.geojson.geometry.coordinates[this.geojson.geometry.coordinates.length-1]);
            lastPoint.properties.elevation=0
            lastPoint.properties.start=this.distance;
            lastPoint.properties.id=i;
            points.push(lastPoint);
            this.allPoints = turf.featureCollection(points);
                
                /////////// 
            this.data=[];

            var dataSeries = { 
                type: "line",
                dataPoints:[]
            };

            GL.loading("Profil Çıkarılıyor");
            
            GL.elevation.getElevationFromGeoJSON(this.allPoints,function(geojson){
                    var layerCount=GL.map.getStyle().layers.length;
                    var color=GL.config.colors[layerCount%19];
                    that.heights=geojson;
                    var information={id:"terrainprofile",name:"Yüzey Profil Noktaları",type:'point',layers:["terrainprofile-point","terrainprofile-line","terrainprofile-polygon"]};
                    GL.addGeojsonToLayer(geojson,"terrainprofile",color,information);
                    geojson.features.map(function(point){
                        dataSeries.dataPoints.push({x:point.properties.start,y:point.properties.elevation,z:point.properties.id});
                    });
                    that.data.push(dataSeries);
                    $("#modal-terrain").modal('show');
                    that.setPage('tab_profil_grafik');
                    GL.loading(false);
                });
            }
      },
      setPage:function(pageId){
        var that = this;
        switch(pageId){
          case 'tab_profil_harita':{

            if(this.pages.selected=='tab_profil_liste'){
              this.tableclass = "tab-pane animated3 fadeOutRight active";
            }
            if(this.pages.selected=='tab_profil_grafik'){
              this.grafikclass = "tab-pane animated3 fadeOutRight active";
            }
                     
            setTimeout(function(){
              $("#map").show();
              that.pages.selected = pageId;   
            },300);
            break;
          }
          case 'tab_profil_grafik':{
            if(this.drawingMode==true){
              GL.uyari("Lütfen Çizimi Bitiriniz");
              this.pages.selected = 'tab_profil_harita';
              $("#map").show();
              return false;
            }
            $("#map").hide();
            
            if(this.pages.selected=='tab_profil_liste'){
              this.tableclass="tab-pane animated3 fadeOutRight active";
              setTimeout(function(){
                that.tableclass='tab-pane';
                that.grafikclass="tab-pane animated3 fadeInLeft active";
                that.pages.selected = pageId;
                that.showGraph();
              },300);
            }else{
              this.grafikclass="tab-pane animated3 fadeInRight active";
              this.tableclass="tab-pane";
              this.pages.selected = pageId;
              this.showGraph();
            }
            
            break;
          }
          case 'tab_profil_liste':{
            if(this.drawingMode==true){
              GL.uyari("Lütfen Çizimi Bitiriniz");
              this.pages.selected = 'tab_profil_harita';
              $("#map").show();
              return false;
            }
            $("#map").hide();
            if(this.pages.selected=='tab_profil_grafik'){
              this.grafikclass="tab-pane animated3 fadeOutLeft active";
              setTimeout(function(){
                that.tableclass="tab-pane animated3 fadeInRight active";
                that.grafikclass="tab-pane";
                that.pages.selected = pageId;
                that.features=that.heights.features;
              },300);
            }else{
              this.tableclass="tab-pane animated3 fadeInRight active";
              this.grafikclass="tab-pane";
              this.pages.selected = pageId;
              this.features=this.heights.features;
            }
           
            break;
          }
        }
        
      },
      drawchart:function(){
        var that=this;
        setTimeout(function(){
          var chart = new CanvasJS.Chart("lineelevationchart", {
            backgroundColor: "transparent",
            exportEnabled: true,
            animationEnabled: true,
            zoomEnabled: true,
            title:{
              text: "Yükseklik Profili",
              fontColor:GL.config.darkMode==true?'#efefef':'#666666'
            },
            axisY :{
              includeZero:false
            },
            data: that.data 
          });
          chart.render();
          that.setPage("tab_profil_grafik");
        },300);
        
      },
      showGraph:function(){
        var that=this;
        
        setTimeout(function(){
          //var x = document.getElementById("lineelevationchart");
          //x.style.display = "block";
          var chart = new CanvasJS.Chart("lineelevationchart", {
            backgroundColor: "transparent",
            exportEnabled: true,
            animationEnabled: true,
            zoomEnabled: true,
            title:{
              text: "Yükseklik Profili",
              fontColor:GL.config.darkMode==true?'#efefef':'#666666'
            },
            axisY :{
              includeZero:false
            },
            data: that.data 
          });
          chart.render();
        },100);
      },
      showFeature:function(obj2){
        //show feature on map
        this.setPage('tab_profil_harita');
        var layerCount=GL.map.getStyle().layers.length;
        var color=GL.config.colors[(layerCount-1)%19];
        setTimeout(function(){
          GL.zoomFeature(obj2);
          GL.map.setPaintProperty(
            'terrainprofile-point', 
            'circle-color',
            ['match', ['get', 'id'], obj2.id, '#f44336',color ]
          );
        },300)   
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
        '<div class="pageTitle">Yüzey Profili Oluşturma</div>'+
        '<div class="right"></div>'+
      '</div>'+


        //header
      '<div class="extraHeader p-0">'+
          '<ul class="nav nav-tabs lined" role="tablist">'+
          '<li class="nav-item">'+
                  '<a :class="pages.selected==\'tab_profil_harita\'?\'nav-link active\':\'nav-link\'" @click="setPage(\'tab_profil_harita\')" href="#">'+
                      'Harita'+
                  '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                  '<a :class="pages.selected==\'tab_profil_grafik\'?\'nav-link active\':\'nav-link\'" id="graph" @click="setPage(\'tab_profil_grafik\')" href="#">'+
                      'Grafik'+
                  '</a>'+
              '</li>'+
              '<li class="nav-item">'+
                  '<a :class="pages.selected==\'tab_profil_liste\'?\'nav-link active\':\'nav-link\'"  @click="setPage(\'tab_profil_liste\')" href="#">'+
                      'Nokta Listesi'+
                  '</a>'+
              '</li>'+
          '</ul>'+
      '</div>'+
    
          '<div id="appCapsule" class="extra-header-active" style="padding-top: 50px !important;">'+

            '<div class="tab-content mt-1">'+

             /* '<div class="tab-pane fade show active" id="draw" role="tabpanel">'+
                  '<div class="section full mt-1">'+
                  '</div>'+

              '</div>'+*/

              '<div :class="grafikclass" v-if="pages.selected==\'tab_profil_grafik\'">'+
                  '<div class="section full mt-1">'+
                      '<div class="wide-block pt-2 pb-2">'+
                        '<button style="margin-bottom:10px;" type="button" @click="open" class="btn btn-primary btn-block">Yeni Bir Çizim Başlat</button>'+
                        '<div id="lineelevationchart" style="zoom:100%; height:270px; width:100%;"></div>'+
                      '</div>'+
                  '</div>'+

              '</div>'+
              
              
              '<div :class="tableclass" v-if="pages.selected==\'tab_profil_liste\'" style="padding-top:-150px">'+

                      '<div class="section full mt-1">'+
                      '<div class="wide-block pt-2 pb-2">'+
                          '<button style="margin-bottom:10px;" type="button" @click="open" class="btn btn-primary btn-block">Yeni Bir Çizim Başlat</button>'+
                          '<table class="table">'+
                          '<thead>'+
                              '<tr>'+
                                  '<th scope="col">#</th>'+
                                  '<th scope="col">Mesafe (m)</th>'+
                                  '<th scope="col">Yükseklik (m)</th>'+
                                  '<th scope="col">Göster</th>'+
                              '</tr>'+
                          '</thead>'+
                          '<tbody v-for="(val,i) in features">'+
                                        '<tr val>'+
                                            '<th scope="row">{{i+1}}</th>'+
                                            '<td>{{val.properties.start}}</td>'+
                                            '<td>{{val.properties.elevation}}</td>'+
                                            '<td @click="showFeature(val)">Göster</td>'+
                                        '</tr>'+
                             '</tbody>'+
                      '</table>'+
                      '</div>'+
                '</div>'+
                  
            '</div>'+
          '</div>'+
    '</div>'
  
  });

var terrainprofile = new Vue({ el: '#terrainprofile' });