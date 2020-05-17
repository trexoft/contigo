Vue.component('verbalquery', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Sözel Sorgu",
              close:"Kapat",
              columns:[],
              selectedField:"",
              selectedOperator:"",
              selectedtype:"",
              value:"",
              queryList:[]
          }
      },
      open:function(fields){
        $("#verbalqueryModal").modal('show');
        this.columns=fields;
      },
      close:function(e){
        $("#verbalqueryModal").modal('hide');
      },
      selectedType:function(){
          for(var i=0;i<this.columns.length;i++){
            if(this.selectedField==this.columns[i].name){
                this.selectedtype=this.columns[i].type; 
                break
            }
          }
          if(this.selectedtype=="boolean"){
              this.value=false;
          }else{
              this.value="";
          }
      },
      addQuery:function(){

        var query={field:this.selectedField,type:this.selectedOperator,value:this.value,label:"Sorgu-"+(this.queryList.length+1)};
        this.queryList.push(query);

        this.selectedField="";
        this.selectedOperator="";
        this.value="";
        this.selectedtype="";
      },
      deleteQuery:function(i){
        this.queryList.splice(i,1);
      },
      runQuery:function(){
        datatable.$children[0].table.clearFilter();
        datatable.$children[0].table.setFilter(this.queryList);
        $("#verbalqueryModal").modal('hide');
        datatable.$children[0].setPage("tab2");
      }
  },
  template:
  '<div  class="modal fade modalbox" id="verbalqueryModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px">{{header}}</h5>'+
                        '<a @click="close" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                        
                        '<div class="form-group basic">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="column">Sütun</label>'+
                                '<select class="form-control custom-select" id="column" @change="selectedType" v-model="selectedField">'+
                                    '<option v-for="item in columns" :value="item.name">{{item.name}}</option>'+
                                '</select>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group basic">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="operatorType">Sorgu Tipi</label>'+
                                '<select class="form-control custom-select" id="operatorType" v-model="selectedOperator">'+
                                    '<option value="=">=</option>'+
                                    '<option value="<"><</option>'+
                                    '<option value="<="><=</option>'+
                                    '<option value=">">></option>'+
                                    '<option value=">=">>=</option>'+
                                    '<option value="!=">!=</option>'+
                                    '<option value="like">like</option>'+
                                    '<option value="regex">regex</option>'+
                                    '<option value="in">in</option>'+
                                '</select>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed">'+
                            '<div v-if="selectedtype==\'string\'" class="input-wrapper">'+
                                '<label class="label" for="value">Değer</label>'+
                                '<input type="text" v-model="value" class="form-control" id="value" placeholder="Değer Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+

                            '<div v-if="selectedtype==\'integer\' || selectedtype==\'double\'" class="input-wrapper">'+
                                '<label class="label" for="value">Değer</label>'+
                                '<input type="number" v-model="value" class="form-control" id="value" placeholder="Değer Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+

                            '<div v-if="selectedtype==\'boolean\'" class="custom-control custom-checkbox mb-1">'+
                                '<input type="checkbox" v-model="value" class="custom-control-input" id="customCheckb1">'+
                                '<label class="custom-control-label" for="customCheckb1">{{value}}</label>'+ //v-if="value==\'\' ? false || {{value}}"
                            '</div>'+

                            '<div v-if="selectedtype==\'date\'" class="input-wrapper">'+
                                '<label class="label" for="layerfield">Değer</label>'+
                                    '<input v-model="value" type="date" class="form-control" id="layerfield" placeholder="Değer Giriniz">'+
                                    '<i class="clear-input">'+
                                        '<ion-icon name="close-circle"></ion-icon>'+
                                    '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div v-if="queryList.length>0" class="form-group boxed">'+
                            '<div v-if="queryList.length>0">Sorgu Listesi</div>'+
                            '<div v-for="(item,i) in queryList" class="input-wrapper">'+
                                //'<label class="label" :for="item.label">{{item.label}}</label>'+
                                '<input type="text" style="width:85%; float:left;" class="form-control" v-model="item.field+\' \'+item.type+\' \'+item.value" readonly>'+
                                '<button type="button" @click="deleteQuery(i)" class="btn btn-icon text-primary mr-1 mb-1" style="float:right;">'+
                                    '<ion-icon name="trash-outline"></ion-icon>'+
                                '</button>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-button-group">'+
                            '<button @click="addQuery" type="button" class="btn btn-primary">Sorgu Ekle</button>'+
                            '<button @click="runQuery" v-if="queryList.length>0" type="button" class="btn btn-primary">Sorgula</button>'+
                            //'<button type="button" class="btn btn-secondary">Right</button>'+
                        '</div>'+
        
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var verbalquery = new Vue({ el: '#verbalquery' });