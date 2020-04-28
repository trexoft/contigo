Vue.component('addwms', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"WMS Servisi Ekleme",
              close:"Kapat",
              layerName:"",
              url:"",
              servicelayer:"",
              versions:{selected:"1.0.0",data:[{name:"1.0.0", value:"1.0.0"},{name:"1.1.0",value:"1.1.0"},{name:"2.0.0",value:"2.0.0"}]},
              type:{selected:"image/png",data:[{name:"image/png", value:"image/png"},{name:"image/gif",value:"iamge/gif"}]},
          }
      },
      open:function(){
        $("#addwmsserver").modal('show');
      },
      close:function(){
        $("#addwmsserver").modal('hide');
      },
      close2:function(){
        $("#addwmsserver").modal('hide');
      },
      saveLayer:function(){
        var that=this;
        if (this.layerName==""){
          GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url==""){
          GL.uyari("URL adresi boş olamaz");
        }else if(this.servicelayer==""){
          GL.uyari("Servis Katman Adı Boş Olamaz");
        }else{
            var url= 'http://localhost:8080/geoserver/topp/wms?service=WMS&version='+this.versions.selected+'&request=GetMap&layers='+this.servicelayer+'&styles=&bbox={bbox-epsg-3857}&transparent=true&width=256&height=256&srs=EPSG:3857&format='+this.type.selected;
            //'http://localhost:8080/geoserver/topp/wms?service=WMS&version=1.1.0&request=GetMap&layers=topp:states&styles=&bbox={bbox-epsg-3857}&transparent=true&width=768&height=330&srs=EPSG:3857&format=image/png'
            var id=Date.now().toString();
            GL.addWMSLayer(url,id,this.layerName);
            $("#addwmsserver").modal('hide');
            GL.bilgi("Başarıyla Eklendi");
        }
      }
  },
  template:
  '<div  class="modal fade modalbox" id="addwmsserver" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layernamewms">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layernamewms" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                                '<div class="invalid-feedback">Katman Adını Giriniz</div>'+
                            '</div>'+
                        '</div>'+
                            
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlwms">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlwms" placeholder="URL adresini girin">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="servicelayerwms">Serviste Kullanılan Katman Adı</label>'+
                                '<input type="text" v-model="servicelayer" class="form-control" id="servicelayerwms" placeholder="Serviste Kullanılan Katman Adı">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group basic" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="version2">Versiyon</label>'+
                                '<select v-model="versions.selected" class="form-control custom-select" id="version2">'+
                                    '<option v-for="item in versions.data" :value="item.value">{{item.name}}</option>'+
                                '</select>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group basic" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="version2">Resim Tipi</label>'+
                                '<select v-model="type.selected" class="form-control custom-select" id="version2">'+
                                    '<option v-for="item in type.data" :value="item.value">{{item.name}}</option>'+
                                '</select>'+
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

var addwms = new Vue({ el: '#addwms' });