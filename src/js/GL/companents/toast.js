Vue.component('toast', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              gosterilen:{

              },
              kuyruk:[]
          }
      },
      open:function(durum){
      },
      close:function(e){
        var that = this;
        this.gosterilen.class = "toast-box toast-bottom animated3 fadeOutDown show";
        setTimeout(function(){
          that.kuyruk.splice(0,1);
          if(that.kuyruk.length>0){
            that.gosterilen = that.kuyruk[0];
            setTimeout(function(){
              that.close();
            },that.gosterilen.delay);
          }
        },400);
        
      },
      showMessage:function(obj){
        var that =this;
        var type  = obj["type"] || "info";
        var text = obj["text"] || "Bu Kutuda Mesaj Yok!...";
        var icon = obj["icon"] || "information-circle-outline";
        var sure = 2000;

        if(typeof obj["delay"]!=="undefined"){
          sure = parseInt(obj["delay"],10);
        }else{
          var kelimeSayisi = text.split(" ").length;
          sure = kelimeSayisi*1000;
        }

        var obj2 = {
          icon:icon,
          type:type,
          class:"toast-box toast-bottom animated3 fadeInUp show",
          text:text,
          delay:sure
        };
        switch(type){
            case 'success':{
              obj2.icon="checkmark-outline";
              obj2.class = obj2.class+" bg-success";
            break;
            }
            case 'warning':{
              obj2.icon="warning-outline";
              obj2.class = obj2.class+" bg-warning";
            break;
            }
            case 'info':{
              obj2.icon="information-circle-outline";
              obj2.class = obj2.class+" bg-info";
            break;
            }
            case 'alert':{
              obj2.icon="alert-circle-outline";
              obj2.class = obj2.class+" bg-danger";
            break;
            }
            case 'danger':{
              obj2.icon="alert-circle-outline";
              obj2.class = obj2.class+" bg-danger";
            break;
            }
        }

        if(this.kuyruk.length==0){
          this.gosterilen = obj2;
          setTimeout(function(){
            that.close();
          },sure);
        }
        this.kuyruk.push(obj2);
      }
  },
  template:
    '<div v-if="kuyruk.length>0" :Class="gosterilen.class">'+
            '<div class="in">'+
              '<ion-icon :name="gosterilen.icon"></ion-icon>'+
                '<div class="text" v-html="gosterilen.text"></div>'+
            '</div>'+
            '<ion-icon @click="close" style="width:24px; height:24px;" name="close-circle-outline"></ion-icon>'+
    '</div>'
  
  });

var toast = new Vue({ el: '#toast' });