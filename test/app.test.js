const expect = require('chai').expect;
require('mocha-sinon');
const scrapping = require('../controller/scrapping');
// Function to test, can also be in another file and as long as it's
// being called through some public interface it should be testable.
// If it's not in any way exposed/exported, testing will be problematic.
function privateFunction (time) {
    if (time < 12) { console.log('Good morning'); }
    if (time >= 12 && time <19) { console.log('Good afternoon'); }
    else { console.log('Good night!'); }
}


describe('Testing Scrapping Mandiri Mutation', function() {
    it('should log "Good afternoon" for hours >= 12 and < 19', function() {
        scrapping();
        setTimeout(() => {
            expect( console.log.calledWith('Good afternoon')).to.be.true;
        },60000)
    });
});