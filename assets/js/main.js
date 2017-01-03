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
}());

