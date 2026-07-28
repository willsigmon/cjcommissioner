import { google } from "googleapis";
import type { VolunteerSubmission } from "@/lib/validation";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required configuration: ${name}`);
  return value;
}

export async function appendVolunteer(
  submission: VolunteerSubmission,
  submittedAt = new Date(),
) {
  const email = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const tabName = required("GOOGLE_SHEET_TAB");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const utm = submission.utm ?? {};

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${tabName.replaceAll("'", "''")}'!A:O`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          submittedAt.toISOString(),
          submission.name,
          submission.email,
          submission.phone ?? "",
          submission.zip,
          submission.interests.join(", "),
          submission.message ?? "",
          "yes",
          submission.sourcePath,
          utm.source ?? "",
          utm.medium ?? "",
          utm.campaign ?? "",
          utm.content ?? "",
          utm.term ?? "",
          "",
        ],
      ],
    },
  });
}
