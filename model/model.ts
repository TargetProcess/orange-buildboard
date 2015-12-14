
interface Item{
    _id:String
    branch:Branch
    task:Task

    state:State
    users:User[]
    builds:Build[]
    getActions():Action[]

}


interface Action{

}

interface Build {
    date:Date
    commit:String
    status:BuildStatus
    results:BuildResult[]
}

interface BuildResult {
    status:BuildStatus
    children?:BuildResult[]
}

interface BuildStatus{
    isOk:boolean
}

export interface Task {
    id:any
    name:String
}

export interface Branch {
    commits:String[]
}

export interface Build {

}

export interface User {
    email:String
}

export interface State {
    name:String
}
