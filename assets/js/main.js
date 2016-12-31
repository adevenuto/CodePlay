var resources = {
  links: ['http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'],
  scripts: []
}

var settingsModal = {
  init: function() {
    this.cacheDom();
    this.bindEvent();
  },
  cacheDom: function() {
    this.$modal = $('#settings-modal-container');
    this.$overlay = $('#overlay');
    this.$settingsBtn = $('.fa-gear');
    this.$saveSettingsBtn = $('#save');
    this.$modalNavBtn = $('.modal-nav-a');
    this.$language = $('.language');
  },
  bindEvent: function() {
    this.$settingsBtn.on('click', this.toggleSettings.bind(this));
    this.$overlay.on('click', this.toggleSettings.bind(this));
    this.$modalNavBtn.on('click', this.toggleState.bind(this));
  },
  focusSettings: function() {

  },
  toggleState: function(e) {
    var target = $(e.target);
    // Toggle Nav Btn
    target.toggleClass('active');
    this.$modalNavBtn.not(target).removeClass('active');
    // Toggle Setting Type
    var currentTarget = this.$modal.find(target.attr('href'));
    currentTarget.toggleClass('show');
    this.$language.not(currentTarget).removeClass('show');
  },
  toggleSettings: function() {
    this.$modal.toggleClass('show');
    this.$overlay.toggleClass('show');
  }
  // Do Something When Save Is Clicked
}
settingsModal.init();
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
        // Head Content
        doc.write('<link rel="stylesheet prefetch" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">')
        doc.write('<style type="text/css">' + editorCss.getValue() + '</style>')
        // Body Content
        doc.write('<body>' + editorHtml.getValue() +
          '<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>' +
          '<script>' + editorJs.getValue() + '</script>' +
          '</body>')
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
    $(e.target).toggleClass('panel-hide');
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