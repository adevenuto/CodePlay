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
    head: [],
    css: [],
    scripts: []
  }
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
// var cssResources = {
//   init: function() {
//     this.cacheDom();
//     this.bindEvents();
//   },
//   cacheDom: function() {
//     this.$cssQuickSelect = $('#css-quick-select');
//     this.$cssAssets = $('#css-assets');
//   },
//   bindEvents: function() {
//     this.$cssQuickSelect.on('change', this.gatherCssAssets.bind(this));
//   },
//   gatherCssAssets: function() {
//     var $currentVal = $('#css-quick-select option:selected').val();
//     var $objResources = this.$cssAssets.find('input');
//     if (!$objResources.val()) {
//       $objResources.val($currentVal);
//       console.log($objResources)
//     } else {
//       this.$cssAssets.append('<input type="text" value="'+ $currentVal +'">')
//     }
//   }
// }
// cssResources.init();


var collectResources = {
  init: function() {
    this.cacheDom();
    this.bindEvents();
  },
  cacheDom: function() {
    this.$settingsModal = $('#settings-modal');
    this.$quickSelect = $('.quick-select');
    this.$assets = $('.assets');
  },
  bindEvents: function() {
    this.$quickSelect.on('change', this.gatherAssets.bind(this));
  },
  gatherAssets: function(e) {
    var $currentVal;
    var $resource;
    var $target = $(e.target).attr('name');
    this.$quickSelect.each(function(){
      if ($(this).attr('name') == $target) {
        $currentVal = $(this).find('option:selected').val();
        $resource = $(this).attr('name');
      }
    })
    if ($resource == 'html') {
      var $htmlInputs = this.$settingsModal.find($('input[name=html]'));
      if (!$htmlInputs.val()) {
        $htmlInputs.val($currentVal);
      } else {
        $htmlInputs.parent().append('<input type="text" value="'+ $currentVal +'">')
      }
    }
    if ($resource == 'css') {
      var $cssInputs = this.$settingsModal.find($('input[name=css]'));
      if (!$cssInputs.val()) {
        $cssInputs.val($currentVal);
      } else {
        $cssInputs.parent().append('<input type="text" value="'+ $currentVal +'">')
      }
    }
    if ($resource == 'js') {
      var $jsInputs = this.$settingsModal.find($('input[name=js]'));
      if (!$jsInputs.val()) {
        $jsInputs.val($currentVal);
      } else {
        $jsInputs.parent().append('<input type="text" value="'+ $currentVal +'">')
      }
    }
  }
}
collectResources.init();


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
//////////////////////////////////////////////////////////////
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
    this.$settingsBtn.on('click', this.focusSettings.bind(this));
    this.$overlay.on('click', this.toggleSettings.bind(this));
    this.$modalNavBtn.on('click', this.toggleState.bind(this));
  },
  focusSettings: function(e) {
    this.toggleSettings();
    var $btnDataType = $(e.target).attr('data-type');
    if ($btnDataType === 'html') $('a[href="#html-settings"]').click();
    if ($btnDataType === 'css') $('a[href="#css-settings"]').click();
    if ($btnDataType === 'js') $('a[href="#js-settings"]').click();
  },
  toggleState: function(e) {
    var $target = $(e.target);
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
}());

