Vue.component('drawvector', {
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
              header:"Yeni Çizim Oluşturma",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Özellikler',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Çizimler',active:false,class:"tab-pane"}],

              point:true,
              line:true,
              polygon:true,
              layer:null,
              geojson:null,
              fields:[],
              button:false,
              drawngeojson:false,
              table:{},
          }
      },
      open:function(id){
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#drawvector',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });
        var source= GL.layerbox.getSource(id);
        this.layer=source;

        this.geojson=source.geojson;
        if(source.type=="collection" || source.type=="geojson"){
            this.point=true;
            this.line=true;
            this.polygon=true;
        }else if(source.type=="point"){
            this.point=true;
            this.line=false;
            this.polygon=false;
        }else if(source.type=="linestring"){
            this.point=false;
            this.line=true;
            this.polygon=false;
        }else if(source.type=="polygon"){
            this.point=false;
            this.line=false;
            this.polygon=true;
        }
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#drawvector');
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
      startDrawing:function(type){
          var that=this;
          that.setPage('tab1');
        switch(type){
            case 'point':{
                GL.draw.start("Point2",that.layer.id,function(geojson,layerId){
                    that.setPage('tab2');
                    //GL.draw.deleteAll();
                    that.drawngeojson=geojson;
                    if(that.layer.fields!=undefined){
                        that.fields=JSON.parse(JSON.stringify(that.layer.fields));
                    }
                    
                    that.fields.map(function(a){
                        a.value="";
                    })
                    that.button=true;

                });
                break
            }
            case 'linestring':{
                GL.draw.start("LineString",that.layer.id,function(geojson,layerId){
                    that.setPage('tab2');
                    //GL.draw.deleteAll();
                    that.drawngeojson=geojson
                    if(that.layer.fields!=undefined){
                        that.fields=JSON.parse(JSON.stringify(that.layer.fields));
                    }
                    that.fields.map(function(a){
                        a.value="";
                    })
                    that.button=true;
                });
                break
            }
            case 'polygon':{
                GL.draw.start("Polygon",that.layer.id,function(geojson,layerId){
                    that.setPage('tab2');
                    //GL.draw.deleteAll();
                    that.drawngeojson=geojson;
                    if(that.layer.fields!=undefined){
                        that.fields=JSON.parse(JSON.stringify(that.layer.fields));
                    }
                    that.fields.map(function(a){
                        a.value="";
                    })
                    that.button=true;
                });
                break
            }
        }
        
      },
      save:function(){
        var that=this;
        var a=this.fields;
        GL.draw.deleteAll();
        var d={};
        for(var i=0;i<a.length;i++){
            d[a[i].name]=a[i].value;
        }
        this.drawngeojson.properties=d;
        this.geojson.features.push(this.drawngeojson);
        GL.map.getSource(this.layer.id).setData(this.geojson);

        var fields = GL.datatable.getFields(this.layer.id);
        var columns = GL.datatable.readyColumns(fields);
        var data = GL.datatable.getData(this.geojson,fields);
        setTimeout(function(){
            that.table = new Tabulator("#datatableView1", {
              layout:"fitData",
              height:GL.config.clientHeight+'px',
              resizableColumns:false,
              columns:columns
            });
            setTimeout(function(){
              that.table.setData(data);
              that.button=false;
              that.fields=[];
              that.setPage('tab3');
              GL.bilgi("Kayıt Edildi");
            },10);
            
          },10);
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
                '<div class="wide-block pt-2 pb-2">'+

                '<div class="btn-group" role="group" style="width:100%">'+
                            '<button type="button" v-if="point" @click="startDrawing(\'point\')" class="btn btn-primary">Nokta At</button>'+
                            '<button type="button" v-if="line" @click="startDrawing(\'linestring\')" class="btn btn-primary">Çizgi Çiz</button>'+
                            '<button type="button" v-if="polygon" @click="startDrawing(\'polygon\')" class="btn btn-primary">Poligon Çiz</button>'+
                '</div>'+

                '<div v-for="item in fields" class="form-group boxed">'+
                    '<div class="input-wrapper">'+
                        '<label v-if="item.type==\'string\'" class="label" for="layerfield">{{item.name}}</label>'+
                            '<input v-if="item.type==\'string\'" v-model="item.value" type="text" class="form-control" id="layerfield" placeholder="Değer Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                    '</div>'+

                    '<div  class="input-wrapper">'+
                        '<label v-if="item.type==\'integer\' || item.type==\'double\'" class="label"  for="layerfield">{{item.name}}</label>'+
                            '<input v-if="item.type==\'integer\' || item.type==\'double\'" v-model="item.value" type="number" class="form-control" id="layerfield" placeholder="Değer Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                    '</div>'+
                    
                    '<div  class="input-wrapper">'+
                        '<label v-if="item.type==\'date\'" class="label" for="layerfield">{{item.name}}</label>'+
                            '<input v-if="item.type==\'date\'" v-model="item.value" type="date" class="form-control" id="layerfield" placeholder="Değer Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                    '</div>'+

                    '<div class="custom-control custom-checkbox">'+
                        '<input v-if="item.type==\'boolean\'" v-model="item.value" type="checkbox" class="custom-control-input" id="customCheck4">'+
                        '<label v-if="item.type==\'boolean\'" class="custom-control-label" for="customCheck4">{{item.name}}</label>'+
                    '</div>'+

                '</div>'+

                '<div v-if="button" class="form-group boxed">'+
                    '<div class="form-group basic">'+
                        '<div class="input-wrapper">'+
                        '<button @click="save" type="button" class="btn btn-primary btn-block">Kaydet</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+
  
                    '<div id="datatableView1"></div>'+
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var drawvector = new Vue({ el: '#drawvector' });