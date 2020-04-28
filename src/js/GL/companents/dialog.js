Vue.component('mydialog', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              modals:[]
          }
      },
      open:function(obj){
        var id = "dialog-"+this.modals.length;
        var header = obj["header"] || "İşlem Diyaloğu";
        var content = obj["content"] || "Bu işlemi Yapmak İstediğinize Eminmisiniz";
        var obj2 = {
          id:id,
          header:header,
          content:content
        };
        if(typeof obj["callback"]!=="undefined"){
          obj2.callback = obj["callback"];
        }
        if(typeof obj["buttons"]!=="undefined"){
          obj2.buttons = obj["buttons"];
        }else{
          obj2.buttons = [];
        }
        
        this.modals.push(obj2);
        setTimeout(function(){
          $("#"+id).modal("show");
        },100);
        
      },
      close:function(modal,status){
        GL.titresim();
        var that  =this;
        if(status==false){
          if(typeof modal["callback"]!=="undefined"){
            modal.callback({type:'close',modal:modal});
          }
        }
        $("#"+modal.id).modal("hide");
        setTimeout(function(){
          for(var i=0; i<that.modals.length;i++){
            var nowModal = that.modals[i];
            if(modal.id==nowModal.id){
              that.modals.splice(i,1);
              break;
            }
          }
        },300);
      },
      butonCalistir:function(modal,butonId){
        GL.titresim();
        if(modal.id==butonId){
          if(typeof modal["callback"]!=="undefined"){
            modal.callback({type:'ok',modal:modal});
          }
        }else{
          if(modal.buttons.length>0){
            modal.buttons.map(function(btn){
              if(butonId==btn.id){
                btn.callback({type:butonId,modal:modal});
              }
            });
          }
        }
        $("#"+modal.id).modal("hide");
      }
  },
  template:
  '<div>'+
    '<div v-for="modal in modals" class="modal fade dialogbox" :id="modal.id" data-backdrop="static" tabindex="-1" role="dialog">'+
      '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+
          '<div class="modal-header"><h5 class="modal-title">{{modal.header}}</h5></div>'+
          '<div class="modal-body" v-html="modal.content"></div>'+
          '<div class="modal-footer">'+
            '<div :class="modal.buttons.length>0?\'btn-list\':\'btn-inline\'">'+
              '<a v-for="button in modal.buttons" v-if="modal.buttons.length>0" href="#" @click="butonCalistir(modal,button.id)" class="btn btn-block">{{button.title}}</a>'+
              '<a v-if="modal.buttons.length>0" href="#" @click="close(modal,false)" class="btn btn-text-secondary btn-block">Kapat</a>'+

              '<a v-if="modal.buttons.length==0" href="#" @click="close(modal,false)" class="btn btn-text-secondary">Kapat</a>'+
              '<a v-if="modal.buttons.length==0" href="#" @click="butonCalistir(modal,modal.id)" class="btn">Tamam</a>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });

var mydialog = new Vue({ el: '#mydialog' });