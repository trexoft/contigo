Vue.component('xyzbasemaps', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"",
              close:"Kapat",
              style:{
                light:{backgroundColor:'#efefef'},
                dark:{backgroundColor:'#333333'},
                active:{opacity:1,marginBottom:'15px'},
                passive:{opacity:0.5,marginBottom:'15px'},
                classActive:'btn btn-success square btn-block',
                classPassive:'btn btn-warning square btn-block',
              },
              type:{selected:'street',data:[
                {value:'street',text:'Sokak Haritası Altlıkları'},
                {value:'satellite',text:'Uydu Haritası Altlıkları'},
                {value:'special',text:'Özel Harita Altlıkları'},
                {value:'offline',text:'Çevrimdışı Haritalarım'},
                {value:'own',text:'Kendi Harita Altlıklarım'},
              ]},
              basemaps:{
                street:[
                  {
                    id:"googlestreet",
                    name:"Google Sokak Haritası",
                    type:'xyz',
                    url:[
                      "http://mts0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                      "http://mts1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                      "http://mts2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                      "http://mts3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    ],
                    img:"src/img/maps/google-street.png",
                    status:false
                  },
                  {
                    id:"googleterrain",
                    name:"Google Yükselti Haritası",
                    type:'xyz',
                    url:[
                      "http://mts0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
                      "http://mts1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
                      "http://mts2.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
                      "http://mts3.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                    ],
                    img:"src/img/maps/google-street.png",
                    status:false
                  },
                  {
                    id:"openstreetmap",
                    name:"OSM Haritası",
                    type:'xyz',
                    url:[
                      "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      "http://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    ],
                    img:"src/img/maps/osm.png",
                    status:false
                  },
                  {
                    id:"esristreet",
                    name:"ESRI Sokak Haritası",
                    type:'xyz',
                    url:[
                      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                    ],
                    img:"src/img/maps/esri-world-street.png",
                    status:false
                  },
                  {
                    id:"esristreet",
                    name:"ESRI Topoloji Haritası",
                    type:'xyz',
                    url:[
                      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    ],
                    img:"src/img/maps/esri-world-topo.png",
                    status:false
                  },
                  {
                    id:"cartodbvoyager",
                    name:"CartoDB Sokak Harita",
                    type:'xyz',
                    url:[
                      "https://a.basemaps.cartocdn.com/voyager/{z}/{x}/{y}.png",
                      "https://b.basemaps.cartocdn.com/voyager/{z}/{x}/{y}.png",
                      "https://c.basemaps.cartocdn.com/voyager/{z}/{x}/{y}.png",
                      "https://d.basemaps.cartocdn.com/voyager/{z}/{x}/{y}.png",
                    ],
                    img:"src/img/maps/cartodb-voyager.png",
                    status:false
                  }
                ],
                satellite:[
                  {
                    id:"googlehybrid",
                    name:"Google Uydu Haritası",
                    type:'xyz',
                    url:[
                      "http://mts0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                      "http://mts1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                      "http://mts2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                      "http://mts3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    ],
                    img:"src/img/maps/google-sattalite.png",
                    status:false
                  },
                  {
                    id:"esrisatellite",
                    name:"ESRI Uydu Haritası",
                    type:'xyz',
                    url:[
                      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    ],
                    img:"src/img/maps/esri-world-imagery.png",
                    status:false
                  }
                ],
                special:[
                  {
                    id:"topomap",
                    name:"Topolojik Harita",
                    type:'xyz',
                    url:[
                      "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
                      "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
                      "https://c.tile.opentopomap.org/{z}/{x}/{y}.png"
                    ],
                    img:"src/img/maps/osm-topo.png",
                    status:false
                  },
                  {
                    id:"toner",
                    name:"Toner Siyah Beyaz",
                    type:'xyz',
                    url:[
                      "https://stamen-tiles-a.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
                      "https://stamen-tiles-b.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
                      "https://stamen-tiles-c.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
                      "https://stamen-tiles-d.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
                    ],
                    img:"src/img/maps/osm-toner.png",
                    status:false
                  },
                  {
                    id:"tonerlight",
                    name:"Toner Açık Siyah Beyaz",
                    type:'xyz',
                    url:[
                      "https://stamen-tiles-a.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png",
                      "https://stamen-tiles-b.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png",
                      "https://stamen-tiles-c.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png",
                      "https://stamen-tiles-d.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png"
                    ],
                    img:"src/img/maps/osm-toner-lite.png",
                    status:false
                  },
                  {
                    id:"stamenlabel",
                    name:"Harita Etiketleri",
                    type:'xyz',
                    url:[
                      "https://stamen-tiles-a.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}.png",
                      "https://stamen-tiles-b.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}.png",
                      "https://stamen-tiles-c.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}.png",
                      "https://stamen-tiles-d.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}.png"
                    ],
                    img:"src/img/maps/osm-toner-lite.png",
                    status:false
                  },
                  {
                    id:"esriworldgray",
                    name:"ESRI Gri Harita",
                    type:'xyz',
                    url:[
                      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                    ],
                    img:"src/img/maps/esri-world-gray-canvas.png",
                    status:false
                  },
                  {
                    id:"mtbmap",
                    name:"MTB Topolojik Haritası",
                    type:'xyz',
                    url:[
                      "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png"
                    ],
                    img:"src/img/maps/mtb-map.png",
                    status:false
                  },
                  {
                    id:"cartodbpositron",
                    name:"CartoDB Pozitron Haritası",
                    type:'xyz',
                    url:[
                      "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                      "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                      "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                      "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                    ],
                    img:"src/img/maps/cartodb-positron.png",
                    status:false
                  },
                  {
                    id:"cartodbdark",
                    name:"CartoDB Karanlık Harita",
                    type:'xyz',
                    url:[
                      "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                      "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                      "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                      "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                    ],
                    img:"src/img/maps/cartodb-dark.png",
                    status:false
                  },
                  {
                    id:"hikebikehillshade",
                    name:"Hikebike Hillshade Haritası",
                    type:'xyz',
                    url:[
                      "https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png"
                    ],
                    img:"src/img/maps/hikebike-hillshade.png",
                    status:false
                  }
                ]
              }
          }
      },
      open:function(type){
        var that = this;
        $("#xyzBasemapsModal").modal('show');
        this.type.selected = type || 'street';
        var findBase = this.type.data.find(function(a){if(a.value==type){
          return true;
        }});
        this.header = findBase.text; 
        this.$forceUpdate();


      },
      close:function(e){
        $("#xyzBasemapsModal").modal('hide');
      },
      changeBasemap:function(item){
        console.log(item);
        GL.addXYZLayer(item.id,item.url,item.name,0,22);
        $("#xyzBasemapsModal").modal('hide');
        GL.bilgi("Altlık harita değiştirildi");
      }
  },
  template:
  '<div  class="modal fade modalbox" id="xyzBasemapsModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title">{{header}}</h5>'+
                        '<a @click="close" href="javascript:;" style="color:#8bc34a;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" >'+
                        '<div class="wide-block p-5" :style="GL.config.darkMode==true ? style.dark:style.light">'+

                            '<div class="row">'+
                              '<div v-for="item in basemaps[type.selected]" class="col-12 mb-5">'+
                                '<div class="card">'+
                                '<div class="card-header">{{item.name}}</div>'+
                                '<div class="card-body" style="padding: 0 !important;">'+
                                  '<img style="border-radius: 0px !important; width: 100%;" :src="item.img" class="card-img-top" alt="image">'+
                                '</div>'+
                                '<div class="card-footer" style="padding: 0 !important; border: none;">'+
                                  '<button type="button" @click="changeBasemap(item)" :class="item.status!==true?style.classActive:style.classPassive">{{item.status!==true?GL.lang.general.use:GL.lang.general.active}}</button>'+
                                '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
        
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var xyzBasemaps = new Vue({ el: '#xyzBasemaps' });