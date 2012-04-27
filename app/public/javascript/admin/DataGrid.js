function DataGrid(source, dest, fields) {
    this.source = source;
    this.dest = dest;
    this.fields = fields;
}

_.extend(DataGrid.prototype, {

    load: function(){
        $.getJSON(this.source, function(data){
            self.apply(data);
        })
    }
})

