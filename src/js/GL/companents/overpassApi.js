Vue.component('overpass', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Overpass API",
              close:"Kapat",
              filterss:[{
                selected:"",data:['park_ride'],
                dataHighway:['highway','highway=primary','highway=bus_stop'],
                dataLeisure:['leisure','leisure=park'],
                dataSport:['sport','sport=swimming'],
                dataBuilding:['building=yes','amenity=cafe','amenity=restaurant','amenity=theatre','amenity=bank','amenity=marketplace','amenity=fast_food']
              }],
              layerName:""
          }
      },
      open:function(){
        $("#overpassModal").modal('show');
        
      },
      close:function(e){
        
      },
      close2:function(){
        $("#overpassModal").modal('hide');
        this.layerName="";
        this.filterss=[{
                selected:"",data:['park_ride'],
                dataHighway:['highway','highway=primary','highway=bus_stop'],
                dataLeisure:['leisure','leisure=park'],
                dataSport:['sport','sport=swimming'],
                dataBuilding:['building=yes','amenity=cafe','amenity=restaurant','amenity=theatre','amenity=bank','amenity=marketplace','amenity=fast_food']
        }];
      },
      stopQuery:function(){
        GL.overpass=false;
        this.close2();
        GL.bilgi("Overpass Sorgusu Durduruldu");
      },
      filterdata:function(){
        var that=this;
        var control=true;
        for(var i=0;i<this.filterss.length;i++){
            if(this.filterss[i].selected==""){
                control=false;
                break
            }
        }

        if(control==false){
            GL.uyari("Lütfen filtre seçiniz!");
        }else if(this.layerName==""){
            GL.uyari("Katman adı giriniz");
        }else{
            //Overpass
            GL.overpass=true;
            GL.overpassLayerName=this.layerName;

            var filters=[];
            for(var j=0;j<that.filterss.length;j++){
                console.log(that.filterss[j]);
                filters.push(that.filterss[j].selected);
            };

            //var filter=this.filters.selected;
            GL.filter=filters;

            // Get initial values
            var zoom=GL.map.getZoom();
            var center=GL.map.getCenter();

            var bbox = geoViewport.bounds(
                [Number(center.lat),
                Number(center.lng)],
                parseInt(zoom,10),
            [600, 400]);

            $("#overpassModal").modal('hide');

            GL.createOverpassLayer(bbox,filters,this.layerName);

            this.layerName="";
            this.filterss=[{
                selected:"",data:['park_ride'],
                dataHighway:['highway','highway=primary','highway=bus_stop'],
                dataLeisure:['leisure','leisure=park'],
                dataSport:['sport','sport=swimming'],
                dataBuilding:['building=yes','amenity=cafe','amenity=restaurant','amenity=theatre','amenity=bank','amenity=marketplace','amenity=fast_food']
              }];
        }
      },
      addFilter:function(){
        this.filterss.push({
            selected:"",data:['park_ride'],
            dataHighway:['highway','highway=primary','highway=bus_stop'],
            dataLeisure:['leisure','leisure=park'],
            dataSport:['sport','sport=swimming'],
            dataBuilding:['building=yes','amenity=cafe','amenity=restaurant','amenity=theatre','amenity=bank','amenity=marketplace','amenity=fast_food']
          });
      },
      deleteQuery:function(i){
          this.filterss.splice(i,1);
      }
  },
  template:
  '<div  class="modal fade modalbox" id="overpassModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px">{{header}}</h5>'+
                        '<a @click="close2" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                            '<form>'+
                                    '<div class="form-group boxed">'+
                                        '<div class="input-wrapper">'+
                                            '<label class="label" for="name5">Kayıt Edilecek Katman Adı</label>'+
                                            '<input v-model="layerName" type="text" class="form-control" id="name5" placeholder="Katman adını giriniz">'+
                                            '<i class="clear-input">'+
                                                '<ion-icon name="close-circle"></ion-icon>'+
                                            '</i>'+
                                        '</div>'+
                                    '</div>'+

                                    '<div v-for="(item,i) in filterss" class="form-group boxed">'+
                                        '<div class="input-wrapper">'+
                                
                                            '<label class="label" >Filtre Tipi :</label>'+
                                            '<select class="form-control custom-select" v-model="item.selected" style="width:85%;">'+
                                                '<optgroup label="Yol Filtreleme">'+
                                                '<option v-for="item2 in item.dataHighway" :value="item2">{{item2}}</option>'+
                                                '</optgroup>'+
                                                '<optgroup label="Bina Filtreleme">'+
                                                '<option v-for="item2 in item.dataBuilding" :value="item2">{{item2}}</option>'+
                                                '</optgroup>'+
                                                '<optgroup label="Boş zaman yerleri filtreleme">'+
                                                '<option v-for="item2 in item.dataLeisure" :value="item2">{{item2}}</option>'+
                                                '</optgroup>'+
                                                '<optgroup label="Spor Kompleksi Filtreleme">'+
                                                '<option v-for="item2 in item.dataSport" :value="item2">{{item2}}</option>'+
                                                '</optgroup>'+
                                            '</select>'+
                                            '<button v-if="i==0" type="button" @click="addFilter" class="btn btn-icon text-success mr-1 mb-1" style="float:right;">'+
                                                '<ion-icon name="add-outline"></ion-icon>'+
                                            '</button>'+
                                            '<button v-if="i!=0" type="button" @click="deleteQuery(i)" class="btn btn-icon text-primary mr-1 mb-1" style="float:right;">'+
                                                '<ion-icon name="trash-outline"></ion-icon>'+
                                            '</button>'+
                                        '</div>'+
                                    '</div>'+
                                    
                                    '<div class="form-button-group" style="padding-bottom:30px;">'+
                                        '<button @click="stopQuery" type="button" class="btn btn-primary">Sorguyu Durdur</button>'+
                                        '<button @click="filterdata" type="button" class="btn btn-primary">Haritaya Ekle</button>'+
                                    '</div>'+
                            '</form>'+
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var overpass = new Vue({ el: '#overpass' });