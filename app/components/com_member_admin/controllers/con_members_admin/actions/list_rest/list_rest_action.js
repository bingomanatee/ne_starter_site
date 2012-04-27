var _ = require('underscore');
var util = require('util');
var columns = ['_id', 'username', 'name', 'email'];

function _query(search, cols) {
    var terms = [];
    cols.forEach(function (col) {
        if (col.searchable) {
            var match = {};
            if(isNaN(search.value)){
                match[col.field] = new RegExp('.*' + search.value + '.*');
            } else {
                match[col.field] = search.value;
            }
            terms.push(match);
        }
    });

    switch(terms.length){
        case 0:
            return {};
        break;

        case 1:
            return terms[0];
        break;

        default:
            return {"$or": terms}
    }
}

module.exports = {

    on_input:function (rs) {
        var data = rs.req_props;
        _.each(data, function(value, key){
            if (/^i/.test(key)){
                data[key] = parseInt(value);
            } else if (/^b/.test(key)){
                data[key] = (value == 'true') ? true : false;
            }
        });
        console.log('data: %s', util.inspect(data));
        var range = {
            from:data.iDisplayStart,
            size:data.iDisplayLength
        };

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
            var sort_desc = [data['iSortCol_' + i], dir];
            sort.push(sort_desc);
        }

        var query = search.value ? _query(search, schema) : {};

        this.on_process(rs, {range:range, query: query, schema:schema, sort:sort});
    },

    on_process:function (rs, input) {
        console.log('input: %s', util.inspect(rs.req));

        var query = this.models.members_members.find(input.query, columns).slice([input.range.from, input.range.size]);
        var stream = query.stream();
        rs.res.write('[');
        var first = true;

        stream.on('data', function (doc) {
            if (first){
                first = false;
            } else {
                rs.res.write(',');
            }
            rs.res.write(JSON.stringify(doc.toJSON()));
        })

        stream.on('error', function (err) {
            throw err;
        })

        stream.on('close', function () {
            rs.res.write(']');
            rs.res.end();
        })
    }

}