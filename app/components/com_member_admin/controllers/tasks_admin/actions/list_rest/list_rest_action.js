var _ = require('underscore');
var util = require('util');
var columns = ['_id', 'label'];
var Datatable_JSON = require('app_support/Datatable_JSON');

module.exports = {

    on_input:function (rs) {
        var data = rs.req_props;
        var dtj = new Datatable_JSON(data, columns);

        this.on_process(rs, dtj);
    },

    on_process:function (rs, input) {
        console.log('input: %s', util.inspect(input, true, 3));
        var dis_count = 0;
        var self = this;
        input.query.deleted = {"$ne": true}

        self.models.members_tasks.count({deleted: {"$ne": true}}, function (err, count) {
            var query = self.models.members_tasks.find(input.query(), columns);
            query.sort.apply(query, input.sort())
                .skip(input.skip())
                .limit(input.limit());

            var stream = query.stream();
            rs.res.write(JSON.stringify({sEcho:input.echo(), iTotalRecords:count, aaData:[] }).replace(/\]\}$/, ''));
            var first = true;

            stream.on('data', function (doc) {
                ++dis_count;
                if (first) {
                    first = false;
                } else {
                    rs.res.write(',');
                }
                var out = [];

                columns.forEach(function (col) {
                    out.push(doc[col]);
                });
                rs.res.write(JSON.stringify(out));
            });

            stream.on('error', function (err) {
                console.log('error in stream: %s', err);
                throw err;
            });

            stream.on('close', function () {
                console.log('closing stream');
                rs.res.write('],');
                rs.res.write(JSON.stringify({iTotalDisplayRecords:count}).replace(/^\{/, ''));
                rs.res.end();
            });


        });
    }

}