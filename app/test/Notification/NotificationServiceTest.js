var NotificationService = require('../../util/Notifications/NotificationService');
var assert = require('assert');

describe('NotificationService', function() {
  describe('Constructor', function() {
    it('should only ever create one NotificationService', function() {
      var note1 = new NotificationService();
      var note2 = new NotificationService();

      assert.equal(note1, note2);
    });
  });
});