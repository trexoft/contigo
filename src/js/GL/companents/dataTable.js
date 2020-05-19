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
              source:"",
              options:[{name:"Hepsini Seç",id:"all",icon:"chevron-forward-outline"},
                      {name:"Seçimleri İptal Et",id:"nonall",icon:"chevron-forward-outline"},
                      {name:"Filtrelenenleri Seç",id:"choosefilter",icon:"chevron-forward-outline"},
                      {name:"Seçilenleri Göster",id:"showchosen",icon:"chevron-forward-outline"},
                      {name:"Seçimi Ters Çevir",id:"crosschosen",icon:"chevron-forward-outline"}],

              operations:[{name:"Kayıt Sil",id:"deleterecords",icon:"chevron-forward-outline"},
                          {name:"Kayıt Göster",id:"showrecords",icon:"chevron-forward-outline"}],

              exports:[{name:"Geometriyi İndir",id:"download",icon:"chevron-forward-outline"},
                      {name:"Excel Olarak İndir",id:"excel",icon:"chevron-forward-outline"},
                      {name:"PDF Olarak İndir",id:"pdf",icon:"chevron-forward-outline"},
                      {name:"JSON Olarak İndir",id:"json",icon:"chevron-forward-outline"},
                      {name:"CSV Olarak İndir",id:"csv",icon:"chevron-forward-outline"}],

              queries:[{name:"Sözel Sorgular",id:"verbalqueries",icon:"chevron-forward-outline"},
                      {name:"Mekansal Sorgular",id:"scalarqueries",icon:"chevron-forward-outline"}],

              columnss:[{name:"Sütun Ayarları",id:"columnsettings",icon:"chevron-forward-outline"},
                        {name:"Sütun Hesaplamaları",id:"columncalculations",icon:"chevron-forward-outline"}]
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
              
            }},
            {id:'bookmark',title:'Sık Kullanılanlara Kaydet',callback:function(a){
              mydialog.$children[0].close(a.modal,false);
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
                    {id:'check1',type:'checkbox',title:'Otomatik Yükleme',getvalue:true}
                  ],
                  callback:function(a){
                    if(a.type=="close"){
                      GL.bilgi("İşlem İptal Edildi");
                    }else if(a.type=="ok"){
                        var bookmarkname=a.values[0].getvalue;
                        var autoLoad=a.values[1].getvalue;
                        if(bookmarkname==""){
                          GL.uyari("Kayıt adı boş olamaz");
                        }else{
                          GL.addBookmark(item,bookmarkname,autoLoad);
                        }
                    }
                    
                }});
              }, 500);
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
      },
      doSomething:function(id){
        var that=this;
        switch(id){
          case 'all':{
            //Hepsini Seç
            var layer=GL.layerbox.getSource(that.source);
            var indexes=[];
            for(var i=0;i<layer.geojson.features.length;i++){
              indexes.push(layer.geojson.features[i].properties.index);
            }
            layer.selectedIndex=indexes;
            var selectlayer=GL.layerbox.getSource("SelectLayer");

            for(var i=0;i<layer.geojson.features.length;i++){              
              if(selectlayer.geojson.features.length>0){
                for(var j=0;j<selectlayer.geojson.features.length;j++){
                  if(selectlayer.geojson.features[j].properties.index==layer.geojson.features[i].properties.index){
                    break
                  }else{
                    layer.geojson.features[i].source=that.source;
                    selectlayer.geojson.features.push(layer.geojson.features[i]);
                    break
                  }
                } 
              }else{
                layer.geojson.features[i].source=that.source;
                selectlayer.geojson.features.push(layer.geojson.features[i]);
              }
            }
            
            GL.map.getSource("SelectLayer").setData(layer.geojson);
            GL.clearFilters();
            GL.refreshSelectedLayer();
            that.setPage("tab1");
            break
          }
          case 'nonall':{
            // Seçimleri iptal et
            var layer=GL.layerbox.getSource(that.source);

            var selectlayer=GL.layerbox.getSource("SelectLayer");

            for(var i=0;i<selectlayer.geojson.features.length;i++){
              for(var j=0;j<layer.selectedIndex.length;j++){
                if(selectlayer.geojson.features[i].properties.index==layer.selectedIndex[j] || selectlayer.geojson.features[i].source==that.source){
                  selectlayer.geojson.features.splice(selectlayer.geojson.features[i],1);
                  i--
                  break;
                }
              }
            }

            layer.selectedIndex=[];
            GL.map.getSource("SelectLayer").setData(selectlayer.geojson);
            GL.clearFilters();
            GL.refreshSelectedLayer();
            that.setPage("tab1");
            break
          }
          case 'choosefilter':{
            // Filtrelenenleri seç
            secilenler = that.table.getData(true);
            var layer=GL.layerbox.getSource(that.source);
            var indexes=[];
            for(var i=0;i<secilenler.length;i++){
              indexes.push(secilenler[i].index);
            }
            layer.selectedIndex=indexes;

            var selectlayer=GL.layerbox.getSource("SelectLayer");
            for(var i=0;i<layer.selectedIndex.length;i++){
              for(var j=0;layer.geojson.features.length;j++){
                if(layer.selectedIndex[i]==layer.geojson.features[j].properties.index){
                  layer.geojson.features[j].source=that.source;
                  selectlayer.geojson.features.push(layer.geojson.features[j]);
                  break
                }
              }
            }
            
            GL.map.getSource("SelectLayer").setData(selectlayer.geojson);
            GL.clearFilters();
            GL.refreshSelectedLayer();
            that.setPage("tab1");
            
            break
          }
          case 'showchosen':{
            // Seçilenleri göster
            var layer=GL.layerbox.getSource(that.source);

            var selectedItems=layer.selectedIndex; // seçilen indexler
            that.table.selectRow(selectedItems); // select
            selected = that.table.getSelectedData(); 

            var listindex=[];
            for(var i=0;i<selected.length;i++){
              //var query={field:"index",type:"=",value:selected[i].index};
              listindex.push(selected[i].index);
            }
            that.table.clearFilter();
            that.table.clearFilter(true);
            that.table.clearHeaderFilter();
            that.table.setFilter([{
              field: "index",
              type: "in",
              value: listindex
            }]);
            that.setPage("tab2");
            break
          }
          case 'crosschosen':{
            //seçimi ters çevir
            var layer=GL.layerbox.getSource(that.source);
            var selectedItems=layer.selectedIndex; // seçilen indexler
            var selectlayer=GL.layerbox.getSource("SelectLayer");

            for(var j=0;j<selectlayer.geojson.features.length;j++){
              if(selectedItems.indexOf(selectlayer.geojson.features[j].properties.index)!=-1){
                selectlayer.geojson.features.splice(j,1);
                j--
              }
            }

            var newIndexes=[];
            for(var i=0;i<layer.geojson.features.length;i++){
              if(selectedItems.indexOf(layer.geojson.features[i].properties.index)==-1){
                newIndexes.push(layer.geojson.features[i].properties.index);
                selectlayer.geojson.features.push(layer.geojson.features[i]);
              }
            }
            layer.selectedIndex=newIndexes;
            GL.map.getSource("SelectLayer").setData(selectlayer.geojson);
            GL.clearFilters();
            GL.refreshSelectedLayer();
            that.setPage("tab1");
            break
          }

          case 'deleterecords':{
            // kayıtları sil
            mydialog.$children[0].open({
              header:'Kayıtları sil',
              content:'Hangi geometrileri silmek istersiniz?',
              buttons:[
                {id:'allrecords',title:'Bütün geometriler',callback:function(a){
                  //that.setPage("tab1");
                  var layer=GL.layerbox.getSource(that.source);
                  var geojson={type:'FeatureCollection',features:[]};
                  layer.geojson=geojson;
                  GL.map.getSource(that.source).setData(geojson);
                  that.table.replaceData() // refresh table
                  GL.bilgi("Bütün geometriler silindi");
                }},
                {id:'chosenrecords',title:'Seçilen Geometriler',callback:function(a){
                  var layer=GL.layerbox.getSource(that.source);
                  var selectedItems=layer.selectedIndex; // seçilen indexler
                  // seçili indexleri sil
                  for(var i=0; i<layer.geojson.features.length;i++){
                    if(selectedItems.indexOf(layer.geojson.features[i].properties.index)!=-1){
                      layer.geojson.features.splice(i,1);
                      i--
                    }
                  }
                  GL.map.getSource(that.source).setData(layer.geojson);

                  var selectLayer=GL.layerbox.getSource("SelectLayer");
                  for(var j=0; j<selectLayer.geojson.features.length;i++){
                    if(selectedItems.indexOf(selectLayer.geojson.features[j].properties.index)!=-1){
                      selectLayer.geojson.features.splice(j,1);
                      i--
                    }
                  }
                  GL.map.getSource("SelectLayer").setData(selectLayer.geojson);
                  layer.selectedIndex=[]; // selected clear
                  var data = GL.datatable.getData(layer.geojson,layer.fields);
                  that.table.setData(data);
                  GL.bilgi("Seçilen geometriler silindi");
                }},
                {id:'filteredrecords',title:'Filtrelenen Geometriler',callback:function(a){
                  secilenler = that.table.getData(true);
                  var indexes=[]; // filtered indexes
                  for(var i=0;i<secilenler.length;i++){
                    indexes.push(secilenler[i].index);
                  }

                  var layer=GL.layerbox.getSource(that.source);
                  for(var l=0;l<layer.selectedIndex.length;l++){
                    if(indexes.indexOf(layer.selectedIndex[l])!=-1){
                      layer.selectedIndex.splice(l,1);
                      l--
                    }
                  }
                  
                  // filtrelenen indexleri sil
                  for(var i=0; i<layer.geojson.features.length;i++){
                    if(indexes.indexOf(layer.geojson.features[i].properties.index)!=-1){
                      layer.geojson.features.splice(i,1);
                      i--
                    }
                  }
                  GL.map.getSource(that.source).setData(layer.geojson);

                  var selectLayer=GL.layerbox.getSource("SelectLayer");
                  for(var j=0; j<selectLayer.geojson.features.length;i++){
                    if(indexes.indexOf(selectLayer.geojson.features[j].properties.index)!=-1){
                      selectLayer.geojson.features.splice(j,1);
                      i--
                    }
                  }
                  GL.map.getSource("SelectLayer").setData(selectLayer.geojson);
                  var data = GL.datatable.getData(layer.geojson,layer.fields);
                  that.table.setData(data);
                  GL.bilgi("Filtrelenen geometriler silindi");
                }}
              ]
            });   
            break
          }
          case 'showrecords':{
            // kayıt göster
            mydialog.$children[0].open({
              header:'Kayıtları Göster',
              content:'Hangi geometrileri görüntelemek istersiniz?',
              buttons:[
                {id:'allrecords',title:'Bütün geometriler',callback:function(a){
                  that.setPage("tab1");

                  var layer=GL.layerbox.getSource(that.source);
                  var bbox = turf.bbox(layer.geojson);

                  var geojson={type:'FeatureCollection',features:[]};
                  GL.map.getSource("ShowLayer").setData(layer.geojson);
                  GL.zoomToBbox(bbox);
                  setTimeout(function(){
                    GL.map.getSource("ShowLayer").setData(geojson);
                  },3000)
                }},
                {id:'chosenrecords',title:'Seçilen Geometriler',callback:function(a){
                  that.setPage("tab1");
                  var layer=GL.layerbox.getSource(that.source);
                  var selectedItems=layer.selectedIndex; // seçilen indexler

                  var geojson1={type:'FeatureCollection',features:[]};

                  for(var i=0; i<layer.geojson.features.length;i++){
                    if(selectedItems.indexOf(layer.geojson.features[i].properties.index)!=-1){
                      geojson1.features.push(layer.geojson.features[i]);
                    }
                  }
                  if(geojson1.features.length!=0){
                    var bbox = turf.bbox(geojson1);

                    var geojson2={type:'FeatureCollection',features:[]};
                    GL.map.getSource("ShowLayer").setData(geojson1);
                    GL.zoomToBbox(bbox);
                    setTimeout(function(){
                      GL.map.getSource("ShowLayer").setData(geojson2);
                    },3000)
                  }else{
                    GL.uyari("Seçilen geometri bulunamadı");
                  }
                  
                }},
                {id:'filteredrecords',title:'Filtrelenen Geometriler',callback:function(a){
                  that.setPage("tab1");
                  secilenler = that.table.getData(true);
                  var indexes=[]; // filtered indexes
                  for(var i=0;i<secilenler.length;i++){
                    indexes.push(secilenler[i].index);
                  }

                  var geojson1={type:'FeatureCollection',features:[]};
                  var layer=GL.layerbox.getSource(that.source);
                  for(var i=0; i<layer.geojson.features.length;i++){
                    if(indexes.indexOf(layer.geojson.features[i].properties.index)!=-1){
                      geojson1.features.push(layer.geojson.features[i]);
                    }
                  }

                  if(geojson1.features.length!=0){
                    var bbox = turf.bbox(geojson1);

                    var geojson2={type:'FeatureCollection',features:[]};
                    GL.map.getSource("ShowLayer").setData(geojson1);
                    GL.zoomToBbox(bbox);
                    setTimeout(function(){
                      GL.map.getSource("ShowLayer").setData(geojson2);
                    },3000)
                  }else{
                    GL.uyari("Filtrelenen geometri bulunamadı");
                  }

                }}
              ]
            });   
            break
          }

          case 'download':{
            // Geometriyi İndir
            var layer=GL.layerbox.getSource(that.source);

            secilenler = that.table.getData(true);
            var indexes=[]; // filtered indexes
            for(var i=0;i<secilenler.length;i++){
              indexes.push(secilenler[i].index);
            }

            layerdownload.$children[0].open(layer,indexes);
            break
          }
          case 'excel':{
            // Excel İndir
            var layer=GL.layerbox.getSource(that.source);
            that.table.download("xlsx", layer.name + "-datatable.xlsx", {
              sheetName: "GISLAYER-mobil"
            });
            break
          }
          case 'pdf':{
            // pdf İndir
            var layer=GL.layerbox.getSource(that.source);
            var dat1 = this.table.getData()[0];
            var sayi = 0;

            for (var i in dat1) {
              sayi++;
            }

            var yon = "portrait";
            var size = 10;

            if (sayi >= 7) {
              yon = "landscape";
              size = 7;
            }

            that.table.download("pdf", layer.name + "-"+ "veritablosu" + ".pdf", {
              orientation: yon,
              //set page orientation to portrait
              title: layer.name + " " +  "Veri Tablosu",
              //add title to report,
              autoTable: {
                styles: {
                  fontSize: size
                }
              }
            });
            break
          }
          case 'json':{
            // json İndir
            var layer=GL.layerbox.getSource(that.source);
            that.table.download("json", layer.name + "-datatable.json");
            break
          }
          case 'csv':{
            // csv İndir
            var layer=GL.layerbox.getSource(that.source);
            that.table.download("csv", layer.name + "-datatable.csv");
            break
          }

          case 'verbalqueries':{
            // Sözel sorgular
            var source=GL.layerbox.getSource(that.source);
            var columns = source.fields;
            
            var fieldOptions=[];
            for(var j=0;j<columns.length;j++){
              var val={name:columns[j].name,value:columns[j].name,type:columns[j].type};
              fieldOptions.push(val);
            }
            verbalquery.$children[0].open(fieldOptions);
            break
          }
          case 'scalarqueries':{
            // mekansal sorgular 
            spatialquery.$children[0].open(that.source);
            break
          }

          case 'columnsettings':{
            // sütun ayarları 
            columnsettings.$children[0].open(that.source);
            break
          }
          case 'columncalculations':{
            // sütun hesaplamaları 
            columncalculations.$children[0].open(that.source);
            break
          }
        }
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
                '<div class="wide-block pt-2 pb-2">'+
  
                  '<div class="accordion" id="accordionExample3">'+
                  // Seçim Menüsü
                    '<div class="item">'+
                        '<div class="accordion-header">'+
                            '<button class="btn collapsed" type="button" data-toggle="collapse" data-target="#accordion1">'+
                                '<ion-icon name="reorder-three-outline"></ion-icon>'+
                                'Seçim'+
                            '</button>'+
                        '</div>'+
                        '<div id="accordion1" class="accordion-body collapse" data-parent="#accordionExample3">'+
                          '<ul class="listview flush transparent no-line image-listview mt-2" style="margin-top: 0 !important;">'+
                            '<li v-for="item in options">' +
                              '<a @click="doSomething(item.id)" href="#" style="padding: 0; padding-left: 25px; min-height: 35px;"  class="item" >' +
                                '<div class="icon-box"> <ion-icon :name="item.icon"></ion-icon> </div>' +
                                '<div class="in"> <div>{{item.name}}</div> </div>' +
                              '</a>' +
                            '</li>' +
                          '</ul>'+
                        '</div>'+
                    '</div>'+
                    // İşlem Menüsü
                    '<div class="item">'+
                        '<div class="accordion-header">'+
                            '<button class="btn collapsed" type="button" data-toggle="collapse" data-target="#accordion2">'+
                                '<ion-icon name="calculator-outline"></ion-icon>'+
                                'İşlem'+
                            '</button>'+
                        '</div>'+
                        '<div id="accordion2" class="accordion-body collapse" data-parent="#accordionExample3">'+
                          '<ul class="listview flush transparent no-line image-listview mt-2" style="margin-top: 0 !important;">'+
                            '<li v-for="item in operations">' +
                              '<a @click="doSomething(item.id)" href="#" style="padding: 0; padding-left: 25px; min-height: 35px;"  class="item" >' +
                                '<div class="icon-box"> <ion-icon :name="item.icon"></ion-icon> </div>' +
                                '<div class="in"> <div>{{item.name}}</div> </div>' +
                              '</a>' +
                            '</li>' +
                          '</ul>'+
                        '</div>'+
                    '</div>'+
                    // Dışa Aktar
                    '<div class="item">'+
                        '<div class="accordion-header">'+
                            '<button class="btn collapsed" type="button" data-toggle="collapse" data-target="#accordion3">'+
                                '<ion-icon name="download-outline"></ion-icon>'+
                                'Dışa Aktar'+
                            '</button>'+
                        '</div>'+
                        '<div id="accordion3" class="accordion-body collapse" data-parent="#accordionExample3">'+
                          '<ul class="listview flush transparent no-line image-listview mt-2" style="margin-top: 0 !important;">'+
                            '<li v-for="item in exports">' +
                              '<a @click="doSomething(item.id)" href="#" style="padding: 0; padding-left: 25px; min-height: 35px;"  class="item" >' +
                                '<div class="icon-box"> <ion-icon :name="item.icon"></ion-icon> </div>' +
                                '<div class="in"> <div>{{item.name}}</div> </div>' +
                              '</a>' +
                            '</li>' +
                          '</ul>'+
                        '</div>'+
                    '</div>'+

                    // Sorgular 
                    '<div class="item">'+
                        '<div class="accordion-header">'+
                            '<button class="btn collapsed" type="button" data-toggle="collapse" data-target="#accordion4">'+
                                '<ion-icon name="server-outline"></ion-icon>'+
                                'Sorgular'+
                            '</button>'+
                        '</div>'+
                        '<div id="accordion4" class="accordion-body collapse" data-parent="#accordionExample3">'+
                          '<ul class="listview flush transparent no-line image-listview mt-2" style="margin-top: 0 !important;">'+
                            '<li v-for="item in queries">' +
                              '<a @click="doSomething(item.id)" href="#" style="padding: 0; padding-left: 25px; min-height: 35px;"  class="item" >' +
                                '<div class="icon-box"> <ion-icon :name="item.icon"></ion-icon> </div>' +
                                '<div class="in"> <div>{{item.name}}</div> </div>' +
                              '</a>' +
                            '</li>' +
                          '</ul>'+
                        '</div>'+
                    '</div>'+

                    // Sütunlar
                    '<div class="item">'+
                        '<div class="accordion-header">'+
                            '<button class="btn collapsed" type="button" data-toggle="collapse" data-target="#accordion5">'+
                                '<ion-icon name="stats-chart-outline"></ion-icon>'+
                                'Sütunlar'+
                            '</button>'+
                        '</div>'+
                        '<div id="accordion5" class="accordion-body collapse" data-parent="#accordionExample3">'+
                          '<ul class="listview flush transparent no-line image-listview mt-2" style="margin-top: 0 !important;">'+
                            '<li v-for="item in columnss">' +
                              '<a @click="doSomething(item.id)" href="#" style="padding: 0; padding-left: 25px; min-height: 35px;"  class="item" >' +
                                '<div class="icon-box"> <ion-icon :name="item.icon"></ion-icon> </div>' +
                                '<div class="in"> <div>{{item.name}}</div> </div>' +
                              '</a>' +
                            '</li>' +
                          '</ul>'+
                        '</div>'+
                    '</div>'+

                  '</div>'+
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var datatable = new Vue({ el: '#datatable' });