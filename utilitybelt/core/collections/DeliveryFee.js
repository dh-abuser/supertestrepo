/**
 * Restaurant Model, represents a restaurant.
 */
core.define('core.collections.DeliveryFee', {
    extend: 'core.Collection',
    model: 'core.Model',

    /**
     * Returns the smallest delivery fee Of the collection.
     *
     * @return {Core.Model} The delivery fee havind the smallest amount
     *
     * TODO use Colelction.min
     */
    getSmallest: function() {
        if (!this.length) {
            return false;
        }
        var smallest = this.at(0);
        this.forEach(function(fee) {
            if (fee.get('amount') < smallest.get('amount')) {
                smallest = fee;
            }
        });
        return smallest;
    },

    getSmallestAmount: function() {
        var smallest = this.getSmallest();
        return smallest ? this.getSmallest().get('amount') : 0;
    },

    /**
     * Returns the biggest delivery fee Of the collection.
     *
     * @return {Core.Model} The delivery fee havind the biggest amount
     *
     * TODO use Colelction.max
     */
    getBiggest: function() {
        if (!this.length) {
            return false;
        }
        var biggest = this.at(0);
        this.forEach(function(fee) {
            if (fee.get('amount') > biggest.get('amount')) {
                biggest = fee;
            }
        });
        return biggest;
    },

    getBiggestAmount: function() {
        var biggest = this.getBiggest();
        return biggest ? biggest.get('amount') : 0;
    }
});
