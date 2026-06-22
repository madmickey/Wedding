function sendWeddingInvites() {
 
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Guestlist");

  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {

    const guestCode = rows[i][0];   // A
    const guestNames = rows[i][1];  // B
    const email = rows[i][8];       // I
    const ccEmail = rows[i][9];     // J
    const rsvpLink = rows[i][12];   // M

    if (!email) continue;

    const template =
      HtmlService.createTemplateFromFile("mail");

    template.guestNames = guestNames;
    template.guestCode = guestCode;
    template.rsvpLink = rsvpLink;

    const htmlBody =
      template.evaluate().getContent();

    GmailApp.sendEmail(
      email,
      "You're Invited – Liz & Michael's Wedding",
      "Please view this email in HTML format.",
      {
        htmlBody: htmlBody,
        cc: ccEmail || "",
        name: "Liz & Michael",
        replyTo: "wedding@cornell.limited"
      }
    );

    Utilities.sleep(1000);
  }
}



function test1sendWeddingInvites() {

  const sheet =
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Guestlist");

  const rows = sheet.getDataRange().getValues();

  i=1;
  const guestCode = rows[i][0];   // A
  const guestNames = rows[i][1];  // B
  const email = rows[i][8];       // I
  const ccEmail = rows[i][9];     // J
  const rsvpLink = rows[i][12];   // M

  const template =
    HtmlService.createTemplateFromFile("mail");

  template.guestNames = guestNames;
  template.guestCode = guestCode;
  template.rsvpLink = rsvpLink;

  const htmlBody =
    template.evaluate().getContent();

  GmailApp.sendEmail(
    email,
    "You're Invited - Liz + Michael's Wedding",
    "Please view this email in HTML format.",
    {
      htmlBody: htmlBody,
      cc: ccEmail || "",
      name: "Liz & Michael",
      replyTo: "wedding@cornell.limited"
    }
  );

    Utilities.sleep(1000);
  
}

