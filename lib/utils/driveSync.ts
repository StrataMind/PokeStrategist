import { google } from 'googleapis';

const BACKUP_FILENAME = 'pokestrategist-teams.json';

export async function syncToDrive(accessToken: string, teams: any[]) {
  try {
    // Validate input
    if (!accessToken || typeof accessToken !== 'string') {
      return { success: false, error: 'Invalid token' };
    }
    
    if (!Array.isArray(teams)) {
      return { success: false, error: 'Invalid data' };
    }
    
    // Limit file size to 5MB
    const fileContent = JSON.stringify(teams, null, 2);
    if (fileContent.length > 5 * 1024 * 1024) {
      return { success: false, error: 'Data too large' };
    }
    
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Search for existing backup file
    const searchResponse = await drive.files.list({
      q: `name='${BACKUP_FILENAME}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'appDataFolder',
    });
    
    const media = {
      mimeType: 'application/json',
      body: fileContent,
    };
    
    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      // Update existing file
      const fileId = searchResponse.data.files[0].id!;
      await drive.files.update({
        fileId,
        media,
        fields: 'id',
      });
    } else {
      // Create new file
      await drive.files.create({
        requestBody: {
          name: BACKUP_FILENAME,
          parents: ['appDataFolder'],
        },
        media,
        fields: 'id',
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Drive sync error:', error);
    return { success: false, error: 'Sync failed' };
  }
}

export async function loadFromDrive(accessToken: string) {
  try {
    // Validate input
    if (!accessToken || typeof accessToken !== 'string') {
      return { success: false, error: 'Invalid token', teams: [] };
    }
    
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Search for backup file
    const searchResponse = await drive.files.list({
      q: `name='${BACKUP_FILENAME}' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'appDataFolder',
    });
    
    if (!searchResponse.data.files || searchResponse.data.files.length === 0) {
      return { success: true, teams: [] };
    }
    
    const fileId = searchResponse.data.files[0].id!;
    const response = await drive.files.get({
      fileId,
      alt: 'media',
    });
    
    // Validate response is array
    const teams = response.data;
    if (!Array.isArray(teams)) {
      return { success: false, error: 'Invalid data format', teams: [] };
    }
    
    return { success: true, teams };
  } catch (error) {
    console.error('Drive load error:', error);
    return { success: false, error: 'Load failed', teams: [] };
  }
}
