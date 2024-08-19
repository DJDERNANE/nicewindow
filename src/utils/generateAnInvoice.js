import { isNaN } from "lodash";

function createInvoiceHeader(header) {
  return `
          <div class="nav-bar">
            <p>Offre commerciale</p>
            <div class="nav-content">
              <div>
                <p>INTERPRÈTE: ${header?.sender?.name || ""}</p>
                <p>adresse: ${header?.sender?.adresse || ""}</p>
              <p>téléphone: ${header?.sender?.phone || ""}</p>
                <p>email: ${header?.sender?.email || ""}</p>
                <p>page web: ${header?.sender?.website || ""}</p>
              </div>
              <!--  -->
              <div>
                <p>CLEINT: ${header?.reciver?.name || ""}</p>
                <p>téléphone: ${header?.reciver?.phone || ""}</p>
              </div>
            </div>
          </div>
        `;
}

const generateTableRow = (label, value, price, subTotal) => `
    <tr>
      <td>${label}</td>
      <td>${value}</td>
      <td>${price}</td>
      <td>${subTotal} Da</td>
    </tr>
  `;

function createInvoiceContent({
  imageUrl,
  aluminum,
  glass,
  voli,
  total,
  extension,
  qty,
}) {
  const aluminumRow = generateTableRow(
    "aluminum",
    aluminum.length,
    aluminum.price,
    aluminum.total,
  );
  const glassRow = generateTableRow(
    "glass",
    glass.area,
    glass.price,
    glass.total,
  );
  const voliRow = generateTableRow("voli", voli.area, voli.price, voli.total);
  const extensionRow = generateTableRow("extension", "/", "/", extension);
  const qtyRow = generateTableRow("qty", qty, "/", "0");
  const totalRow = generateTableRow("total", "/", "/", total);

  return `
          <div class="data">
            <div class="img">
              <img src="${imageUrl}" style="max-width: 100%; height: auto" alt="window" />
            </div>
            <div class="table">
              <table border="1">
                ${aluminumRow}
                ${glassRow}
                ${voliRow}
                ${extensionRow}
                ${qtyRow}
                ${totalRow}
              </table>
            </div>
          </div>
        `;
}

function createInvoiceSection(invoiceHeader, invoiceContent) {
  let header = "";
  let table = "";
  if (Object.keys(invoiceHeader).length > 0) {
    header = createInvoiceHeader(invoiceHeader);
  }

  if (Object.keys(invoiceContent).length > 0) {
    table = createInvoiceContent(invoiceContent);
  }

  const newSection = `
          <section>
            ${header}
            ${table}
          </section>
        `;
  return newSection;
}

function generateTotalTable(sections, TVAValue = null) {
  let aluminumLength = 0;
  let aluminumTotalPrice = 0;
  let glassArea = 0;
  let glassTotalPrice = 0;
  let voliArea = 0;
  let voliTotalPrice = 0;
  let total = 0;

  let TvaRow = "";

  for (let i = 0; i < sections.length; i++) {
    aluminumLength += sections[i].invoiceContent.aluminum.length;
    if (!isNaN(Number(sections[i].invoiceContent.aluminum.total))) {
      aluminumTotalPrice += Number(sections[i].invoiceContent.aluminum.total);
    }
  }

  for (let i = 0; i < sections.length; i++) {
    glassArea += sections[i].invoiceContent.glass.area;
    if (!isNaN(Number(sections[i].invoiceContent.glass.area))) {
      glassTotalPrice += Number(sections[i].invoiceContent.glass.total);
    }
  }

  for (let i = 0; i < sections.length; i++) {
    voliArea += sections[i].invoiceContent.voli.area;
    if (!isNaN(Number(sections[i].invoiceContent.voli.area))) {
      voliTotalPrice += Number(sections[i].invoiceContent.voli.total);
    }
  }

  for (let i = 0; i < sections.length; i++) {
    total += sections[i].invoiceContent?.total;
  }

  if (typeof TVAValue === "number") {
    const perValue = Math.round((Number(TVAValue) * total) / 100);
    const newTotal = total + perValue;
    TvaRow = `
      <tr>
        <td>TVA</td>
        <td>${TVAValue}%</td>
        <td>${newTotal.toFixed(3)} Da</td>
      </tr>
    `;
  } else {
    TvaRow = "";
  }

  return `
  <div style="margin: 0 auto; float: right; padding: 20px;">
    <table border="1" >
      <tr>
        <td>aluminum</td>
        <td>${aluminumLength} m</td>
        <td>${aluminumTotalPrice.toFixed(3)} Da</td>
      </tr>

      <tr>
        <td>glass</td>
        <td>${glassArea} m²</td>
        <td>${glassTotalPrice.toFixed(3)} Da</td>
      </tr>

      <tr>
        <td>voli</td>
        <td>${voliArea} m²</td>
        <td>${voliTotalPrice.toFixed(3)} Da</td>
      </tr>

      <tr>
        <td>total</td>
        <td>/</td>
        <td>${total.toFixed(3)} Da</td>
      </tr>
    
    ${TvaRow}
    </table>
  </div>
  `;
}

export default function (sections, TVAValue) {
  const dt = sections.map((section) =>
    createInvoiceSection(section.invoiceHeader, section.invoiceContent),
  );

  const totalTable = generateTotalTable(sections, TVAValue);

  const html = `
    <html>
      <style>
      * {
      margin: 0;
      box-sizing: border-box;
      }
      section {
      height: 100vh;
      padding: 20px;
      display: flex;
      flex-direction: column;
      }
      .nav-bar {
      padding: 5px;
      }
      .nav-bar > p {
      text-align: center;
      background-color: gainsboro;
      font-weight: bold;
      font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
      padding: 7px;
      margin-bottom: 5px;
      }
      .nav-content {
      display: flex;
      justify-content: space-between;
      }
      .data {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
      border: 2px solid #333;
      overflow: hidden;
      }
      .data > .img {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #333;
      }
      .data > img {
      }
      .data > .table {
      align-self: flex-end;
      }
      td {
      padding: 4px;
      }
      </style>
      <body>
        ${dt.join("\n")}
        ${totalTable}
      </body>
    </html>
  `;

  return html;
}
