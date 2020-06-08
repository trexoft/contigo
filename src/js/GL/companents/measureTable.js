Vue.component('measuretable', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              obj:null
          }
      },
      open:function(){
        
      },
      close:function(e){
        $("#ModalListview").modal('hide');
        var len=this.obj.length;
      },
      getValues:function(obj){
          $("#ModalListview").modal('show');
          this.obj=obj;
      },
      showFeature:function(obj2){
          //show feature on map
          //GL.draw.draw.add(obj2.geometry);
          $("#ModalListview").modal('hide');
          measurement.$children[0].gosterilen=obj2;
          GL.zoomFeature(obj2.geometry);
      },
      deleteFeature:function(id,i){
          console.log(id);
        // delete feature
        GL.draw.deleteById(id);
        //this.obj.splice(i,1);
        measurement.$children[0].points.splice(i,1);
        // Eğer haritada gösterilen geometry silinirse en son geometriyi tekrar göster
        var g=measurement.$children[0].gosterilen;
        if(g.id==id){
            var len=this.obj.length;
            var geom=this.obj[len-1];
            measurement.$children[0].gosterilen=geom;
        }
        GL.bilgi("Geometri başarıyla silindi");
        
      }
  },
  template:
  '<div  class="modal fade modalbox" id="ModalListview" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 100px">Ölçüm Listesi</h5>'+
                        '<a @click="close" href="javascript:;" data-dismiss="modal">Close</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="wide-block p-0">'+
            
                            '<div class="table-responsive">'+
                                '<table class="table">'+
                                    '<thead>'+
                                        '<tr>'+
                                            '<th scope="col">#</th>'+
                                            '<th scope="col">Tipi</th>'+
                                            '<th scope="col">Değer</th>'+
                                            '<th scope="col">Göster</th>'+
                                            '<th scope="col">Silme</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody v-for="(val,i) in obj">'+
                                        '<tr val>'+
                                            '<th scope="row">{{i+1}}</th>'+
                                            '<td>{{val.type}}</td>'+
                                            '<td v-html="val.result">{{val.result}}</td>'+
                                            '<td @click="showFeature(val)">Göster</td>'+
                                            '<td  @click="deleteFeature(val.id,i)">Sil</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>'+
                            '</div>'+
        
                    '</div>'+
                    '</div>'+

                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var measuretable = new Vue({ el: '#measuretable' });