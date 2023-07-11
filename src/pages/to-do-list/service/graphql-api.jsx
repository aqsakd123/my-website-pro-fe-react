export const FILTER_TASK = `
     query filter($filterRequest: FilterRequest){
        filter (filterRequest: $filterRequest) {
            id
            name
            description
            totalCredit
            typeCode
            pinned
            taskListOrder
            startDate
            endDate
        }
      }`

export const FIND_TASK_BY_ID = `
     query findTaskById ($id: ID!, $skipRoutine: Boolean!, $skipChildren: Boolean!) {
        findTaskById(id: $id) {
            id
            name
            description
            totalCredit
            typeCode
            pinned
            startDate
            endDate
            taskListOrder
            createdBy
            startDate
            endDate
            loopTime
            priority
            isCredited
            routineDate
            typeGroup
            routineType
            isCompleted
            isDeleted
            routine @skip(if: $skipRoutine)
            projectParentId
            children @skip(if: $skipChildren) {
                    id
                    name
                    description
                    totalCredit
                    typeCode
                    pinned
                    startDate
                    endDate
                    taskListOrder
                    createdBy
                    startDate
                    endDate
                    loopTime
                    priority
                    isCredited
                    routineDate
                    typeGroup
                    routineType
                    isCompleted
                    isDeleted
                    projectParentId

            }
        }
      }`