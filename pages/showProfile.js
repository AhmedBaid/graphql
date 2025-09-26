import { container, logout } from "../config/config.js";
import { FetchGraphqlapi } from "../helpers/FetchApi.js";
import { project_list, skills, user_info } from "../query/query.js";
import { getRank } from "../helpers/GetRank.js";
import { formatXP } from "../helpers/FormatXp.js";

export async function showProfile(token) {
  const Profile_data = await FetchGraphqlapi(user_info, token);
  const Project_data = await FetchGraphqlapi(project_list, token);
  const skills_data = await FetchGraphqlapi(skills, token);

  const firstName = Profile_data.data.user[0].firstName || "user";
  const lastName = Profile_data.data.user[0].lastName || "user";
  const totalXP = Profile_data.data.xp.aggregate.sum.amount || 0;
  const level = Profile_data.data.level.aggregate.max.amount || 0;
  const cohort = Profile_data.data.user[0].events[0].cohorts[0].labelName || "cohort not found";
  const completedProjects = Project_data.data.user[0].groups.length || 0;
  const list_skills = skills_data.data.user[0].transactions || [];
  const unique_skills = [];
  const seen = new Set();

  for (const t of list_skills) {
    if (!seen.has(t.skillType)) {
      unique_skills.push(t);
      seen.add(t.skillType);
    }
  }

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
      <h2>Projects Completed (${completedProjects})</h2>
      <div class="project-table-container">
        <div class="project-header">
          <div class="col">Project</div>
          <div class="col">XP</div>
          <div class="col">Members</div>
          <div class="col">Leader</div>
        </div>
        <div class="project-body">
          ${Project_data.data.user[0].groups.map(g => {
    const projectXP = Project_data.data.xp_view
      .filter(x => x.path === g.group.path && x.userId === Project_data.data.user[0].id)
      .reduce((sum, x) => sum + x.amount, 0);
    return `
              <div class="project-row">
                <div class="col">${g.group.path.replace("/oujda/module/", "")}</div>
                <div class="col">${formatXP(projectXP)}</div>
                <div class="col">
                  ${g.group.members.map(m => `<div class="userLogin"><a href="https://profile.zone01oujda.ma/profile/${m.userLogin}">${m.userLogin}</a></div>`).join(" ")}
                </div>
                <div class="col">${g.group.captainLogin || "User"}</div>
              </div>
            `;
  }).join("")}
        </div>
      </div>
    </div>
    <div class="skills">
      <h2>Your Skills (${unique_skills.length})</h2>
      <div class="container-svg">
        <svg id="skillsChart"></svg>
      </div>
      </div>
  `;
  const svg = document.getElementById("skillsChart");
  const width = 1000;
  const barHeight = 40;
  const spacing = 20;
  const colors = ["#4deeea", "#f000ff", "#ffe700", "#74ee15", "#001eff"];

  svg.setAttribute("width", width);
  svg.setAttribute("height", (unique_skills.length * (barHeight + spacing)) + 100);


  const maxAmount = unique_skills[0].skillAmount || 1;


  unique_skills.forEach((skill, i) => {
    const y = i * (barHeight + spacing) + 50;
    const amount = skill.skillAmount || 0;
    const barWidth = Math.max(10, (amount / maxAmount) * (width - 150));
    const combine = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "10");
    text.setAttribute("y", `${y + barHeight / 2}`);
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = skill.skillType.replace("skill_", "");
    combine.appendChild(text);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "100");
    line.setAttribute("y1", `${y}`);
    line.setAttribute("x2", `${100 + barWidth}`);
    line.setAttribute("y2", `${y}`);
    line.setAttribute("stroke", colors[i % colors.length]);
    line.setAttribute("stroke-width", "10");
    line.setAttribute("stroke-linecap", "round");
    combine.appendChild(line);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", `${100 + barWidth}`);
    circle.setAttribute("cy", `${y}`);
    circle.setAttribute("r", "10");
    circle.setAttribute("fill", colors[i % colors.length]);
    combine.appendChild(circle);

    const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
    value.setAttribute("x", `${120 + barWidth}`);
    value.setAttribute("y", `${y}`);
    value.setAttribute("dominant-baseline", "middle");
    value.textContent = `${amount} %`;
    combine.appendChild(value);
    svg.appendChild(combine);
  });
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    logout();
  });
}

