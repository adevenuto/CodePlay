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
     this.other = $(this).next();
     this.startWidth = this.other.width();
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
    this.$head = $('#output').find('head');
    this.$content = $('#output').find('body');
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
  },
  bindEvent: function() {
    this.$htmlIn.on('keyup paste', this.htmlOutput.bind(this))
    this.$cssIn.on('keyup paste', this.cssOutput.bind(this))
    this.$jsIn.on('keyup paste', this.jsOutput.bind(this))
  },
  htmlOutput: function() {
    console.log("html");
  },
  cssOutput: function() {
    console.log("css");
  },
  jsOutput: function() {
    console.log("js");
  }
}
input.init();




// $("#textarea").on('change keyup paste', function() {
//     // your code here
// });
// $('#output').contents().find('body').html("<h1>Hello</h1>")
// $('#output').contents().find('head').append("<style> h1 { color: red } </style>")