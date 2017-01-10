$(function(){
  var controls = {
    init: function() {
      this.cacheDom();
      this.bindEvent();
    },
    cacheDom: function() {
      this.$controls = $('#panel-controls');
      this.$button = this.$controls.find('button');
    },
    bindEvent: function() {
      this.$button.on('click', this.toggleState.bind(this))
    },
    toggleState: function(e) {
      var panel = e.target.innerHTML.toLowerCase();
      var targetPanel = "#"+panel+"-panel";
      $(targetPanel).toggleClass('hide');
      $(e.target).toggleClass('panel-hide');
    }
  }
  controls.init();
  var outputHelper = {
    init: function() {
      this.cacheDom();
      this.bindEvents();
      this.setWidth();
    },
    cacheDom: function() {
      this.$output = $('#output-panel');
      this.$codePanels = $('.panel');
      this.$controlsContainer = $('#panels-controls-container');
      this.$buttons = this.$controlsContainer.find('button');
      this.$sizer = this.$controlsContainer.find('.sizer');
      this.$arrows = this.$controlsContainer.find('.fa-arrows');
      this.$outputSizeDisplay = this.$controlsContainer.find('span')
    },
    bindEvents: function() {
      $(window).resize('#output-panel', this.setWidth.bind(this));
      this.$sizer.on('click', this.setWidth.bind(this));
      this.$arrows.on('click', this.fullScreen.bind(this));
    },
    setWidth: function() {
      this.$outputSizeDisplay.html(Math.floor(this.$output.width())+"px");
    },
    fullScreen: function() {
      this.$buttons.each(function() {

        $(this).click();

      });
      outputHelper.setWidth();
    }
  }
  outputHelper.init();
}());

