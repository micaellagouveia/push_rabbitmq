const chai = require('chai')
const expect = chai.expect
const utils = require('../src/utils/utils')

describe("CheckSql Function", () => {
    it("return file with .sql extension", function(done) {
        const array = ['a.js', 'b.md', 'c.sql', 'd.py']
        const result = utils.checkSql(array)
        expect(result).to.equal('c.sql')
        done()
    })

    it("return an empty const", function(done){
        const array = ['a.js', 'b.md', 'c.html', 'd.py']
        const result = utils.checkSql(array)
        expect(result).to.equal('')
        done()
    })

})

describe('Last Number Function', ()=>{
    it('return the last number + 1 with 3 digits', (done)=>{
        const array = ['x_x_001_x', 'x_x_002_x', 'x_x_003_x', 'x_x_004_x' ]
        const result = utils.lastNumber(array)
        expect(result).to.equal('005')
        done()
    })
})