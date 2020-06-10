module.exports = class Push {
    constructor(content){
        this.branch = content.project.default_branch
        // são arrays, aqui qu vou procurar a mudança do arquivo sql
        this.modified = content.commits.modified
        this.added = content.commits.added
        this.removed = content.commits.removed
    }
}