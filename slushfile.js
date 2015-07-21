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
  configExampleFile = templateDir + '/config.example.js',
  configFile = './config.js',
  srcDir = templateDir + '/src/**';

$publishToApiary = function (answers) { return answers.publishToApiary };

gulp.task('default', function (done) {
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
      name: 'publishToApiary',
      message: 'Publish to Apiary.io?'
    }, {
      type: 'input',
      name: 'apiaryName',
      message: 'Apiary.io API name?',
      when: $publishToApiary
    }, {
      type: 'input',
      name: 'apiaryToken',
      message: 'Apiary.io token?',
      when: $publishToApiary
    }, {
      type: 'confirm',
      name: 'makeItHappen',
      message: 'Let\'s make it happen?'
    }],
    function (answers) {
      if (!answers.makeItHappen) {
        return done();
      }

      if (answers.createConfig) {
        gulp.src(__dirname + configExampleFile)
          .pipe(rename(configFile))
          .pipe(conflict(configFile))
          .pipe(template({
            apiaryName: answers.apiaryName,
            apiaryToken: answers.apiaryToken
          }))
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
          '!' + __dirname + configExampleFile,
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
