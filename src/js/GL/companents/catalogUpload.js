Vue.component('catalogload', {
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
              header:"Katalog",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Katmanlar',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Tab - 3',active:false,class:"tab-pane"}],
              data:null,
              layers:[],
              catalogName:"",
              activeLayers:[]
          }
      },
      open:function(data){
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#catalogload',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });
        this.data=data;
        this.catalogName=this.data.name;
        this.listLayer(data);
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#catalogload');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        this.layers=[];
        this.catalogName="";
        this.activeLayers=[];
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
      listLayer:function(data){
        for(var i=0;i<data.layers.length;i++){
            var layername=data.layers[i].name;
            var layerid=data.layers[i].id;
            this.layers.push({name:layername,id:layerid,active:false})
        }
      },
      getCatalogSettings:function(id){

            var catalogname=this.data.name;
            var catalogid=this.data.id;

            var center=this.data.center;
            var zoom=this.data.zoom;
            var pitch=this.data.pitch;
            var rotate=this.data.rotate;
            var darkmode=this.data.darkMode;
            
          for(var i=0;i<id.length;i++){
              if(this.data.layers[id[i]].method=="vector-custom"){
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].epsg;
                var fields=this.data.layers[id[i]].fields;
                var geotype=this.data.layers[id[i]].geotype;
                var indexcolumn=this.data.layers[id[i]].indexColumn;
                var Id=this.data.layers[id[i]].id;

                var label=GL.style.label(this.data.layers[id[i]].labeling);
                
                var lastindex=this.data.layers[id[i]].lastIndex;
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={label:label,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, fields:fields, type:geotype, id:Id, indexcolumn:indexcolumn, lastIndex:lastindex, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex, style:style,systemrecovery:systemrecovery };
                
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="vector-url" && this.data.layers[id[i]].fileType!="excel"){
                var url=this.data.layers[id[i]].url;
                var fileType=this.data.layers[id[i]].fileType;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].epsg;
                var fields=this.data.layers[id[i]].fields;
                var geotype=this.data.layers[id[i]].geotype;
                var indexcolumn=this.data.layers[id[i]].indexColumn;
                var Id=this.data.layers[id[i]].id;
                
                var label=GL.style.label(this.data.layers[id[i]].labeling);
                var lastindex=this.data.layers[id[i]].lastIndex;
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={label:label,url:url,fileType:fileType,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, fields:fields, type:geotype, id:Id, indexcolumn:indexcolumn, lastIndex:lastindex, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex, style:style,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="createWFS"){
                var url=this.data.layers[id[i]].url;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].srsname;
                var fields=this.data.layers[id[i]].fields;
                var geotype=this.data.layers[id[i]].geotype;
                var indexcolumn=this.data.layers[id[i]].indexColumn;
                var Id=this.data.layers[id[i]].id;
                
                var version=this.data.layers[id[i]].version;
                var typename=this.data.layers[id[i]].typename;
                
                var label=GL.style.label(this.data.layers[id[i]].labeling);
                var lastindex=this.data.layers[id[i]].lastIndex;
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={version:version,typename:typename,label:label,url:url,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, fields:fields, type:geotype, id:Id, indexcolumn:indexcolumn, lastIndex:lastindex, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex, style:style,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="createWMS"){
                var url=this.data.layers[id[i]].url;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].srsname;
                var geotype=this.data.layers[id[i]].geotype;
                var Id=this.data.layers[id[i]].id;
                
                var version=this.data.layers[id[i]].version;
                var typename=this.data.layers[id[i]].typename;
                var selectedType=this.data.layers[id[i]].selectedType;
                var opacity=this.data.layers[id[i]].opacity;
                var minzoom=this.data.layers[id[i]].minZoom;
                var maxzoom=this.data.layers[id[i]].maxZoom;
                
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={opacity:opacity,minzoom:minzoom,maxzoom:maxzoom,selectedType:selectedType,version:version,typename:typename,url:url,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, type:geotype, id:Id, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="createWMTS"){
                var url=this.data.layers[id[i]].url;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].srsname;
                var geotype=this.data.layers[id[i]].geotype;
                var Id=this.data.layers[id[i]].id;
                
                var selectedType=this.data.layers[id[i]].selectedType;
                var opacity=this.data.layers[id[i]].opacity;
                var minzoom=this.data.layers[id[i]].minZoom;
                var maxzoom=this.data.layers[id[i]].maxZoom;
                
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={opacity:opacity,minzoom:minzoom,maxzoom:maxzoom,selectedType:selectedType,url:url,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, type:geotype, id:Id, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="createXYZ"){
                var url=this.data.layers[id[i]].url;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].srsname;
                var geotype=this.data.layers[id[i]].geotype;
                var Id=this.data.layers[id[i]].id;
                
                var opacity=this.data.layers[id[i]].opacity;
                var minzoom=this.data.layers[id[i]].minZoom;
                var maxzoom=this.data.layers[id[i]].maxZoom;
                
                var label=GL.style.label(this.data.layers[id[i]].labeling);
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={opacity:opacity,minzoom:minzoom,maxzoom:maxzoom,label:label,url:url,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, type:geotype, id:Id, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="createMVT"){
                var url=this.data.layers[id[i]].url;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].srsname;
                var geotype=this.data.layers[id[i]].geotype;
                var Id=this.data.layers[id[i]].id;
                
                var typename=this.data.layers[id[i]].typename;
                var opacity=this.data.layers[id[i]].opacity;
                var minzoom=this.data.layers[id[i]].minZoom;
                var maxzoom=this.data.layers[id[i]].maxZoom;
                var style=this.data.layers[id[i]].style;
                
                var label=GL.style.label(this.data.layers[id[i]].labeling);
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={style:style,typename:typename,opacity:opacity,minzoom:minzoom,maxzoom:maxzoom,label:label,url:url,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, type:geotype, id:Id, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="createPBF"){
                var url=this.data.layers[id[i]].url;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].srsname;
                var geotype=this.data.layers[id[i]].geotype;
                var Id=this.data.layers[id[i]].id;
                
                var typename=this.data.layers[id[i]].typename;
                var opacity=this.data.layers[id[i]].opacity;
                var minzoom=this.data.layers[id[i]].minZoom;
                var maxzoom=this.data.layers[id[i]].maxZoom;
                var style=this.data.layers[id[i]].style;
                
                var label=GL.style.label(this.data.layers[id[i]].labeling);
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={style:style,typename:typename,opacity:opacity,minzoom:minzoom,maxzoom:maxzoom,label:label,url:url,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, type:geotype, id:Id, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }else if(this.data.layers[id[i]].method=="vector-url" && this.data.layers[id[i]].fileType=="excel"){
                var url=this.data.layers[id[i]].url;
                var fileType=this.data.layers[id[i]].fileType;
                var autoload=this.data.layers[id[i]].autoLoad;
                var checked=this.data.layers[id[i]].checked;
                var epsg=this.data.layers[id[i]].epsg;
                var fields=this.data.layers[id[i]].fields;
                var geotype=this.data.layers[id[i]].geotype;
                var indexcolumn=this.data.layers[id[i]].indexColumn;
                var Id=this.data.layers[id[i]].id;

                var wktcolumn=this.data.layers[id[i]].wktColumn;
                var pageinfo=this.data.layers[id[i]].pageInfo;

                var label=GL.style.label(this.data.layers[id[i]].labeling);
                var lastindex=this.data.layers[id[i]].lastIndex;
                var localrecovery=this.data.layers[id[i]].localRecovery;
                var method=this.data.layers[id[i]].method;
                var name=this.data.layers[id[i]].name;
                var selectedindex=this.data.layers[id[i]].selectedIndex;
                var style=this.data.layers[id[i]].style;
                var systemrecovery=this.data.layers[id[i]].systemRecovery;
    
                var settings={wktcolumn:wktcolumn,pageinfo:pageinfo,label:label,url:url,fileType:fileType,catalogname:catalogname,catalogid:catalogid,center:center,zoom:zoom,pitch:pitch,rotate:rotate,darkmode:darkmode,autoload:autoload, checked:checked, epsg:epsg, fields:fields, type:geotype, id:Id, indexcolumn:indexcolumn, lastIndex:lastindex, localrecovery:localrecovery, method:method, name:name, selectedindex:selectedindex, style:style,systemrecovery:systemrecovery };
                GL.creteCatalogLayer(settings);
              }
                
          }

          this.activeLayers=[];
          this.close();
      },
      getActive:function(){
        var that=this;
          for(var i=0;i<this.layers.length;i++){
            if(this.layers[i].active==true){
                var j=this.data.layers.findIndex((lay) => lay.id==that.layers[i].id);
                this.activeLayers.push(j);
            }
          }
          console.log(this.activeLayers);
          this.getCatalogSettings(this.activeLayers);
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
                '<div class="section-title">{{catalogName}}</div>'+
                '<div class="wide-block pt-2 pb-2">'+
                    '<ul class="listview simple-listview" >'+
                        '<li style="padding:0;" v-for="(item,i) in layers">'+
                            '<div>{{item.name}}</div>'+
                            '<div class="custom-control custom-switch">'+
                            '<input :id="item.id" type="checkbox" v-model="item.active" class="custom-control-input">'+
                                '<label :for="item.id" class="custom-control-label"></label>'+
                            '</div>'+
                        '</li>'+
                    '</ul>'+

                    '<div class="form-group boxed">'+
                        '<div class="form-group basic">'+
                            '<div class="input-wrapper">'+
                            '<button @click="getActive" type="button" class="btn btn-primary btn-block">Kaydet</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+

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

var catalogload = new Vue({ el: '#catalogload' });