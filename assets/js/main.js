$(function(){
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
}());

