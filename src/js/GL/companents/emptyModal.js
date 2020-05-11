Vue.component('emptymodal', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Modal Başlık",
              close:"Kapat"
          }
      },
      open:function(){
        $("#emptyModal").modal('show');
      },
      close:function(e){
        $("#emptyModal").modal('hide');
      }
  },
  template:
  '<div  class="modal fade modalbox" id="emptyModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px">{{header}}</h5>'+
                        '<a @click="close" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                        
                            'Modal Content'+
        
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var emptymodal = new Vue({ el: '#emptymodal' });