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

describe('Get path file function', ()=>{
    it('return the new path with its new name', (done)=>{

        const sql = 'name/src/main/resources/migrations/2.1.7.0/PJE_2.1.7.0_003__NOME.sql'
        const homologVersion = '2.1.8.0'
        const number = '004'

        const result = utils.getPathFile(sql, homologVersion, number)
        expect(result).to.equal('name/src/main/resources/migrations/2.1.8.0/PJE_2.1.8.0_004__NOME.sql')
        done()
    })
})

describe('Get file version function', ()=>{
    it('return the version of file', (done)=>{

        const sql = 'name/src/main/resources/migrations/2.1.7.0/PJE_2.1.7.0_003__NOME.sql'

        const result = utils.getFileVersion(sql)
        expect(result).to.equal('2.1.7.0')
        done()
    })
})

describe('Compare version function', ()=>{
    it('return true', (done)=>{

        const file = '2.1.7.0'
        const homolog = '2.1.7.0'
        const result = utils.compareVersions(file, homolog)
        expect(result).to.equal(false)
        done()
    })

    it('return false', (done)=>{

        const file = '2.1.7.0'
        const homolog = '2.1.8.0'
        const result = utils.compareVersions(file, homolog)
        expect(result).to.equal(true)
        done()
    })
})

describe('Get path homolog file function', ()=>{
    it('return the path to rescue files in homolog file', (done)=>{

        const sql = 'name/src/main/resources/migrations/2.1.7.0/PJE_2.1.7.0_003__NOME.sql'
        const homologVersion = '2.1.8.0'

        const result = utils.getPathHomologFile(sql, homologVersion)
        expect(result).to.equal('name/src/main/resources/migrations/2.1.8.0')
        done()
    })
})

