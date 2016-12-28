
  var htmlCode = $('#html-input')[0];
  var cssCode = $('#css-input')[0];
  var jsCode = $('#js-input')[0];
  var editorHtml = CodeMirror.fromTextArea(htmlCode, {
    lineNumbers: true,
    lineWrapping: true,
    mode : "text/html",
    profile: 'xhtml',
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchTag: true,
    theme: "neat"
  });
  emmetCodeMirror(editorHtml);
  var editorCss = CodeMirror.fromTextArea(cssCode, {
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    mode: "css",
    theme: "neat"
  });
  var editorJs = CodeMirror.fromTextArea(jsCode, {
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    mode: "javascript",
    theme: "neat"
  });
