Vue.component('actionsheet', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              actions:[]
          }
      },
      open:function(obj){
        var id = "actionsheet-"+this.actions.length;
        var header = obj["header"] || "İşlem Diyaloğu";
        var obj2 = {
          id:id,
          header:header
        };

        if(typeof obj["callback"]!=="undefined"){
            obj2.callback = obj["callback"];
        }
        if(typeof obj["buttons"]!=="undefined"){
            obj2.buttons = obj["buttons"];
        }else{
            obj2.buttons = [];
        }

        this.actions.push(obj2);
        setTimeout(function(){
          $("#"+id).modal("show");
        },100);
      },
      close:function(action,status){
        GL.titresim();
        var that  =this;
        if(status==false){
          if(typeof action["callback"]!=="undefined"){
            action.callback({type:'close',action:action});
          }
        }
        $("#"+action.id).modal("hide");
        setTimeout(function(){
          for(var i=0; i<that.actions.length;i++){
            var nowModal = that.actions[i];
            if(action.id==nowModal.id){
              that.actions.splice(i,1);
              break;
            }
          }
        },300);
      },
      runCommand:function(action,butonId){
        GL.titresim();
        if(action.id==butonId){
          if(typeof action["callback"]!=="undefined"){
            action.callback({type:'ok',action:action});
          }
        }else{
          if(action.buttons.length>0){
            action.buttons.map(function(btn){
              if(butonId==btn.id){
                btn.callback({type:butonId,action:action});
              }
            });
          }
        }
        $("#"+action.id).modal("hide");
      }
  },
  template:
  '<div>'+
  '<div v-for="action in actions" class="modal fade action-sheet inset" :id="action.id" data-backdrop="static" tabindex="-1" role="dialog">'+
                        '<div class="modal-dialog" role="document">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                    '<h5 class="modal-title">{{action.header}}</h5>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<ul class="action-button-list">'+
                                        '<li v-for="button in action.buttons">'+
                                            '<a @click="runCommand(action,button.id)" class="btn btn-list">'+
                                                '<span>{{button.title}}</span>'+
                                            '</a>'+
                                        '</li>'+
                                        '<li>'+
                                            '<a @click="close(action,false)" class="btn btn-list text-primary">'+
                                                '<span>Kapat</span>'+
                                            '</a>'+
                                        '</li>'+
                                    '</ul>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
    '</div>'
  });

var actionsheet = new Vue({ el: '#actionsheet' });