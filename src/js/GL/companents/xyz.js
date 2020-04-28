Vue.component('addxyz', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"XYZ Servisi Ekleme",
              close:"Kapat",
              layerName:"",
              url:"",
              minzoom:0,
              maxzoom:18
          }
      },
      open:function(){
        $("#addxyzserver").modal('show');
      },
      close:function(){
        $("#addxyzserver").modal('hide');
      },
      close2:function(){
        $("#addxyzserver").modal('hide');
      },
      saveLayer:function(){
        if (this.layerName==""){
            GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url==""){
            GL.uyari("URL adresi boş olamaz");
        }else{
            //'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png'
            if(this.maxzoom==""){
                this.maxzoom=18;
            }
            if(this.minzoom=""){
                this.minzoom=0;
            }
            var id=Date.now().toString();
            GL.addXYZLayer(id,this.url,this.layerName,this.minzoom,this.maxzoom);
            $("#addxyzserver").modal('hide');
            GL.bilgi("Başarıyla Eklendi");
        }
    }
      
  },
  template:
  '<div  class="modal fade modalbox" id="addxyzserver" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" >'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layername2">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layername2" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
        
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlxyz">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlxyz" placeholder="URL adresini girin">'+
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

var addxyz = new Vue({ el: '#addxyz' });