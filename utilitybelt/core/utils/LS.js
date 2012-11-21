
/*
 * LocalStorage simple database-alike layer
 */

core.LSDB = function() {
        
    this.prefix = 'db-';

    this.counter = function(table) {
        return this.prefix + table + '-counter';
    };

    this.incrementCounter = function(table) {
        var cnt = parseInt(localStorage.getItem(this.counter(table))) || 0;
        cnt++;
        localStorage.setItem(this.counter(table), cnt);
    }

    this.getCounter = function(table) {
        this.incrementCounter(table);
        return parseInt(localStorage.getItem(this.counter(table)));
    }

    this.insert = function(table, record, id) {
        if (typeof record != 'string') 
            record = JSON.stringify(record);
        var id = id || this.getCounter(table);
        localStorage.setItem(this.prefix + table + '-' + id, record);
    }

    this.select = function(table, id, callback) {
        var rec = localStorage.getItem(this.prefix + table + '-' + id);
        if (rec) {
            rec = JSON.parse(rec);
            if (!callback || callback(rec) === true)
                return rec;
            else 
                return false;
        }
        else 
            return false;
    }

    this.selectAll = function(table, callback) {
        var recs = [];
        if (!callback)
            callback = function() { return true; };
        for (key in localStorage) {
            var test_key = key.match(new RegExp((this.prefix + table + '-([a-zA-Z0-9]+)$'), "i"));
            if (test_key && test_key[1] && test_key[1]!='counter') {
                var rec = JSON.parse(localStorage[key]);
                if (callback(rec) === true)
                    recs.push(rec);
            }
        }
        return recs;
    }; 

    this.update = function(table, id, record) {
        this.insert(table, record, id);
    };

}
