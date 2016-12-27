
// $('textarea').on('keydown mousedown', function(e) {
//   var val   = this.value,
//       start = this.selectionStart,
//       end   = this.selectionEnd;
//       console.log(start, end)
//   if (e.which == 9 || e.keyCode == 9) {
//     e.preventDefault();

//     if (e.shiftKey) {
//       var firstTabPoint = val.lastIndexOf('\n', start) + 1;

//       if (val.substring(firstTabPoint, firstTabPoint + 1) == '\t') {
//         var startString = val.substr(0, firstTabPoint);
//         var endString = val.substr(firstTabPoint + 1);

//         this.value = startString + endString;
//         this.setSelectionRange(start - 1, end - 1);
//       }
//     } else {
//       this.value = val.substring(0, start) + '\t' + val.substring(end);
//       this.setSelectionRange(start + 1, end + 1);
//     }
//   }
// });

// $('textarea').on('keydup mouseup', function(e) {
//   var val   = this.value,
//     start = this.selectionStart,
//     end   = this.selectionEnd;
//     console.log(window.getSelection().toString())
// });

// $(document).ready(function() {
  var htmlCode = $('#html-input')[0];
  var cssCode = $('#css-input')[0];
  var jsCode = $('#js-input')[0];
  var editorHtml = CodeMirror.fromTextArea(htmlCode, {
    lineNumbers: true,
    lineWrapping: true,
  });
  var editorCss = CodeMirror.fromTextArea(cssCode, {
    lineNumbers: true,
    lineWrapping: true,
  });
  var editorJs = CodeMirror.fromTextArea(jsCode, {
    lineNumbers: true,
    lineWrapping: true,
  });
// });