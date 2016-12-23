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
/////////////////////////////////////////////////////////
var output = {
  init: function() {
    this.cacheDom();
  },
  cacheDom: function() {
    this.$display = $('#output');
    this.addTag();
    this.$styles = this.$display.contents().find('style');
    this.$content = this.$display.contents().find('body');
  },
  addTag: function() {
    this.$display.contents().find('head').append("<style type='text/css'></style>")
  },
  renderHtml: function(html) {
    this.$content.html(html);
  },
  renderCss: function(css) {
    this.$styles.html(css);
  },
  renderJs: function(js) {
    document.getElementById('output').contentWindow.eval(js)
  }
}
output.init();

var input = {
  init: function() {
    this.cacheDom();
    this.bindEvent();
  },
  cacheDom: function() {
    this.$panels = $('#panels-container');
    this.$htmlIn = this.$panels.find('#html-input');
    this.$cssIn = this.$panels.find('#css-input');

    this.$jsIn = this.$panels.find('#js-input');
    this.$jsRun = this.$panels.find('#runScript');
  },
  bindEvent: function() {
    this.$htmlIn.on('chnage keyup paste', this.htmlOutput.bind(this))
    this.$cssIn.on('chnage keyup paste', this.cssOutput.bind(this))
    this.$jsRun.on('click', this.jsOutput.bind(this))
  },
  htmlOutput: function() {
    output.renderHtml(this.$htmlIn.val());
  },
  cssOutput: function() {
    output.renderCss(this.$cssIn.val());
  },
  jsOutput: function() {
    output.renderJs(this.$jsIn.val());
  }
}
input.init();




// $("#textarea").on('change keyup paste', function() {
//     // your code here
// });
// $('#output').contents().find('body').html("<h1>Hello</h1>")
// $('#output').contents().find('head').append("<style> h1 { color: red } </style>")