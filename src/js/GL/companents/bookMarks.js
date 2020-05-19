Vue.component('bookmarks', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Sık Kullanılanlar",
              close:"Kapat",
              bookmarks:[]
          }
      },
      open:function(){
        $("#bookmarkModal").modal('show');
        var bookmark = localStorage.getItem('bookmarks');
        this.bookmarks=JSON.parse(bookmark);
      },
      close:function(e){
        $("#bookmarkModal").modal('hide');
      },
      close2:function(e){
        $("#bookmarkModal").modal('hide');
      },
      options:function(item){
        $("#bookmarkModal").modal('hide');
        mydialog.$children[0].open({
            header:'Seçenekler',
            content:'Hangi işlemi yapmak istersiniz?',
            buttons:[
              {id:'show',title:'Göster',callback:function(a){
                var props = item.properties;
                var propsAddStatus = props==null || props==undefined;
                if(propsAddStatus){
                    props={};
                }
                var fields = GL.datatable.getFieldsFromProperties(props);
                var layer=GL.layerbox.getSource("BookmarkLayer");
                var control=false;
                for(var i=0;i<layer.geojson.features.length;i++){
                    if(item.bookId==layer.geojson.features[i].bookId){
                        control=true;
                    }
                }
                if(control==false){
                    layer.geojson.features.push(item);
                }
                
                GL.map.getSource("BookmarkLayer").setData(layer.geojson);
                //GL.addGeojsonToLayer(geojson,id,color,information);
                GL.zoomFeature(item);
              }},
              {id:'delete',title:'Sil',callback:function(a){
                var data=localStorage.getItem('bookmarks');
                data=JSON.parse(data);
                for(var i=0;i<data.length;i++){
                    if(item.properties.index==undefined){
                        if(item.id==data[i].id){
                            data.splice(i,1);
                        }
                    }else if(item.source==data[i].source && item.properties.index==data[i].properties.index && item.properties!={}){
                        data.splice(i,1);
                    }
                }
                GL.savelocalstorage("bookmarks",data);
                setTimeout(function() {
                    GL.getBookmarks();
                }, 300);
              }},
              {id:'navigate',title:'Buraya Git',callback:function(a){

              }}
            ]
        });   
      },
      addLocation:function(){
        $("#bookmarkModal").modal('hide');
        var sourceid="bookmark"+Date.now();
        GL.draw.deleteAll();
        GL.draw.start("Point2",sourceid,function(geojson,layerId){
            geojson.source=sourceid;
            var d=JSON.parse(localStorage.getItem('bookmarks'));
            if(d){
                var n=d.length+1;
            }else{
                var n=1;
            }
            var defaultName="Önemli Yer-"+n;
            setTimeout(function() {
                mydialoginputs.$children[0].open({
                  header:'Sık Kullanılanara Ekle',
                  inputs:[
                    {id:'yazi1',type:'text',title:'Kayıt Adı',getvalue:defaultName},
                    {id:'check1',type:'checkbox',title:'Otomatik Yükleme',getvalue:true},
                  ],
                  callback:function(a){
                    if(a.type=="close"){
                      GL.bilgi("İşlem İptal Edildi");
                      GL.draw.deleteAll();
                    }else if(a.type=="ok"){
                        GL.draw.deleteAll();
                        var bookmarkname=a.values[0].getvalue;
                        var autoLoad=a.values[1].getvalue;
                        if(bookmarkname==""){
                            GL.uyari("Kayıt adı boş olamaz");
                        }else{
                            GL.addBookmark(geojson,bookmarkname,autoLoad);
                        }
                    }
                    
                }});
            }, 200);
        });
      },
      changeVisibility:function(item){
        var bookmark = JSON.parse(localStorage.getItem('bookmarks'));
        var layer=GL.layerbox.getSource("BookmarkLayer");
        for(var i=0;i<layer.geojson.features.length;i++){
            if(item.bookId==layer.geojson.features[i].bookId){
                layer.geojson.features[i]=item;
            }
        }

        var bookmarks=[];
        for(var i=0;i<bookmark.length;i++){
            if(item.bookId==bookmark[i].bookId){
                bookmark[i]=item;
                bookmarks.push(item);
            }else{
                bookmarks.push(bookmark[i]);
            }
        }
        GL.savelocalstorage("bookmarks",bookmarks);
        var geojson={type:'FeatureCollection',features:[]};
        GL.map.getSource("BookmarkLayer").setData(geojson);
        setTimeout(function() {
            GL.getBookmarks();
        }, 300);
        //GL.getBookmarks();
      }
  },
  template:
  '<div  class="modal fade modalbox" id="bookmarkModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                        '<button @click="addLocation" type="button" class="btn btn-primary btn-block">Önemli Yer Ekle</button>'+
                            '<ul class="listview image-listview" >'+
                                '<li v-for="item in bookmarks"  >'+
                                    '<div class="item">'+
                                            '<div class="custom-control custom-checkbox mb-1">'+
                                                '<input @change="changeVisibility(item)" type="checkbox" class="custom-control-input" v-model="item.autoLoad" :id="item.bookId">'+
                                                '<label class="custom-control-label" :for="item.bookId"></label>'+
                                            '</div>'+
                                            '<ion-icon name="bookmark-outline"></ion-icon>'+
                                        '<div class="in">'+
                                            '<div style="padding-left:15px;">'+
                                                '{{item.bookmarkName}}'+
                                                //'<footer>{{item.typeName}}</footer>'+
                                            '</div>'+
                                            
                                            
                                            
                                            '<span @click="options(item)" class="icon-box" style="width: 100%; background-color:#c8d1e3 !important;">'+
                                                '<ion-icon name="ellipsis-vertical"></ion-icon>'+
                                            '</span>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>'+
                            '</ul>'+
        
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var bookmarks = new Vue({ el: '#bookmarks' });