import { container, logout } from "../config/config.js";
import { FetchGraphqlapi } from "../helpers/FetchApi.js";
import { audits, project_list, skills, user_info } from "../query/query.js";
import { getRank } from "../helpers/GetRank.js";
import { formatXP } from "../helpers/FormatXp.js";
import { debounce } from "../helpers/debounce.js";

export async function showProfile(token) {
  const Profile_data = await FetchGraphqlapi(user_info, token);
  const Project_data = await FetchGraphqlapi(project_list, token);
  const skills_data = await FetchGraphqlapi(skills, token);
  const audits_data = await FetchGraphqlapi(audits, token);
  console.log(audits_data);

  const firstName = Profile_data.data.user[0].firstName || "user";
  const lastName = Profile_data.data.user[0].lastName || "user";
  const totalXP = Profile_data.data.xp.aggregate.sum.amount || 0;
  const level = Profile_data.data.level.aggregate.max.amount || 0;
  const cohort = Profile_data.data.user[0].events[0].cohorts[0].labelName || "cohort not found";
  const completedProjects = Project_data.data.user[0].groups.length || 0;
  const list_skills = skills_data.data.user[0].transactions || [];
  const unique_skills = [];
  const seen = new Set();
  // const accepted

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
    <div class="audits">
      <h2>Audit Performance</h2>
      <div class="audit-svg">
        <svg id="audit"></svg>
      </div>
    </div>
  `;
  function draw_SkillsSvg() {
    const svgContainer = document.querySelector(".container-svg");
    const svg = document.getElementById("skillsChart");
    const containerWidth = svgContainer.clientWidth - 50;

    const barHeight = 20;
    const spacing = 20;
    const color = "#26c43dff";

    svg.setAttribute("height", unique_skills.length * (barHeight + spacing) + 30);

    const maxAmount = Math.max(...unique_skills.map(s => s.skillAmount || 1));

    unique_skills.forEach((skill, i) => {
      const y = i * (barHeight + spacing) + 30;
      const amount = skill.skillAmount || 0;

      const leftPadding = 120;
      const rightPadding = 50;
      const availableWidth = containerWidth - leftPadding - rightPadding - 200;

      const barWidth = (amount / maxAmount) * availableWidth;

      const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
      name.setAttribute("x", "10");
      name.setAttribute("y", y + barHeight);
      name.textContent = skill.skillType.replace("skill_", "");
      svg.appendChild(name);

      const bgBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bgBar.setAttribute("x", leftPadding);
      bgBar.setAttribute("y", y);
      bgBar.setAttribute("width", availableWidth + 200);
      bgBar.setAttribute("height", barHeight);
      bgBar.setAttribute("fill", "#333");
      bgBar.setAttribute("rx", "8");
      bgBar.setAttribute("ry", "8");
      svg.appendChild(bgBar);

      const progress = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      progress.setAttribute("x", leftPadding);
      progress.setAttribute("y", y);
      progress.setAttribute("width", barWidth);
      progress.setAttribute("height", barHeight);
      progress.setAttribute("fill", color);
      progress.setAttribute("rx", "8");
      progress.setAttribute("ry", "8");
      svg.appendChild(progress);

      const value = document.createElementNS("http://www.w3.org/2000/svg", "text");
      value.setAttribute("x", availableWidth + 350);
      value.setAttribute("y", y + barHeight / 2);
      value.setAttribute("dominant-baseline", "middle");
      value.textContent = `${amount}%`;
      svg.appendChild(value);
    });

  }
  function draw_AuditSvg(auditData) {
    const div = document.querySelector(".audit-svg");

    const failedCount = auditData.data.user[0].failed.aggregate.count;
    const successCount = auditData.data.user[0].success.aggregate.count;
    const total = failedCount + successCount;

    const ratio = auditData.data.user[0].auditRatio.toFixed(2);

    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    const successPercent = (successCount / total) * 100;
    const failedPercent = (failedCount / total) * 100;

    const successLength = (successPercent / 100) * circumference;
    const failedLength = (failedPercent / 100) * circumference;

    div.innerHTML = `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- الخلفية -->
      <circle cx="150" cy="150" r="${radius}" fill="none" stroke="#2c2f48" stroke-width="40"/>
      
      <!-- Success arc -->
      <circle
        cx="150"
        cy="150"
        r="${radius}"
        fill="none"
        stroke="#4caf50"
        stroke-width="40"
        stroke-dasharray="${successLength}, ${circumference}"
        stroke-dashoffset="0"
        transform="rotate(-90 150 150)"
      />
      
      <!-- Failed arc -->
      <circle
        cx="150"
        cy="150"
        r="${radius}"
        fill="none"
        stroke="#e74c3c"
        stroke-width="40"
        stroke-dasharray="${failedLength}, ${circumference}"
        stroke-dashoffset="-${successLength}"
        transform="rotate(-90 150 150)"
      />

      <!-- النص فالنص -->
      <text x="150" y="140" text-anchor="middle" fill="white" font-size="22px" font-family="Arial">
        ${total} Audits
      </text>
      <text x="150" y="170" text-anchor="middle" fill="#04E17A" font-size="16px" font-family="Arial">
        Ratio: ${ratio}
      </text>
    </svg>
  `;
  }

  draw_SkillsSvg();
  draw_AuditSvg();

  window.addEventListener("resize", debounce(() => {
    const svg = document.getElementById("skillsChart");
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    drawSvg();
  }, 500));

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => logout());
}

