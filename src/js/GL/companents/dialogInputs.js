Vue.component('mydialoginputs', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              modals:[],
              geocoder:null,
              geojson:null
          }
      },
      open:function(obj){
        var that=this;
        var id = "dialog-"+this.modals.length;
        var header = obj["header"] || "İşlem Bilgileri";
        var obj2 = {
          id:id,
          header:header
        };
        if(typeof obj["callback"]!=="undefined"){
          obj2.callback = obj["callback"];
        }
        if(typeof obj["inputs"]!=="undefined"){
          obj2.inputs = obj["inputs"];
        }else{
          obj2.inputs = [];
        }

        this.geocoder = new MapboxGeocoder({
          accessToken: GL.config.mapboxglAccessToken,
          mapboxgl: mapboxgl,
          language:'tr',
          marker: {
            color: '#4caf50'
          },
          placeholder:'Ara...',
          clearOnBlur:true
        });

        this.geocoder.on('result', function(ev) {
          that.geojson= ev.result;
          //that.geojson= ev.result;
        });
        setTimeout(function(){
          if(document.getElementById('geocoder3')){
            document.getElementById('geocoder3').appendChild(that.geocoder.onAdd(GL.map));
            var a=$("#geocoder3").find('div')[1];
            //$('#searchLocation').hide();
          }
        }, 100);
        
        this.modals.push(obj2);
        setTimeout(function(){
          $("#"+id).modal("show");
        },300);
        
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
      GetInputs:function(modal){
        var that=this;
        //var a=document.getElementById('geocoder3');
        //a.removeChild(a.that.geocoder.onRemove(GL.map));   
        if(modal.inputs[0].id=="searching"){
          modal.inputs[0].getvalue=this.geojson;
        }
        GL.titresim();
          if(typeof modal["callback"]!=="undefined"){
            modal.callback({type:'ok',values:modal.inputs});
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
          //'<div class="modal-body" v-html="modal.content"></div>'+
            '<div class="modal-body">'+
                  '<div v-for="input in modal.inputs"  class="form-group boxed">'+
                    '<div :class="modal.inputs.length>0?\'input-wrapper\':\'input-wrapper\'">'+
                          '<label v-if="input.type==\'text\'" class="label" for="name5">{{input.title}}</label>'+
                          '<input :type="input.type" v-if="input.type==\'text\'" v-model="input.getvalue" class="form-control" id="name5" :placeholder="input.title">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+

                          '<label v-if="input.type==\'number\'" class="label" for="name5">{{input.title}}</label>'+
                          '<input :type="input.type" v-if="input.type==\'number\'" v-model="input.getvalue" class="form-control" id="name5" :placeholder="input.title">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+

                          '<label v-if="input.type==\'password\'" class="label" for="name5">{{input.title}}</label>'+
                          '<input :type="input.type" v-if="input.type==\'password\'" v-model="input.getvalue" class="form-control" id="name5" :placeholder="input.title">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+

                          '<label v-if="input.type==\'search\'" class="label" for="name5">{{input.title}}</label>'+
                          //'<input :type="input.type" v-if="input.type==\'search\'" v-model="input.getvalue" class="form-control" id="name5" :placeholder="input.title">'+
                          //      '<i class="clear-input">'+
                          //          '<ion-icon name="close-circle"></ion-icon>'+
                          //      '</i>'+

                          '<div class="input-group" v-if="input.type==\'search\'" id="geocoder3" style="border-style: solid; border-width: 2px; margin-top:10px;">'+
                          '</div>'+
                    '</div>'+
                  '</div>'+
                // checkbox
                //'<div class="wide-block pt-2 pb-1">'+
                  '<div v-for="input in modal.inputs" v-if="input.type==\'checkbox\'" class="custom-control custom-checkbox mb-1">'+
                      '<input style="float:left important!;" :type="input.type" class="custom-control-input" v-model="input.getvalue" id="customCheckb1">'+
                      '<label style="float:left important!;" class="custom-control-label" for="customCheckb1">{{input.title}}</label>'+
                  '</div>'+
                //'</div>'+

                // Select
                  '<div class="form-group basic">'+
                        '<div v-for="input in modal.inputs" class="input-wrapper">'+
                            '<label v-if="input.type==\'select\'" class="label" for="city4">{{input.title}}</label>'+
                            '<select v-if="input.type==\'select\'" v-model="input.getvalue" class="form-control custom-select" id="city4">'+
                                '<option v-for="opt in input.options" :value="opt.value">{{opt.name}}</option>'+
                            '</select>'+
                        '</div>'+
                    '</div>'+

                    '<div class="btn-inline">'+
                '<a href="#" @click="close(modal,false)" class="btn btn-text-secondary">Kapat</a>'+
                '<a href="#" @click="GetInputs(modal)" class="btn">Tamam</a>'+
                '</div>'+
            '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });

var mydialoginputs = new Vue({ el: '#mydialoginputs' });