var _ = require('underscore');
var util = require('util');
var columns = ['_id', 'username', 'name', 'email'];

function _query(search, cols) {
    var terms = [];
    cols.forEach(function (col) {
        if (col.searchable) {
            var match = {};
            if (isNaN(search.value)) {
                match[col.field] = new RegExp('.*' + search.value + '.*');
            } else {
                match[col.field] = search.value;
            }
            terms.push(match);
        }
    });

    switch (terms.length) {
        case 0:
            return {};
            break;

        case 1:
            return terms[0];
            break;

        default:
            return {"$or":terms}
    }
}

module.exports = {

    on_input:function (rs) {
        var data = rs.req_props;
        _.each(data, function (value, key) {
            if (/^i/.test(key)) {
                data[key] = parseInt(value);
            } else if (/^b/.test(key)) {
                data[key] = (value == 'true') ? true : false;
            }
        });

        var schema = [];
        var search = {value:data.sSearch, regex:data.bRegex}

        columns.forEach(function (field, index) {
            var cell = {
                field:field,
                searchable:data['bSearchable_' + i],
                regex:data['bRegex_' + i]
            };
            schema.push(cell);
        });

        var sort = [];
        for (var i = 0; i < data.iSortingCols; ++i) {
            var dir = (data['sSortDir_' + i] == 'asc') ? 1 : -1;
            var sort_desc = [columns[data['iSortCol_' + i]], dir];
            sort.push(sort_desc);
        }

        var query = search.value ? _query(search, schema) : {};

        this.on_process(rs, {sEcho: data.sEcho, skip: data.iDisplayStart, limit: data.iDisplayLength, query:query, schema:schema, sort:sort});
    },

    on_process:function (rs, input) {
        console.log('input: %s', util.inspect(input));
        var dis_count = 0;
        var self = this;
        var query2 = self.models.members_members.find(input.query, columns)
            .skip(input.skip).limit(input.limit);
        query2.exec(function (err, data) {
            console.log('executing query %s: %s',util.inspect(query2), util.inspect(data));
        });


        self.models.members_members.count(function (err, count) {
            var query = self.models.members_members.find(input.query, columns)
                .skip(input.skip).limit(input.limit);

            var stream = query.stream();
            rs.res.write(JSON.stringify({sEcho:input.sEcho, iTotalRecords:count, aaData:[] }).replace(/\]\}$/, ''));
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
                rs.res.write(JSON.stringify({iTotalDisplayRecords:dis_count}).replace(/^\{/, ''));
                rs.res.end();
            });


        });
    }

}