Vue.component('notification', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              gosterilen:{

            },
            kuyruk:[],
            uzunluk:0
          }
      },
      open:function(){
        this.onoff = true;
      },
      close:function(fonkCntrl){
        GL.titresim();
        var that=this;
        var fnk = fonkCntrl || false;
        this.gosterilen.class = "notification-box animated3 fadeOutUp show";
        if(typeof that.gosterilen["callback"]!=="undefined"){
            if(fnk==false){
                that.gosterilen.callback(false);
            }
        }
        setTimeout(function(){
            that.kuyruk.splice(0,1);  
            if(that.kuyruk.length>0){
              that.gosterilen = that.kuyruk[0];
            }
        },400);
      },
      ok:function(){
        GL.titresim();
        if(typeof this.gosterilen["callback"]!=="undefined"){
            this.gosterilen.callback(true);
        }
        this.close(true);
      },
      showNotification:function(obj){
        var that =this;
        var type  = obj["type"] || "info";
        var text = obj["text"] || "Bu Kutuda Mesaj Yok!...";
        var icon = obj["icon"] || "information-circle-outline";
        var header = obj["header"] || "Başlık";

        var obj2 = {
            icon:icon,
            type:type,
            class:"notification-box animated3 fadeInDown show",
            text:text,
            header:header
        };

        obj2.iconbox = 'icon-box text-'+type;

        if(typeof obj["callback"]!=="undefined"){
            obj2["callback"] = obj["callback"];
        }

        switch(type){
            case 'success':{
              obj2.icon="checkmark-outline";
              obj2.header = obj["header"] || "Başarılı !";
            break;
            }
            case 'warning':{
              obj2.icon="warning-outline";
              obj2.header = obj["header"] || "Uyarı !";
            break;
            }
            case 'info':{
              obj2.icon="information-circle-outline";
              obj2.header = obj["header"] || "Bilgilendirme !";
            break;
            }
            case 'alert':{
              obj2.icon="alert-circle-outline";
              obj2.header = obj["header"] || "Hata !";
              obj2.iconbox = 'icon-box text-danger';
            break;
            }
            case 'danger':{
                obj2.icon="alert-circle-outline";
                obj2.header = obj["header"] || "Hata !";
                obj2.iconbox = 'icon-box text-danger';
            break;
            }
        }

        if(this.kuyruk.length==0){
            this.gosterilen = obj2;
        }

        this.kuyruk.push(obj2);
      }
  },
  template:
    '<div v-if="kuyruk.length>0" :Class="gosterilen.class">'+
        '<div class="notification-dialog ios-style">'+
            '<div class="notification-header">'+
                '<div class="in" style="color:white;">'+
                    '{{kuyruk.length}} bildiriminiz var'+
                '</div>'+
                '<div class="right">'+
                        '<ion-icon @click="close(false)" style="width:24px; height:24px; color:white; float-left:50px;" name="close-circle"></ion-icon>'+
                '</div>'+
            '</div>'+
            '<div class="notification-content">'+
                '<div class="in">'+
                    '<h3 class="subtitle">{{gosterilen.header}}</h3>'+
                    '<div class="text" v-html="gosterilen.text"></div>'+
                '</div>'+
                '<div :class="gosterilen.iconbox">'+
                    '<ion-icon :name="gosterilen.icon"></ion-icon>'+
                '</div>'+
            '</div>'+
            '<div class="notification-footer">'+
                    '<a @click="close(false)" class="notification-button">'+
                            '{{kuyruk.length>1?\'Geç\':\'Kapat\'}}'+
                        '</a>'+
                        '<a href="#" @click="ok" class="notification-button">'+
                            'Tamam'+
                    '</a>'+
            '</div>'+
        '</div>'+
    '</div>'
  });

var notification = new Vue({ el: '#notification' });
