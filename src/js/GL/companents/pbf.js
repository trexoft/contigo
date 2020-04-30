Vue.component('addpbf', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"PBF Servisi Ekleme",
              close:"Kapat",
              layerName:"",
              url:"",
              minzoom:0,
              maxzoom:18,
              sourcelayer:""
          }
      },
      open:function(){
        $("#addpbfserver").modal('show');
      },
      close:function(){
        $("#addpbfserver").modal('hide');
      },
      close2:function(){
        $("#addpbfserver").modal('hide');
      },
      saveLayer:function(){
        if (this.layerName==""){
            GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url=="" || this.sourcelayer==""){
            GL.uyari("URL adresi ve kaynak katman adı boş olamaz");
        }else{
            if(this.maxzoom==""){
                this.maxzoom=18;
            }
            if(this.minzoom=""){
                this.minzoom=0;
            }
            var id=Date.now().toString();
            GL.addPBFLayer(id,this.url,this.sourcelayer,this.layerName,this.minzoom,this.maxzoom);
            $("#addpbfserver").modal('hide');
            GL.bilgi("Başarıyla Eklendi");
        }
    },
    deneme:function(){
        //http://{a-d}.maptileserver.xyz:8000/services/osm_vectortiles/tiles/{z}/{x}/{y}.pbf
        //https://map.infrapedia.com/geoserver/gwc/service/tms/1.0.0/infrapedia%3Aall_point@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf?t=${tmm}
        //https://d2jyc3sz0j3f3j.cloudfront.net/soi151_vectortiles/{z}/{x}/{y}.pbf
        GL.map.addSource('mapillary', {
            'type': 'vector',
            'tiles': [
            'https://map.infrapedia.com/geoserver/gwc/service/tms/1.0.0/infrapedia%3Aall_point@EPSG%3A4326@pbf/{z}/{y}/{x}.pbf?t=${tmm}'
            ],
            'minzoom': 0,
            'maxzoom': 18
        });

        GL.map.addLayer({
            'id': 'tiles',
            'type': 'circle',
            'source': 'mapillary',
            'source-layer': 'all_point',
            'paint': {
                'circle-color': '#FFFFFF',
                'circle-radius': 3,
                'circle-stroke-color': '#333333',
                'circle-stroke-width': 1
            }
        });

        

        GL.map.addLayer(
            {
            'id': 'mapillary',
            'type': 'line',
            'source': 'mapillary',
            'source-layer': 'all_point',
            'paint': {
            'line-opacity': 0.6,
            'line-color': 'rgb(53, 175, 109)',
            'line-width': 2
            },
            'filter': ['==', '$type', 'LineString']
            }
        );
/*
        GL.map.addLayer(
            {
            'id': 'mapillary2',
            'type': 'circle',
            'source': 'mapillary',
            'source-layer': 'soi151_vectortiles',
            'paint': {
            'circle-radius': 3,
            'circle-color': 'rgb(53, 175, 109)',
            'circle-stroke-width': 1,
            'circle-stroke-color':"#333333"
            },
            'filter': ['==', '$type', 'Point']
            }
        );

        GL.map.addLayer(
            {
            'id': 'mapillary3',
            'type': 'fill',
            'source': 'mapillary',
            'source-layer': 'soi151_vectortiles',
            'paint': {
                'fill-color': 'rgb(53, 175, 109)',
                'fill-opacity': 0.7
            },
            'filter': ['==', '$type', 'Polygon']
            }
        );
        */
    }
      
  },
  template:
  '<div  class="modal fade modalbox" id="addpbfserver" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" >'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layernamepbf">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layernamepbf" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
        
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlpbf">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlpbf" placeholder="URL adresini girin">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="sourcepbf">Kaynak Katman Adı</label>'+
                                '<input type="text" v-model="sourcelayer" class="form-control" id="sourcepbf" placeholder="Kaynak Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="minzoom">Minumum Yaklaştırma Seviyesi</label>'+
                                '<input type="number" v-model="minzoom" class="form-control" id="minzoom" placeholder="Minumum Yaklaştırma Seviyesi">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="maxzoom">Maksimum Yaklaştırma Seviyesi</label>'+
                                '<input type="number" v-model="maxzoom" class="form-control" id="maxzoom" placeholder="Maksimum Yaklaştırma Seviyesi">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
                        
                        '<div class="form-button-group">'+
                            '<button type="button" @click="saveLayer" class="btn btn-primary btn-block ">Kayıt Et</button>'+
                        '</div>'+

                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var addpbf = new Vue({ el: '#addpbf' });