module.exports = class Push {
    constructor(content){
        this.branch = content.project.default_branch  
        this.modified = content.commits[0].modified
        this.added = content.commits[0].added
    }
}