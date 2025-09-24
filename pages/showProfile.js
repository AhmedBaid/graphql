import { container, logout } from "../config/config.js";
import { FetchGraphqlapi } from "../helpers/FetchApi.js";
import { project_info, user_info } from "../query/query.js";
import { getRank } from "../helpers/GetRank.js";
import { formatXP } from "../helpers/FormatXp.js";

export async function showProfile(token) {

  const Profile_data = await FetchGraphqlapi(user_info, token);
  const Project_data = await FetchGraphqlapi(project_info, token);
  console.log("Profile data:", Project_data);

  const firstName = Profile_data.data.user[0].firstName || "user";
  const lastName = Profile_data.data.user[0].lastName || "user";
  const totalXP = Profile_data.data.xp.aggregate.sum.amount || 0;
  const level = Profile_data.data.level.aggregate.max.amount || 0;
  const cohort = Profile_data.data.user[0].events[0].cohorts[0].labelName || "cohort not found";
  const completedProjects = Project_data.data.user[0].groups.length || 0;

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
        <h3>Total XP</h3>
        <p>${formatXP(totalXP)}</p>
      </div>
      <div class="stat-card">
        <h3>Current Rank</h3>
        <p>${getRank(level)}</p>
      </div>
      <div class="stat-card">
        <h3>Your cohort</h3>
        <p>${cohort}</p>
      </div>
    </div>
    <div class="projects">
      <div class="stat-card">
          <h3>Completed Projects</h3>
          <p>${completedProjects}</p>
      </div>
      <div class="project-table-container">
        <h2>Projects XP Overview</h2>
        <table class="project-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>XP</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            ${Project_data.data.user[0].groups.map(g => {
              const projectXP = Project_data.data.xp_view
                .filter(x => x.path === g.group.path && x.userId === Project_data.data.user[0].id)
                .reduce((sum, x) => sum + x.amount, 0);
              return `
                <tr>
                  <td>${g.group.path}</td>
                  <td>${formatXP(projectXP)}</td>
                  <td>${g.group.members.map(m => m.userLogin).join(", ")}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
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
