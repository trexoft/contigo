Vue.component('addwmts', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"WMTS Servisi Ekleme",
              close:"Kapat",
              layerName:"",
              url:"",
              type:{selected:"png",data:[{name:"image/png", value:"png"},{name:"image/gif",value:"gif"}]},
          }
      },
      open:function(){
        $("#addwmtsserver").modal('show');
      },
      close:function(){
        $("#addwmtsserver").modal('hide');
      },
      close2:function(){
        $("#addwmtsserver").modal('hide');
      },
      saveLayer:function(){
        if (this.layerName==""){
          GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url==""){
          GL.uyari("URL adresi boş olamaz");
        }else{
            var url="https://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/WMTS/tile/1.0.0/WorldTimeZones/default/default028mm/{z}/{y}/{x}."+this.type.selected;
            //https://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/WMTS/tile/1.0.0/WorldTimeZones/default/default028mm/{z}/{y}/{x}.png
            var id=Date.now().toString();
            GL.addWMTSLayer(this.url,id,this.layerName);
            $("#addwmtsserver").modal('hide');
            GL.bilgi("Başarıyla Eklendi");
        }
      }
  },
  template:
  '<div  class="modal fade modalbox" id="addwmtsserver" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layernamewmts">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layernamewmts" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                                '<div class="invalid-feedback">Katman Adını Giriniz</div>'+
                            '</div>'+
                        '</div>'+
                            
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlwmts">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlwmts" placeholder="URL adresini girin">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group basic" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="typee">Resim Tipi</label>'+
                                '<select v-model="type.selected" class="form-control custom-select" id="typee">'+
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

var addwmts = new Vue({ el: '#addwmts' });