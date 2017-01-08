$(function(){
  var $htmlCode = $('#html-input')[0];
  var $cssCode = $('#css-input')[0];
  var $jsCode = $('#js-input')[0];
  var editorHtml = CodeMirror.fromTextArea($htmlCode, {
    lineNumbers: true,
    lineWrapping: true,
    mode : "text/html",
    profile: 'xhtml',
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchTag: true,
    theme: "mbo"
  });
  emmetCodeMirror(editorHtml);
  var editorCss = CodeMirror.fromTextArea($cssCode, {
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    mode: "css",
    theme: "mbo"
  });
  var editorJs = CodeMirror.fromTextArea($jsCode, {
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    mode: "javascript",
    theme: "mbo"
  });
  /////////////////////////////////////////////////////
  var resources = {
    init: function() {
      this.cacheDom();
      this.bindEvent();
    },
    cacheDom: function() {
      this.$save = $('#save');
    },
    bindEvent: function() {
      this.$save.on('click', this.saveSettings.bind(this));
    },
    saveSettings: function() {
      update.init();
    },
    head: [],
    css: [],
    script: []
  }
  resources.init();
  ////////////////////////////////////////////////////////
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

      // Head Content (Meta tags)
      resources.head.forEach(function(head){
        doc.write(head);
      });
      // Head Content (Additional Css)
      resources.css.forEach(function(css){
        doc.write("<link rel='stylesheet prefetch' href=" +css+ ">");
      });

      doc.write('<style type="text/css">' + editorCss.getValue() + '</style>');

      // Body Content (Additional Scripts)
      doc.write('<body>' + editorHtml.getValue());

      resources.script.forEach(function(script){
        doc.write("<script type='text/javascript' src=" +script+ "></script>");
      });

      doc.write('<script>' + editorJs.getValue() + '</script>' +
      '</body>');

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

var collectResources = {
  init: function() {
    this.cacheDom();
    this.bindEvent();
  },
  cacheDom: function() {
    this.$settingsModal = $('#settings-modal');
    this.$quickSelect = $('.quick-select');
    this.$assets = $('.assets');
    this.$removeResource = $('.fa-times');
  },
  bindEvent: function() {
    this.$quickSelect.on('change', this.gatherAssets.bind(this));
    this.$settingsModal.on('click', '.new-resource', this.addResource.bind(this));
    this.$settingsModal.on('click', '.deleteVal', this.permanentInput.bind(this));
    this.$assets.on('click', '.deleteInput', this.removeResource.bind(this));
  },
  gatherAssets: function(e) {
    var $currentVal;
    var $resource;
    var populated = false;
    var $target = $(e.target).attr('name');
    this.$quickSelect.each(function(){
      if ($(this).attr('name') == $target) {
        $currentVal = $(this).find('option:selected').val();
        $resource = $(this).attr('name');
      };
    })
    if ($resource == 'html' && $currentVal !== '---') {
      var $htmlInputs = $('input[name=html]');
      $htmlInputs.each(function(){
        if (!$(this).val()) {
          $(this).val($currentVal);
          populated = true;
          return false;
        };
      });
      if ($htmlInputs.last().val() && !populated) {
        $('.assets[data-type=html').append('<div><input type="text" name="html" value="'+ $currentVal +'"> <i class="fa fa-times deleteInput"></i></div>');
        populated = false;
      };
      populated = false;
    };
    if ($resource == 'css' && $currentVal !== '---') {
      var $cssInputs = $('input[name=css]');
      $cssInputs.each(function(){
        if (!$(this).val()) {
          $(this).val($currentVal);
          populated = true;
          return false;
        };
      });
      if ($cssInputs.last().val() && !populated) {
        $('.assets[data-type=css').append('<div><input type="text" name="css" value="'+ $currentVal +'"> <i class="fa fa-times deleteInput"></i></div>');
        populated = false;
      };
      populated = false;
    };
    if ($resource == 'js' && $currentVal !== '---') {
      var $jsInputs = $('input[name=js]');
      $jsInputs.each(function(){
        if (!$(this).val()) {
          $(this).val($currentVal);
          populated = true;
          return false;
        };
      });
      if ($jsInputs.last().val() && !populated) {
        $('.assets[data-type=js').append('<div><input type="text" name="js" value="'+ $currentVal +'"> <i class="fa fa-times deleteInput"></i></div>');
        populated = false;
      };
      populated = false;
    };
  },
  addResource: function() {
    var resource = settingsModal.currentState;
    $(".assets[data-type='"+resource+"']").append("<div class='resource'><input name='"+resource+"' type='text'> <i class='fa fa-times deleteInput'></i></div>");
  },
  removeResource: function(e) {
    // remove from dom
    var target = $(e.target);
    target.parent().remove();
  },
  permanentInput: function(e) {
    $(e.target).prev().val('');
  }
}
collectResources.init();


////////////////////////////////////////////////////////////
var input = {
  init: function() {
    this.cacheDom();
    this.bindEvents();
  },
  cacheDom: function() {
    this.$panels = $('#panels-container');
    this.$htmlIn = this.$panels.find('#html-panel .CodeMirror');
    this.$cssIn = this.$panels.find('#css-panel .CodeMirror');
    this.$jsRun = this.$panels.find('#runScript');
  },
  bindEvents: function() {
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
//////////////////////////////////////////////////////////////
var settingsModal = {
  init: function() {
    this.cacheDom();
    this.bindEvents();
  },
  cacheDom: function() {
    this.$modal = $('#settings-modal-container');
    this.$overlay = $('#overlay');
    this.$settingsBtn = $('.fa-gear');
    this.$saveSettingsBtn = $('#save');
    this.$modalNavBtn = $('.modal-nav-a');
    this.$language = $('.language');
  },
  bindEvents: function() {
    this.$settingsBtn.on('click', this.focusSettings.bind(this));
    this.$overlay.on('click', this.toggleSettings.bind(this));
    this.$modalNavBtn.on('click', this.toggleState.bind(this));
  },
  currentState: '',
  focusSettings: function(e) {
    this.toggleSettings();
    var $btnDataType = $(e.target).attr('data-type');
    this.currentState = $btnDataType;
    if ($btnDataType === 'html') $('a[href="#html-settings"]').click();
    if ($btnDataType === 'css') $('a[href="#css-settings"]').click();
    if ($btnDataType === 'js') $('a[href="#js-settings"]').click();
  },
  toggleState: function(e) {
    var $target = $(e.target);
    var $targetDataType = $(e.target).attr('data-type');
    this.currentState = $targetDataType;
    if (!$target.hasClass('active')) {
      // Toggle Nav Btn
      $target.toggleClass('active');
      this.$modalNavBtn.not($target).removeClass('active');
      // Toggle Setting Type
      var currentTarget = this.$modal.find($target.attr('href'));
      currentTarget.toggleClass('show');
      this.$language.not(currentTarget).removeClass('show');
    };
  },
  toggleSettings: function() {
    this.$modal.toggleClass('show');
    this.$overlay.toggleClass('show');
  }
  // Do Something When Save Is Clicked
}
settingsModal.init();
//////////////////////////////////////
// Dim js run button if panel is empty
var dimRun = {
  init: function() {
    this.cacheDom();
    this.bindEvent();
  },
  cacheDom: function() {
    this.$jsPanel = $('#js-panel .CodeMirror');
  },
  bindEvent: function() {
    this.$jsPanel.on('keyup', this.toggleDim.bind(this));
  },
  toggleDim: function() {
    editorJs.getValue() ?
    $('#runScript').removeClass('isEmpty') :
    $('#runScript').addClass('isEmpty');
  }
}
dimRun.init();
///////////////////////////////////////////////////
  $(".resize").resizable({
    handles: 'e',
    minWidth: 30,
    start:function(){
       $("#output").addClass('pointer-evnt-none');
       this.other = $(this).next();
       this.startWidth = this.other.width();
    },
    stop: function() {
      $("#output").removeClass('pointer-evnt-none');
    },
    resize:function(e,ui) {
      var panelId = "#" + e.target.id;
      if (panelId == "#html-panel")
        editorHtml.setSize($(panelId).width(), $(panelId).height());
      if (panelId == "#css-panel")
        editorCss.setSize($(panelId).width(), $(panelId).height());
      if (panelId == "#js-panel")
        editorJs.setSize($(panelId).width(), $(panelId).height());
    }
  });
}());

