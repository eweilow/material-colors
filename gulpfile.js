var gulp = require("gulp");
var fs = require("fs");

var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var  clean = require("gulp-clean");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("data", function(cb){
  var colordata = require("./lib/colors.json");
  
  var output = {};
  output.text = colordata.text;
  output.colors = {};
  for(var color in colordata.swatches) {
    var values = colordata.swatches[color];
    var lightpoint = colordata.lightpoints.swatches[color];
    
    for(var value in values) {
      value = parseInt(value);
      
      var hex = values[value];
      var islight = value >= lightpoint;
      
      output.colors[color + "-" + value.toFixed(0)] = {
        hex: hex,
        light: islight
      };
    }
  }
  for(var color in colordata.accents) {
    var values = colordata.accents[color];
    var lightpoint = colordata.lightpoints.accents[color];
    
    for(var value in values) {
      value = parseInt(value);
      
      var hex = values[value];
      var islight = value >= lightpoint;
      
      output.colors[color + "-A" + value.toFixed(0)] = {
        hex: hex,
        light: islight
      };
    }
  }
  if(!fs.existsSync("./build/")) { 
    fs.mkdirSync("./build/");
  }
  
  fs.writeFile("./build/colors.js", "window.colors = " + JSON.stringify(output, null, "  ") + ";", 
    function(err) {
      if(err) return cb(err);
      fs.writeFile("./build/colors.json", JSON.stringify(output, null, "  "), cb);
    });
});

gulp.task("scripts", function(){
  return gulp.src("./lib/script/*.js")
    .pipe(gulp.dest("./build"));
});

gulp.task("tests", function(){
  return gulp.src("./test/index.html")
    .pipe(gulp.dest("./build"));
});

gulp.task("style", ["data"], function(cb){
  var colordata = require("./build/colors.json");
  var style = "";
  var light = colordata.text.light;
  var dark = colordata.text.dark;
  style += ("[m-hook-color] {                 color: "+dark["primary"]+"; }");
  style += ("[m-hook-color][m-light='true'] { color: "+light["primary"]+"; }");
  style += ("[m-hook-color-bg] {                 background-color: "+dark["primary"]+"; }");
  style += ("[m-hook-color-bg][m-light='true'] { background-color: "+light["primary"]+"; }");
  for(var key in light) {
  style += ("[m-hook-color='"+key+"'] {                 color: "+dark[key]+"; }");
  style += ("[m-hook-color='"+key+"'][m-light='true'] { color: "+light[key]+"; }");
  style += ("[m-hook-color-bg='"+key+"'] {                 background-color: "+dark[key]+"; }");
  style += ("[m-hook-color-bg='"+key+"'][m-light='true'] { background-color: "+light[key]+"; }");
  }
  for(var key in colordata.colors) {
    style += ("[m-actual-color='"+key+"'] { color: "+colordata.colors[key].hex + "; }");
    style += ("[m-actual-bg='"+key+"'] { background-color: "+colordata.colors[key].hex + "; }");
  }
  fs.writeFile("./build/colors.css", style, cb);
});

gulp.task("bundle", ["data", "scripts", "style"], function(){
  return gulp.src(["./build/colors.js", "./build/script.js"])
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./build"));
});

gulp.task("bundleminified", ["bundle"], function(){
  return gulp.src(["./build/colors.js", "./build/script.js"])
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./build"));
});

gulp.task("minify", ["bundleminified", "tests"], function(){
  return gulp.src(["./build/colors.js", "./build/script.js"])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./build"));
});

gulp.task("clean", function(){
  return gulp.src("./build", {read: false})
    .pipe(clean());
});

gulp.task("build", ["clean"], function(){
  gulp.run("minify");
})

gulp.task("watch", ["build"], function(){
  gulp.watch("./lib/**/*.js", ["minify"]);
})