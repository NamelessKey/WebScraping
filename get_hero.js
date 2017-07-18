/// <reference path="./autocomplete/node.d.ts" />

/* === import lib === */
// for use http
var http = require('http');
// for use jQuery API
var cheerio = require('cheerio');
// for remove html tag
var striptags = require('striptags')

/* === striptags ==
Usage
  striptags(html);
  striptags(html, allowedTags);
== end striptags == */
// for read write file
var fs = require('fs');
// for stringbuilder
var sb = require("string-builder");
// for request
var request = require("request");
// for mysql
// var mysql = require('mysql');

/* === define url === */
var hero_name = 'Winter_Wyvern';
var options = {
  host: 'www.dota2.com',
  port: 80,
  path: '/hero/' + hero_name,
  method: 'GET'
};

/* === main === */
request({ uri: 'http://www.dota2.com/hero/' + hero_name ,}, function(error, response, body) {
      $ = cheerio.load(body);
      // writeFile($('#bodyContainer'));
      // status
      var overview_IntVal = $('#overview_IntVal').html();
      var overview_AgiVal = $('#overview_AgiVal').html();
      var overview_StrVal = $('#overview_StrVal').html();
      var overview_AttackVal = $('#overview_AttackVal').html();
      var overview_SpeedVal = $('#overview_SpeedVal').html();
      var overview_DefenseVal = $('#overview_DefenseVal').html();
      sb.append("{");
      sb.append('\"IntVal\" : \"' + overview_IntVal + '\",\n');
      sb.append('\"AgiVal\" : \"' + overview_AgiVal + '\",\n');
      sb.append('\"StrVal\" : \"' + overview_StrVal + '\",\n');
      sb.append('\"AttackVal\" : \"' + overview_AttackVal + '\",\n');
      sb.append('\"SpeedVal\" : \"' + overview_SpeedVal + '\",\n');
      sb.append('\"DefenseVal\" : \"' + overview_DefenseVal + '\",\n');

      // bio
      var content_bio = $('#bioInner').html();
      sb.append('\"Bio\" : \"' + striptags(content_bio).trim() + '\",\n');

      // stata
      var stata_table = $('#statsInner').html();
      sb.append('\"Stata\" : [');
      var icount = 0;
      $('#statsInner').find('#statsLeft > .statRow').each(function(index,item) {
           if (icount == 0) {
                // level
                sb.append('{ \"Level\" : [');
                $(this).find('.statRowCol').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\",');
                });
                sb.append(']},\n');
           } else if (icount == 1) {
                // mana
                sb.append('{ \"Mana\" : [');
                $(this).find('.statRowColW').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\",');
                });
                sb.append(']},\n');
           } else if (icount == 2) {
               // armor
                sb.append('{ \"Armor\" : [');
                $(this).find('.statRowColW').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\",');
                });
                sb.append(']},\n');
           }
           icount++;
      });
      icount = 0;
       $('#statsInner').find('#statsLeft > .statRowB').each(function(index,item) {
           if (icount == 0) {
                // hit point
                sb.append('{ \"HitPoint\" : [');
                $(this).find('.statRowColW').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\",');
                });
                sb.append(']},\n');
           } else if (icount == 1) {
                // damage
                sb.append('{ \"Damage\" : [');
                $(this).find('.statRowColW').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\",');
                });
                sb.append(']},\n');
           }
           icount++;
      });
      icount = 0;
      $('#statsInner').find('#statsRight > .statRow').each(function(index,item){
          if (icount == 0) {
               // blank
           } else if (icount == 1) {
                // attack range
                sb.append('{ \"AttackRange\" : ');
                $(this).find('.statRowCol2W').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\"');
                });
                sb.append('},\n');
           }
           icount++;
      });
      icount = 0;
      $('#statsInner').find('#statsRight > .statRowB').each(function(index,item){
          if (icount == 0) {
               // sight range
               sb.append('{ \"SightRange\" : ');
                $(this).find('.statRowCol2W').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\"');
                });
                sb.append('},\n');
           } else if (icount == 1) {
                // missile speed
                sb.append('{ \"MissileSpeed\" : ');
                $(this).find('.statRowCol2W').each(function(index,item){
                    sb.append('\"' + $(item).html() + '\"');
                });
                sb.append('}\n');
           }
           icount++;
      });
      //sb.append(striptags(stata_table).trim() + '\n');
      sb.append('],\n');

      // ability
      var a_image_url = '';
      var a_name = '';
      var a_desc = '';
      var a_mana = '';
      var a_cooldown = '';
      var a_footer_left = '';
      var a_footer_right = '';
      var a_youtube = '';
      sb.append('\"Ability\" : [' + '\n');
      $('#abilitiesInner').each(function(index, item){
        $(this).find('.abilitiesInsetBoxInner').each(function(index,item) {
            sb.append("{");
            $(this).find('.abilitiesInsetBoxContent > .abilityHeaderBox').each(function(index , item){
              // image 
              $(this).find('.abilityIconHolder2 > img').each(function(index, item) {
                  console.log('ability_image_url : ' + $(item).attr('src') + '\n');
                  a_image_url = $(item).attr('src');
                  sb.append('\"ability_image_url\" : \"' + a_image_url.trim() + '\",\n');
              });
              // name
              $(this).find('.abilityHeaderRowDescription > h2').each(function(index,item) {
                  console.log('ability_name : ' + $(item).html() + '\n');
                  a_name = $(item).html();
                  sb.append('\"ability_name\" : \"' + a_name.trim() + '\",\n');
              })
              // desc
              $(this).find('.abilityHeaderRowDescription > p').each(function(index,item) {
                  console.log('ability_desc : ' + $(item).html() + '\n');
                  a_desc = $(item).html();
                  sb.append('\"ability_desc\" : \"' + a_desc.trim() + '\",\n');
              })
              // mana
              $(this).find('.abilityHeaderRowDescriptionRight > cooldownMana > mana').each(function(index,item){
                  console.log('mana : ' + striptags($(item).html()) + '\n');
                  a_mana = striptags($(item).html());
                  sb.append('\"mana\" : \"' + a_mana.trim() + '\",\n');
              })
              // cooldown
              $(this).find('.abilityHeaderRowDescriptionRight > cooldownMana > cooldown').each(function(index,item){
                  console.log('cooldown : ' + striptags($(item).html()) + '\n');
                  a_cooldown = striptags($(item).html());
                  sb.append('\"cooldown\" : \"' + a_cooldown.trim() + '\",\n');
              })
            })
            // footer
            $(this).find('.abilitiesInsetBoxContent > .abilityFooterBox').each(function(index , item){
              // left
              $(this).find('.abilityFooterBoxLeft').each(function(index,item) {
                  console.log('ability_footer_left : ' + striptags($(item).html()) + '\n');
                  a_footer_left = striptags($(item).html());
                  sb.append('\"footer_left\" : \"' + a_footer_left.trim() + '\",\n');
              })
              // right
              $(this).find('.abilityFooterBoxRight').each(function(index,item) {
                  console.log('ability_footer_right : ' + striptags($(item).html()) + '\n');
                  a_footer_right = striptags($(item).html());
                  sb.append('\"footer_right\" : \"' + a_footer_right.trim() + '\",\n');
              })
            })
            // youtude
            $(this).find('.abilitiesInsetBoxContent > .abilityVideoContainer').each(function(index , item){
              $(this).find('iframe').each(function(index,item) {
                  console.log('youtude  : ' + $(item).attr('src') + '\n');
                  a_youtube = $(item).attr('src');
                  sb.append('\"youtude\" : \"' + a_youtube.trim() + '\"\n');
              })
            })
            sb.append("},");
        })
      });
      sb.append("]");
      sb.append("}");

      // write file
      writeFile(convertSpecialCharecter(sb.toString()));
});

function writeFile(content) {
  // fs.writeFile(hero_name + '.txt',clear_content,function(err){
  fs.appendFile('./raw_data/hero_int/' + hero_name + '.txt',content,function(err){
    if (err) {
      throw 'error writing file: ' + err;
    } else {
      console.log('file written');
      return true;
    }
  });
}

function convertSpecialCharecter(content) {
  return content.replace(/&apos;/g, "'")
               .replace(/&quot;/g, '"')
               .replace(/&gt;/g, '>')
               .replace(/&lt;/g, '<')
               .replace(/&amp;/g, '&');
}
