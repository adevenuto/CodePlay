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
      var validate = /^((ftp|http|https):)?\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/gi;

      $('textarea[name=html]').each(function(){
        var value = $(this).val();
        if (resources.head.indexOf(value)<0) {
            resources.head.push(value);
        };
      });
      $('input[name=css]').each(function(){
        var value = $(this).val();
        if (value.match(validate) && resources.css.indexOf(value)<0) {
            resources.css.push(value);
        };
      });
      $('input[name=js]').each(function(){
        var value = $(this).val();
        if (value.match(validate) && resources.css.indexOf(value)<0) {
            resources.script.push(value);
        };
      });
      settingsModal.toggleSettings();
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
  },
  bindEvent: function() {
    this.$quickSelect.on('change', this.manageAssets.bind(this));
    this.$settingsModal.on('click', '.new-resource', this.addResource.bind(this));
    this.$settingsModal.on('click', '.deleteVal', this.removeValue.bind(this));
    this.$assets.on('click', '.deleteInput', this.removeInput.bind(this));
  },
  manageAssets: function(e) {
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
      var $htmlInputs = $('textarea[name=html]');
      $htmlInputs.each(function(){
        if (!$(this).val()) {
          $(this).val($currentVal);
          return false;
        } else {
          $(this).val($(this).val()+"\n"+$currentVal)
          console.log($(this).val())
          return false;
        }
      });
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
    $(".assets[data-type='"+resource+"']").append(
      "<div class='resource'>" +
        "<input name='"+resource+"' type='text'> <i class='fa fa-times deleteInput'></i>" +
      "</div>");
  },
  removeResource: function(type, val) {
    if (type === "html") {
      var headVal = resources.head.indexOf(val);
      console.log(headVal)
      if (headVal>=0) resources.head.splice(headVal);
    };
    if (type === "css") {
      var cssVal = resources.css.indexOf(val);
      if (cssVal>=0) resources.css.splice(cssVal);
    };
    if (type === "js") {
      var jsVal = resources.script.indexOf(val);
      if (jsVal>=0) resources.script.splice(jsVal);
    };
  },
  removeInput: function(e) {
    // remove from dom
    var target = $(e.target);
    var type = target.prev().attr('name');
    var val = target.prev().val();
    collectResources.removeResource(type, val);
    target.parent().remove();
  },
  // remove value when X is clicked on first input only
  removeValue: function(e) {
    var target = $(e.target);
    var type = target.prev().attr('name');
    var val = target.prev().val();
    collectResources.removeResource(type, val);
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
    e.preventDefault();
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

// Emulates handle grag event
$.widget("ui.resizable", $.ui.resizable, {
  resizeTo: function(newSize) {
    var start = new $.Event("mousedown", { pageX: 0, pageY: 0 });
    this._mouseStart(start);
    this.axis = 'se';
    var end = new $.Event("mouseup", {
        pageX: newSize.width - this.originalSize.width,
        pageY: newSize.height - this.originalSize.height
  });
  this._mouseDrag(end);
  this._mouseStop(end);
    }
  });
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

      var target = $(e.target);
      var panelName = target.find('.panel-name');
      var runBtn = $('#runScript');
      if (target.width() <= 125) {
        panelName.addClass('compress');
        if (panelId === "#js-panel") {
          runBtn.hide();
        }
      } else if (target.width() > 125) {
        if (panelId === "#js-panel") {
          runBtn.show();
        }
        panelName.removeClass('compress');
      }
    }
  });
// Toggle panel state open/close
  var panelState = {
    init: function() {
      this.cacheDom();
      this.bindEvent();
    },
    cacheDom: function() {
      this.$panelBtn = $('.fa-bars');
    },
    bindEvent: function() {
      this.$panelBtn.on('click', this.toggleState.bind(this))
    },
    toggleState: function(e) {
      var $panelId = $(e.target).closest('.panel').attr('id');
      var $target = $(e.target).closest('.ui-resizable');
      var $targetWidth = $target.width();
      var startWidth = 275;

      if ($targetWidth > 29) {
        $target.resizable("resizeTo", { width: 30 });
      } else {
        $target.resizable("resizeTo", { width: startWidth });
      }
    }
  }
  panelState.init();
  // Refresh script in full screen view
  var outputHelper = {
    init: function() {
      this.cacheDom();
      this.bindEvents();
      this.setWidth();
    },
    cacheDom: function() {
      this.$output = $('#output-panel');
      this.$codePanels = $('.panel');
      this.$controlsContainer = $('#controls-container');
      this.$arrows = this.$controlsContainer.find('.fa-arrows');
      this.$outputSize = this.$controlsContainer.find('#output-size');
      this.$refreshScript = this.$controlsContainer.find('#full-screen-run');
    },
    bindEvents: function() {
      $(window).resize('#output-panel', this.setWidth.bind(this));
      this.$arrows.on('click', this.fullScreen.bind(this));
      this.$refreshScript.on('click', this.refresh.bind(this));
    },
    setWidth: function() {
      this.$outputSize.html(Math.floor(this.$output.width())+"px");
    },
    fullScreen: function() {
      this.$codePanels.each(function() {
        $(this).toggleClass('hide');
      });
      this.$refreshScript.toggleClass('show');
      outputHelper.setWidth();
    },
    refresh: function() {
      update.init();
    }
  }
  outputHelper.init();
}());

