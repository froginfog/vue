<template>
  <div>
    <textarea :id="id"></textarea>
  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/modern/theme';
  import 'tinymce/skins/lightgray/skin.min.css';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/importcss';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/textcolor';
  import 'tinymce/plugins/colorpicker';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/hr';

  import fileUpload from '../upload';
  import api from '../api';

  export default {
    name: "Editor",
    data: function(){
      const Id = Date.now();
      return {
        id: Id,
        editor: null,
        config: {
          language: 'zh_CN',
          language_url: '/tinymce/langs/zh_CN.js',
          height: 400,
          plugins: `
            paste
            importcss
            image
            code
            table
            advlist
            fullscreen
            link
            media
            lists
            textcolor
            colorpicker
            hr
            preview
          `,
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | styleselect | fontselect | formatselect | bullist numlist | undo redo | link unlink image code | removeformat',
          branding: false,
          forced_root_block: 'p',
          force_p_newlines: true,
          importcss_append: true,
          paste_retain_style_properties: 'all',
          paste_word_valid_elements: '*[*]',
          paste_data_images: true,
          paste_convert_word_fake_lists: false,
          paste_webkit_styles: 'all',
          paste_merge_formats: true,
          nonbreaking_force_tab: false,
          paste_auto_cleanup_on_paste: false,
          style_formats: [
            {
              title: '首行缩进',
              block: 'p',
              styles: { 'text-indent': '2em' }
            },
            {
              title: '行高',
              items: [
                {title: '1', styles: { 'line-height': '1' }, inline: 'span'},
                {title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span'},
                {title: '2', styles: { 'line-height': '2' }, inline: 'span'},
                {title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span'},
                {title: '3', styles: { 'line-height': '3' }, inline: 'span'}
              ]
            }
          ],
          font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,
        }
      };
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      imageUploadAccept: {
        type: String,
        default: 'image/*'
      },
      imageUploadSize: {
        type: Number,
        default: 2097152
      }
    },
    methods: {
      init: function(){
        const that = this;
        tinymce.init({
          ...this.config,
          selector: `#${this.id}`,
          setup: (editor) => {
            this.editor = editor;
            editor.on('init', () => {
              editor.setContent(that.value)
            });
            editor.on('input change undo redo', () => {
              this.$emit('input', editor.getContent());
            })
          },
          images_upload_handler: function(blobInfo, success, failure){
            if(blobInfo.blob().size > that.imageUploadSize){
              const maxSize = Math.floor(that.imageUploadSize / 1024000);
              failure(`图片大小不能超过${maxSize}M`)
            }
            if(that.imageUploadAccept !== 'image/*'){
              if(that.imageUploadAccept.indexOf(blobInfo.blob().type) < 0) failure(`图片格式必须为${that.imageUploadAccept}`);
            }
            fileUpload(blobInfo.blob()).then(response => {
              success(api.baseUrl + response);
            })
          }
        });
      }
    },
    mounted() {
      this.init();
    },
    beforeDestroy(){
      this.editor.destroy();
    }
  }
</script>

<style scoped>

</style>
