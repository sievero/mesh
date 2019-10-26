import axios from 'axios';

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const emailRes = await axios.post(process.env.VUE_APP_WEBHOOK_EMAIL, body);
    const spreadsheetRes = await axios.post(
      process.env.VUE_APP_WEBHOOK_SPREADSHEET,
      body
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        email: emailRes.data,
        sheet: spreadsheetRes.data
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
}
