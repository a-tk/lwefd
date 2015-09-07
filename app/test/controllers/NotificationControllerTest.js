var NotificationController = require('../../controllers/NotificationController');
var assert = require('assert');

describe('NotificationController', function() {
  describe('Constructor', function() {
    it('should only ever create one NotificationController', function() {
      var note1 = new NotificationController();
      var note2 = new NotificationController();

      assert.equal(note1, note2);
    });
  });
});