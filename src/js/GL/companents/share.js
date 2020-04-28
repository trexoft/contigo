Vue.component('share', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              style:{
                light:{backgroundColor:'#efefef'},
                dark:{backgroundColor:'#333333'},
                active:{opacity:1,marginBottom:'15px'},
                passive:{opacity:0.5,marginBottom:'15px'},
                classActive:'btn btn-success square btn-block',
                classPassive:'btn btn-warning square btn-block',
              },
              shareTypes:[
                {value:'link',text:'Bağlantıyı Kopyala',class:'btn btn-warning',icon:'copy-outline'},
                {value:'email',text:'Mail\'de Paylaş',class:'btn btn-danger',icon:'mail-unread-outline'},
                {value:'whatsapp',text:'Whatsapp\'ta Paylaş',class:'btn btn-whatsapp',icon:'logo-whatsapp'},
                {value:'twitter',text:'Twitter\'da Paylaş',class:'btn btn-twitter',icon:'logo-twitter'},
                {value:'facebook',text:'Facebook\'ta Paylaş',class:'btn btn-facebook',icon:'logo-facebook'},
                {value:'linkedin',text:'Linkedin\'de Paylaş',class:'btn btn-linkedin',icon:'logo-linkedin'},
                {value:'skype',text:'Skype\'ta Paylaş',class:'btn btn-skype',icon:'logo-skype'},
                {value:'telegram',text:'Telegram\'da Paylaş',class:'btn btn-success',icon:'share-social-outline'},
                {value:'pinterest',text:'Pinterest\'de Paylaş',class:'btn btn-pinterest',icon:'logo-pinterest'},
                {value:'vk',text:'VK\'da Paylaş',class:'btn btn-linkedin',icon:'logo-vk'},
                {value:'baidu',text:'Baidu\'da Paylaş',class:'btn btn-primary',icon:'share-social-outline'},
              ],
              data:{status:false}
          }
      },
      open:function(data){
        GL.titresim();
        $("#modal-share").modal('show');
        this.onoff = true;
        if(typeof data!=="undefined"){
          for(var a in data){
            this.data[a]=data[a];
          }
        }else{
          this.data = {status:false};
        }
        this.$forceUpdate();
      },
      close:function(e){
        GL.titresim();
        this.onoff = false;
        $("#modal-share").modal('hide');
      },
      paylas:function(type){
        if(type=='link'){
          GL.clipboardText(window.location.href);
          this.close();
          return false;
        }
        var a = document.getElementById('modal-share');
        var shareButton = document.createElement('button');
        shareButton.dataset.width = a.clientWidth;
        shareButton.dataset.height = a.clientHeight;
        shareButton.dataset.title = this.data["title"] || "GISLayer Paylaşımı";
        shareButton.dataset.url = this.data["url"] || "https://gislayer.com/mobil/";
        shareButton.dataset.sharer = type;

        switch(type){
          case 'pinterest':{
            shareButton.dataset.image = this.data["image"] || "GISLayer Paylaşımı";
            shareButton.dataset.description = this.data["description"] || "Harika Bir CBS Yazılımı !";
            break;
          }
          case 'telegram':{
            shareButton.dataset.to = this.data["to"] || "";
            break;
          }
          case 'email':{
            shareButton.dataset.title = this.data["title"] || "Lütfen bu paylaşımı inceler misin ";
            shareButton.dataset.subject = this.data["subject"] || "GISLayer Paylaşımı";
            shareButton.dataset.url = this.data["url"] || "https://gislayer.com/mobil/";
            shareButton.dataset.to = this.data["to"] || "";
            break;
          }
          case 'facebook':{
            shareButton.dataset.hashtag = this.data["hashtag"] || "gislayer";
            break;
          }
          case 'twitter':{
            shareButton.dataset.hashtags = this.data["hashtags"] || "gislayer";
            shareButton.dataset.via = this.data["via"] || "gislayer1";
            break;
          }
          case 'whatsapp':{

            break;
          }
        }

        $('#shareVisible').append(shareButton);
        window.Sharer.init();
        shareButton.click();
        $('#shareVisible').html('');
        this.close();
      }
  },
  template:
  '<div class="modal fade modalbox" id="modal-share" tabindex="-1" role="dialog">'+
    '<div class="modal-dialog" role="document">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<h5 class="modal-title">{{GL.lang.labels.share}}</h5>'+
          '<a href="javascript:;" style="color:#8bc34a;" data-dismiss="modal">{{GL.lang.general.close}}</a>'+
        '</div>'+
        '<div class="modal-body" :style="GL.config.darkMode==true ? style.dark:style.light">'+
          '<div class="row">'+
            '<div v-for="item in shareTypes" class="col-12" :style="style.active" @>'+
              '<button @click="paylas(item.value)" style="width:100%;" type="button" :class="item.class"><ion-icon :name="item.icon"></ion-icon> {{item.text}}</button>'+
              '</div>'+
            '</div>'+
            '<div id="shareVisible"></div>'+
          '</div>'+

        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'
  });

var share = new Vue({ el: '#share' });