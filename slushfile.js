/*
 * slush-api-blueprint-focus-booster
 * https://github.com/saamo/slush-api-blueprint-focus-booster
 *
 * Copyright (c) 2015, Samir Djellil
 * Licensed under the MIT license.
 */

var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  inquirer = require('inquirer');

var templateDir = '/templates/app',
  configFile = templateDir + '/config.example.js',
  srcDir = templateDir + '/src/**';

gulp.task('default', function(done) {
  inquirer.prompt([{
      type: 'confirm',
      name: 'createConfig',
      message: 'Create config file?'
    }, {
      type: 'confirm',
      name: 'copyExamples',
      message: 'Copy example blueprints?'
    }, {
      type: 'confirm',
      name: 'doIt',
      message: 'Let\'s do it?'
    }],
    function(answers) {
      if (!answers.doIt) {
        return done();
      }

      if (answers.createConfig) {
        gulp.src(__dirname + configFile)
          .pipe(rename('./config.js'))
          .pipe(conflict('./config.js'))
          .pipe(gulp.dest('./'))
      }

      if (answers.copyExamples) {
        gulp.src(__dirname + srcDir)
          .pipe(conflict('./src'))
          .pipe(gulp.dest('./src'))
      }

      gulp.src([
          __dirname + templateDir + '/**/*',
          '!' + __dirname + templateDir + '/.git',
          '!' + __dirname + configFile,
          '!' + __dirname + srcDir
        ], {
          dot: true
        })
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function() {
          done();
        })
        .resume();
    });
});
