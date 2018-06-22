var gulp = require("gulp");
var sass = require("gulp-sass");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");
var revDel = require("rev-del");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var cssnano = require("gulp-cssnano");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var runSequence = require("run-sequence");
var htmlmin = require("gulp-htmlmin");
var cachebust = require("gulp-cache-bust");

// Basic Gulp task syntax
gulp.task("hello", function() {
  console.log("Hello Zell!");
});

// Development Tasks
// -----------------

// Start browserSync server
gulp.task("browserSync", function() {
  browserSync({
    server: {
      baseDir: "app"
    }
  });
});

gulp.task("sass", function() {
  return gulp
    .src("app/scss/**/*.scss") // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on("error", sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer("last 2 version")) // Adds CSS vendor prefixes automatically
    .pipe(gulp.dest("app/css")) // Outputs it in the css folder
    .pipe(
      browserSync.reload({
        // Reloading with Browser Sync
        stream: true
      })
    );
});

//gulp.task('rev', function() {
//	return gulp.src('dist/css/*.css')
//		.pipe(rev())
//		.pipe(gulp.dest('dist/css'))
//});



// Watchers
gulp.task("watch", function() {
  gulp.watch("app/scss/**/*.scss", ["sass"]);
  gulp.watch("app/*.html", browserSync.reload);
  gulp.watch("app/js/**/*.js", browserSync.reload);
});

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task("useref", function() {
  return gulp
    .src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"));
});

// Optimizing Images
gulp.task("images", function() {
  return (
    gulp
      .src("app/images/**/*.+(png|jpg|jpeg|gif|svg)")
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true
          })
        )
      )
      .pipe(gulp.dest("dist/images"))
  );
});

// Copying fonts
gulp.task("fonts", function() {
  return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

// Cleaning
gulp.task("clean", function() {
  return del.sync("dist").then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task("clean:dist", function() {
  return del.sync(["dist/**/*", "!dist/manifest.json", "!dist/*.js", "!dist/images", "!dist/images/**/*"]);
});

gulp.task("link-dependencies", function() {
  return depLinker.linkDependenciesTo("dist/js");
});

gulp.task('minify', function() {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({collapseWhitespace: true,
      removeComments: true,
    minifyCSS: true
  }))
    .pipe(gulp.dest('dist'));
});

// Build Sequences
// ---------------

gulp.task("default", function(callback) {
  runSequence(["sass", "browserSync"], "watch", callback);
});

gulp.task("build", function(callback) {
  runSequence(
    "clean:dist",
    "sass",
    ["useref", "images", "fonts"],
    "minify",
    callback
  );
});

