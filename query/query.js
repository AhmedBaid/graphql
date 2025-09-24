export const user_info = `
{
    user {
    firstName
    lastName
    events(where: {cohorts: {labelName: {_is_null: false}}}) {
        cohorts {
        labelName
        }
    }
    }
    xp: transaction_aggregate(
    where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
    ) {
    aggregate {
        sum {
        amount
        }
    }
    }
    level: transaction_aggregate(
    where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
    ) {
    aggregate {
        max {
        amount
        }
    }
}
}`


export const project_info = `
{
  user {
    groups(where: {group: {status: {_eq: finished}, _and: {eventId: {_eq: 41}}}}
    order_by:{createdAt:asc}
    ) {
      group {
        captainLogin
        id
        path
        members {
          userLogin
        }
      }
    }
  }
  xp_view {
    amount
    path
  }
}`