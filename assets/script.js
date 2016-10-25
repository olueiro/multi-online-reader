$(function(){

  var availableLanguages = ["Lua", "Moonscript"];
  window.MODE_DEFAULT = availableLanguages[0];

  // Parse hash

  var hash = window.location.hash;

  var uiLanguage, codeLanguage, autoplay, code;
  
  code = "";
  uiLanguage = "";

  if(hash) {

    var content = hash.substring(1);

    uiLanguage = content.split(",")[0];
    codeLanguage = content.split(",")[1];
    autoplay = content.split(",")[2];
    code = Base64.decode(content.substr(content.indexOf(";") + 1));

    if($.inArray(availableLanguages, codeLanguage)) {
      window.MODE_DEFAULT = codeLanguage;
    }
  } else {

    if (typeof(Storage) !== "undefined") {
      code = localStorage.code || "";
    }
  }

  window.uiLanguage = uiLanguage;
  window.autoplay = autoplay;
  window.code = code;

  // Add code languages

  for(var i = 0; i < availableLanguages.length; i++) {
    $("#codeLanguages").append($("<button></button>").attr("type", "button").attr("class", "btn btn-default").html(availableLanguages[i]).click(function(){
      $("#codeLanguages>button.active").removeClass("active");
      $(this).addClass("active");
      window.MODE_DEFAULT = $(this).html();
      
      // Update default mode
      window.CodeMirror.setValue(window.CodeMirror.getValue());
    }));
  }

  $("#codeLanguages button").each(function(){
    if(window.MODE_DEFAULT == $(this).html()) {
      $(this).addClass("active");
    }
  });

  // Create CodeMirror
  
  window.CodeMirror = CodeMirror(document.getElementById("editor"), {
    value: "",
    lineNumbers: true,
    lineWrapping: true,
    mode: 'gfm',
  });
  
  window.CodeMirror.setValue(window.code);
  
  window.CodeMirror.on("change", function(){
    if (typeof(Storage) !== "undefined") {
      localStorage.code = window.CodeMirror.getValue();
    }
  });
  
  // Embed button
  
  window.embed = function(){
    var url = document.location.href.split("#")[0];
    url = url + "#";
    var autoplay = "";
    var content = "";
    if($("#embed_autoplay").is(':checked')) {
      autoplay = "autoplay";
    }
    if($("#embed_content").is(':checked')) {
      content = Base64.encode(window.CodeMirror.getValue())
    }
    var uiLanguage = $("#language > a").val();
    var codeLanguage = window.MODE_DEFAULT;
    url = url + uiLanguage + "," + codeLanguage + "," + autoplay + ",;" + content
    $("#embed_code").text('<iframe src="' + url + '"></iframe>');

  };
  
  $("#embed input").change(window.embed);
  
  // Share button
  
  window.share = function(){
    var url = document.location.href.split("#")[0];
    url = url + "#";
    var autoplay = "";
    var content = "";
    if($("#share_autoplay").is(':checked')) {
      autoplay = "autoplay";
    }
    if($("#share_content").is(':checked')) {
      content = Base64.encode(window.CodeMirror.getValue())
    }
    var uiLanguage = $("#language > a").val();
    var codeLanguage = window.MODE_DEFAULT;
    url = url + uiLanguage + "," + codeLanguage + "," + autoplay + ",;" + content
    $("#share_code").text(url);
    // AddToAny
    $(".a2a_dd").attr("href", "https://www.addtoany.com/share?linkurl=" + encodeURIComponent(url) + "&linkname=");
    window.a2a_config.linkurl = url;
  };
  
  $("#share input").change(window.share);

});

window.parseMoonscript = function(code) {
  return Module.ccall("compile_moonscript", "string", ["string"], [code]);
}

window.LuaReady = function(){
  // User interface

  function changeLanguage(element){
    $("#language > a").html(element.html() + "&nbsp;<span class=\"caret\"></span>");
    $("#language > a").val(element.text());
  }

  $("#language > ul li a").click(function(){
    changeLanguage($(this));
  });

  if(window.uiLanguage == "") {
    changeLanguage($("#language > ul li a:first-child"));
  } else {
    var lang = $("#language > ul li a:contains('" + window.uiLanguage + "')");
    if(lang.length) {
      changeLanguage(lang);
    } else {
      changeLanguage($("#language > ul li a:first-child"));
    }
  }
  
  window.markdown = new showdown.Converter();
}