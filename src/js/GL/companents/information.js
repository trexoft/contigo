Vue.component('infopanel', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              geojson:{type:'FeatureCollection',features:[]}
          }
      },
      open:function(){
        this.onoff = true;
        $("#infoPanel").modal('show');
        var data = GL.draw.draw.getAll();
        // stops editing if exists
        if(data.features.length>0){
          var layer=GL.layerbox.getSource(GL.editingLayer);
          if(layer.geotype=="wfst" || layer.geotype=="wfs"){GL.editedFeatures.push(data.features[0])};

          for(var i=0;i<layer.geojson.features.length;i++){
            if(data.features[0].properties.index==layer.geojson.features[i].properties.index){
              layer.geojson.features[i]=data.features[0];
              GL.map.getSource(GL.editingLayer).setData(layer.geojson);
              GL.editingLayer="";
              GL.clearFilters();
              GL.draw.deleteAll();
            }
          }
          
        }
      },
      close:function(e){
        //this.onoff = false;
        //$("#infoPanel").modal('hide');
        this.geojson.features = [];
        setTimeout(function(){GL.clearFilters()},300)
        setTimeout(function(){GL.refreshSelectedLayer()},300)
      },
      pushGeoJSON:function(features){
        if(features.length>0){
          var lastFeatures = [];
          features.map(function(feature){
            var source = GL.layerbox.getSource(feature.source);
            var type = feature.layer.type;
            var geotype = type=='fill'?'K.Alan':type=='line'?'Çizgi':type=='circle'?'Nokta':'Sembol';
            var layerName = source.name;
            var geojson = feature.toJSON();
            geojson.layerName=layerName;
            geojson.geotype=geotype;
            lastFeatures.push(geojson);
          });
          if(lastFeatures.length>0){
            this.open();
            this.geojson.features = lastFeatures;
          }else{
            GL.uyari("Herangi Bir bilgiye rastlanılmamıştır");
          }
        }
        GL.loading(false);
      },
      settings:function(item){
        $("#infoPanel").modal('hide');
        console.log(item);
        mydialog.$children[0].open({
          header:'Seçenekler',
          content:'Bu geometriye hangi işlemi yapmak istersiniz?',
          buttons:[
            {id:'showonmap',title:'Haritada Göster',callback:function(a){
              // zoom to feature
              var geojson={type:'FeatureCollection',features:[]};
              GL.map.getSource("ShowLayer").setData(item);
              GL.zoomFeature(item);
              setTimeout(function(){
                GL.map.getSource("ShowLayer").setData(geojson);
              },3000)
            }},
            {id:'select',title:'Geometriyi Seç',callback:function(a){
              var s=GL.layerbox.getSource("SelectLayer");
              s.geojson.features.push(item);
              GL.map.getSource("SelectLayer").setData(s.geojson);
              var geojson={type:'FeatureCollection',features:[]};
              GL.map.getSource("InfoLayer").setData(geojson);
              var index=item.properties.index;

              var source=GL.layerbox.getSource(item.source);
              source.selectedIndex.push(index);
            }},
            {id:'edit',title:'Geometriyi Düzenle',callback:function(a){
              GL.hideEditingFeature(item);
            }},
            {id:'download',title:'Geometriyi İndir',callback:function(a){
              var geojson={type:'FeatureCollection',features:[]};
              var index=item.properties.index;
              var source=GL.layerbox.getSource(item.source);
              var features=source.geojson.features;
              for (var i=0; i<features.length; i++){
                if(features[i].properties.index==index){
                  geojson.features.push(features[i]);
                  break
                }
              }
              var reader = new ol.format.GeoJSON();
              var features=reader.readFeatures(geojson);
        
              var geojson2 = reader.writeFeatures(features, {});
              download(geojson2, item.layerName+"-feature"+ ".geojson", "text/plain");
              GL.bilgi("Geometri indirildi");
            }},
            {id:'delete',title:'Geometriyi Sil',callback:function(a){
              mydialog.$children[0].close(a.modal,false);

              setTimeout(function() {
                mydialog.$children[0].open({
                  header:'Katman Silme',
                  content:'Geometriyi silmek istediğinizden emin misiniz?',
                  buttons:[
                    {id:'evet',title:'Evet',callback:function(a){
                      var index=item.properties.index;
                      var source=GL.layerbox.getSource(item.source);

                      if(item.source.slice(0,4)=='wfst' || item.source.slice(0,3)=='wfs'){
                          for(var j=0;j<source.geojson.features.length;j++){
                            if(source.geojson.features[j].properties.index==item.properties.index){
                              GL.deletedFeatures.push(source.geojson.features[j]);
                              break
                            }
                          }
                      }

                      var features=source.geojson.features;
                      for (var i=0; i<features.length; i++){
                        if(features[i].properties.index==index){
                          features.splice(i,1);
                          break
                        }
                      }
                      GL.map.getSource(item.source).setData(source.geojson);
                      GL.bilgi("Geometri silindi");
                      GL.clearFilters();
                    }}
                  ]
                });   
              }, 400);
              
            }}
          ],
          callback:function(a){
            if(a.type=="close"){
              GL.bilgi("İşlem İptal Edildi");
              setTimeout(function(){GL.clearFilters()},300)
              setTimeout(function(){GL.refreshSelectedLayer()},300)
            }
          }
        });   
      }
  },
  template:
  '<div v-if="onoff">'+
    '<div class="modal fade panelbox panelbox-right" id="infoPanel" tabindex="-1" role="dialog">'+
      '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+
          '<div class="modal-header" style="margin-bottom: 0; background-color: #8BC34A;">'+
            '<h4 class="modal-title" style="color: #fff !important;">Geometrinin Bilgileri</h4>'+
            '<a href="javascript:;" data-dismiss="modal" @click="close" class="panel-close"> <ion-icon name="close-outline"></ion-icon> </a>'+
          '</div>'+
          '<div class="modal-body" style="padding: 0;">'+
            '<div class="accordion" id="infoPanelAcrd">'+
              '<div class="item" v-for="(item,sira) in geojson.features">'+
                '<div class="accordion-header">'+
                  '<button class="btn collapsed" type="button" data-toggle="collapse" :data-target="\'#infoPanelaccordion\'+sira"> {{item.layerName}} - {{item.geotype}}</button>'+
                '</div>'+
                '<div :id="\'infoPanelaccordion\'+sira" class="accordion-body collapse" data-parent="#infoPanelAcrd">'+
                  '<div class="accordion-content">'+
                    '<button @click="settings(item)" type="button" class="btn btn-primary btn-sm btn-block">Ayarlar</button>'+
                    '<table class="table">'+
                      '<thead><tr><th>Özellik</th><th>Değer</th></tr></thead>'+
                      '<tbody>'+
                        '<tr v-for="(prop,propName) in item.properties"><th>{{propName}}</th><td>{{prop}}</td></tr>'+
                      '</tbody>'+
                    '</table>'+
                  '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });

var infopanels = new Vue({ el: '#infopanel' });