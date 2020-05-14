Vue.component('datatable', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:false,
              tab1class:"",
              tab2class:"",
              tab3class:"",
              header:"Veri Tablosu",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Tablo',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'İşlemler',active:false,class:"tab-pane"}],
              table:{},
              source:""
          }
      },
      open:function(sourceId){
        var that = this;
        this.onoff = true;
        this.setPage('tab2');
        this.source=sourceId;
        var source=GL.layerbox.getSource(sourceId);
        this.header = source.name+' Katmanı Veri Tablosu';
        var geojson = source.geojson;
        debugger;
        var columns = GL.datatable.readyColumns(source.fields);
        var data = GL.datatable.getData(geojson,source.fields);
        var printIcon = function printIcon(cell, formatterParams) {
          return "<span><ion-icon name='settings-outline'></ion-icon></span>";
        };
        columns.unshift({
          formatter: printIcon,
          headerSort: false,
          width: 40,
          align: "center",
          cellClick: function cellClick(e, row) {
            GL.titresim();
            var data = row.getData();
            var source=GL.layerbox.getSource(that.source);
            //var data2={};
            for(var i=0;i<source.geojson.features.length;i++){
              if(data.index==source.geojson.features[i].properties.index){
                var data2={layerName:source.name,type:"Feature",geometry:source.geojson.features[i].geometry, properties:source.geojson.features[i].properties, source:that.source};
                //infopanel.$children[0].settings(data2);
                that.settings(data2);
                break
              }
            }
          }
        });
        setTimeout(function(){
          that.table = new Tabulator("#datatableView1", {
            layout:"fitData",
            height:GL.config.clientHeight+'px',
            resizableColumns:false,
            columns:columns
          });
          setTimeout(function(){
            that.table.setData(data);
          },10);
          
        },10);
      },
      close:function(e){
        this.onoff = false;
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        $("#map").show();
      },
      setPage:function(pageId){
        var that = this;
        var activePage = this.pages.find(function(p){
          if(p.active==true){
            return p;
          }
        });

        var newPage = this.pages.find(function(p){
          if(p.id==pageId){
            return p;
          }
        });

        if(typeof activePage!=="undefined"){
          if(activePage.id==newPage.id){
            return false;
          }else{

            var activePageClass = "fadeOutRight";
            var newPageClass = "fadeInLeft";
            if(newPage.i>activePage.i){
              activePageClass="fadeOutLeft";
              newPageClass="fadeInRight";
            }

            this.pages[activePage.i].active=false;
            this.pages[newPage.i].active=true;
            this.pages[activePage.i].class="tab-pane animated3 "+activePageClass+" active";
            setTimeout(function(){
              that.pages[activePage.i].class="tab-pane";
              that.pages[newPage.i].class="tab-pane animated3 "+newPageClass+" active";
              that.doIt(newPage.id);
            },200);
          }
        }else{
          $("#map").hide();
          this.pages[newPage.i].active=true;
          this.pages[newPage.i].class="tab-pane animated3 fadeIn active"
        }
      },
      setPageDirection:function(direction){
        var activePage = this.pages.find(function (p) {
          if (p.active == true) {
            return p;
          }
        });
        var min = 0;
        var max = this.pages.length-1;
        var now = activePage.i;
        var artis = 0;
        if(direction=="right"){
          artis=-1;
        }else{
          artis=1;
        }
        var newnow = now+artis;
        if(newnow<min){
          newnow = min;
        }
        if(newnow>max){
          newnow = max;
        }
        var newPage = this.pages.find(function (p) {
          if (p.i == newnow) {
            return p;
          }
        });
        this.setPage(newPage.id);
  
      },
      doIt:function(tabId){
        switch(tabId){
          case 'tab1':{
            $("#map").show();
            break;
          }
          case 'tab2':{
            $("#map").hide();
            break;
          }
          case 'tab3':{
            $("#map").hide();
            break;
          }
        }
      },
      settings:function(item){
        $("#infoPanel").modal('hide');
        this.setPage("tab1");
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
              GL.clearFilters();
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

      '<div class="appHeader bg-primary text-light">'+
      '<div class="left">'+
          '<a href="javascript:;" class="headerButton goBack" @click="close">'+
              '<ion-icon name="chevron-back-outline"></ion-icon>'+
          '</a>'+
      '</div>'+
        '<div class="pageTitle">{{header}}</div>'+
        '<div class="right"></div>'+
      '</div>'+


        //header
      '<div class="extraHeader p-0">'+
          '<ul class="nav nav-tabs lined" role="tablist">'+
          '<li class="nav-item" v-for="(item,i) in pages">'+
                  '<a :class="item.active==true?\'nav-link active\':\'nav-link\'" @click="setPage(item.id)" href="#">'+
                      '{{item.title}}'+
                  '</a>'+
              '</li>'+
          '</ul>'+
      '</div>'+
    
          '<div id="appCapsule" class="extra-header-active" style="padding-top: 50px !important;">'+

            '<div class="tab-content mt-1">'+

            // tab2
            '<div :class="pages[1].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block">'+

                  '<div id="datatableView1"></div>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="section-title">Tab 3</div>'+
                '<div class="wide-block pt-2 pb-2">'+
  
                  'tab3'+
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var datatable = new Vue({ el: '#datatable' });