var fvh = require('./../app/resources/view_helpers/Flash_View_Helper')();
var current_flash_content = {};
var util = require('util');

module.exports = {
    setup: function(t){
        fvh._req_state = {
            flash: function(type){
                return (current_flash_content.hasOwnProperty(type)) ? current_flash_content[type] : [];
                delete current_flash_content[type];
            }
        }
        t.done();
    },

    empty: function(t){
        t.equal(fvh.render(), '<!-- no messages -->');
        t.done();
    },

    one_content: function(t){
        current_flash_content = {
            info: ['foo']
        };

        t.deepEqual([{type: 'info', messages: ['foo']}], fvh.flash_messages(), 'flash message foo one');
        t.done();
    },


    one_content_render: function(t){
        current_flash_content = {
            info: ['foo']
        };

        t.equal('<div class="flash_messages"><h2>Messages:</h2><h3>info</h3><ul><li>foo</li></ul></div>' ,
            fvh.render(), 'flash message foo one render ' );
        t.done();
    },

    two_content_render: function(t){
        current_flash_content = {
            info: ['foo', 'bar']
        };

        t.equal('<div class="flash_messages"><h2>Messages:</h2><h3>info</h3><ul><li>foo</li><li>bar</li></ul></div>' ,
            fvh.render(), 'flash message foo two render ' );
        t.done();
    }
}