var NotificationParser = require('../../util/Notifications/NotificationParser');
var assert = require('assert');

describe('NotificationParser', function() {
  describe('Constructor', function() {
    it('should only ever create one NotificationParser', function() {
      var note1 = new NotificationParser();
      var note2 = new NotificationParser();

      assert.equal(note1, note2);
    });
  });
});