import { container, logout } from "../config/config.js";
import { FetchGraphqlapi } from "../helpers/FetchApi.js";
import { audits, project_list, skills, user_info } from "../query/query.js";
import { getRank } from "../helpers/GetRank.js";
import { formatXP } from "../helpers/FormatXp.js";
import { debounce } from "../helpers/debounce.js";

// display user profile
export async function showProfile(token) {
  const Profile_data = await FetchGraphqlapi(user_info, token);
  const Project_data = await FetchGraphqlapi(project_list, token);

  const skills_data = await FetchGraphqlapi(skills, token);
  const audits_data = await FetchGraphqlapi(audits, token);

  const firstName = Profile_data.data.user[0].firstName || "user";
  const lastName = Profile_data.data.user[0].lastName || "user";
  const username = Profile_data.data.user[0].login || "user";
  const attrs = Profile_data.data.user[0].attrs;
  // info about user
  const cin = attrs.cin || "";
  const tel = attrs.tel || "";
  const email = attrs.email || "";
  const gender = attrs.gender || "";
  const addressCity = attrs.addressCity || "";
  const totalXP = Profile_data.data.xp.aggregate.sum.amount || 0;
  const level = Profile_data.data.level.aggregate.max.amount || 0;
  const cohort = Profile_data.data.user[0].events[0].cohorts[0].labelName || "cohort not found";
  const completedProjects = Project_data.data.transaction.length || 0;
  const list_skills = skills_data.data.user[0].transactions || [];
  const unique_skills = [];
  const seen = new Set();
  // remove duplicate skills
  for (const t of list_skills) {
    if (!seen.has(t.skillType)) {
      unique_skills.push(t);
      seen.add(t.skillType);
    }
  }

  container.innerHTML = `
    <div class="header">
      <h1 class="logo">Welcome, <span class="firstLast">${firstName} ${lastName}</span></h1>
      <div class="profile-actions">
        <button id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i>Logout</button>
        <img src="https://discord.zone01oujda.ma/assets/pictures/${username}.jpg" alt="profile pic" class="profile-pic"/>
      </div>
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
      <h2>Transactions (${completedProjects})</h2>
      <div class="project-table-container">
        <div class="project-header">
          <div class="col">Project</div>
          <div class="col">XP</div>
          <div class="col">Created At</div>
          <div class="col">Team Members</div>
          <div class="col">Team Leader</div>
        </div>
        <div class="project-body">
          ${Project_data.data.transaction.map(t => {
    const projectName = t.object?.name || "Unknown";
    const xp = formatXP(t.amount || 0);
    const date = new Date(t.createdAt).toLocaleDateString();
    const members = t.object.progresses?.[0]?.group?.members || [];
    const leader = t.object.progresses?.[0]?.group?.captainLogin || "";

    return `
              <div class="project-row">
                <div class="col">${projectName}</div>
                <div class="col" style="color:${t.amount > 0 ? '#00FF00' : '#FF0000'}">${xp}</div>
                <div class="col">${date}</div>
                <div class="col members">
                  ${members.map(m => `<div class="userLogin"><a href="https://profile.zone01oujda.ma/profile/${m.userLogin}" target="_blank">${m.userLogin}</a></div>`).join(" ")}
                </div>
                <div class="col">${leader}</div>
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
  // handle profile pic error and write the default pic
  const profilePic = document.querySelector(".profile-pic");
  profilePic.onerror = () => {
    profilePic.src = "../assets/images/profile.jpg";
  };

  profilePic.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    overlay.innerHTML = `
    <div class="info-popup">
      <img src="${profilePic.src}" alt="Profile Picture"/>
      <h2>Hi ${firstName} ${lastName}</h2>
      <p><strong>Username :</strong> ${username}</p>
      <p><strong>CIN :</strong> ${cin}</p>
      <p><strong>Phone Number :</strong> ${tel}</p>
      <p><strong>Gender :</strong> ${gender}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Address :</strong> ${addressCity}</p>
    </div>
  `;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  });
  // draw skills chart
  function draw_SkillsSvg() {
    const svgContainer = document.querySelector(".container-svg");
    const svg = document.getElementById("skillsChart");
    const containerWidth = svgContainer.clientWidth - 100;

    const barHeight = 20;
    const spacing = 20;
    const color = "#26c43dff";

    svg.setAttribute("height", unique_skills.length * (barHeight + spacing) + 30);

    unique_skills.forEach((skill, i) => {
      const y = i * (barHeight + spacing) + 30;
      const amount = skill.skillAmount || 0;

      const leftPadding = 120;
      const rightPadding = 50;
      const availableWidth = containerWidth - leftPadding - rightPadding;

      const barWidth = (amount / 100) * availableWidth;

      const name = document.createElementNS("http://www.w3.org/2000/svg", "text");
      name.setAttribute("x", "10");
      name.setAttribute("y", y + barHeight / 1.5);
      name.textContent = skill.skillType.replace("skill_", "");
      svg.appendChild(name);

      const bgBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bgBar.setAttribute("x", leftPadding);
      bgBar.setAttribute("y", y);
      bgBar.setAttribute("width", availableWidth);
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
      value.setAttribute("x", availableWidth + 140);
      value.setAttribute("y", y + barHeight / 1.5);
      value.setAttribute("dominant-baseline", "middle");
      value.textContent = `${amount}%`;
      svg.appendChild(value);
    });

  }
  // draw audit chart
  function draw_AuditSvg() {
    const div = document.querySelector(".audit-svg");

    const failedCount = audits_data.data.user[0].failed.aggregate.count;
    const successCount = audits_data.data.user[0].success.aggregate.count;
    const total = failedCount + successCount;
    const totalUp = audits_data.data.user[0].totalUp;
    const totalDown = audits_data.data.user[0].totalDown;



    const ratio = audits_data.data.user[0].auditRatio.toFixed(2);

    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    const successPourcentage = (successCount / total) * 100;
    const failedPourcentage = (failedCount / total) * 100;

    const successLength = (successPourcentage / 100) * circumference;
    const failedLength = (failedPourcentage / 100) * circumference;

    div.innerHTML = `
    <div class="combined-chart">
      <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
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

        <text x="150" y="140" text-anchor="middle" fill="white" >
          ${total} Audits
        </text>
        <text x="150" y="170" text-anchor="middle" fill="#04E17A" >
          Ratio: ${ratio}
        </text>
      </svg>
    </div>
    <div class="audit-details">
      <div class="audit-stats">
        <p>${formatXP(totalUp)}</p>
        <h3>Total up</h3>
      </div>
      <div class="audit-stats">
        <p>${formatXP(totalDown)}</p>
        <h3>Total down</h3>
      </div>
      <div class="audit-stats">
        <p class="green">${successPourcentage.toFixed(2)} %</p>
        <h3>Success</h3>
      </div>
      <div class="audit-stats">
        <p class="red">${failedPourcentage.toFixed(2)} %</p>
        <h3>Failed</h3>
      </div>
    </div>
  `;
  }

  draw_SkillsSvg();
  draw_AuditSvg();
  // redraw skills chart on window resize
  window.addEventListener("resize", debounce(() => {
    const svg = document.getElementById("skillsChart");
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    draw_SkillsSvg();
  }, 500));

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => logout());
}

