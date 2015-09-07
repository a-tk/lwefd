var NotificationQueue = require('../../util/Notifications/NotificationQueue');
var assert = require('assert');

describe('NotificationQueue', function() {
  describe('Constructor', function() {
    it('should only ever create one NotificationQueue', function() {
      var note1 = new NotificationQueue();
      var note2 = new NotificationQueue();

      assert.equal(note1, note2);
    })
  });
});