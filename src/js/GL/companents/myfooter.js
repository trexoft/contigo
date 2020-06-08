Vue.component('myfooter', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              style:{
                active:'item active',
                passive:'item',
                sub:{
                  dark:{backgroundColor:'#4caf50'},
                  light:{backgroundColor:'#03A9F4'},
                }
              },
              activeButton:''
          }
      },
      open:function(){
        this.onoff = true;
      },
      close:function(e){
        this.onoff = false;
      },
      clickButton:function(id){
        GL.titresim();
        var status = true;
        if(this.activeButton!==id){
          this.activeButton = id;
        }else{
          status=false;
          this.activeButton = '';
        }
        switch(id){
          case 'layerbox':{
            layerbox.$children[0].open();
            break;
          }
          case 'bookmarks':{
            bookmarks.$children[0].open();
            break;
          }
          case 'location':{
            GL.openLocation();
            break;
          }
          case 'measure':{
            mydialog.$children[0].open({
              header:'Ölçüm Yöntemleri',
              content:'Lütfen ne ölçeceğinizi belirleyiniz',
              buttons:[
                {id:'area',title:'Alan Ölçümü',callback:function(a){
                  //if(measurement.$children[0].points.length>0){
                  //  measurement.$children[0].deleteFeatureonMap();
                  //}
                  GL.onay("Şimdi Alan Çizimine Başlayabilirsiniz");
                  GL.draw.start("Polygon","measure",function(geojson,layerId){
                    GL.area(geojson);
                  });
                }},
                {id:'length',title:'Uzunluk Ölçümü',callback:function(a){

                  mydialog.$children[0].open({
                    header:'Uzunluk Ölçü Birimleri',
                    content:'<div class="input-wrapper" style="text-align: left; width: 100%;"><label class="label" for="unit1">Birim Listesi</label><select id="unit1" class="form-control custom-select"><option>Metre</option><option>Inch</option><option>Derece</option></select></div>',
                    callback:function(a){
                      if(a.type=="ok"){
                        
                        var secim = $("#"+a.modal.id).find("#unit1").val();
                        GL.onay("Şimdi Uzunluk Çizimine Başlayabilirsiniz");
                        GL.bilgi("Uzunluk ölçümü için <b>"+secim+'</b> ölçü birimi kullanılacak');
                        GL.draw.start("LineString","measure",function(geojson,layerId){
                          GL.distance(geojson,secim);
                        });
                      }
                      if(a.type=="close"){
                        GL.bilgi("Uzunluk ölçüm işlemi iptal edilmiştir");
                      }
                  }});
                }},
                {id:'nokta',title:'Nokta Toplama',callback:function(a){
                  GL.onay("Nokta Toplamaya Başlayabilirsiniz");
                  GL.draw.start("Point","measure",function(geojson,layerId){
                    GL.collectPoint(geojson);
                  });
                }},
                {id:'yükseklik',title:'Yükseklik Alma',callback:function(a){
                  GL.onay("Yükseklik Toplamaya Başlayabilirsiniz");
                  GL.draw.start("Point","measure",function(geojson,layerId){
                    var coords=geojson.geometry.coordinates;
                    GL.loading(GL.lang.mesaj.m1);
                    GL.elevation.getElevation(coords,function(result){
                      GL.loading(false);
                      measurement.$children[0].showMeasurement({type:"yükseklik",result:result.features[0].properties.elevation,id:geojson.id,geometry:result.features[0],unit:"metre"});
                    });
                  });
                }}
              ],
              callback:function(a){
                GL.bilgi("Ölçüm işlemi iptal edilmiştir.");
            }});
            break;
          }
          case 'basemap':{
            basemaps.$children[0].open();
            break;
          }
          case 'file':{
            fileupload.$children[0].open();
            break;
          }
          case 'share':{
            share.$children[0].open({
              url:window.location.href,
              title:'GISLayer MOBİL CBS Uygulaması'
            }); 
            break;
          }
        }
      }
  },
  template:
  '<div>'+
    '<div class="appBottomMenu">'+

      '<a href="#" :class="activeButton==\'layerbox\'?style.active:style.passive" v-on:click="clickButton(\'layerbox\')">'+
        '<div class="col">'+
          '<ion-icon name="layers-outline" role="img" class="md hydrated" aria-label="document text outline"></ion-icon>'+
          '<strong>{{GL.lang.panel.myfooter.layerbox}}</strong>'+
        '</div>'+
      '</a>'+

      '<a href="#" :class="activeButton==\'bookmarks\'?style.active:style.passive" v-on:click="clickButton(\'bookmarks\')">'+
        '<div class="col">'+
          '<ion-icon name="bookmarks-outline" role="img" class="md hydrated" aria-label="document text outline"></ion-icon>'+
          '<strong>{{GL.lang.panel.myfooter.bookmarks}}</strong>'+
        '</div>'+
      '</a>'+

      '<a href="#" class="item">'+
        '<div class="fab-button animate bottom-center dropdown">'+
          '<a :style="GL.config.darkMode==true ? style.sub.dark:style.sub.light" href="#" class="fab" data-toggle="dropdown"  v-on:click="clickButton(\'sub\')"> <ion-icon style="color:#fff;" name="add-outline"></ion-icon> </a>'+
          '<div class="dropdown-menu">'+
            '<a :style="GL.config.darkMode==true ? style.sub.dark:style.sub.light" class="dropdown-item" href="#" v-on:click="clickButton(\'basemap\')"> <ion-icon style="margin:0;" name="map-outline"></ion-icon> <p>{{GL.lang.panel.myfooter.basemaps}}</p> </a>'+
            '<a :style="GL.config.darkMode==true ? style.sub.dark:style.sub.light" class="dropdown-item" href="#" v-on:click="clickButton(\'services\')"> <ion-icon style="margin:0;" name="cloud-download-outline"></ion-icon> <p>{{GL.lang.panel.myfooter.services}}</p> </a>'+
            '<a :style="GL.config.darkMode==true ? style.sub.dark:style.sub.light" class="dropdown-item" href="#" v-on:click="clickButton(\'tools\')"> <ion-icon style="margin:0;" name="construct-outline"></ion-icon> <p>{{GL.lang.panel.myfooter.tools}}</p> </a>'+
            '<a :style="GL.config.darkMode==true ? style.sub.dark:style.sub.light" class="dropdown-item" href="#" v-on:click="clickButton(\'file\')"> <ion-icon style="margin:0;" name="cloud-upload-outline"></ion-icon> <p>{{GL.lang.panel.myfooter.file}}</p> </a>'+
            '<a :style="GL.config.darkMode==true ? style.sub.dark:style.sub.light" class="dropdown-item" href="#" v-on:click="clickButton(\'measure\')"> <ion-icon style="margin:0;" name="analytics-outline"></ion-icon> <p>{{GL.lang.panel.myfooter.measure}}</p> </a>'+
          '</div>'+
        '</div>'+
      '</a>'+

      '<a href="#" :class="activeButton==\'location\'?style.active:style.passive" v-on:click="clickButton(\'location\')">'+
        '<div class="col">'+
          '<ion-icon name="locate-outline" role="img" class="md hydrated" aria-label="document text outline"></ion-icon>'+
          '<strong>{{GL.lang.panel.myfooter.location}}</strong>'+
        '</div>'+
      '</a>'+

      '<a href="#" :class="activeButton==\'measure\'?style.active:style.passive" v-on:click="clickButton(\'share\')">'+
        '<div class="col">'+
          '<ion-icon name="share-social-outline" role="img" class="md hydrated" aria-label="document text outline"></ion-icon>'+
          '<strong>{{GL.lang.panel.myfooter.share}}</strong>'+
        '</div>'+
      '</a>'+

    '</div>'+
  '</div>'
  });

var myfooter = new Vue({ el: '#myfooter' });