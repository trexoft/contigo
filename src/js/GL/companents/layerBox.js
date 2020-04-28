Vue.component('layerbox', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Katman Kutusu",
              close:"Kapat",
              activeSources:[],
              light:{backgroundColor:'#efefef'},
              dark:{backgroundColor:'#333333'},
              geojson:{type:'FeatureCollection',features:[]},
          }
      },
      open:function(){
        $("#layerboxModal").modal('show');
        //console.log(GL.layerbox.sources);
        //this.sources=GL.layerbox.sources;
        this.getSources();
      },
      close:function(){
        //$("#layerboxModal").modal('hide');
        this.activeSources=[];
        this.geojson={type:'FeatureCollection',features:[]};
      },
      closee:function(){
        GL.titresim();
        $("#layerboxModal").modal('hide');
        this.activeSources=[];
        this.geojson={type:'FeatureCollection',features:[]};
      },
      getSources:function(){
        var that=this;
        var sources=GL.layerbox.sources;
        
        
        
        sources.map(function (item) {
            var info=that.getImg(item.type);
            var img=info.img;
            var typeName=info.name;

            var color=that.getColor(item.id);
            var color_info=color.color;
            var style="width: 100%; background-color:"+color_info+" !important;";
            var s={id:item.id,name:item.name,type:item.type,layers:item.layers,img:img,typeName:typeName, style:style};
            that.activeSources.push(s);
        });
      },
      getImg:function(type){
        var result=GL.layerbox.fileTypes.find(function(file){if(file.id==type){return file}});
        return result
      },
      getColor:function(id){
        var result=GL.layerbox.layers.find(function(file){if(file.id==id+"-point"){return file}});
        if(result==undefined){
          var result=GL.layerbox.layers.find(function(file){if(file.id==id+"-line"){return file}});
          if(result==undefined){
            var result=GL.layerbox.layers.find(function(file){if(file.id==id+"-polygon"){return file}});
            if(result==undefined){
              var result={color:"#fc3503"};
            }
          }
        }
        return result
      },
    options:function(obj){
      console.log(obj);
      GL.titresim();
      var that=this;
      if(obj.type=="wms" || obj.type=="xyz" || obj.type=="wmts"){
        actionsheet.$children[0].open({
          header:'Seçenekler - '+obj.name,
          buttons:[
            {id:'settings',title:'Düzenle',callback:function(a){
              //get features
              var source=GL.layerbox.getSource(obj.id);

              that.closee();
            }},
            {id:'share',title:'Paylaş',callback:function(a){
              console.log(a);
            }},
            {id:'save',title:'Sisteme Kayıt Et',callback:function(a){
              console.log(a);
            }},
            {id:'delete',title:'Katmanı Sil',callback:function(a){
              actionsheet.$children[0].close(a.action,false);
              that.closee();
              mydialog.$children[0].open({
                header:'Katman Silme',
                content:obj.name+' katmanını silmek istediğinizden emin misiniz?',
                buttons:[
                  {id:'evet',title:'Evet',callback:function(a){
                    GL.removeRasterLayerByID(obj.id);
                  }}
                ]
              });   
            }}
          ]
        });    

      }else{
        actionsheet.$children[0].open({
          header:'Seçenekler - '+obj.name,
          buttons:[
            {id:'table',title:'Öznitelik Tablosunu Aç',callback:function(a){
                console.log(a);
                that.closee();
                datatable.$children[0].open(obj.id);
            }},
            {id:'newdraw',title:'Yeni Çizim Yap',callback:function(a){
              console.log(a);
              that.closee();
              drawvector.$children[0].open(obj.id);
            }},
            {id:'showonmap',title:'Haritada Göster',callback:function(a){
              //get features
              var source=GL.layerbox.getSource(obj.id);
              var bbox = turf.bbox(source.geojson);

              that.closee();
              GL.zoomToBbox(bbox);
            }},
            {id:'changecolor',title:'Renk Değiştir',callback:function(a){
              GL.renkAl(function(color){
                that.closee();
                GL.changeLayerColor(obj,color);
              });
            }},
            {id:'download',title:'İndir',callback:function(a){
              that.closee();
              layerdownload.$children[0].open(obj);
            }},
            {id:'share',title:'Paylaş',callback:function(a){
              console.log(a);
            }},
            {id:'save',title:'Sisteme Kayıt Et',callback:function(a){
              console.log(a);
            }},
            {id:'delete',title:'Katmanı Sil',callback:function(a){
              actionsheet.$children[0].close(a.action,false);
              that.closee();
              mydialog.$children[0].open({
                header:'Katman Silme',
                content:obj.name+' katmanını silmek istediğinizden emin misiniz?',
                buttons:[
                  {id:'evet',title:'Evet',callback:function(a){
                    GL.removeLayerByID(obj.id);
                  }}
                ]
              });   
            }}
          ]
        });    
      }
        
    },
  },
  template:
  '<div  class="modal fade modalbox" id="layerboxModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px;">{{header}}</h5>'+
                        '<a @click="closee" href="javascript:;" data-dismiss="modal" style="color:#8bc34a;">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0" :style="GL.config.darkMode==true ? dark:light">'+
                        '<div class="wide-block p-0">'+

                            //'Modal Content'+
                            '<ul class="listview image-listview" >'+
                                '<li v-for="item in activeSources"  >'+
                                    '<div class="item">'+
                                        '<img :src="item.img" alt="image" class="imaged w64" style="height:30px !important; width: 30px !important;">'+
                                        '<div class="in">'+
                                            '<div style="padding-left:15px;">'+
                                                //'<header>Name</header>'+
                                                '{{item.name}}'+
                                                '<footer>{{item.typeName}}</footer>'+
                                                //'<div class="progress mb-1" >'+
                                                //    '<div class="progress-bar" :style="item.style" aria-valuenow="25" aria-valuemin="0"'+
                                                //        'aria-valuemax="100"></div>'+
                                                //'</div>'+
                                            '</div>'+
                                                
                                            '<span @click="options(item)" class="icon-box" :style="item.style">'+
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

var layerbox = new Vue({ el: '#layerbox' });