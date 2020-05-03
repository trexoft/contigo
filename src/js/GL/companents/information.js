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
      },
      close:function(e){
        this.onoff = false;
        $("#infoPanel").modal('hide');
        this.geojson.features = [];
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
      }
  },
  template:
  '<div v-if="onoff">'+
    '<div class="modal fade panelbox panelbox-right" id="infoPanel" tabindex="-1" role="dialog">'+
      '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<h4 class="modal-title">Geometrinin Bilgileri</h4>'+
            '<a href="javascript:;" data-dismiss="modal" class="panel-close"> <ion-icon name="close-outline"></ion-icon> </a>'+
          '</div>'+
          '<div class="modal-body" style="padding: 0;">'+
            '<div class="accordion" id="infoPanelAcrd">'+
              '<div class="item" v-for="(item,sira) in geojson.features">'+
                '<div class="accordion-header">'+
                  '<button class="btn collapsed" type="button" data-toggle="collapse" :data-target="\'#infoPanelaccordion\'+sira"> {{item.layerName}} - {{item.geotype}}</button>'+
                '</div>'+
                '<div :id="\'infoPanelaccordion\'+sira" class="accordion-body collapse" data-parent="#infoPanelAcrd">'+
                  '<div class="accordion-content">'+
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