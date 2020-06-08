Vue.component('addfile', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              search:'',
              epsglist:{selected:'4326',data:[{code:'4326',name:"Enlem-Boylam WG84"},{code:'4917',name:"ITRF96 Y(m),X(m)"},{code:'3857',name:"Y(m),X(m)"}]}
          }
      },
      open:function(){
        this.onoff = true;
        $("#addfileModal").modal('show');
      },
      close:function(e){
        this.onoff = false;
        GL.titresim();
        GL.bilgi("Dosya yükleme işlemi iptal edildi");
        $("#addfileModal").modal('hide');
      },
      searchEPSG:function(){
        var that = this;
        var search = this.search;
        GL.EPSG.search(search,function(results){
          GL.bilgi(results.length+' '+"projeskiyon bulundu");
          that.epsglist.data = results;
          if(results.length==1){
            that.epsglist.selected=results[0].code+'';
          }
        });
      },
      registerProjection2:function(callback){
        var that = this;
        if(this.epsglist.selected!==''){
          GL.EPSG.search(this.epsglist.selected,function(resutls){
            if(resutls.length==1){
              GL.EPSG.registerProjection(resutls[0]);
              GL.EPSG.file = 'EPSG:'+resutls[0].code;
              callback();
            }else{
              GL.uyari("Hata");
            }
          })
        }
      }
  },
  template:
    '<div class="modal fade dialogbox" id="addfileModal" data-backdrop="static" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title">Dosya Bilgileri</h5>'+
                    '</div>'+
                    '<form>'+
                        '<div class="modal-body text-left mb-2">'+
                        '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                            '<label class="label" for="epsgSearchfile" style="font-size:15 !important;">Koordinat Sistemi ara</label>'+
                            '<div class="form-group basic">'+
                                '<div class="input-group mb-3">'+
                                    '<input v-model="search" type="search" class="form-control" id="epsgSearchfile" placeholder="EPSG Kodu">'+
                                    '<div class="input-group-append">'+
                                        '<button @click="searchEPSG" class="btn btn-outline-secondary" type="button">Ara</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+

                            '<div class="form-group boxed">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="epsgfile">Koordiant Sistemi Listesi</label>'+
                                    '<select class="form-control custom-select" v-model="epsglist.selected" id="epsgfile" required>'+
                                        '<option v-for="item in epsglist.data" :value="item.code">{{item.name}} - EPSG:{{item.code}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="modal-footer">'+
                            '<div class="btn-inline">'+
                                '<button type="button" @click="close" class="btn btn-text-secondary" data-dismiss="modal">Kapat</button>'+
                                '<button type="button" @click="GL.addFile(epsglist.selected)" class="btn btn-text-primary" data-dismiss="modal">Devam</button>'+
                            '</div>'+
                        '</div>'+
                    '</form>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var addfile = new Vue({ el: '#addfile' });