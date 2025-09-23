import { APIGraphql, container, logout } from "../config/config.js";

function formatXP(xp) {
  if (!xp) return "0 kb";

  if (xp.toString().length <= 6) {
    return `${(xp / 1000).toFixed(2)} KB`;
  } else {
    return `${(xp / 1000000).toFixed(2)} MB`;
  }
}

function getRank(level) {
  if (level >= 0 && level < 10) {
    return "Aspiring developer";
  } else if (level >= 10 && level < 20) {
    return "Beginner developer";
  } else if (level >= 20 && level < 30) {
    return "Apprentice developer";
  } else if (level >= 30 && level < 40) {
    return "Assistant developer";
  } else if (level >= 40 && level < 50) {
    return "Basic developer";
  } else if (level >= 50 && level < 55) {
    return "Junior developer";
  } else if (level >= 55 && level < 60) {
    return "Full-Stack developer";
  } else {
    return "";
  }
}

export async function showProfile(token) {
  const response = await fetch(APIGraphql, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        query {
          user {
            firstName
            lastName
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
          groups:transaction_aggregate(
            where: { type: { _eq: "level" }, event: { object: { name: { _eq: "Module" } } } }
          ) {
            aggregate {
              count
            }
          }
        }
      `
    })
  });

  const data = await response.json();
  console.log("Profile data:", data);

  const firstName = data.data.user[0].firstName;
  const lastName = data.data.user[0].lastName;
  const totalXP = data.data.xp.aggregate.sum.amount;
  const level = data.data.level.aggregate.max.amount;

  container.innerHTML = `
    <div class="header">
      <h1 class="logo">Welcome, <span class="firstLast">${firstName} ${lastName}</span></h1>
      <button id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i>Logout</button>
    </div>
    <div class="stats">
      <div class="stat-card">
        <h3>Current Level</h3>
        <p>${level}</p>
      </div>
      <div class="stat-card">
        <h3>Current Rank</h3>
        <p>${getRank(level)}</p>
      </div>
      <div class="stat-card">
        <h3>Total XP</h3>
        <p>${formatXP(totalXP)}</p>
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    logout();
  });
}




















// import { APIGraphql, container, logout } from "../config/config.js";

// // Format XP into kb/mb
// function formatXP(xp) {
//   if (!xp) return "0 kb";
//   if (xp < 1_000_000) return `${(xp / 1000).toFixed(1)} kb`;
//   return `${(xp / 1_000_000).toFixed(2)} mb`;
// }

// export async function showProfile(token) {
//   // 1. Query user + groups + xp_view
//   const response = await fetch(APIGraphql, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify({
//       query: `
//         query {
//           user {
//             id
//             firstName
//             lastName
//             groups(
//               where: {
//                 group: { status: { _eq: finished }, _and: { eventId: { _eq: 41 } } }
//               }
//             ) {
//               group {
//                 id
//                 path
//                 members { userLogin }
//               }
//             }
//           }
//           xp_view {
//             amount
//             path
//             userId
//           }
//         }
//       `
//     })
//   });

//   const data = await response.json();
//   console.log("Profile data:", data);

//   const user = data.data.user[0];
//   const firstName = user.firstName;
//   const lastName = user.lastName;
//   const groups = user.groups || [];
//   const xpView = data.data.xp_view || [];

//   // 2. نربط projects مع XP
//   const xpResults = groups.map(g => {
//     const projectXP = xpView
//       .filter(x => x.path === g.group.path && x.userId === user.id)
//       .reduce((sum, x) => sum + x.amount, 0);

//     return {
//       path: g.group.path,
//       xp: projectXP,
//       members: g.group.members
//     };
//   });

//   // 3. عدد المشاريع
//   const completedProjects = xpResults.length;

//   // 4. UI
//   container.innerHTML = `
//     <div class="header">
//       <h1 class="logo">Welcome, ${firstName} ${lastName}</h1>
//       <button id="logoutBtn">Logout</button>
//     </div>

//     <div class="stats">
//       <div class="stat-card">
//         <h3>Completed Projects</h3>
//         <p>${completedProjects}</p>
//       </div>
//     </div>

//     <div class="projects">
//       <h2>Projects XP Overview</h2>
//       <table class="project-table">
//         <thead>
//           <tr>
//             <th>Project</th>
//             <th>XP</th>
//             <th>Members</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${xpResults.map(p => `
//             <tr>
//               <td>${p.path}</td>
//               <td>${formatXP(p.xp)}</td>
//               <td>${p.members.map(m => m.userLogin).join(", ")}</td>
//             </tr>
//           `).join("")}
//         </tbody>
//       </table>
//     </div>
//   `;

//   // 5. Logout btn
//   const logoutBtn = document.getElementById("logoutBtn");
//   logoutBtn.addEventListener("click", () => {
//     logout();
//   });
// }
