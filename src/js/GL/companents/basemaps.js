Vue.component('basemaps', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              style:{
                light:{backgroundColor:'#efefef'},
                dark:{backgroundColor:'#333333'},
                active:{opacity:1,marginBottom:'15px'},
                passive:{opacity:0.5,marginBottom:'15px'},
                classActive:'btn btn-success square btn-block',
                classPassive:'btn btn-warning square btn-block',
              },
              basemaps:[
                {
                  id:'streets-v11',
                  title:'Sokak Haritası',
                  img:'./src/img/maps/street.png',
                  url:'mapbox://styles/mapbox/streets-v11',
                  active:true
                },
                {
                  id:'light-v10',
                  title:'Parlak Harita',
                  img:'./src/img/maps/light.png',
                  url:'mapbox://styles/mapbox/light-v10',
                  active:false
                },
                {
                  id:'dark-v10',
                  title:'Koyu Harita',
                  img:'./src/img/maps/dark.png',
                  url:'mapbox://styles/mapbox/dark-v10',
                  active:false
                },
                {
                  id:'outdoors-v11',
                  title:'Outdoor Harita',
                  img:'./src/img/maps/outdoor.png',
                  url:'mapbox://styles/mapbox/outdoors-v11',
                  active:false
                },
                {
                  id:'satellite-v9',
                  title:'Uydu Haritası',
                  img:'./src/img/maps/satellite.png',
                  url:'mapbox://styles/mapbox/satellite-v9',
                  active:false
                }
              ]
          }
      },
      open:function(){
        GL.titresim();
        this.onoff = true;

        if(localStorage.getItem("currentBaseap")!==null){
          var currentBaseap = localStorage.getItem("currentBaseap");
          this.basemaps.map(function(a){
            a.active=false;
          });
          var item = this.getItem(currentBaseap);
          item.active = true;
        }

        $("#modal-basemaps").modal('show');
        this.$forceUpdate();
      },
      close:function(e){
        GL.titresim();
        this.onoff = false;
        $("#modal-basemaps").modal('hide');
      },
      setStyle:function(item){
        GL.titresim();
        this.basemaps.map(function(a){
          a.active=false;
        });
        item.active=true;

        var currentStyle = GL.map.getStyle();
        var appLayers = currentStyle.layers.filter((el) => { // app layers are the layers to retain, and these are any layers which have a different source set
          return (el.source && el.source != "mapbox://mapbox.satellite" && el.source != "composite");
        });


        GL.map.setStyle(item.url);
        localStorage.setItem("currentBaseap",item.id);
        GL.onay("Altlık Harita "+item.title+" olarak değiştirilmiştir.");
        
        setTimeout(function(){
          GL.getAllLoadData(currentStyle,appLayers);
        },500)
        //GL.map.on('style.load', function () {
          // Triggered when `setStyle` is called.
        //  if (geojson) addDataLayer();
        //});
        this.close();
      },
      setActive:function(id){
        var item = this.getItem(id);
        this.setStyle(item);
      },
      getItem:function(id){
        return this.basemaps.find(function(a){if(a.id==id){return true;}});
      }
  },
  template:
  '<div class="modal fade modalbox" id="modal-basemaps" tabindex="-1" role="dialog">'+
    '<div class="modal-dialog" role="document">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<h5 class="modal-title">{{GL.lang.panel.myfooter.basemaps}}</h5>'+
          '<a href="javascript:;" style="color:#8bc34a;" data-dismiss="modal">{{GL.lang.general.close}}</a>'+
        '</div>'+
        '<div class="modal-body" :style="GL.config.darkMode==true ? style.dark:style.light">'+
          '<div class="row">'+
            '<div v-for="item in basemaps" class="col-6" @click="item.active!==true?setStyle(item):null">'+
              '<div class="card" :style="item.active==true?style.passive:style.active">'+
              '<div class="card-header">{{item.title}}</div>'+
              '<div class="card-body" style="padding: 0 !important;">'+
                '<img style="border-radius: 0px !important; width: 100%;" :src="item.img" class="card-img-top" alt="image">'+
              '</div>'+
              '<div class="card-footer" style="padding: 0 !important; border: none;">'+
                '<button type="button" :class="item.active!==true?style.classActive:style.classPassive">{{item.active!==true?GL.lang.general.use:GL.lang.general.active}}</button>'+
              '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+

        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });

var basemaps = new Vue({ el: '#basemaps' });