module.exports = class Push {
    constructor(content){
        this.id = content.project_id
        this.branch = content.project.default_branch  
        this.commit = content.commits
        this.modified = content.commits[0].modified
        this.added = content.commits[0].added
    }
}