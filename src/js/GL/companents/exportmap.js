Vue.component('exportmap', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              exportType:"normal",
              dpiTypes:{selected:150,data:[
                  {value:96,text:'Düşük Kalite  - 96 dpi'},
                  {value:150,text:'Normal Kalite - 150 dpi'},
                  {value:300,text:'Yüksek Kalite - 300 dpi'},
                  {value:600,text:'Çok Yüksek Kalite - 600 dpi'},
              ]}
          }
      },
      open:function(){
        GL.titresim();
        this.onoff = true;
        $("#export-map").modal('show');
      },
      close:function(e){
        $("#export-map").modal('hide');
        this.onoff = false;
        
      },
      exportMap:function(){
        GL.titresim();
        var name= "GISLayer-"+Date.now();
        var dpi = this.dpiTypes.selected;
        GL.printMap(dpi,name);
      },
      paylas:function(){
          GL.titresim();
        share.$children[0].open({
            url:window.location.href,
            title:'GISLayer Harita Çıktısı'
        }); 
        this.close();
      }
  },
  template:
        '<div class="modal fade dialogbox" id="export-map" data-backdrop="static" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h3 class="modal-title">Çıktı Seçenekleri</h3>'+
                    '</div>'+
                    '<div style="float:left; padding:10px;" >'+

                        '<div class="custom-control custom-radio" v-for="item in dpiTypes.data">'+
                            '<input type="radio" :id="\'dpi\'+item.value" v-bind:value="item.value" :checked="item.value == dpiTypes.selected" v-model="dpiTypes.selected" name="dpiSelection" class="custom-control-input">'+
                            '<label class="custom-control-label" :for="\'dpi\'+item.value">{{item.text}}</label>'+
                        '</div>'+

                    '</div>'+
                    '<div class="modal-footer">'+
                        '<div class="btn-inline">'+
                            '<button @click="close" class="btn btn-text-secondary">Kapat</button>'+
                            '<button @click="paylas" class="btn btn-text-secondary">Paylaş</button>'+
                            '<button @click="exportMap" class="btn btn-text-primary" data-dismiss="modal">İndir</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var exportmap = new Vue({ el: '#exportmap' });