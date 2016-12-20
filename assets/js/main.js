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






$(".resize").resizable({
  handles: 'e',
  resize: function(e, ui) {
  // console.log(e.target.clientWidth)
  }
});


var max = 0;

$(".panel").resize(function(){
  max = $('#html-panel').width() +
  $('#css-panel').width() +
  $('#js-panel').width();

  console.log(max)
})

