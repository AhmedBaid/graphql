export const user_info = `
{
    user {
    login
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


export const project_list = `
{
  user {
    groups(where: {group: {status: {_eq: finished}, _and: {eventId: {_eq: 41}}}}
    order_by:{createdAt:asc}
    ) {
      group {
        captainLogin
        path
        members (where: { accepted: { _eq: true } })  {
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

export const skills = `
{
  user {
    transactions(
      where: {type: {_nin: ["xp", "level", "up", "down"]}}
      order_by: {amount: desc}
    ) {
      skillType: type
      skillAmount: amount
    }
  }
}`

export const audits = `
{ 
  user {
    auditRatio
    totalUp
    totalDown
    success:audits_aggregate(where: { closureType: { _eq: succeeded } }) {
      aggregate {
        count
      }
    }
    failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
      aggregate {
        count
      }
    }
  }
}
`