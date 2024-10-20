
function createFilters(condition) {
    return {
        "match": condition,
        "rules": []
    }
}

function Commonfilters(field_key) {

    return {
        isDuringTheCurrentMonth: {
            field: field_key,
            operator: "is during the current",
            type: "month",
        },
        isDuringThePreviousMonth: {
            field: field_key,
            operator: "is during the previous",
            range: "1",
            type: "months",
        },
        isDuringTheNextMonth: {
            field: field_key,
            operator: "is during the next",
            range: "1",
            type: "months",
        },
        isBeforeThePreviousMonth: {
            field: field_key,
            operator: "is before the previous",
            range: "1",
            type: "months",
        },
    }

}

export const filters = {
    create: (condition) => createFilters(condition),
    common: (field_key) => Commonfilters(field_key)
}