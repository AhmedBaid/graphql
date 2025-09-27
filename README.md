# graphql


  function draw_AuditSvg() {
    const div = document.querySelector(".audit-svg");
    div.innerHTML = `
    <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="100" fill="none" stroke="#2c2f48" stroke-width="40"/>
      
      <!-- Success arc (74%) -->
      <circle
        cx="150"
        cy="150"
        r="100"
        fill="none"
        stroke="#4caf50"
        stroke-width="40"
        stroke-dasharray="465.421, 628.319"
        stroke-dashoffset="0"
        transform="rotate(-90 150 150)"
      />
      
      <!-- Failed arc (26%) -->
      <circle
        cx="150"
        cy="150"
        r="100"
        fill="none"
        stroke="#e74c3c"
        stroke-width="40"
        stroke-dasharray="162.898, 628.319"
        stroke-dashoffset="-465.421"
        transform="rotate(-90 150 150)"
      />

      <text x="150" y="145" text-anchor="middle" fill="white" font-size="22px" font-family="Arial">50 Audits</text>

    </svg>
    `
  }





  const audits_data = await FetchGraphqlapi(audits, token);
  console.log(audits_data);

in the picture you can see the data and i want you to put them on the svg please to be dynamique as data