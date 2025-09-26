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
  const svgContainer = document.querySelector(".container-svg");
const svg = document.getElementById("skillsChart");

const barHeight = 20;
const spacing = 20;
const color = "#3edd56ff";

const maxAmount = Math.max(...unique_skills.map(s => s.skillAmount || 1));
const svgHeight = unique_skills.length * (barHeight + spacing) + 30;

// Set SVG attributes for responsiveness
svg.setAttribute("width", "100%");
svg.setAttribute("height", svgHeight);
svg.setAttribute("viewBox", `0 0 1000 ${svgHeight}`);
svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

// Fixed padding values in viewBox units
const leftPadding = 150;
const rightPadding = 50;
const fullBarWidth = 1000 - leftPadding - rightPadding;

unique_skills.forEach((skill, i) => {
  const y = i * (barHeight + spacing) + 30;
  const amount = skill.skillAmount || 0;
  const barWidth = (amount / maxAmount) * fullBarWidth;

  // Skill name
  const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
  name.setAttribute("x", 10);
  name.setAttribute("y", y + barHeight / 2);
  name.setAttribute("dominant-baseline", "middle");
  name.setAttribute("font-size", "16");
  name.setAttribute("fill", "white");
  name.setAttribute("font-family", "Arial");
  name.textContent = skill.skillType.replace("skill_", "");
  svg.appendChild(name);

  // Background bar
  const bgBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgBar.setAttribute("x", leftPadding);
  bgBar.setAttribute("y", y);
  bgBar.setAttribute("width", fullBarWidth);
  bgBar.setAttribute("height", barHeight);
  bgBar.setAttribute("fill", "#333");
  bgBar.setAttribute("rx", "8");
  bgBar.setAttribute("ry", "8");
  svg.appendChild(bgBar);

  // Progress bar
  const progress = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  progress.setAttribute("x", leftPadding);
  progress.setAttribute("y", y);
  progress.setAttribute("width", barWidth);
  progress.setAttribute("height", barHeight);
  progress.setAttribute("fill", color);
  progress.setAttribute("rx", "8");
  progress.setAttribute("ry", "8");
  svg.appendChild(progress);

  // Percentage text
  const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
  value.setAttribute("x", leftPadding + barWidth + 10);
  value.setAttribute("y", y + barHeight / 2);
  value.setAttribute("dominant-baseline", "middle");
  value.setAttribute("font-size", "16");
  value.setAttribute("fill", "white");
  value.setAttribute("font-family", "Arial");
  value.textContent = `${amount}%`;
  svg.appendChild(value);
});

}

