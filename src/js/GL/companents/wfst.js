Vue.component('addwfst', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"WFS Servisi Ekleme",
              close:"Kapat",
              layerName:"",
              url:"",
              servicelayer:"",
              versions:{selected:"1.0.0",data:[{name:"1.0.0", value:"1.0.0"},{name:"1.1.0",value:"1.1.0"},{name:"2.0.0",value:"2.0.0"}]}
          }
      },
      open:function(){
        $("#addwfstserver").modal('show');
      },
      close:function(){
        $("#addwfstserver").modal('hide');
      },
      close2:function(){
        $("#addwfstserver").modal('hide');
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
            var url2=this.url+"?service=WFS&version="+this.versions.selected+"&srsname=EPSG:4326&request=GetFeature&typeName="+this.servicelayer+"&outputFormat=application%2Fjson";
            //"http://localhost:8080/geoserver/deneme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=deneme:izmir&maxFeatures=50&outputFormat=application%2Fjson"
            $.get(url2,function(data, status){
                console.log(status);
                console.log(data);
                var color=GL.config.colors[10];
                var id = 'wfst'+Date.now();
                var information={id:id,name:that.layerName,type:'collection',layers:[id+"-point",id+"-line",id+"-polygon"]};
                GL.addGeojsonToLayer(data,id,color,information);
                $("#addwfstserver").modal('hide');
                GL.bilgi("Başarıyla Eklendi");   
            });
          }
      }
      
  },
  template:
  '<div  class="modal fade modalbox" id="addwfsserver" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" >'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layername">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layername" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
        
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlwfs">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlwfs" placeholder="URL adresini girin">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="servicelayer">Serviste Kullanılan Katman Adı</label>'+
                                '<input type="text" v-model="servicelayer" class="form-control" id="servicelayer" placeholder="Serviste Kullanılan Katman Adı">'+
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
                        
                        '<div class="form-button-group">'+
                            '<button type="button" @click="saveLayer" class="btn btn-primary btn-block ">Kayıt Et</button>'+
                        '</div>'+

                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var addwfst = new Vue({ el: '#addwfst' });