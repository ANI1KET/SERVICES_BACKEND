import { google } from "googleapis";
import * as stream from "stream";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

export default async function uploadFile({
  picture,
  name,
}: {
  //   picture: string | ArrayBuffer;
  picture: string;
  name: string;
}) {
  try {
    let subFolderId: string | undefined;
    const folderQuery = `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${process.env.PARENT_FOLDER_ID}' in parents and trashed=false`;

    // Check if the subfolder already exists
    const existingSubfolderResponse = await drive.files.list({
      q: folderQuery,
      fields: "files(id)",
    });

    if (existingSubfolderResponse.data.files?.length) {
      const fileId = existingSubfolderResponse.data.files[0].id;
      if (fileId) {
        subFolderId = fileId; // Assign only if fileId is truthy (not null or undefined)
      }
    } else {
      // Create a new subfolder if it doesn't exist
      const subfolderResponse = await drive.files.create({
        requestBody: {
          name: name,
          mimeType: "application/vnd.google-apps.folder",
          parents: [`${process.env.PARENT_FOLDER_ID}`],
        },
      });

      if (subfolderResponse.data.id) {
        subFolderId = subfolderResponse.data.id;
      }
      // Set permissions to allow anyone to read the folder
      await drive.permissions.create({
        fileId: subFolderId,
        requestBody: {
          type: "anyone",
          role: "reader",
        },
      });
    }

    // Convert base64 to buffer directly without unnecessary variable
    const base64ImageData = picture.split(",")[1];
    const bufferData = Buffer.from(base64ImageData, "base64");

    // Create a readable stream from the buffer
    const readableStream = new stream.PassThrough();
    readableStream.end(bufferData);

    // Upload the image
    const response = await drive.files.create({
      requestBody: {
        name: `${name}.png`,
        mimeType: "image/png", // Use the specific image type
        parents: [`${subFolderId}`],
      },
      media: {
        mimeType: "image/png",
        body: readableStream,
      },
    });

    return `https://drive.google.com/uc?id=${response.data.id}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to Google Drive."); // Re-throwing with a clear message
  }
}
