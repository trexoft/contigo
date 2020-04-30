Vue.component('addmvt', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"MVT Servisi Ekleme",
              close:"Kapat",
              layerName:"",
              url:"",
              minzoom:0,
              maxzoom:18,
              sourcelayer:""
          }
      },
      open:function(){
        $("#addmvtserver").modal('show');
      },
      close:function(){
        $("#addmvtserver").modal('hide');
      },
      close2:function(){
        $("#addmvtserver").modal('hide');
      },
      saveLayer:function(){
        if (this.layerName==""){
            GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url=="" || this.sourcelayer==""){
            GL.uyari("URL adresi boş olamaz");
        }else{
            if(this.maxzoom==""){
                this.maxzoom=18;
            }
            if(this.minzoom=""){
                this.minzoom=0;
            }
            var id=Date.now().toString();
            GL.addMVTLayer(id,this.url,this.sourcelayer,this.layerName,this.minzoom,this.maxzoom);
            $("#addmvtserver").modal('hide');
            GL.bilgi("Başarıyla Eklendi");
        }
    } 
  },
  template:
  '<div  class="modal fade modalbox" id="addmvtserver" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" >'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layernamemvt">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layernamemvt" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
        
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlmvt">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlmvt" placeholder="URL adresini girin">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="sourcemvt">Kaynak Katman Adı</label>'+
                                '<input type="text" v-model="sourcelayer" class="form-control" id="sourcemvt" placeholder="Kaynak Katman Adını Giriniz">'+
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

var addmvt = new Vue({ el: '#addmvt' });