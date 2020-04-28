Vue.component('excelpanel', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Excel Dosya Paneli",
              close:"Kapat",
              excel:{},
              sheet:"",
              columns:{selected:"",data:[]},
              selectedField:"",
              selectedField2:"",
              point:false,
              epsg:"",
              fileName:"",
              method:"wkt",
              columnName:"WKT Kolonu Seçiniz"
          }
      },
      open:function(epsg,fileName){
        $("#excellModal").modal('show');
        //this.yontem.data = [{value:"wkt",text:"WKT"},{value:"lat,lng",text:this.lang.l1},{value:"latlng",text:this.lang.l2},{value:"Y,X",text:this.lang.l3},{value:"YX",text:this.lang.l4}];
        this.excel = GL.excel;
        this.epsg=epsg;
        this.fileName=fileName;
      },
      close:function(e){
        $("#excellModal").modal('hide');
      },
      closee:function(){
        $("#excellModal").modal('hide');
        this.excel={};
        this.sheet="";
        GL.excel={
          fileName: "",
          file: {},
          sheets: []
        };
      },
      changemethod:function(){
          if(this.method=="wkt"){
            this.point=false;
            this.columnName="WKT Kolonu Seçiniz"
          }else if(this.method=="colon"){
              this.point=true;
              this.columnName="Enlem veya Y Kolonunu Seçiniz"
          }
      },
      selectedSheet:function(){
        var page = this.sheet;
        var item = this.excel.sheets.find(function(a){if(a.sheetName==page){return true;}});
        var columns = [];
        item.fields.map(function(b){
            columns.push({value:b,text:b});
        });
        this.columns.data=columns;
      },
      save:function(){
        $("#excellModal").modal('hide');
        var sayfa = this.sheet;
        var point = this.point;
        var sutun1 = this.selectedField;
        var sutun2 = this.selectedField2;
        var obj = {name:this.excel.fileName,sheet:sayfa,seperated:point,epsg:this.epsg,coord1:sutun1,coord2:sutun2};
        this.showExcel(obj);
      },
      showExcel:function(obj){
          var that=this;
        var excelResult =XLSX.utils.sheet_to_row_object_array(GL.excel.file.Sheets[obj.sheet]);
        var epsg = obj.epsg;
        var fcollect = { type: "FeatureCollection", features: []};
        excelResult.map(function(item){
          var properties = item;
          if(that.method=="colon"){
            var coord = [];
            coord.push(parseFloat(item[obj.coord2]));
            coord.push(parseFloat(item[obj.coord1]));
            var gjn = {type: "Feature", properties: properties, geometry: { type: "Point", coordinates: coord }};
          }
          if(that.method=="wkt"){
            var reader = new ol.format.WKT();
            var readergeo = new ol.format.GeoJSON();
            var feature = reader.readFeature(item[obj.coord1]);
            var gjn = readergeo.writeFeature(feature);
            gjn=JSON.parse(gjn)
            gjn.properties = properties;
          }
          fcollect.features.push(gjn);
        });
        var readergeo = new ol.format.GeoJSON();
        if(epsg!==""){
          var features = readergeo.readFeatures(fcollect,{featureProjection: "EPSG:4326",dataProjection: "EPSG:"+epsg});
        }else{
          var features = readergeo.readFeatures(fcollect,{featureProjection: "EPSG:4326",dataProjection: "EPSG:4326"});
        }

        var id = "xls" + Date.now();
        var layerCount=GL.map.getStyle().layers.length;
        var color=GL.config.colors[layerCount%19];

        var features2= new ol.format.GeoJSON().writeFeatures(features,{})
        if (typeof features2 == 'string') {
                features2 = JSON.parse(features2);
        }
        that.excel={};
        that.sheet="";
        GL.excel={
          fileName: "",
          file: {},
          sheets: []
        };
        var information={id:id,name:this.fileName,type:'xls',layers:[id+"-point",id+"-line",id+"-polygon"]};
        GL.addGeojsonToLayer(features2,id,color,information);       
        GL.bilgi("Katman Başarıyla Eklendi"); 
      }
  },
  template:
  '<div  class="modal fade modalbox" id="excellModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 80px">{{header}}</h5>'+
                        '<a @click="closee" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+

                        '<div class="section mt-4 mb-5">'+
                        '<form>'+

                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="sheetlist">Sayfa Listesi</label>'+
                                        '<select v-model="sheet" v-on:change="selectedSheet" class="form-control custom-select" id="sheetlist">'+
                                            '<option :value="item.sheetName" v-for="(item,i) in excel.sheets">{{item.sheetName}}</option>'+
                                        '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="methodlist"> Geometri Kolon Tipi</label>'+
                                        '<select v-model="method" v-on:change="changemethod" class="form-control custom-select" id="methodlist">'+
                                            '<option value="wkt">WKT Kolonu</option>'+
                                            '<option value="colon">2 Kolondan Bilgi Çek</option>'+
                                        '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="geometrycolumn">{{columnName}}</label>'+
                                        '<select v-model="selectedField" v-on:change="selectedSheet" class="form-control custom-select" id="geometrycolumn">'+
                                            '<option v-for="item in columns.data" :value="item.value">{{item.text}}</option>'+
                                        '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div v-if="point==true" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label" for="geometrycolumn2">Boylam veya X Kolonunu Seçiniz</label>'+
                                        '<select v-model="selectedField2" v-on:change="selectedSheet" class="form-control custom-select" id="geometrycolumn2">'+
                                            '<option v-for="item in columns.data" :value="item.value">{{item.text}}</option>'+
                                        '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-button-group">'+
                            '<button @click="save" type="button" class="btn btn-primary btn-block">Haritaya Ekle</button>'+
                            '</div>'+
                        '</form>'+
                        '</div>'+
        
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var excelpanel = new Vue({ el: '#excelpanel' });