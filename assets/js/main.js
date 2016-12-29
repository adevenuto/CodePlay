var update = {
  init: function() {
    this.buildDoc();
  },
  cacheDom: function() {
    this.$display = $('#output');
    this.$styles = this.$display.contents().find('style');
    this.$content = this.$display.contents().find('body').attr('id','iFrameBody');
  },
  buildDoc: function() {
    var frame = document.getElementById('output'),
        doc = frame.contentDocument || frame.contentWindow.document;
        doc.open();
        doc.write('<style type="text/css">' + editorCss.getValue() + '</style>'),
        doc.write('<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>'),
        doc.write('<body>' + editorHtml.getValue() + '<script>' + editorJs.getValue() + '</script>' + '</body>'),
        doc.close();
        this.cacheDom();
  },
  renderHtml: function(html) {
    this.$content.html(html);
  },
  renderCss: function(css) {
    this.$styles.html(css);
  }
}
update.init();
////////////////////////////////////////////////////////////
var input = {
  init: function() {
    this.cacheDom();
    this.bindEvent();
  },
  cacheDom: function() {
    this.$panels = $('#panels-container');
    this.$htmlIn = this.$panels.find('#html-panel .CodeMirror');
    this.$cssIn = this.$panels.find('#css-panel .CodeMirror');
    this.$jsRun = this.$panels.find('#runScript');
  },
  bindEvent: function() {
    this.$htmlIn.on('change keyup paste', this.htmlUpdate.bind(this))
    this.$cssIn.on('change keyup paste', this.cssUpdate.bind(this))
    this.$jsRun.on('click', this.docUpdate.bind(this))
  },
  docUpdate: function() {
    update.init();
  },
  htmlUpdate: function() {
    update.renderHtml(editorHtml.getValue());
  },
  cssUpdate: function() {
    update.renderCss(editorCss.getValue());
  }
}
input.init();









var controls = {
  init: function() {
    this.cacheDom();
    this.bindEvent();
  },
  cacheDom: function() {
    this.$controls = $('#panel-controls');
    this.$panels = $('#code-panels');
    this.$button = this.$controls.find('button');
  },
  bindEvent: function() {
    this.$button.on('click', this.toggleState.bind(this))
  },
  toggleState: function(e) {
    var $panel = e.target.innerHTML.toLowerCase();
    var $targetPanel = "#"+$panel+"-panel";
    $($targetPanel).toggleClass('hide');
    $(e.target).toggleClass('active');
  }
}
controls.init();
///////////////////////////////////////////////////
$(".resize").resizable({
  handles: 'e',
  minWidth: 20,
  start:function(){
     $("#output").addClass('pointer-evnt-none');
     this.other = $(this).next();
     this.startWidth = this.other.width();
  },
  stop: function() {
    $("#output").removeClass('pointer-evnt-none');
  },
  resize:function(e,ui) {
     var minWidth = ui.element.resizable("option", "minWidth");
     var diffW = ui.size.width-ui.originalSize.width;
     if (diffW > this.startWidth-minWidth){
         diffW =  this.startWidth;
         ui.size.width = ui.originalSize.width+diffW-minWidth;
     }
     this.other.width( Math.max(50, this.startWidth - diffW)  );
   }
});